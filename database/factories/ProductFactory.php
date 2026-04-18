<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name' => 'Componente Genérico',
            'slug' => Str::slug('componente-generico-' . Str::random(5)),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 50, 1500),
            'stock' => $this->faker->numberBetween(5, 50),
            'image' => 'https://via.placeholder.com/400x400.png?text=Product',
            'specs' => [],
        ];
    }

    public function cpu()
    {
        $name = $this->faker->randomElement(['ZendCore', 'Quantum', 'Nebula']) . ' ' . $this->faker->randomElement(['X', 'Pro', 'Ultra']) . ' ' . $this->faker->numberBetween(500, 9000);
        return $this->state(fn (array $attributes) => [
            'name' => $name,
            'slug' => Str::slug($name),
            'specs' => [
                'socket' => $this->faker->randomElement(['AM4', 'AM5', 'LGA1700']),
                'tdp' => $this->faker->randomElement([65, 105, 125, 170, 253]),
                'cores' => $this->faker->randomElement([6, 8, 12, 16, 24]),
                'series' => $this->faker->randomElement(['Ryzen 5', 'Ryzen 7', 'Core i5', 'Core i7', 'Core i9']),
            ]
        ]);
    }

    public function motherboard()
    {
        $name = $this->faker->randomElement(['ZendBoard', 'Prime', 'Apex']) . ' ' . $this->faker->randomElement(['Z790', 'B650', 'X670']) . '-' . $this->faker->randomElement(['Plus', 'WiFi', 'Max']);
        return $this->state(fn (array $attributes) => [
            'name' => $name,
            'slug' => Str::slug($name),
            'specs' => [
                'socket' => $this->faker->randomElement(['AM4', 'AM5', 'LGA1700']),
                'form_factor' => $this->faker->randomElement(['ATX', 'Micro-ATX', 'Mini-ITX']),
                'memory_type' => $this->faker->randomElement(['DDR4', 'DDR5']),
            ]
        ]);
    }

    public function gpu()
    {
        $name = 'ZendVision ' . $this->faker->randomElement(['RTX', 'RX']) . ' ' . $this->faker->randomElement(['8000', '9000', '7000']) . ' ' . $this->faker->randomElement(['Super', 'XT', 'Ti']);
        return $this->state(fn (array $attributes) => [
            'name' => $name,
            'slug' => Str::slug($name),
            'specs' => [
                'tdp' => $this->faker->numberBetween(150, 450),
                'length' => $this->faker->numberBetween(200, 360),
                'vram' => $this->faker->randomElement([8, 12, 16, 24]),
            ]
        ]);
    }

    public function ram()
    {
        return $this->state(fn (array $attributes) => [
            'specs' => [
                'type' => $this->faker->randomElement(['DDR4', 'DDR5']),
                'capacity' => $this->faker->randomElement([8, 16, 32, 64]),
                'speed' => $this->faker->randomElement([3200, 3600, 5200, 6000, 6400]),
            ]
        ]);
    }

    public function storage()
    {
        return $this->state(fn (array $attributes) => [
            'specs' => [
                'type' => $this->faker->randomElement(['NVMe Gen4', 'NVMe Gen3', 'SATA SSD', 'HDD']),
                'capacity' => $this->faker->randomElement([500, 1000, 2000, 4000]),
                'speed' => $this->faker->numberBetween(500, 7500),
            ]
        ]);
    }

    public function psu()
    {
        return $this->state(fn (array $attributes) => [
            'specs' => [
                'wattage' => $this->faker->randomElement([550, 650, 750, 850, 1000, 1200]),
                'modular' => $this->faker->boolean(),
                'rating' => $this->faker->randomElement(['80+ Bronze', '80+ Gold', '80+ Platinum']),
            ]
        ]);
    }

    public function case()
    {
        return $this->state(fn (array $attributes) => [
            'specs' => [
                'form_factor' => $this->faker->randomElement(['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX']),
                'max_gpu_length' => $this->faker->numberBetween(300, 450),
                'max_cooler_height' => $this->faker->numberBetween(150, 190),
                'radiator_support' => $this->faker->randomElements([120, 240, 280, 360, 420], $this->faker->numberBetween(1, 4)),
            ]
        ]);
    }

    public function cooler()
    {
        return $this->state(fn (array $attributes) => [
            'specs' => [
                'type' => $this->faker->randomElement(['Aire', 'AIO Líquida']),
                'radiator_size' => $this->faker->optional(0.5)->randomElement([120, 240, 280, 360]),
                'height' => $this->faker->optional(0.5)->numberBetween(120, 170),
                'tdp_rating' => $this->faker->numberBetween(150, 350),
                'socket_support' => ['AM4', 'AM5', 'LGA1700'],
            ]
        ]);
    }
}
