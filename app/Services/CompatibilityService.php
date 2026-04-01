<?php

namespace App\Services;

use App\Models\Product;

class CompatibilityService
{
    /**
     * Check if CPU and Motherboard sockets match.
     */
    public function checkSocket(?Product $cpu, ?Product $motherboard): array
    {
        if (!$cpu || !$motherboard) {
            return ['compatible' => true];
        }

        $cpuSocket = $cpu->specs['socket'] ?? null;
        $mbSocket = $motherboard->specs['socket'] ?? null;

        if ($cpuSocket === $mbSocket) {
            return ['compatible' => true];
        }

        return [
            'compatible' => false,
            'reason' => "CPU Socket ({$cpuSocket}) does not match Motherboard Socket ({$mbSocket})."
        ];
    }

    /**
     * Check if RAM type matches Motherboard.
     */
    public function checkRam(?Product $ram, ?Product $motherboard): array
    {
        if (!$ram || !$motherboard) {
            return ['compatible' => true];
        }

        $ramType = $ram->specs['type'] ?? null;
        $mbRamType = $motherboard->specs['memory_type'] ?? null;

        if ($ramType === $mbRamType) {
            return ['compatible' => true];
        }

        return [
            'compatible' => false,
            'reason' => "RAM Type ({$ramType}) is not supported by Motherboard ({$mbRamType})."
        ];
    }

    /**
     * Check if PSU wattage is sufficient.
     */
    public function checkWattage(?Product $cpu, ?Product $gpu, ?Product $psu): array
    {
        if (!$psu) {
            return ['compatible' => true];
        }

        $cpuTdp = $cpu->specs['tdp'] ?? 65;
        $gpuTdp = $gpu->specs['tdp'] ?? 0;
        $systemBuffer = 100;

        $totalEstimated = $cpuTdp + $gpuTdp + $systemBuffer;
        $psuWattage = $psu->specs['wattage'] ?? 0;

        if ($psuWattage >= $totalEstimated) {
            return ['compatible' => true];
        }

        return [
            'compatible' => false,
            'reason' => "PSU Wattage ({$psuWattage}W) is insufficient for estimated system load ({$totalEstimated}W)."
        ];
    }

    /**
     * Check if CPU Cooler fits in Case (Air).
     */
    public function checkCoolerClearance(?Product $cooler, ?Product $case): array
    {
        if (!$cooler || !$case || ($cooler->specs['type'] ?? '') !== 'Air') {
            return ['compatible' => true];
        }

        $coolerHeight = $cooler->specs['height'] ?? 0;
        $caseMaxHeight = $case->specs['max_cooler_height'] ?? 999;

        if ($coolerHeight <= $caseMaxHeight) {
            return ['compatible' => true];
        }

        return [
            'compatible' => false,
            'reason' => "Cooler height ({$coolerHeight}mm) exceeds case clearance ({$caseMaxHeight}mm)."
        ];
    }

    /**
     * Check if Radiator is supported by Case (AIO).
     */
    public function checkRadiatorSupport(?Product $cooler, ?Product $case): array
    {
        if (!$cooler || !$case || ($cooler->specs['type'] ?? '') !== 'AIO') {
            return ['compatible' => true];
        }

        $radSize = $cooler->specs['radiator_size'] ?? 0;
        $supported = $case->specs['radiator_support'] ?? [];

        if (in_array($radSize, $supported)) {
            return ['compatible' => true];
        }

        return [
            'compatible' => false,
            'reason' => "Case does not support {$radSize}mm radiators (Supported: " . implode(', ', $supported) . "mm)."
        ];
    }

    /**
     * Check if GPU fits in Case.
     */
    public function checkDimensions(?Product $gpu, ?Product $case): array
    {
        if (!$gpu || !$case) {
            return ['compatible' => true];
        }

        $gpuLength = $gpu->specs['length'] ?? 0;
        $caseMaxGpu = $case->specs['max_gpu_length'] ?? 999;

        if ($gpuLength <= $caseMaxGpu) {
            return ['compatible' => true];
        }

        return [
            'compatible' => false,
            'reason' => "GPU Length ({$gpuLength}mm) exceeds Case clearance ({$caseMaxGpu}mm)."
        ];
    }

    /**
     * Validate a full configuration.
     */
    public function validateConfig(array $components): array
    {
        $errors = [];
        
        $cpu = $components['cpu'] ?? null;
        $mb = $components['motherboard'] ?? null;
        $ram = $components['ram'] ?? null;
        $gpu = $components['gpu'] ?? null;
        $psu = $components['psu'] ?? null;
        $case = $components['case'] ?? null;
        $cooler = $components['cooler'] ?? null;

        // Socket & RAM
        $socketCheck = $this->checkSocket($cpu, $mb);
        if (!$socketCheck['compatible']) $errors[] = $socketCheck['reason'];

        $ramCheck = $this->checkRam($ram, $mb);
        if (!$ramCheck['compatible']) $errors[] = $ramCheck['reason'];

        // Energy
        $wattageCheck = $this->checkWattage($cpu, $gpu, $psu);
        if (!$wattageCheck['compatible']) $errors[] = $wattageCheck['reason'];

        // Physical
        $dimCheck = $this->checkDimensions($gpu, $case);
        if (!$dimCheck['compatible']) $errors[] = $dimCheck['reason'];

        $heightCheck = $this->checkCoolerClearance($cooler, $case);
        if (!$heightCheck['compatible']) $errors[] = $heightCheck['reason'];

        $radCheck = $this->checkRadiatorSupport($cooler, $case);
        if (!$radCheck['compatible']) $errors[] = $radCheck['reason'];

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}
