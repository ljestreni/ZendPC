<?php

namespace App\Http\Controllers;

use App\Models\SavedConfig;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class SavedConfigController extends Controller
{
    /**
     * Cargar un proyecto en el configurador para editarlo.
     */
    public function edit(SavedConfig $savedConfig)
    {
        // Verificar que pertenece al usuario
        if ($savedConfig->user_id !== auth()->id()) {
            abort(403);
        }

        $categorias = Category::orderBy('name', 'asc')->get();

        $configurationDb = $savedConfig->configuration;
        $componentIds = array_values(array_filter($configurationDb));
        $productos = \App\Models\Product::whereIn('id', $componentIds)->get()->keyBy('id');

        $fullConfiguration = [];
        foreach ($configurationDb as $type => $id) {
            $fullConfiguration[$type] = $productos->get($id);
        }

        return Inertia::render('Builder/Index', [
            'categorias' => $categorias,
            'initialConfig' => [
                'id' => $savedConfig->id,
                'name' => $savedConfig->name,
                'configuration' => $fullConfiguration,
                'total_price' => $savedConfig->total_price,
            ]
        ]);
    }

    /**
     * Actualiza un proyecto existente.
     */
    public function update(Request $request, SavedConfig $savedConfig)
    {
        if ($savedConfig->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'configuration' => 'required|array',
            'total_price' => 'required|numeric',
        ]);

        $savedConfig->update([
            'name' => $request->name,
            'configuration' => $request->configuration,
            'total_price' => $request->total_price,
        ]);

        return response()->json(['mensaje' => 'Proyecto actualizado con éxito']);
    }

    /**
     * Añadir toda la configuración al carrito.
     */
    public function moveToCart(SavedConfig $savedConfig)
    {
        if ($savedConfig->user_id !== auth()->id()) {
            abort(403);
        }

        $cart = Session::get('cart', []);
        
        foreach ($savedConfig->configuration as $type => $id) {
            if ($id) {
                // Check if we need to add multiple quantities (e.g. RAM sticks), defaults to 1
                $qty = 1;
                
                if (isset($cart[$id])) {
                    $cart[$id] += $qty;
                } else {
                    $cart[$id] = $qty;
                }
            }
        }

        Session::put('cart', $cart);

        return back()->with('success', 'Manifiesto cargado en la Cesta. Procede con el ensamblaje cuando estés listo.');
    }

    /**
     * Eliminar un proyecto del taller.
     */
    public function destroy(SavedConfig $savedConfig)
    {
        if ($savedConfig->user_id !== auth()->id()) {
            abort(403);
        }

        $savedConfig->delete();

        return back()->with('success', 'Proyecto eliminado del Taller.');
    }
}
