<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categorias = Category::orderBy('id', 'desc')->get();
        return Inertia::render('Admin/Categories/Index', compact('categorias'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->merge(['slug' => Str::slug($request->name)]);
        $request->validate(self::rules());

        Category::create($request->all());

        return redirect()->route('admin.categories.index')->with('mensaje', 'Categoría guardada con éxito.');
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
    public function edit(Category $category)
    {
        $categoria = $category;
        return Inertia::render('Admin/Categories/Edit', compact('categoria'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->merge(['slug' => Str::slug($request->name)]);
        $request->validate(self::rules($category->id));

        $category->update($request->all());

        return redirect()->route('admin.categories.index')->with('mensaje', 'Categoría modificada con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('admin.categories.index')->with('mensaje', 'Categoría borrada con éxito.');
    }

    private static function rules(?int $id = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug,' . $id],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
        ];
    }
}
