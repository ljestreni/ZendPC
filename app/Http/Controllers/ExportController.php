<?php

namespace App\Http\Controllers;

use App\Models\SavedConfig;
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

        // Decode the JSON configuration (array of component details)
        $componentes = is_string($savedConfig->configuration) 
            ? json_decode($savedConfig->configuration, true) 
            : $savedConfig->configuration;
            
        $configuracion = $savedConfig;
        $usuario = Auth::user();

        // Render the blade view to PDF
        $pdf = Pdf::loadView('pdf.configuration', compact('configuracion', 'componentes', 'usuario'));

        // Download the file
        $filename = 'ZendPC-Presupuesto-' . $configuracion->id . '.pdf';
        return $pdf->download($filename);
    }
}
