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

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $productos = $query->paginate(12)->withQueryString();
        $categorias = Category::orderBy('name', 'asc')->get();

        $filters = $request->only(['search', 'category']);

        return Inertia::render('Catalog/Index', compact('productos', 'categorias', 'filters'));
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
