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
                    ['name' => 'AMD Ryzen 5 7600X', 'price' => 249.99, 'stock' => 50, 'url' => 'https://img.pccomponentes.com/articles/1057/10571167/1460-amd-ryzen-5-7600x-47-ghz-box.jpg', 'desc' => '6 Cores, 12 Threads, 5.3GHz. Ideal Gaming 1080p.', 'specs' => ['socket' => 'AM5', 'tdp' => 105, 'cores' => 6, 'series' => 'Ryzen 5', 'integrated_graphics' => 'Sí', 'architecture' => 'Zen 4']],
                    ['name' => 'AMD Ryzen 7 7800X3D', 'price' => 399.99, 'stock' => 30, 'url' => 'https://img.pccomponentes.com/articles/1069/10696956/1944-amd-ryzen-7-7800x3d-42ghz-5ghz-box.jpg', 'desc' => '8 Cores con 3D V-Cache. El rey indiscutible del Gaming.', 'specs' => ['socket' => 'AM5', 'tdp' => 120, 'cores' => 8, 'series' => 'Ryzen 7', 'integrated_graphics' => 'Sí', 'architecture' => 'Zen 4']],
                    ['name' => 'AMD Ryzen 9 7950X3D', 'price' => 699.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/51f2hk81eGL._AC_SL1000_.jpg', 'desc' => '16 Cores. Potencia extrema para creadores y gamers.', 'specs' => ['socket' => 'AM5', 'tdp' => 120, 'cores' => 16, 'series' => 'Ryzen 9', 'integrated_graphics' => 'Sí', 'architecture' => 'Zen 4']],
                    ['name' => 'AMD Ryzen 5 5600X', 'price' => 159.99, 'stock' => 100, 'url' => 'https://img.pccomponentes.com/articles/32/328475/1101-amd-ryzen-5-5600x-37ghz.jpg', 'desc' => 'El clásico calidad/precio en AM4.', 'specs' => ['socket' => 'AM4', 'tdp' => 65, 'cores' => 6, 'series' => 'Ryzen 5', 'integrated_graphics' => 'No', 'architecture' => 'Zen 3']],
                    ['name' => 'AMD Ryzen 7 5800X3D', 'price' => 319.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/61Kq9Q5mDIL._AC_SL1000_.jpg', 'desc' => 'Actualización final para plataformas AM4.', 'specs' => ['socket' => 'AM4', 'tdp' => 105, 'cores' => 8, 'series' => 'Ryzen 7', 'integrated_graphics' => 'No', 'architecture' => 'Zen 3']],
                    ['name' => 'Intel Core i5-13600K', 'price' => 319.99, 'stock' => 40, 'url' => 'https://m.media-amazon.com/images/I/6125mFrzr6L._AC_SL1000_.jpg', 'desc' => '14 Cores (6P+8E). Rendimiento híbrido excelente.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 125, 'cores' => 14, 'series' => 'Core i5', 'integrated_graphics' => 'Sí', 'architecture' => 'Raptor Lake']],
                    ['name' => 'Intel Core i7-13700K', 'price' => 409.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/61mR+dEaH8L._AC_SL1000_.jpg', 'desc' => '16 Cores (8P+8E) hasta 5.4GHz.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 16, 'series' => 'Core i7', 'integrated_graphics' => 'Sí', 'architecture' => 'Raptor Lake']],
                    ['name' => 'Intel Core i9-13900K', 'price' => 569.99, 'stock' => 10, 'url' => 'https://m.media-amazon.com/images/I/61cQ1H1y8YL._AC_SL1000_.jpg', 'desc' => '24 Cores extremos para productividad máxima.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 24, 'series' => 'Core i9', 'integrated_graphics' => 'Sí', 'architecture' => 'Raptor Lake']],
                    ['name' => 'Intel Core i7-14700K', 'price' => 459.99, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/61Tf-u-Q3wL._AC_SL1500_.jpg', 'desc' => 'Gneración 14, 20 Cores monstruosos.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 20, 'series' => 'Core i7', 'integrated_graphics' => 'Sí', 'architecture' => 'Raptor Lake R']],
                    ['name' => 'Intel Core i9-14900K', 'price' => 589.99, 'stock' => 5, 'url' => 'https://m.media-amazon.com/images/I/61kM2o93zNL._AC_SL1500_.jpg', 'desc' => 'El procesador más rápido del mundo hasta 6.0GHz.', 'specs' => ['socket' => 'LGA1700', 'tdp' => 253, 'cores' => 24, 'series' => 'Core i9', 'integrated_graphics' => 'Sí', 'architecture' => 'Raptor Lake R']],
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
                    ['name' => 'Fractal Design North Charcoal Black', 'price' => 149.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/81Mlt80G44L._AC_SL1500_.jpg', 'desc' => 'Madera de nogal frontal. Muy elegante.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 355, 'max_cooler_height' => 170, 'radiator_support' => [120, 140, 240, 280, 360]]],
                    ['name' => 'Corsair 4000D Airflow', 'price' => 104.99, 'stock' => 60, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'El estandar de flujo de aire.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 360, 'max_cooler_height' => 170, 'radiator_support' => [120, 140, 240, 280, 360]]],
                    ['name' => 'Lian Li PC-O11 Dynamic EVO', 'price' => 159.99, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'La caja pecera por excelencia.', 'specs' => ['form_factor' => 'E-ATX', 'max_gpu_length' => 422, 'max_cooler_height' => 167, 'radiator_support' => [120, 140, 240, 280, 360]]],
                    ['name' => 'NZXT H9 Flow', 'price' => 159.99, 'stock' => 40, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Competidor del O11.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 435, 'max_cooler_height' => 165, 'radiator_support' => [120, 140, 240, 280, 360]]],
                    ['name' => 'NZXT H5 Flow', 'price' => 94.99, 'stock' => 55, 'url' => 'https://m.media-amazon.com/images/I/61ngFwH62PL._AC_SL1500_.jpg', 'desc' => 'Compacta con ventilador de GPU.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 365, 'max_cooler_height' => 165, 'radiator_support' => [120, 140, 240, 280]]],
                    ['name' => 'Phanteks Eclipse G360A', 'price' => 99.99, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Incluye ventiladores D-RGB.', 'specs' => ['form_factor' => 'ATX', 'max_gpu_length' => 400, 'max_cooler_height' => 162, 'radiator_support' => [120, 140, 240, 280, 360]]],
                    ['name' => 'Cooler Master MasterBox NR200P', 'price' => 99.99, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Reina del formato Mini-ITX SFF.', 'specs' => ['form_factor' => 'Mini-ITX', 'max_gpu_length' => 330, 'max_cooler_height' => 155, 'radiator_support' => [120, 140, 240, 280]]],
                    ['name' => 'Fractal Design Torrent', 'price' => 189.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Máximo airflow bruto.', 'specs' => ['form_factor' => 'E-ATX', 'max_gpu_length' => 423, 'max_cooler_height' => 188, 'radiator_support' => [120, 140, 240, 280, 360, 420]]],
                    ['name' => 'Hyte Y60', 'price' => 199.99, 'stock' => 12, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Visión panorámica e incluye riser.', 'specs' => ['form_factor' => 'E-ATX', 'max_gpu_length' => 375, 'max_cooler_height' => 160, 'radiator_support' => [120, 140, 240, 280, 360]]],
                    ['name' => 'Corsair 2000D Airflow', 'price' => 139.99, 'stock' => 18, 'url' => 'https://m.media-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg', 'desc' => 'Torre ITX vertical pequeña.', 'specs' => ['form_factor' => 'Mini-ITX', 'max_gpu_length' => 365, 'max_cooler_height' => 165, 'radiator_support' => [120, 140, 240, 280, 360]]],
                ]
            ],
            'cooler' => [
                'name' => 'Refrigeración', 'image' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg',
                'items' => [
                    ['name' => 'Noctua NH-D15', 'price' => 109.90, 'stock' => 30, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'La bestia por aire marrón.', 'specs' => ['type' => 'Air', 'tdp_rating' => 220, 'height' => 165, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                    ['name' => 'Thermalright Peerless Assassin 120 SE', 'price' => 35.90, 'stock' => 100, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'Asesino de calidades a precio absurdo.', 'specs' => ['type' => 'Air', 'tdp_rating' => 200, 'height' => 155, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                    ['name' => 'Corsair iCUE H150i Elite Capellix XT', 'price' => 219.99, 'stock' => 15, 'url' => 'https://m.media-amazon.com/images/I/71R2A0t0E5L._AC_SL1500_.jpg', 'desc' => 'AIO de 360mm, top RGB.', 'specs' => ['type' => 'AIO', 'radiator_size' => 360, 'tdp_rating' => 300, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                    ['name' => 'NZXT Kraken Elite 360 RGB', 'price' => 279.99, 'stock' => 10, 'url' => 'https://m.media-amazon.com/images/I/71R2A0t0E5L._AC_SL1500_.jpg', 'desc' => 'Pantalla LCD en la bomba.', 'specs' => ['type' => 'AIO', 'radiator_size' => 360, 'tdp_rating' => 300, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                    ['name' => 'Arctic Liquid Freezer II 360', 'price' => 119.99, 'stock' => 45, 'url' => '/storage/products/arctic-liquid-freezer-ii-360.png', 'desc' => 'Rendimiento bestial por el precio (II).', 'specs' => ['type' => 'AIO', 'radiator_size' => 360, 'tdp_rating' => 320, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                    ['name' => 'Arctic Liquid Freezer II 240', 'price' => 89.99, 'stock' => 45, 'url' => '/storage/products/arctic-liquid-freezer-ii-240.png', 'desc' => 'Dúo de radiadores 120 (II).', 'specs' => ['type' => 'AIO', 'radiator_size' => 240, 'tdp_rating' => 250, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                    ['name' => 'Arctic Liquid Freezer III 360', 'price' => 129.99, 'stock' => 30, 'url' => '/storage/products/arctic-liquid-freezer-iii-360.jpg', 'desc' => 'La nueva generación Arctic (III).', 'specs' => ['type' => 'AIO', 'radiator_size' => 360, 'tdp_rating' => 340, 'socket_support' => ['AM4', 'AM5', 'LGA1700', 'LGA1851']]],
                    ['name' => 'Arctic Liquid Freezer III 240', 'price' => 99.99, 'stock' => 30, 'url' => '/storage/products/arctic-liquid-freezer-iii-240.jpg', 'desc' => 'Eficiencia compacta (III).', 'specs' => ['type' => 'AIO', 'radiator_size' => 240, 'tdp_rating' => 260, 'socket_support' => ['AM4', 'AM5', 'LGA1700', 'LGA1851']]],
                    ['name' => 'DeepCool AK620', 'price' => 64.99, 'stock' => 50, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'Doble torre oscuro e imponente.', 'specs' => ['type' => 'Air', 'tdp_rating' => 220, 'height' => 160, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                    ['name' => 'Be quiet! Dark Rock Pro 4', 'price' => 89.90, 'stock' => 20, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'Silencio sepulcral.', 'specs' => ['type' => 'Air', 'tdp_rating' => 250, 'height' => 163, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                    ['name' => 'Noctua NH-U12S chromax.black', 'price' => 79.95, 'stock' => 25, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'Excelente compatibilidad de RAM.', 'specs' => ['type' => 'Air', 'tdp_rating' => 165, 'height' => 158, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                    ['name' => 'Cooler Master Hyper 212 Black Edition', 'price' => 39.99, 'stock' => 80, 'url' => 'https://m.media-amazon.com/images/I/61WfB30yHjL._AC_SL1500_.jpg', 'desc' => 'El icónico disipador barato.', 'specs' => ['type' => 'Air', 'tdp_rating' => 150, 'height' => 159, 'socket_support' => ['AM4', 'AM5', 'LGA1700']]],
                ]
            ],
        ];

        // Ensure categories exist
        $catModels = [];
        foreach ($catalog as $slug => $data) {
            $catModels[$slug] = Category::updateOrCreate(['slug' => $slug], [
                'name' => $data['name'],
                'image' => $data['image']
            ]);
        }
        
        // Cargar archivos en memoria para coincidencia EXACTA y FUZZY MATCH
        $allFiles = Storage::disk('public')->files('products');
        $localImages = [];
        $fileInfo = [];
        foreach ($allFiles as $f) {
            $base = strtolower(basename($f));
            $path = '/storage/' . $f;
            $localImages[pathinfo($base, PATHINFO_FILENAME)] = $path;
            
            if (str_ends_with($f, 'webp') || str_ends_with($f, 'jpg') || str_ends_with($f, 'png')) {
                $fileInfo[] = [
                    'path' => $path,
                    'keywords' => explode('-', str_replace(['_', '.', ' '], '-', pathinfo($base, PATHINFO_FILENAME)))
                ];
            }
        }

        // 3. SOLO 80 PRODUCTOS MANUALES CURADOS
        foreach ($catalog as $catSlug => $data) {
            $cat = $catModels[$catSlug];
            foreach ($data['items'] as $item) {
                // Generar slug del nombre para comparar con archivos existentes locales
                $productSlug = Str::slug($item['name']);
                
                // Priority: Exact match -> Fuzzy match -> Stable URL -> Manual URL
                $finalImage = $item['url'];
                $isArctic = str_contains(strtolower($item['name']), 'arctic liquid freezer ii');
                $isPccomponentes = str_contains($finalImage, 'pccomponentes.com');
                
                if (isset($localImages[$productSlug]) && !$isArctic) {
                    $finalImage = $localImages[$productSlug];
                } else if (!$isArctic && !$isPccomponentes) {
                    // Start fuzzy match only if not Arctic and not PCComponentes 
                    $nameKeywords = explode('-', $productSlug);
                    $bestMatch = null;
                    $maxScore = 0;
                    foreach ($fileInfo as $info) {
                        $score = count(array_intersect($nameKeywords, $info['keywords']));
                        // special penalizations
                        if (in_array('ddr4', $nameKeywords) && in_array('ddr5', $info['keywords'])) $score -= 10;
                        if (in_array('ddr5', $nameKeywords) && in_array('ddr4', $info['keywords'])) $score -= 10;
                        if ($score > $maxScore) {
                            $maxScore = $score;
                            $bestMatch = $info['path'];
                        }
                    }
                    if ($maxScore >= 2 && $bestMatch) {
                        $finalImage = $bestMatch;
                    }
                }
                
                // Manual hardcodes fallback for components lacking exact or fuzzy local images
                if (str_contains($finalImage, 'amazon.com') || $finalImage == '/placeholder.jpg') {
                    if (str_contains($item['name'], 'ASRock Z790')) $finalImage = '/storage/products/asus-prime-z790-a-wifi.jpg';
                    if (str_contains($item['name'], 'Patriot Viper Steel')) $finalImage = '/storage/products/corsair-vengeance-lpx-ddr4-3600-32gb.jpg';
                    if (str_contains($item['name'], 'Kingston NV2')) $finalImage = '/storage/products/crucial-p3-plus-2tb-nvme.jpg';
                    if (str_contains($item['name'], 'Corsair HX1200')) $finalImage = '/storage/products/corsair-rm850x.png';
                }

                // Explicit Overrides for severe content mismatches (User's storage folder contains wrongly named files)
                if ($productSlug === 'corsair-rm850x-2021') $finalImage = '/storage/products/corsair-rm850x.png';
                if ($productSlug === 'evga-supernova-1000-g6') $finalImage = '/storage/products/evga-supernova-1000-g6_fix.jpg';
                if ($productSlug === 'corsair-mp600-pro-lpx-2tb') $finalImage = '/storage/products/crucial-p3-plus-2tb-nvme.jpg';
                if ($productSlug === 'crucial-pro-ram-32gb-ddr4-3200mhz') $finalImage = '/storage/products/crucial-pro-ddr5-5600-32gb.png';
                if ($productSlug === 'gigabyte-rtx-4080-super-windforce') $finalImage = '/storage/products/gigabyte-gaming-oc-geforce-rtx-4080.jpg';
                if ($productSlug === 'msi-rtx-4070-ti-super-ventus-3x') $finalImage = '/storage/products/msi-ventus-2x-geforce-rtx-4060.jpg';

                Product::updateOrCreate(['slug' => $productSlug], [
                    'category_id' => $cat->id,
                    'name' => $item['name'],
                    'description' => $item['desc'] ?? '',
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                    'image' => $finalImage,
                    'specs' => $item['specs'],
                ]);
            }
        }
    }
}
