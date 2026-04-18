<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = Session::get('cart', []);
        
        if (empty($cart)) {
            return redirect()->route('catalog.index')->with('error', 'Tu carrito está vacío.');
        }

        $cartItems = [];
        $total = 0;

        foreach ($cart as $id => $quantity) {
            $product = Product::find($id);
            if ($product) {
                $subtotal = $product->price * $quantity;
                $cartItems[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                    'image' => $product->image
                ];
                $total += $subtotal;
            }
        }

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'total' => $total
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'address' => 'required|string|max:255|min:5',
            'city' => ['required', 'string', 'max:255', 'min:2', 'regex:/^[\pL\s\-]+$/u'],
            'postal_code' => ['required', 'string', 'regex:/^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/'],
            'phone' => ['required', 'string', 'regex:/^[6789]\d{8}$/'],
            'notes' => 'nullable|string|max:1000',
        ], [
            'city.regex' => 'La ciudad solo puede contener letras.',
            'postal_code.regex' => 'Introduce un código postal español válido (5 dígitos).',
            'phone.regex' => 'Introduce un número de teléfono español válido (9 dígitos).',
        ]);

        $cart = Session::get('cart', []);
        
        if (empty($cart)) {
            return redirect()->route('catalog.index')->with('error', 'Tu carrito está vacío.');
        }

        try {
            DB::beginTransaction();

            $total = 0;
            $itemsToCreate = [];

            foreach ($cart as $id => $quantity) {
                $product = Product::lockForUpdate()->find($id);
                
                if (!$product) {
                    throw new \Exception("Producto no encontrado.");
                }

                if ($product->stock < $quantity) {
                    throw new \Exception("No hay suficiente stock para {$product->name}.");
                }

                $subtotal = $product->price * $quantity;
                $total += $subtotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ];

                // Reducir stock
                $product->decrement('stock', $quantity);
            }

            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => 'ZPC-' . strtoupper(Str::random(8)),
                'address' => $request->address,
                'city' => $request->city,
                'postal_code' => $request->postal_code,
                'phone' => $request->phone,
                'notes' => $request->notes,
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($itemsToCreate as $item) {
                $order->items()->create($item);
            }

            DB::commit();
            Session::forget('cart');

            return redirect()->route('dashboard')->with('success', "Pedido {$order->order_number} creado con éxito.");

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al procesar el pedido: ' . $e->getMessage());
        }
    }
}
