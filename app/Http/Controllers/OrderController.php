<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $pedidos = auth()->user()->orders()->with('items.product')->latest()->get();
        return Inertia::render('Orders/Index', compact('pedidos'));
    }

    /**
     * Cancelar un pedido si está pendiente y restaurar el stock.
     */
    public function cancel(Order $order)
    {
        // Verificar que el pedido pertenece al usuario
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        // Solo se pueden cancelar pedidos pendientes
        if ($order->status !== 'pending') {
            return back()->with('error', 'Solo se pueden cancelar pedidos en estado pendiente.');
        }

        try {
            DB::beginTransaction();

            // Restaurar el stock de los productos
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                }
            }

            // Cambiar estado a cancelado
            $order->update(['status' => 'cancelled']);

            DB::commit();

            return back()->with('success', "El pedido {$order->order_number} ha sido cancelado y el stock restaurado.");

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al cancelar el pedido: ' . $e->getMessage());
        }
    }
}
