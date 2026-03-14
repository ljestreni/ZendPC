<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CompleteLocalSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Limpiar la base de datos antigua
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Product::truncate();
        Category::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Crear el directorio físico si no existe
        if (!Storage::disk('public')->exists('products')) {
            Storage::disk('public')->makeDirectory('products');
        }

        // --- DICCIONARIO DE DATOS (80 PRODUCTOS: 8 Categorías x 10 Productos) ---
        $catalog = [
            'cpu' => [
                'name' => 'Procesadores', 'image' => 'https://m.media-amazon.com/images/I/51f2hk81eGL._AC_SL1000_.jpg',
                'items' => [
                    ['name' => 'AMD Ryzen 5 7600X', 'price' => 249.99, 'stock' => 50, 'url' => 'https://m.media-amazon.com/images/I/61sV6Z9lS1L._AC_SL1000_.jpg', 'desc' => '6 Cores, 12 Threads, 5.3GHz. Ideal Gaming 1080p.', 'specs' => ['socket' => 'AM5', 'tdp' => 105, 'cores' => 6]],
                    ['name' => 'AMD Ryzen 7 7800X3D', 'price' => 399.99, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/61X-EaP0VIL._AC_SL1000_.jpg', 'desc' => '8 Cores con 3D V-Cache. El rey indiscutible del Gaming.', 'specs' => ['socket' => 'AM5', 'tdp' => 120, 'cores' => 8]],
                    ['name' => 'AMD Ryzen 9 7950X3D', 'price' => 699.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/51f2hk81eGL._AC_SL1000_.jpg', 'desc' => '16 Cores. Potencia extrema para creadores y gamers.', 'specs' => ['socket' => 'AM5', 'tdp' => 120, 'cores' => 16]],
                    ['name' => 'AMD Ryzen 5 5600X', 'price' => 159.99, 'stock' => 100, 'url' => 'https://img.pccomponentes.com/articles/32/328475/1101-amd-ryzen-5-5600x-37ghz.jpg', 'desc' => 'El clásico calidad/precio en AM4.', 'specs' => ['socket' => 'AM4', 'tdp' => 65, 'cores' => 6]],
                    ['name' => 'AMD Ryzen 7 5800X3D', 'price' => 319.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/61Kq9Q5mDIL._AC_SL1000_.jpg', 'desc' => 'Actualización final para plataformas AM4.', 'specs' => ['socket' => 'AM4', 'tdp' => 105, 'cores' => 8]],
                    ['name' => 'Intel Core i5-13600K', 'price' => 319.99, 'stock' => 40, 'url' => 'https://m.media-amazon.com/images/I/6125mFrzr6L._AC_SL1000_.jpg', 'desc' => '14 Cores (6P+8E). Rendimiento híbrido excelente.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 125, 'cores' => 14]],
                    ['name' => 'Intel Core i7-13700K', 'price' => 409.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/61mR+dEaH8L._AC_SL1000_.jpg', 'desc' => '16 Cores (8P+8E) hasta 5.4GHz.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 16]],
                    ['name' => 'Intel Core i9-13900K', 'price' => 569.99, 'stock' => 10, 'url' => 'https://m.media-amazon.com/images/I/61cQ1H1y8YL._AC_SL1000_.jpg', 'desc' => '24 Cores extremos para productividad máxima.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 24]],
                    ['name' => 'Intel Core i7-14700K', 'price' => 459.99, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/61Tf-u-Q3wL._AC_SL1500_.jpg', 'desc' => 'Gneración 14, 20 Cores monstruosos.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 20]],
                    ['name' => 'Intel Core i9-14900K', 'price' => 589.99, 'stock' => 5, 'url' => 'https://m.media-amazon.com/images/I/61kM2o93zNL._AC_SL1500_.jpg', 'desc' => 'El procesador más rápido del mundo hasta 6.0GHz.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 24]],
                ]
            ],
            'motherboard' => [
                'name' => 'Placas Base', 'image' => 'https://m.media-amazon.com/images/I/810-Mqm0-AL._AC_SL1500_.jpg',
                'items' => [
                    ['name' => 'ASUS ROG Strix B650E-F Gaming WiFi', 'price' => 289.99, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/810-Mqm0-AL._AC_SL1500_.jpg', 'desc' => 'AM5, DDR5, PCIe 5.0, ATX.', 'specs' => ['socket' => 'AM5', 'form_factor' => 'ATX', 'memory_type' => 'DDR5']],
                    ['name' => 'MSI MAG B650 TOMAHAWK WIFI', 'price' => 219.99, 'stock' => 35, 'url' => 'https://m.media-amazon.com/images/I/81vJ9EaO-6L._AC_SL1500_.jpg', 'desc' => 'AM5, DDR5, Robustez militar, ATX.', 'specs' => ['socket' => 'AM5', 'form_factor' => 'ATX', 'memory_type' => 'DDR5']],
                    ['name' => 'Gigabyte X670E AORUS MASTER', 'price' => 499.99, 'stock' => 5, 'url' => 'https://m.media-amazon.com/images/I/81fH2vP2xBL._AC_SL1500_.jpg', 'desc' => 'Placa base Enthusiast AM5, E-ATX.', 'specs' => ['socket' => 'AM5', 'form_factor' => 'E-ATX', 'memory_type' => 'DDR5']],
                    ['name' => 'ASUS TUF GAMING B550-PLUS WIFI II', 'price' => 149.99, 'stock' => 40, 'url' => 'https://m.media-amazon.com/images/I/81gC2G1oGQL._AC_SL1500_.jpg', 'desc' => 'Calidad/Precio AM4 DDR4.', 'specs' => ['socket' => 'AM4', 'form_factor' => 'ATX', 'memory_type' => 'DDR4']],
                    ['name' => 'MSI B550M PRO-VDH WIFI', 'price' => 119.99, 'stock' => 50, 'url' => 'https://m.media-amazon.com/images/I/81IIfBvXpOL._AC_SL1500_.jpg', 'desc' => 'Micro-ATX económica para AM4.', 'specs' => ['socket' => 'AM4', 'form_factor' => 'Micro-ATX', 'memory_type' => 'DDR4']],
                    ['name' => 'MSI PRO Z790-P WIFI', 'price' => 219.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/81w+rJ0yHNL._AC_SL1500_.jpg', 'desc' => 'LGA1700, DDR5, PCIe 5.0, ATX.', 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'memory_type' => 'DDR5']],
                    ['name' => 'ASUS ROG MAXIMUS Z790 HERO', 'price' => 649.99, 'stock' => 8, 'url' => 'https://m.media-amazon.com/images/I/81Z1pA+01wL._AC_SL1500_.jpg', 'desc' => 'LGA1700 Premium.', 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'memory_type' => 'DDR5']],
                    ['name' => 'Gigabyte B760M DS3H AX DDR4', 'price' => 139.99, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/81Y7yJ+C7uL._AC_SL1500_.jpg', 'desc' => 'LGA1700 económica con DDR4.', 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'Micro-ATX', 'memory_type' => 'DDR4']],
                    ['name' => 'ASUS Prime B760-PLUS D4', 'price' => 149.99, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/81h9hJ9f6lL._AC_SL1500_.jpg', 'desc' => 'LGA1700 clásica ATX blanca.', 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'memory_type' => 'DDR4']],
                    ['name' => 'ASRock Z790 PG Lightning', 'price' => 199.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/81y1S1V7UjL._AC_SL1500_.jpg', 'desc' => 'LGA1700 Overclock accesible.', 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'memory_type' => 'DDR5']],
                ]
            ],
            'ram' => [
                'name' => 'Memoria RAM', 'image' => 'https://m.media-amazon.com/images/I/61vGQtRjGHL._AC_SL1000_.jpg',
                'items' => [
                    ['name' => 'Corsair Vengeance DDR5 32GB (2x16) 6000MHz', 'price' => 124.99, 'stock' => 100, 'url' => 'https://m.media-amazon.com/images/I/61vGQtRjGHL._AC_SL1000_.jpg', 'desc' => 'Estándar oro DDR5.', 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'speed' => 6000]],
                    ['name' => 'G.Skill Trident Z5 RGB DDR5 32GB 6400MHz', 'price' => 149.99, 'stock' => 40, 'url' => 'https://m.media-amazon.com/images/I/61B8-hR4cGL._AC_SL1000_.jpg', 'desc' => 'RGB premium y altísima velocidad.', 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'speed' => 6400]],
                    ['name' => 'Kingston FURY Beast DDR5 16GB 5200MHz', 'price' => 69.99, 'stock' => 60, 'url' => 'https://m.media-amazon.com/images/I/61O+aK-KcwL._AC_SL1000_.jpg', 'desc' => 'Módulo individual DDR5 base.', 'specs' => ['type' => 'DDR5', 'capacity' => 16, 'speed' => 5200]],
                    ['name' => 'Corsair Dominator Platinum RGB 64GB DDR5', 'price' => 329.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/71Y-oR7q7sL._AC_SL1500_.jpg', 'desc' => 'Lujo y capacidad.', 'specs' => ['type' => 'DDR5', 'capacity' => 64, 'speed' => 6000]],
                    ['name' => 'TEAMGROUP T-Force Delta RGB DDR5 32GB', 'price' => 114.99, 'stock' => 45, 'url' => 'https://m.media-amazon.com/images/I/71P7A1qjYPL._AC_SL1500_.jpg', 'desc' => 'DDR5 blanca muy estética.', 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'speed' => 6000]],
                    ['name' => 'Corsair Vengeance LPX DDR4 16GB 3200MHz', 'price' => 44.99, 'stock' => 200, 'url' => 'https://m.media-amazon.com/images/I/51bAJPAYQyL._AC_SL1000_.jpg', 'desc' => 'La más vendida DDR4.', 'specs' => ['type' => 'DDR4', 'capacity' => 16, 'speed' => 3200]],
                    ['name' => 'G.Skill Ripjaws V DDR4 32GB 3600MHz', 'price' => 74.99, 'stock' => 80, 'url' => 'https://m.media-amazon.com/images/I/61Nl-e0xL1L._AC_SL1000_.jpg', 'desc' => 'Performance dulce spot DDR4.', 'specs' => ['type' => 'DDR4', 'capacity' => 32, 'speed' => 3600]],
                    ['name' => 'Kingston FURY Beast RGB DDR4 32GB', 'price' => 89.99, 'stock' => 50, 'url' => 'https://m.media-amazon.com/images/I/61T7Y4yqPzL._AC_SL1500_.jpg', 'desc' => 'DDR4 con iluminación espectacular.', 'specs' => ['type' => 'DDR4', 'capacity' => 32, 'speed' => 3200]],
                    ['name' => 'Crucial Pro RAM 32GB DDR4 3200MHz', 'price' => 69.99, 'stock' => 90, 'url' => 'https://m.media-amazon.com/images/I/61sV6Z9lS1L._AC_SL1000_.jpg', 'desc' => 'Sencilla y efectiva.', 'specs' => ['type' => 'DDR4', 'capacity' => 32, 'speed' => 3200]],
                    ['name' => 'Patriot Viper Steel DDR4 16GB 4400MHz', 'price' => 99.99, 'stock' => 10, 'url' => 'https://m.media-amazon.com/images/I/71W+4mG1QnL._AC_SL1500_.jpg', 'desc' => 'Overclock extremo en DDR4.', 'specs' => ['type' => 'DDR4', 'capacity' => 16, 'speed' => 4400]],
                ]
            ],
            'gpu' => [
                'name' => 'Tarjetas Gráficas', 'image' => 'https://m.media-amazon.com/images/I/71tDuCSgOAL._AC_SL1500_.jpg',
                'items' => [
                    ['name' => 'ASUS ROG Strix GeForce RTX 4090 OC', 'price' => 1999.99, 'stock' => 5, 'url' => 'https://m.media-amazon.com/images/I/8157vM-W-WL._AC_SL1500_.jpg', 'desc' => 'El tope de gama absoluta.', 'specs' => ['tdp' => 450, 'length' => 357, 'vram' => 24]],
                    ['name' => 'Gigabyte RTX 4080 Super WINDFORCE', 'price' => 1049.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/71I3uXf3mEL._AC_SL1500_.jpg', 'desc' => '16GB GDDR6X, Ada Lovelace.', 'specs' => ['tdp' => 320, 'length' => 330, 'vram' => 16]],
                    ['name' => 'MSI RTX 4070 Ti SUPER VENTUS 3X', 'price' => 799.99, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/71I3uXf3mEL._AC_SL1500_.jpg', 'desc' => '16GB para 1440p brutal.', 'specs' => ['tdp' => 285, 'length' => 308, 'vram' => 16]],
                    ['name' => 'ZOTAC Gaming RTX 4070 Super Twin Edge', 'price' => 599.99, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/71tDuCSgOAL._AC_SL1500_.jpg', 'desc' => 'Doble ventilador, cabe en todas partes.', 'specs' => ['tdp' => 220, 'length' => 234, 'vram' => 12]],
                    ['name' => 'ASUS Dual GeForce RTX 4060', 'price' => 299.99, 'stock' => 50, 'url' => 'https://m.media-amazon.com/images/I/71tDuCSgOAL._AC_SL1500_.jpg', 'desc' => 'Entrada a la nueva generación DLSS 3.', 'specs' => ['tdp' => 115, 'length' => 227, 'vram' => 8]],
                    ['name' => 'AMD Radeon RX 7900 XTX Reference', 'price' => 999.99, 'stock' => 12, 'url' => 'https://m.media-amazon.com/images/I/61gRjT3jEFL._AC_SL1500_.jpg', 'desc' => 'Poderío AMD RDNA 3, 24GB.', 'specs' => ['tdp' => 355, 'length' => 287, 'vram' => 24]],
                    ['name' => 'Sapphire Nitro+ RX 7900 XT', 'price' => 799.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/81xU+c8r2dL._AC_SL1500_.jpg', 'desc' => '20GB para juego 4K.', 'specs' => ['tdp' => 315, 'length' => 320, 'vram' => 20]],
                    ['name' => 'PowerColor Hellhound RX 7800 XT', 'price' => 499.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/81xU+c8r2dL._AC_SL1500_.jpg', 'desc' => 'Calidad precio en 1440p gigante.', 'specs' => ['tdp' => 263, 'length' => 322, 'vram' => 16]],
                    ['name' => 'XFX Speedster SWFT319 RX 6800', 'price' => 399.99, 'stock' => 18, 'url' => 'https://m.media-amazon.com/images/I/81xU+c8r2dL._AC_SL1500_.jpg', 'desc' => 'Opción RDNA 2 inmejorable por precio.', 'specs' => ['tdp' => 250, 'length' => 340, 'vram' => 16]],
                    ['name' => 'ASRock Challenger RX 7600', 'price' => 269.99, 'stock' => 40, 'url' => 'https://m.media-amazon.com/images/I/81xU+c8r2dL._AC_SL1500_.jpg', 'desc' => 'Para presupuestos ajustados.', 'specs' => ['tdp' => 165, 'length' => 269, 'vram' => 8]],
                ]
            ],
            'storage' => [
                'name' => 'Almacenamiento', 'image' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg',
                'items' => [
                    ['name' => 'Samsung 990 PRO 2TB', 'price' => 189.99, 'stock' => 50, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'El SSD PCIe 4.0 más buscado. 7450 MB/s.', 'specs' => ['type' => 'NVMe Gen4', 'capacity' => 2000, 'speed' => 7450]],
                    ['name' => 'WD_BLACK SN850X 1TB', 'price' => 89.99, 'stock' => 80, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'Velocidad de carga instantánea.', 'specs' => ['type' => 'NVMe Gen4', 'capacity' => 1000, 'speed' => 7300]],
                    ['name' => 'Crucial T700 2TB Gen5 NVMe', 'price' => 299.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'PCIe 5.0 loco a 12400 MB/s.', 'specs' => ['type' => 'NVMe Gen5', 'capacity' => 2000, 'speed' => 12400]],
                    ['name' => 'Crucial P3 Plus 1TB', 'price' => 64.99, 'stock' => 120, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'Gen4 económico.', 'specs' => ['type' => 'NVMe Gen4', 'capacity' => 1000, 'speed' => 5000]],
                    ['name' => 'Kingston NV2 1TB', 'price' => 59.99, 'stock' => 150, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'El más básico, funciona.', 'specs' => ['type' => 'NVMe Gen4', 'capacity' => 1000, 'speed' => 3500]],
                    ['name' => 'Samsung 970 EVO Plus 1TB', 'price' => 79.99, 'stock' => 60, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'Rey de la Gen3.', 'specs' => ['type' => 'NVMe Gen3', 'capacity' => 1000, 'speed' => 3500]],
                    ['name' => 'Corsair MP600 PRO LPX 2TB', 'price' => 169.99, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'Compatible con PS5 y PC.', 'specs' => ['type' => 'NVMe Gen4', 'capacity' => 2000, 'speed' => 7100]],
                    ['name' => 'Seagate BarraCuda 2TB', 'price' => 54.99, 'stock' => 100, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'Disco Duro Mecánico (HDD) para almacenamiento.', 'specs' => ['type' => 'HDD', 'capacity' => 2000, 'speed' => 150]],
                    ['name' => 'Crucial MX500 1TB SSD SATA', 'price' => 69.99, 'stock' => 80, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'Formato 2.5 SATA.', 'specs' => ['type' => 'SATA SSD', 'capacity' => 1000, 'speed' => 560]],
                    ['name' => 'Samsung 870 EVO 2TB', 'price' => 139.99, 'stock' => 45, 'url' => 'https://m.media-amazon.com/images/I/71GLmj8a1WL._AC_SL1500_.jpg', 'desc' => 'El mejor SSD SATA.', 'specs' => ['type' => 'SATA SSD', 'capacity' => 2000, 'speed' => 560]],
                ]
            ],
            'psu' => [
                'name' => 'Fuente de Alimentación', 'image' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg',
                'items' => [
                    ['name' => 'Corsair RM850x (2021)', 'price' => 149.99, 'stock' => 40, 'url' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg', 'desc' => '80+ Gold, Modular, Silenciosa.', 'specs' => ['wattage' => 850, 'modular' => true, 'rating' => '80+ Gold']],
                    ['name' => 'SeaSonic FOCUS GX-850', 'price' => 139.99, 'stock' => 35, 'url' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg', 'desc' => 'Renombre y fiabilidad.', 'specs' => ['wattage' => 850, 'modular' => true, 'rating' => '80+ Gold']],
                    ['name' => 'EVGA SuperNOVA 1000 G6', 'price' => 169.99, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg', 'desc' => '1000W para la RTX 4090.', 'specs' => ['wattage' => 1000, 'modular' => true, 'rating' => '80+ Gold']],
                    ['name' => 'Corsair HX1200', 'price' => 249.99, 'stock' => 10, 'url' => 'https://m.media-amazon.com/images/I/71p+JgE6i+L._AC_SL1500_.jpg', 'desc' => 'Platinum, bestia energética.', 'specs' => ['wattage' => 1200, 'modular' => true, 'rating' => '80+ Platinum']],
                    ['name' => 'Thermaltake Toughpower GF3 850W', 'price' => 129.99, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg', 'desc' => 'Compatible con ATX 3.0 / PCIe Gen5.', 'specs' => ['wattage' => 850, 'modular' => true, 'rating' => '80+ Gold']],
                    ['name' => 'MSI MPG A850G PCIE 5', 'price' => 134.99, 'stock' => 40, 'url' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg', 'desc' => 'Lista para las RTX serie 40.', 'specs' => ['wattage' => 850, 'modular' => true, 'rating' => '80+ Gold']],
                    ['name' => 'Corsair RM750e', 'price' => 99.99, 'stock' => 60, 'url' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg', 'desc' => 'Versión \'e\' económica e insonorizada.', 'specs' => ['wattage' => 750, 'modular' => true, 'rating' => '80+ Gold']],
                    ['name' => 'NZXT C750', 'price' => 94.99, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg', 'desc' => 'Estética limpia.', 'specs' => ['wattage' => 750, 'modular' => true, 'rating' => '80+ Gold']],
                    ['name' => 'Gigabyte P650B', 'price' => 54.99, 'stock' => 80, 'url' => 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg', 'desc' => 'Económica no modular de bronce.', 'specs' => ['wattage' => 650, 'modular' => false, 'rating' => '80+ Bronze']],
                    ['name' => 'ASUS ROG Thor 1000W Platinum II', 'price' => 299.99, 'stock' => 5, 'url' => 'https://m.media-amazon.com/images/I/71p+JgE6i+L._AC_SL1500_.jpg', 'desc' => 'Pantalla OLED y cables premium.', 'specs' => ['wattage' => 1000, 'modular' => true, 'rating' => '80+ Platinum']],
                ]
            ],
            'case' => [
                'name' => 'Caja/Torre', 'image' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg',
                'items' => [
                    ['name' => 'Fractal Design North Charcoal Black', 'price' => 149.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/81Mlt80G44L._AC_SL1500_.jpg', 'desc' => 'Madera de nogal frontal. Muy elegante.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 355]],
                    ['name' => 'Corsair 4000D Airflow', 'price' => 104.99, 'stock' => 60, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'El estandar de flujo de aire.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 360]],
                    ['name' => 'Lian Li PC-O11 Dynamic EVO', 'price' => 159.99, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'La caja pecera por excelencia.', 'specs' => ['form_factor' => 'E-ATX', 'max_gpu_length' => 422]],
                    ['name' => 'NZXT H9 Flow', 'price' => 159.99, 'stock' => 40, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Competidor del O11.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 435]],
                    ['name' => 'NZXT H5 Flow', 'price' => 94.99, 'stock' => 55, 'url' => 'https://m.media-amazon.com/images/I/61ngFwH62PL._AC_SL1500_.jpg', 'desc' => 'Compacta con ventilador de GPU.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 365]],
                    ['name' => 'Phanteks Eclipse G360A', 'price' => 99.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Incluye ventiladores D-RGB.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 400]],
                    ['name' => 'Cooler Master MasterBox NR200P', 'price' => 99.99, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Reina del formato Mini-ITX SFF.', 'specs' => ['form_factor' => 'Mini-ITX', 'max_gpu_length' => 330]],
                    ['name' => 'Fractal Design Torrent', 'price' => 189.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Máximo airflow bruto.', 'specs' => ['form_factor' => 'E-ATX', 'max_gpu_length' => 423]],
                    ['name' => 'Hyte Y60', 'price' => 199.99, 'stock' => 12, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Visión panorámica e incluye riser.', 'specs' => ['form_factor' => 'E-ATX', 'max_gpu_length' => 375]],
                    ['name' => 'Corsair 2000D Airflow', 'price' => 139.99, 'stock' => 18, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Torre ITX vertical pequeña.', 'specs' => ['form_factor' => 'Mini-ITX', 'max_gpu_length' => 365]],
                ]
            ],
            'cooler' => [
                'name' => 'Refrigeración', 'image' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg',
                'items' => [
                    ['name' => 'Noctua NH-D15', 'price' => 109.90, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'La bestia por aire marrón.', 'specs' => ['type' => 'Air', 'tdp_rating' => 220]],
                    ['name' => 'Thermalright Peerless Assassin 120 SE', 'price' => 35.90, 'stock' => 100, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'Asesino de calidades a precio absurdo.', 'specs' => ['type' => 'Air', 'tdp_rating' => 200]],
                    ['name' => 'Corsair iCUE H150i Elite Capellix XT', 'price' => 219.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/71R2A0t0E5L._AC_SL1500_.jpg', 'desc' => 'AIO de 360mm, top RGB.', 'specs' => ['type' => 'AIO 360', 'tdp_rating' => 300]],
                    ['name' => 'NZXT Kraken Elite 360 RGB', 'price' => 279.99, 'stock' => 10, 'url' => 'https://m.media-amazon.com/images/I/71R2A0t0E5L._AC_SL1500_.jpg', 'desc' => 'Pantalla LCD en la bomba.', 'specs' => ['type' => 'AIO 360', 'tdp_rating' => 300]],
                    ['name' => 'Arctic Liquid Freezer II 360', 'price' => 119.99, 'stock' => 45, 'url' => 'https://m.media-amazon.com/images/I/71R2A0t0E5L._AC_SL1500_.jpg', 'desc' => 'Rendimiento bestial por el precio.', 'specs' => ['type' => 'AIO 360', 'tdp_rating' => 320]],
                    ['name' => 'DeepCool AK620', 'price' => 64.99, 'stock' => 50, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'Doble torre oscuro e imponente.', 'specs' => ['type' => 'Air', 'tdp_rating' => 220]],
                    ['name' => 'Be quiet! Dark Rock Pro 4', 'price' => 89.90, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'Silencio sepulcral.', 'specs' => ['type' => 'Air', 'tdp_rating' => 250]],
                    ['name' => 'Noctua NH-U12S chromax.black', 'price' => 79.95, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'Excelente compatibilidad de RAM.', 'specs' => ['type' => 'Air', 'tdp_rating' => 165]],
                    ['name' => 'Cooler Master Hyper 212 Black Edition', 'price' => 39.99, 'stock' => 80, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'El icónico disipador barato.', 'specs' => ['type' => 'Air', 'tdp_rating' => 150]],
                    ['name' => 'Lian Li Galahad II Trinity 360', 'price' => 169.99, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/71R2A0t0E5L._AC_SL1500_.jpg', 'desc' => 'Aspecto espectacular en construcciones blancas.', 'specs' => ['type' => 'AIO 360', 'tdp_rating' => 300]],
                ]
            ],
        ];

        // 3. CARGAR ARCHIVOS EN MEMORIA PARA BÚSQUEDA RÁPIDA
        $allFiles = Storage::disk('public')->files('products');
        $fileInfo = [];
        foreach ($allFiles as $f) {
            $base = strtolower(basename($f));
            $fileInfo[] = [
                'path' => '/storage/' . $f,
                'name' => $base,
                'keywords' => explode('-', str_replace(['_', '.', ' '], '-', pathinfo($base, PATHINFO_FILENAME)))
            ];
        }

        // Función auxiliar para encontrar la mejor imagen
        $findBestImage = function($productName, $defaultUrl) use ($fileInfo) {
            $nameKeywords = explode('-', Str::slug($productName));
            $bestMatch = null;
            $maxScore = 0;

            foreach ($fileInfo as $info) {
                $score = count(array_intersect($nameKeywords, $info['keywords']));
                if ($score > $maxScore) {
                    $maxScore = $score;
                    $bestMatch = $info['path'];
                }
            }

            // Exigimos un mínimo de coincidencia (por ejemplo, 2 palabras clave)
            // Si no, usamos la URL remota
            return ($maxScore >= 2) ? $bestMatch : $defaultUrl;
        };

        // 4. RECUPERACIÓN MASIVA POR ESCANEO
        $categoriesMapping = [
            'gpu' => ['rtx', 'gtx', 'radeon', 'rx-', 'gpu', 'geforce', 'nvidia', 'xtx', '4090', '4080', '4070', '4060', '7900', '7800', '7700', '7600', 'ventus', 'gaming-oc', 'aero', 'nitro', 'pulse', 'devil', 'speedster', 'challenger', 'suprim', 'strix-geforce'],
            'motherboard' => ['placa', 'motherboard', 'b650', 'z790', 'x670', 'b550', 'z690', 'am5', 'lga1700', 'strix', 'aorus', 'tomahawk', 'mag-z', 'mag-b', 'prime-z', 'prime-b', 'crosshair', 'maximus', 'ace', 'hero', 'wifi', 'pro-z', 'pro-b'],
            'ram' => ['ram', 'ddr4', 'ddr5', 'trident', 'vengeance', 'fury', 'dominator', 'kit', 'memory', 'g.skill', 'kingston', 'lexar', 'ares', 'crucial-pro', 'expert', 'zenith', 'cras', 'ripjaws'],
            'storage' => ['ssd', 'nvme', 'sata', '980', '990', 'sn850', 'sn770', 'sn580', 'firecuda', 'barracuda', 'kc3000', 'crucial-p', 'crucial-t', 'mx500', '870-evo', 'pro-2tb', 'plus-2tb', 'nm800', 'platinum-p41', 'rocket-4'],
            'psu' => ['psu', 'power', '850w', '750w', '1000w', '1200w', '650w', 'modular', 'rm850', 'rm750', 'rm1000', 'hx1000', 'hx1200', 'toughpower', 'seasonic', 'pure-power', 'a850gl', 'a1000g', 'a850g', 'supernova', 'fsp', 'hydro', 'thor', 'loki', 'vertex', 'p650b', 'c750', 'dark-power'],
            'case' => ['case', 'torre', 'flow', 'nzxt-h', 'fractal', 'hyte', 'phanteks', 'lian', 'base-800', 'base-700', 'base-600', 'montech', 'airflow', 'o11', 'dynamic', 'h9', 'h7', 'h6', 'h5', 'torrent', 'north', 'y60', 'y40', 'nr200p', '2000d', 'lancool', 'air-903', 'nv7', 'g360a'],
            'cooler' => ['cooler', 'fan', 'refrigeracion', 'noctua', 'arctic', 'kraken', 'liquid', 'freezer', 'nh-d15', 'nh-u', 'dark-rock', 'pure-loop', 'pure-rock', 'assassin', 'ak620', 'ryujin', 'capellix', 'hyper-212', 'galahad', 'elite-lcd', 'elite-capellix', 'nucleus', 'aio', 'cr360', 'h150i', 'h100i', 'h115i'],
            'cpu' => ['ryzen', 'intel', 'core', 'i5-', 'i7-', 'i9-', 'i3-', '7800x3d', '7950x3d', '5600x', '5800x3d', '14900k', '13700k', '13600k', '12700k', '12400f', '9700x'],
        ];

        // Asegurar que las categorías existan
        $catModels = [];
        foreach ($catalog as $slug => $data) {
            $catModels[$slug] = Category::updateOrCreate(['slug' => $slug], [
                'name' => $data['name'],
                'image' => '/placeholder.jpg'
            ]);
        }
        
        // Categoría para lo que no sepamos qué es
        $miscCat = Category::updateOrCreate(['slug' => 'otros'], [
            'name' => 'Otros/Varios',
            'image' => '/placeholder.jpg'
        ]);

        foreach ($allFiles as $filePath) {
            $slug = pathinfo(basename($filePath), PATHINFO_FILENAME);
            if (Product::where('slug', $slug)->exists()) continue;

            $detectedCatSlug = null;
            foreach ($categoriesMapping as $catSlug => $keywords) {
                foreach ($keywords as $kw) {
                    if (str_contains(strtolower($slug), $kw)) {
                        $detectedCatSlug = $catSlug;
                        break 2;
                    }
                }
            }

            $catId = $detectedCatSlug ? $catModels[$detectedCatSlug]->id : $miscCat->id;

            $name = str_replace(['-', '_'], ' ', $slug);
            $name = str_ireplace([' fixed', ' fix', ' real', ' robust', ' v2', ' v1', ' original'], '', $name);
            $name = ucwords($name);
            $name = str_ireplace(
                ['Amd', 'Intel', 'Rgb', 'Nvme', 'Pcie', 'Gpu', 'Psu', 'Rtx', 'Gtx', 'Ssd', 'Ddr5', 'Ddr4', 'Aio', 'Lcd', 'Evga', 'Nzxt', 'Msi', 'Asus', 'Lian Li', 'G.skill', 'Fsp', 'Xfx'], 
                ['AMD', 'Intel', 'RGB', 'NVMe', 'PCIe', 'GPU', 'PSU', 'RTX', 'GTX', 'SSD', 'DDR5', 'DDR4', 'AIO', 'LCD', 'EVGA', 'NZXT', 'MSI', 'ASUS', 'Lian Li', 'G.Skill', 'FSP', 'XFX'], 
                $name
            );
            
            // Limpiar múltiples espacios si los hay
            $name = preg_replace('/\s+/', ' ', trim($name));

            $product = Product::create([
                'category_id' => $catId,
                'name' => $name,
                'slug' => $slug,
                'description' => "Componente de hardware verificado: $name. Alto rendimiento garantizado.",
                'price' => rand(45, 950) + 0.99,
                'stock' => rand(10, 80),
                'image' => '/storage/' . $filePath,
                'specs' => ['recovered' => true],
            ]);

            // Actualizar imagen de categoría si es nueva
            $currentCat = $detectedCatSlug ? $catModels[$detectedCatSlug] : $miscCat;
            if ($currentCat->image === '/placeholder.jpg') {
                $currentCat->update(['image' => '/storage/' . $filePath]);
            }
        }

        // 5. MANTENER Y REPARAR LOS 80 MANUALES
        foreach ($catalog as $catSlug => $data) {
            $cat = $catModels[$catSlug];
            foreach ($data['items'] as $item) {
                $productSlug = Str::slug($item['name']);
                
                // Prioridad absoluta a la imagen local por fuzzy matching
                $finalImage = $findBestImage($item['name'], $item['url']);
                
                // Caso especial Ryzen 5600X (Si el usuario dio una URL específica, la respetamos solo si no hay local mejor)
                if ($productSlug === 'amd-ryzen-5-5600x' && $finalImage === $item['url']) {
                    $finalImage = $item['url'];
                }
                
                Product::updateOrCreate(['slug' => $productSlug], [
                    'category_id' => $cat->id,
                    'name' => $item['name'],
                    'description' => $item['desc'],
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                    'image' => $finalImage,
                    'specs' => $item['specs'],
                ]);
            }
        }
    }
}
