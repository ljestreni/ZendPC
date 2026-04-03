<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\CatalogController;

Route::get('/', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/product/{product:slug}', [CatalogController::class, 'show'])->name('catalog.show');

use App\Http\Controllers\ZendBuilderController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\Auth\GoogleController;

Route::get('/builder', [ZendBuilderController::class, 'index'])->name('builder.index');
Route::post('/builder/validate', [ZendBuilderController::class, 'validateSelection'])->name('builder.validate');
Route::post('/builder/save', [ZendBuilderController::class, 'save'])->name('builder.save')->middleware('auth');
Route::get('/builder/products/{categorySlug}', [ZendBuilderController::class, 'getProducts'])->name('builder.products');

use App\Http\Controllers\CartController;
Route::prefix('cart')->name('cart.')->group(function () {
    Route::post('/add', [CartController::class, 'add'])->name('add');
    Route::post('/remove', [CartController::class, 'remove'])->name('remove');
    Route::post('/update', [CartController::class, 'update'])->name('update');
    Route::post('/bulk-add', [CartController::class, 'bulkAdd'])->name('bulkAdd');
    Route::post('/clear', [CartController::class, 'clear'])->name('clear');
});
Route::middleware('auth')->group(function () {
    Route::get('/export/config/{savedConfig}/pdf', [ExportController::class, 'exportConfigPdf'])->name('export.config.pdf');
});

Route::get('/dashboard', function () {
    $configuracionesGuardadas = request()->user()->savedConfigs()->latest()->get();
    return Inertia::render('Dashboard', compact('configuracionesGuardadas'));
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
});

require __DIR__.'/auth.php';

// Socialite Routes
Route::get('auth/google', [GoogleController::class, 'redirect'])->name('google.login');
Route::get('auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');
