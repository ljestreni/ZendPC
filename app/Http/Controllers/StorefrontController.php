<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Session;

class StorefrontController extends Controller
{
    /**
     * Display the Storefront landing page.
     */
    public function index()
    {
        // 1. Novedades (Últimas piezas de hardware añadidas o actualizadas recientemente)
        $novedades = Product::with('category')
            ->latest('created_at')
            ->take(8)
            ->get();

        // 2. Destacados (Puede ser un restock o selección aleatoria curada)
        $destacados = Product::with('category')
            ->inRandomOrder()
            ->take(8)
            ->get();

        // 3. Lo Último Visitado (Historial extraído de la sesión temporal)
        $recentIds = Session::get('recent_products', []);
        
        $ultimoVisitado = collect();
        if (!empty($recentIds)) {
            // Obtener los productos que aún existan
            // Preservamos el orden en que fueron vistos (los más recientes primero)
            $productsRaw = Product::with('category')
                ->whereIn('id', $recentIds)
                ->get()
                ->keyBy('id');
                
            foreach ($recentIds as $id) {
                if ($productsRaw->has($id)) {
                    $ultimoVisitado->push($productsRaw->get($id));
                }
            }
        }

        $categorias = \App\Models\Category::orderBy('name')->get();

        return Inertia::render('Welcome', compact('novedades', 'destacados', 'ultimoVisitado', 'categorias'));
    }
}
