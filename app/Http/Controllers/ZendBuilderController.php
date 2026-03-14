<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Services\CompatibilityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ZendBuilderController extends Controller
{
    protected $compatibilityService;

    public function __construct(CompatibilityService $compatibilityService)
    {
        $this->compatibilityService = $compatibilityService;
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

        // Validate
        $result = $this->compatibilityService->validateConfig($components);

        return response()->json($result);
    }
    
    /**
     * Get compatible products for a specific slot/type.
     */
    public function getProducts(Request $request, string $categorySlug)
    {
        $category = Category::where('slug', $categorySlug)->firstOrFail();
        $query = $category->products();
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
