<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Services\CompatibilityService;
use App\Services\PerformanceService;
use App\Services\TechnicalSummaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ZendBuilderController extends Controller
{
    protected $compatibilityService;
    protected $performanceService;
    protected $technicalSummaryService;

    public function __construct(
        CompatibilityService $compatibilityService,
        PerformanceService $performanceService,
        TechnicalSummaryService $technicalSummaryService
    ) {
        $this->compatibilityService = $compatibilityService;
        $this->performanceService = $performanceService;
        $this->technicalSummaryService = $technicalSummaryService;
    }

    /**
     * Show the builder interface.
     */
    public function index()
    {
        $categorias = Category::orderBy('name', 'asc')->get();

        return Inertia::render('Builder/Index', compact('categorias'));
    }

    /**
     * API to validate current selection.
     */
    public function validateSelection(Request $request)
    {
        $componentIds = $request->input('components', []);
        
        // Fetch full product models
        $components = [];
        if (!empty($componentIds)) {
            $productos = Product::whereIn('id', array_values($componentIds))->get();
            
            foreach ($componentIds as $type => $id) {
                $components[$type] = $productos->find($id);
            }
        }

        // Validate Compatibility
        $compResult = $this->compatibilityService->validateConfig($components);

        // Get Performance Estimates
        $perfResult = $this->performanceService->estimateFps(
            $components['cpu'] ?? null,
            $components['gpu'] ?? null
        );

        // Get Technical Summary
        $techResult = $this->technicalSummaryService->getSummary($components);

        return response()->json([
            'compatibility' => $compResult,
            'performance' => $perfResult,
            'technical' => $techResult
        ]);
    }
    
    /**
     * Get compatible products for a specific slot/type.
     */
    public function getProducts(Request $request, string $categorySlug)
    {
        $category = Category::where('slug', $categorySlug)->firstOrFail();
        $query = $category->products();

        // Aplicamos el filtro si el "socket-first" manda la plataforma
        if ($request->has('platform')) {
            $platform = $request->input('platform');

            if (in_array($categorySlug, ['cpu', 'motherboard'])) {
                // Normalizar plataforma para búsqueda (LGA 1700 vs LGA1700)
                $normalized = str_replace([' ', '/', '-'], '', $platform);
                $query->where(function($q) use ($platform, $normalized) {
                    $q->where('specs->socket', $platform)
                      ->orWhere('specs->socket', $normalized)
                      ->orWhere('specs->socket', 'like', '%' . $platform . '%')
                      ->orWhere('specs->socket', 'like', '%' . $normalized . '%');
                });

                // Si es placa base, también filtramos por el tipo de RAM que obliga el socket
                if ($categorySlug === 'motherboard') {
                    if ($platform === 'AM4') {
                        $query->where('specs->memory_type', 'DDR4');
                    } elseif ($platform === 'AM5') {
                        $query->where('specs->memory_type', 'DDR5');
                    }
                }
            } elseif ($categorySlug === 'cooler') {
                $query->where(function($q) use ($platform) {
                    $q->whereJsonContains('specs->socket', $platform)
                      ->orWhereJsonContains('specs->socket_support', $platform)
                      ->orWhere('specs->socket', 'like', '%' . $platform . '%')
                      ->orWhere('specs->socket_support', 'like', '%' . $platform . '%');
                });
            } elseif ($categorySlug === 'ram') {
                // Filtramos la RAM según lo admitido por la Placa Base seleccionada o el Socket
                if ($request->has('motherboard')) {
                    $mb = Product::find($request->input('motherboard'));
                    if ($mb && is_array($mb->specs) && isset($mb->specs['memory_type'])) {
                        $query->where('specs->type', $mb->specs['memory_type']);
                    }
                } else {
                    if ($platform === 'AM4') {
                        $query->where('specs->type', 'DDR4');
                    } elseif ($platform === 'AM5') {
                        $query->where('specs->type', 'DDR5');
                    }
                }
            }
        }

        $productos = $query->get();
        return response()->json($productos);
    }

    /**
     * Save the current configuration.
     */
    public function save(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'components' => 'required|array',
            'total_price' => 'required|numeric',
        ]);

        $request->user()->savedConfigs()->create([
            'name' => $request->name,
            'components' => $request->components,
            'total_price' => $request->total_price,
        ]);

        return response()->json(['mensaje' => 'Configuración guardada con éxito']);
    }
}
