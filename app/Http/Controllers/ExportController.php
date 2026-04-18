<?php

namespace App\Http\Controllers;

use App\Models\SavedConfig;
use App\Models\Product;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class ExportController extends Controller
{
    /**
     * Export a saved PC configuration to PDF.
     */
    public function exportConfigPdf(SavedConfig $savedConfig)
    {
        // Ensure the config belongs to the authenticated user
        if ($savedConfig->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Configuration Map for translations
        $categoryMap = [
            'cpu' => 'Procesador',
            'motherboard' => 'Placa Base',
            'ram' => 'Memoria RAM',
            'gpu' => 'Tarjeta Gráfica',
            'storage' => 'Almacenamiento',
            'psu' => 'Fuente de Alimentación',
            'case' => 'Caja/Torre',
            'cooler' => 'Refrigeración'
        ];

        // Resolved components array
        $componentesEnriquecidos = [];
        $configuration = $savedConfig->configuration;

        if (is_array($configuration)) {
            foreach ($configuration as $slug => $productId) {
                if ($productId) {
                    $producto = Product::find($productId);
                    if ($producto) {
                        $componentesEnriquecidos[] = [
                            'categoria' => $categoryMap[$slug] ?? ucfirst($slug),
                            'nombre' => $producto->name,
                            'precio' => $producto->price,
                            'image' => $producto->image,
                            'specs' => $producto->specs
                        ];
                    }
                }
            }
        }

        $configuracion = $savedConfig;
        $usuario = Auth::user();

        // Render the blade view to PDF
        $pdf = Pdf::loadView('pdf.configuration', [
            'configuracion' => $configuracion,
            'componentes' => $componentesEnriquecidos,
            'usuario' => $usuario
        ]);

        // Download the file
        $filename = 'ZendPC-Presupuesto-' . $configuracion->id . '.pdf';
        return $pdf->download($filename);
    }
}
