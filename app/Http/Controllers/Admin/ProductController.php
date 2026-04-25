<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productos = Product::with('category')->orderBy('id', 'desc')->get();
        return Inertia::render('Admin/Products/Index', compact('productos'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categorias = Category::orderBy('name', 'asc')->get();
        return Inertia::render('Admin/Products/Create', compact('categorias'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->merge(['slug' => Str::slug($request->name)]);
        $request->validate(self::rules());

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $request->merge(['image' => '/storage/' . $path]);
        }

        Product::create($request->except('image_file'));

        return redirect()->route('admin.products.index')->with('mensaje', 'Producto guardado con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categorias = Category::orderBy('name', 'asc')->get();
        $producto = $product;
        return Inertia::render('Admin/Products/Edit', compact('producto', 'categorias'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        if ($request->name) {
            $request->merge(['slug' => Str::slug($request->name)]);
        }
        $request->validate(self::rules($product->id));

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $request->merge(['image' => '/storage/' . $path]);
        }

        $product->update($request->except('image_file'));

        return redirect()->route('admin.products.index')->with('mensaje', 'Producto modificado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('mensaje', 'Producto borrado con éxito.');
    }

    private static function rules(?int $id = null): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug,' . $id],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric'],
            'stock' => ['required', 'integer'],
            'specs' => ['nullable', 'array'],
            'image' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
