<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1'
        ]);

        $productId = $request->product_id;
        $qty = $request->input('quantity', 1);

        $cart = Session::get('cart', []);
        
        if (isset($cart[$productId])) {
            $cart[$productId] += $qty;
        } else {
            $cart[$productId] = $qty;
        }

        Session::put('cart', $cart);

        return back()->with('success', 'Producto añadido al carrito.');
    }

    public function remove(Request $request)
    {
        $request->validate([
            'product_id' => 'required'
        ]);

        $cart = Session::get('cart', []);
        if (isset($cart[$request->product_id])) {
            unset($cart[$request->product_id]);
            Session::put('cart', $cart);
        }

        return back()->with('success', 'Producto eliminado del carrito.');
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Session::get('cart', []);
        
        if (isset($cart[$request->product_id])) {
            $cart[$request->product_id] = $request->quantity;
            Session::put('cart', $cart);
        }

        return back()->with('success', 'Cantidad actualizada.');
    }

    public function bulkAdd(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        $cart = Session::get('cart', []);
        
        foreach ($request->items as $item) {
            $id = $item['id'];
            $qty = $item['quantity'];
            
            if (isset($cart[$id])) {
                $cart[$id] += $qty;
            } else {
                $cart[$id] = $qty;
            }
        }

        Session::put('cart', $cart);

        return back()->with('success', 'Configuración completa añadida al carrito.');
    }

    public function clear(Request $request)
    {
        Session::forget('cart');
        return back()->with('success', 'Carrito vaciado.');
    }
}
