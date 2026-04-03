<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'mensaje' => fn () => $request->session()->get('mensaje'),
                'success' => fn () => $request->session()->get('success'),
            ],
            'cart' => fn () => $this->getCartData(),
        ];
    }

    protected function getCartData()
    {
        $cartSession = \Illuminate\Support\Facades\Session::get('cart', []);
        
        if (empty($cartSession)) {
            return [
                'items' => [],
                'total_items' => 0,
                'total_price' => 0
            ];
        }

        $products = \App\Models\Product::whereIn('id', array_keys($cartSession))->get();
        
        $items = [];
        $totalPrice = 0;
        $totalItems = 0;

        foreach ($products as $product) {
            $qty = $cartSession[$product->id];
            $items[] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'image' => $product->image,
                'slug' => $product->slug,
                'quantity' => $qty,
                'subtotal' => $product->price * $qty
            ];
            $totalPrice += $product->price * $qty;
            $totalItems += $qty;
        }

        return [
            'items' => array_reverse($items), // newest first
            'total_items' => $totalItems,
            'total_price' => $totalPrice
        ];
    }
}
