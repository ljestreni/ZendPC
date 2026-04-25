<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\CatalogController;

Route::get('/', [StorefrontController::class, 'index'])->name('home');
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/product/{product:slug}', [CatalogController::class, 'show'])->name('catalog.show');

use App\Http\Controllers\ZendBuilderController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\Auth\GoogleController;

Route::get('/builder', [ZendBuilderController::class, 'index'])->name('builder.index');
Route::post('/builder/validate', [ZendBuilderController::class, 'validateSelection'])->name('builder.validate');
Route::post('/builder/save', [ZendBuilderController::class, 'save'])->name('builder.save')->middleware('auth');
Route::get('/builder/products/{categorySlug}', [ZendBuilderController::class, 'getProducts'])->name('builder.products');

use App\Http\Controllers\SavedConfigController;
Route::middleware('auth')->prefix('saved-configs')->name('saved-configs.')->group(function () {
    Route::get('/{savedConfig}/edit', [SavedConfigController::class, 'edit'])->name('edit');
    Route::put('/{savedConfig}', [SavedConfigController::class, 'update'])->name('update');
    Route::delete('/{savedConfig}', [SavedConfigController::class, 'destroy'])->name('destroy');
    Route::post('/{savedConfig}/move-to-cart', [SavedConfigController::class, 'moveToCart'])->name('moveToCart');
});

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;

Route::prefix('cart')->name('cart.')->group(function () {
    Route::post('/add', [CartController::class, 'add'])->name('add');
    Route::post('/remove', [CartController::class, 'remove'])->name('remove');
    Route::post('/update', [CartController::class, 'update'])->name('update');
    Route::post('/bulk-add', [CartController::class, 'bulkAdd'])->name('bulkAdd');
    Route::post('/clear', [CartController::class, 'clear'])->name('clear');
});

Route::get('/cart', function () {
    return redirect()->route('catalog.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/{order}/cancel', [\App\Http\Controllers\OrderController::class, 'cancel'])->name('orders.cancel');
    Route::get('/export/config/{savedConfig}/pdf', [ExportController::class, 'exportConfigPdf'])->name('export.config.pdf');
});

Route::get('/dashboard', function () {
    $user = request()->user();
    $configuracionesGuardadas = $user->savedConfigs()->latest()->get();
    $pedidos = $user->orders()->with('items.product')->latest()->get();
    
    return Inertia::render('Dashboard', compact('configuracionesGuardadas', 'pedidos'));
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

use App\Http\Controllers\Admin\OrderController as AdminOrderController;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
    
    Route::get('orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.updateStatus');
    
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('users/{user}/role', [UserController::class, 'updateRole'])->name('users.updateRole');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/auth.php';

// Socialite Routes
Route::get('auth/google', [GoogleController::class, 'redirect'])->name('google.login');
Route::get('auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');
