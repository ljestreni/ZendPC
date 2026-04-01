<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        // 1. Basic Filters
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // 2. Price Range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // 3. Dynamic Spec Filters
        if ($request->has('specs') && is_array($request->specs)) {
            foreach ($request->specs as $key => $values) {
                if (!empty($values)) {
                    $query->where(function($q) use ($key, $values) {
                        foreach ((array)$values as $value) {
                            // Supposing specs is a JSON column
                            $q->orWhere('specs->' . $key, $value);
                        }
                    });
                }
            }
        }

        // 4. Get Available Filters (for the sidebar)
        $availableFilters = [];
        if ($request->has('category')) {
            $activeCategory = Category::where('slug', $request->category)->first();
            if ($activeCategory) {
                // Get all specs for products in this category
                $allSpecs = Product::where('category_id', $activeCategory->id)
                    ->pluck('specs')
                    ->filter();

                $filterGroups = [];
                foreach ($allSpecs as $spec) {
                    foreach ($spec as $key => $value) {
                        // We skip technical scores for filters usually
                        if (in_array($key, ['perf_score', 'tdp'])) continue;
                        
                        if (!isset($filterGroups[$key])) {
                            $filterGroups[$key] = [];
                        }
                        if (!in_array($value, $filterGroups[$key])) {
                            $filterGroups[$key][] = $value;
                        }
                    }
                }
                
                $translations = [
                    'socket' => 'Socket / Conexión',
                    'memory_type' => 'Tipo de Memoria',
                    'form_factor' => 'Tamaño / Formato',
                    'chipset' => 'Chipset (Base)',
                    'cores' => 'Núcleos',
                    'vram' => 'Memoria de Gráfica',
                    'efficiency' => 'Certificación / Eficiencia',
                    'wattage' => 'Potencia (W)',
                    'modular' => 'Cables Modulares',
                    'capacity' => 'Capacidad / Almacenamiento',
                    'interface' => 'Conexión / Interfaz',
                    'type' => 'Tipo de Unidad',
                    'speed' => 'Velocidad'
                ];
                
                foreach($filterGroups as $key => $values) {
                    sort($values);
                    $availableFilters[] = [
                        'key' => $key,
                        'name' => $translations[$key] ?? ucfirst(str_replace('_', ' ', $key)),
                        'options' => $values
                    ];
                }
            }
        }

        $productos = $query->paginate(12)->withQueryString();
        $categorias = Category::orderBy('name', 'asc')->get();
        
        $priceRange = [
            'min' => floor(Product::min('price') ?? 0),
            'max' => ceil(Product::max('price') ?? 5000)
        ];

        $filters = $request->only(['search', 'category', 'min_price', 'max_price', 'specs']);

        return Inertia::render('Catalog/Index', compact('productos', 'categorias', 'filters', 'availableFilters', 'priceRange'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('category');
        $producto = $product;
        return Inertia::render('Catalog/Show', compact('producto'));
    }
}
