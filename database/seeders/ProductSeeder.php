<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Procesador', 'slug' => 'cpu', 'image' => 'https://via.placeholder.com/640x480.png?text=CPU'],
            ['name' => 'Placa Base', 'slug' => 'motherboard', 'image' => 'https://via.placeholder.com/640x480.png?text=Motherboard'],
            ['name' => 'Memoria RAM', 'slug' => 'ram', 'image' => 'https://via.placeholder.com/640x480.png?text=RAM'],
            ['name' => 'Tarjeta Gráfica', 'slug' => 'gpu', 'image' => 'https://via.placeholder.com/640x480.png?text=GPU'],
            ['name' => 'Almacenamiento', 'slug' => 'storage', 'image' => 'https://via.placeholder.com/640x480.png?text=Storage'],
            ['name' => 'Fuente de Alimentación', 'slug' => 'psu', 'image' => 'https://via.placeholder.com/640x480.png?text=PSU'],
            ['name' => 'Caja/Torre', 'slug' => 'case', 'image' => 'https://via.placeholder.com/640x480.png?text=Case'],
            ['name' => 'Refrigeración', 'slug' => 'cooler', 'image' => 'https://via.placeholder.com/640x480.png?text=Cooler'],
        ];

        foreach ($categories as $catData) {
            $category = Category::updateOrCreate(['slug' => $catData['slug']], $catData);
            
            /* 
            // Generate 15 random products for each category using factories
            $method = $catData['slug'];
            
            Product::factory()
                ->count(15)
                 ->sequence(fn ($sequence) => ['slug' => $catData['slug'] . '-random-' . $sequence->index . '-' . Str::random(4)])
                ->for($category)
                ->{$method}()
                ->create();
            */
        }
    }
}
