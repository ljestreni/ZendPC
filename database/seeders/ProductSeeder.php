<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Categories
        $categories = [
            ['name' => 'Procesador', 'slug' => 'cpu', 'image' => 'https://m.media-amazon.com/images/I/51f2hk81eGL._AC_SL1000_.jpg'], // Generic CPU Img
            ['name' => 'Placa Base', 'slug' => 'motherboard', 'image' => 'https://m.media-amazon.com/images/I/810-Mqm0-AL._AC_SL1500_.jpg'],
            ['name' => 'Memoria RAM', 'slug' => 'ram', 'image' => 'https://m.media-amazon.com/images/I/61vGQtRjGHL._AC_SL1000_.jpg'],
            ['name' => 'Tarjeta Gráfica', 'slug' => 'gpu', 'image' => 'https://m.media-amazon.com/images/I/71tDuCSgOAL._AC_SL1500_.jpg'],
            ['name' => 'Almacenamiento', 'slug' => 'storage', 'image' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg'],
            ['name' => 'Fuente de Alimentación', 'slug' => 'psu', 'image' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg'],
            ['name' => 'Caja/Torre', 'slug' => 'case', 'image' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 2. Clear existing products to avoid duplicates or just updateOrCreate
        // For simplicity, we'll use updateOrCreate based on SKU or name/slug.

        // --- CPUs ---
        $cpuCat = Category::where('slug', 'cpu')->first();
        
        Product::updateOrCreate(['slug' => 'amd-ryzen-5-7600x'], [
            'category_id' => $cpuCat->id,
            'name' => 'AMD Ryzen 5 7600X',
            'description' => '6 Cores, 12 Threads, hasta 5.3GHz. Socket AM5.',
            'price' => 249.99,
            'stock' => 50,
            'image' => 'https://m.media-amazon.com/images/I/61sV6Z9lS1L._AC_SL1000_.jpg',
            'specs' => ['socket' => 'AM5', 'tdp' => 105, 'cores' => 6, 'integrated_graphics' => true],
        ]);

        Product::updateOrCreate(['slug' => 'amd-ryzen-7-7800x3d'], [
            'category_id' => $cpuCat->id,
            'name' => 'AMD Ryzen 7 7800X3D',
            'description' => '8 Cores, 16 Threads, AMD 3D V-Cache Technology. El rey del gaming. Socket AM5.',
            'price' => 399.99,
            'stock' => 30,
            'image' => 'https://m.media-amazon.com/images/I/61X-EaP0VIL._AC_SL1000_.jpg',
            'specs' => ['socket' => 'AM5', 'tdp' => 120, 'cores' => 8, 'integrated_graphics' => true],
        ]);

        Product::updateOrCreate(['slug' => 'intel-core-i5-13600k'], [
            'category_id' => $cpuCat->id,
            'name' => 'Intel Core i5-13600K',
            'description' => '14 Cores (6P+8E), hasta 5.1GHz. Socket LGA1700.',
            'price' => 319.99,
            'stock' => 40,
            'image' => 'https://m.media-amazon.com/images/I/6125mFrzr6L._AC_SL1000_.jpg',
            'specs' => ['socket' => 'LGA1700', 'tdp' => 125, 'cores' => 14, 'integrated_graphics' => true],
        ]);

        Product::updateOrCreate(['slug' => 'intel-core-i9-14900k'], [
            'category_id' => $cpuCat->id,
            'name' => 'Intel Core i9-14900K',
            'description' => '24 Cores (8P+16E), 32 Threads, hasta 6.0GHz. Socket LGA1700.',
            'price' => 589.99,
            'stock' => 15,
            'image' => 'https://m.media-amazon.com/images/I/61kM2o93zNL._AC_SL1500_.jpg',
            'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 24, 'integrated_graphics' => true],
        ]);

        Product::updateOrCreate(['slug' => 'intel-core-i7-14700k'], [
            'category_id' => $cpuCat->id,
            'name' => 'Intel Core i7-14700K',
            'description' => '20 Cores (8P+12E), 28 Threads, hasta 5.6GHz. Socket LGA1700.',
            'price' => 409.99,
            'stock' => 25,
            'image' => 'https://m.media-amazon.com/images/I/61Tf-u-Q3wL._AC_SL1500_.jpg',
            'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 20, 'integrated_graphics' => true],
        ]);

        // --- Motherboards ---
        $mbCat = Category::where('slug', 'motherboard')->first();

        Product::updateOrCreate(['slug' => 'asus-rog-strix-b650e-f'], [
            'category_id' => $mbCat->id,
            'name' => 'ASUS ROG Strix B650E-F Gaming WiFi',
            'description' => 'Placa base AM5, DDR5, PCIe 5.0, WiFi 6E.',
            'price' => 289.99,
            'stock' => 20,
            'image' => 'https://m.media-amazon.com/images/I/810-Mqm0-AL._AC_SL1500_.jpg', // Confirmed good
            'specs' => ['socket' => 'AM5', 'memory_type' => 'DDR5', 'form_factor' => 'ATX'],
        ]);

        Product::updateOrCreate(['slug' => 'msi-pro-z790-p'], [
            'category_id' => $mbCat->id,
            'name' => 'MSI PRO Z790-P WIFI',
            'description' => 'Placa base LGA1700, DDR5, PCIe 5.0.',
            'price' => 219.99,
            'stock' => 25,
            'image' => 'https://m.media-amazon.com/images/I/81w+rJ0yHNL._AC_SL1500_.jpg', // Confirmed good
            'specs' => ['socket' => 'LGA1700', 'memory_type' => 'DDR5', 'form_factor' => 'ATX'],
        ]);

        Product::updateOrCreate(['slug' => 'gigabyte-b660m-ds3h'], [
            'category_id' => $mbCat->id,
            'name' => 'Gigabyte B660M DS3H DDR4',
            'description' => 'Placa base LGA1700, DDR4, Micro-ATX.',
            'price' => 109.99,
            'stock' => 30,
            'image' => 'https://m.media-amazon.com/images/I/81X2v+b+a+L._AC_SL1500_.jpg', // Confirmed good
            'specs' => ['socket' => 'LGA1700', 'memory_type' => 'DDR4', 'form_factor' => 'Micro-ATX'],
        ]);


        // --- RAM ---
        $ramCat = Category::where('slug', 'ram')->first();

        Product::updateOrCreate(['slug' => 'corsair-vengeance-ddr5-32gb'], [
            'category_id' => $ramCat->id,
            'name' => 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz',
            'description' => 'Kit de memoria DDR5 de alto rendimiento.',
            'price' => 114.99,
            'stock' => 100,
            'image' => 'https://m.media-amazon.com/images/I/61vGQtRjGHL._AC_SL1000_.jpg', // Confirmed good
            'specs' => ['type' => 'DDR5', 'capacity' => 32, 'speed' => 6000],
        ]);

        Product::updateOrCreate(['slug' => 'kingston-fury-beast-ddr4-16gb'], [
            'category_id' => $ramCat->id,
            'name' => 'Kingston FURY Beast DDR4 16GB (2x8GB) 3200MHz',
            'description' => 'Memoria DDR4 fiable y económica.',
            'price' => 45.99,
            'stock' => 150,
            'image' => 'https://m.media-amazon.com/images/I/61O+aK-KcwL._AC_SL1000_.jpg', // Confirmed good
            'specs' => ['type' => 'DDR4', 'capacity' => 16, 'speed' => 3200],
        ]);

        // --- GPU ---
        $gpuCat = Category::where('slug', 'gpu')->first();

        Product::updateOrCreate(['slug' => 'rtx-4070-windforce'], [
            'category_id' => $gpuCat->id,
            'name' => 'Gigabyte GeForce RTX 4070 WINDFORCE OC',
            'description' => '12GB GDDR6X, DLSS 3, Ray Tracing.',
            'price' => 599.99,
            'stock' => 15,
            'image' => 'https://m.media-amazon.com/images/I/71tDuCSgOAL._AC_SL1500_.jpg',
            'specs' => ['tdp' => 200, 'length' => 261, 'vram' => 12],
        ]);

        Product::updateOrCreate(['slug' => 'rtx-4080-super-founders'], [
            'category_id' => $gpuCat->id,
            'name' => 'NVIDIA GeForce RTX 4080 Super Founders Edition',
            'description' => '16GB GDDR6X, Ada Lovelace, DLSS 3.5.',
            'price' => 1109.99,
            'stock' => 8,
            'image' => 'https://m.media-amazon.com/images/I/71I3uXf3mEL._AC_SL1500_.jpg',
            'specs' => ['tdp' => 320, 'length' => 310, 'vram' => 16],
        ]);

        Product::updateOrCreate(['slug' => 'rtx-4090-rog-strix'], [
            'category_id' => $gpuCat->id,
            'name' => 'ASUS ROG Strix GeForce RTX 4090 OC',
            'description' => '24GB GDDR6X, La GPU más potente del mercado de consumo.',
            'price' => 1999.99,
            'stock' => 5,
            'image' => 'https://m.media-amazon.com/images/I/8157vM-W-WL._AC_SL1500_.jpg',
            'specs' => ['tdp' => 450, 'length' => 357, 'vram' => 24],
        ]);
        
        Product::updateOrCreate(['slug' => 'rx-7900-xtx-reference'], [
            'category_id' => $gpuCat->id,
            'name' => 'AMD Radeon RX 7900 XTX Reference',
            'description' => '24GB GDDR6, Arquitectura RDNA 3.',
            'price' => 999.99,
            'stock' => 12,
            'image' => 'https://m.media-amazon.com/images/I/61gRjT3jEFL._AC_SL1500_.jpg',
            'specs' => ['tdp' => 355, 'length' => 287, 'vram' => 24],
        ]);

        // --- Storage ---
        $storageCat = Category::where('slug', 'storage')->first();
        
        Product::updateOrCreate(['slug' => 'samsung-980-pro-1tb'], [
            'category_id' => $storageCat->id,
            'name' => 'Samsung 980 PRO 1TB NVMe M.2',
            'description' => 'SSD PCIe 4.0 de alta velocidad.',
            'price' => 89.99,
            'stock' => 80,
            'image' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', // Confirmed good
            'specs' => ['type' => 'NVMe', 'capacity' => 1000, 'read_speed' => 7000],
        ]);

        // --- PSU ---
        $psuCat = Category::where('slug', 'psu')->first();
        
        Product::updateOrCreate(['slug' => 'corsair-rm750e'], [
            'category_id' => $psuCat->id,
            'name' => 'Corsair RM750e 750W 80+ Gold',
            'description' => 'Fuente modular, eficiente y silenciosa.',
            'price' => 99.99,
            'stock' => 45,
            'image' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg', // Confirmed good
            'specs' => ['wattage' => 750, 'modular' => true, 'rating' => '80+ Gold'],
        ]);

        Product::updateOrCreate(['slug' => 'corsair-hx1000i'], [
            'category_id' => $psuCat->id,
            'name' => 'Corsair HX1000i 1000W 80+ Platinum',
            'description' => 'Fuente de alta potencia para builds extremas.',
            'price' => 239.99,
            'stock' => 20,
            'image' => 'https://m.media-amazon.com/images/I/71p+JgE6i+L._AC_SL1500_.jpg', // Confirmed good
            'specs' => ['wattage' => 1000, 'modular' => true, 'rating' => '80+ Platinum'],
        ]);

        // --- Case ---
        $caseCat = Category::where('slug', 'case')->first();

        Product::updateOrCreate(['slug' => 'corsair-4000d-airflow'], [
            'category_id' => $caseCat->id,
            'name' => 'Corsair 4000D Airflow',
            'description' => 'Caja ATX con panel frontal de rejilla para un flujo de aire óptimo.',
            'price' => 104.99,
            'stock' => 60,
            'image' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg',
            'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 360, 'color' => 'Black'],
        ]);
        
        Product::updateOrCreate(['slug' => 'nzxt-h510'], [
            'category_id' => $caseCat->id,
            'name' => 'NZXT H510',
            'description' => 'Caja compacta ATX con diseño minimalista.',
            'price' => 89.99,
            'stock' => 50,
            'image' => 'https://m.media-amazon.com/images/I/61ngFwH62PL._AC_SL1500_.jpg',
            'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 381, 'color' => 'White'],
        ]);

        Product::updateOrCreate(['slug' => 'fractal-design-north'], [
            'category_id' => $caseCat->id,
            'name' => 'Fractal Design North Charcoal Black',
            'description' => 'Diseño elegante con frontal de madera auténtica.',
            'price' => 149.99,
            'stock' => 20,
            'image' => 'https://m.media-amazon.com/images/I/81Mlt80G44L._AC_SL1500_.jpg',
            'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 355, 'color' => 'Black/Wood'],
        ]);

        // --- Coolers (New Category) ---
        $coolerCat = Category::updateOrCreate(
            ['slug' => 'cooler'], 
            ['name' => 'Disipador/Refrigeración', 'image' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg']
        );

        Product::updateOrCreate(['slug' => 'noctua-nh-d15'], [
            'category_id' => $coolerCat->id,
            'name' => 'Noctua NH-D15',
            'description' => 'Disipador de aire de doble torre, rendimiento extremo.',
            'price' => 109.90,
            'stock' => 35,
            'image' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg',
            'specs' => ['type' => 'Air', 'tdp_rating' => 220, 'socket_support' => ['AM5', 'LGA1700']],
        ]);

        Product::updateOrCreate(['slug' => 'corsair-icue-h150i'], [
            'category_id' => $coolerCat->id,
            'name' => 'Corsair iCUE H150i Elite Capellix XT',
            'description' => 'Refrigeración líquida AIO de 360mm con RGB.',
            'price' => 219.99,
            'stock' => 15,
            'image' => 'https://m.media-amazon.com/images/I/71R2A0t0E5L._AC_SL1500_.jpg',
            'specs' => ['type' => 'AIO 360mm', 'tdp_rating' => 300, 'socket_support' => ['AM5', 'LGA1700']],
        ]);
    }
}
