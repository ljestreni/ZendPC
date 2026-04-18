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
                            if (in_array($key, ['socket', 'socket_support'])) {
                                $q->orWhere('specs->' . $key, 'like', '%' . $value . '%');
                            } else {
                                $q->orWhere('specs->' . $key, $value);
                            }
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
                        if (in_array($key, ['perf_score', 'tdp'])) continue;
                        
                        if (!isset($filterGroups[$key])) {
                            $filterGroups[$key] = [];
                        }

                        // If the value is an array (like socket list in new seeders)
                        if (is_array($value)) {
                            foreach ($value as $v) {
                                if (is_string($v)) {
                                    $v = trim($v);
                                    if (!in_array($v, $filterGroups[$key])) {
                                        $filterGroups[$key][] = $v;
                                    }
                                }
                            }
                        // Split by comma if it's a comma-separated string
                        } else if (in_array($key, ['socket', 'socket_support']) && is_string($value) && str_contains($value, ',')) {
                            $vals = array_map('trim', explode(',', $value));
                            foreach ($vals as $v) {
                                if (!in_array($v, $filterGroups[$key])) {
                                    $filterGroups[$key][] = $v;
                                }
                            }
                        } else {
                            if (is_scalar($value) && !in_array($value, $filterGroups[$key])) {
                                $filterGroups[$key][] = $value;
                            }
                        }
                    }
                }
                
                $translations = [
                    'socket' => 'Socket / Plataforma',
                    'socket_support' => 'Sockets Compatibles',
                    'memory_type' => 'Tipo de Memoria',
                    'form_factor' => 'Factor de Forma',
                    'chipset' => 'Chipset (Base)',
                    'cores' => 'Núcleos de Proceso',
                    'threads' => 'Hilos de Trabajo',
                    'vram' => 'Memoria de Gráfica (VRAM)',
                    'efficiency' => 'Certificación Energética',
                    'wattage' => 'Potencia Proporcionada',
                    'modular' => 'Gestión de Cables',
                    'capacity' => 'Capacidad / Espacio',
                    'interface' => 'Conexión / Interfaz',
                    'type' => 'Tipo de Unidad',
                    'speed' => 'Velocidad / Frecuencia',
                    'series' => 'Gama / Familia',
                    'integrated_graphics' => 'Video Integrado',
                    'architecture' => 'Microarquitectura',
                    'radiator_size' => 'Tamaño de Radiador',
                    'color' => 'Color Principal',
                    'brand' => 'Fabricante / Marca',
                    'max_gpu_length' => 'Longitud Máx. GPU',
                    'max_cooler_height' => 'Altura Máx. Cooler',
                    'tdp' => 'Consumo Térmico (TDP)',
                    'latency' => 'Latencia (CL)',
                    'voltage' => 'Voltaje Operativo',
                    'read_speed' => 'Lectura Secuencial',
                    'write_speed' => 'Escritura Secuencial',
                    'length' => 'Longitud (mm)',
                    'width' => 'Anchura (mm)',
                    'height' => 'Altura (mm)',
                    'rpm' => 'Velocidad Ventilador (RPM)',
                    'noise_level' => 'Nivel de Ruido (dB)'
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
        // Registrar historial de visita
        $recent = session()->get('recent_products', []);
        
        // Remover si existe, para moverlo al frente
        $recent = array_diff($recent, [$product->id]);
        array_unshift($recent, $product->id);
        
        // Limitar a 8 productos recientes
        $recent = array_slice($recent, 0, 8);
        session()->put('recent_products', $recent);

        $product->load('category');
        $producto = $product;
        return Inertia::render('Catalog/Show', compact('producto'));
    }
}
