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
            return ['compatible' => true]; // Cannot check without PSU
        }

        $cpuTdp = $cpu->specs['tdp'] ?? 65; // Default safe estimate
        $gpuTdp = $gpu->specs['tdp'] ?? 0;  // Optional GPU
        $systemBuffer = 100; // Motherboard, fans, drives, etc.

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

        // Fetch products by ID if passed as IDs, else assume objects
        // For simplicity, we assume the controller resolves IDs to Models before calling this,
        // or passes Models directly.
        
        $cpu = $components['cpu'] ?? null;
        $mb = $components['motherboard'] ?? null;
        $ram = $components['ram'] ?? null;
        $gpu = $components['gpu'] ?? null;
        $psu = $components['psu'] ?? null;
        $case = $components['case'] ?? null;

        $socketCheck = $this->checkSocket($cpu, $mb);
        if (!$socketCheck['compatible']) $errors[] = $socketCheck['reason'];

        $ramCheck = $this->checkRam($ram, $mb);
        if (!$ramCheck['compatible']) $errors[] = $ramCheck['reason'];

        $wattageCheck = $this->checkWattage($cpu, $gpu, $psu);
        if (!$wattageCheck['compatible']) $errors[] = $wattageCheck['reason'];

        $dimCheck = $this->checkDimensions($gpu, $case);
        if (!$dimCheck['compatible']) $errors[] = $dimCheck['reason'];

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}
