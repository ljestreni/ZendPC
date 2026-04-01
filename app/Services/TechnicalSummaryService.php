<?php

namespace App\Services;

use App\Models\Product;

class TechnicalSummaryService
{
    /**
     * Generate a technical summary of the current build.
     */
    public function getSummary(array $components): array
    {
        $cpu = $components['cpu'] ?? null;
        $gpu = $components['gpu'] ?? null;
        $psu = $components['psu'] ?? null;
        $case = $components['case'] ?? null;
        $cooler = $components['cooler'] ?? null;
        $mb = $components['motherboard'] ?? null;

        // 1. Wattage
        $cpuTdp = $cpu->specs['tdp'] ?? 65;
        $gpuTdp = $gpu->specs['tdp'] ?? 0;
        $systemBuffer = 100;
        $estimatedWattage = $cpuTdp + $gpuTdp + $systemBuffer;
        $psuWattage = $psu->specs['wattage'] ?? 0;

        // 2. Clearances
        $gpuLen = $gpu->specs['length'] ?? 0;
        $caseGpuMax = $case->specs['max_gpu_length'] ?? 0;
        
        $coolerH = $cooler->specs['height'] ?? 0;
        $caseCoolerMax = $case->specs['max_cooler_height'] ?? 0;

        // 3. Motherboard / RAM
        $mbRamType = $mb->specs['memory_type'] ?? 'N/D';
        $mbFormFactor = $mb->specs['form_factor'] ?? 'N/D';

        return [
            'energy' => [
                'estimated' => $estimatedWattage,
                'capacity' => $psuWattage,
                'status' => $psuWattage > 0 ? round(($estimatedWattage / $psuWattage) * 100) : 0
            ],
            'clearances' => [
                'gpu' => [
                    'current' => $gpuLen,
                    'max' => $caseGpuMax,
                    'is_valid' => $caseGpuMax > 0 ? $gpuLen <= $caseGpuMax : true
                ],
                'cooler' => [
                    'current' => $coolerH,
                    'max' => $caseCoolerMax,
                    'is_valid' => $caseCoolerMax > 0 ? $coolerH <= $caseCoolerMax : true
                ]
            ],
            'motherboard' => [
                'type' => $mbRamType,
                'format' => $mbFormFactor,
            ]
        ];
    }
}
