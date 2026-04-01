<?php

namespace App\Services;

use App\Models\Product;

class PerformanceService
{
    /**
     * Estimate FPS for three different game profiles.
     */
    public function estimateFps(?Product $cpu, ?Product $gpu): array
    {
        if (!$gpu) {
            return [
                'competitive' => 0,
                'aaa' => 0,
                'ultra' => 0,
                'bottleneck' => 0
            ];
        }

        // Base scores (0-100)
        $gpuScore = $gpu->specs['perf_score'] ?? 30; // Min default
        $cpuScore = $cpu->specs['perf_score'] ?? 30;

        // Calculate Bottleneck (0-100 where 100 is perfectly balanced)
        $bottleneck = 100 - abs($gpuScore - $cpuScore);
        
        // Detailed Reason
        $reason = "Configuración balanceada.";
        if ($cpuScore < $gpuScore * 0.7) {
            $reason = "El Procesador ({$cpu->name}) es demasiado lento para esta Tarjeta Gráfica. Perderás rendimiento en juegos.";
        } elseif ($gpuScore < $cpuScore * 0.7) {
            $reason = "La Tarjeta Gráfica ({$gpu->name}) es el punto débil aquí. Tu Procesador podría manejar algo mucho más potente.";
        }

        // Effective score for FPS calculation
        $combinedScore = ($gpuScore * 0.75) + ($cpuScore * 0.25);
        if ($cpuScore < $gpuScore * 0.6) {
            $combinedScore *= 0.8;
        }

        return [
            'competitive' => round($combinedScore * 3.8),
            'aaa' => round($combinedScore * 1.4),
            'ultra' => round($combinedScore * 0.8),
            'bottleneck' => $bottleneck,
            'reason' => $reason
        ];
    }
}
