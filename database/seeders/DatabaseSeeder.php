<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear Jerarquía de Usuarios por Defecto
        User::factory()->create([
            'name' => 'Super Administrador',
            'email' => 'superadmin@zendpc.com',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
        ]);

        User::factory()->create([
            'name' => 'Administrador de Sistema',
            'email' => 'admin@zendpc.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Usuario de Pruebas',
            'email' => 'user@zendpc.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        // 2. Cargar catálogo y configuración local
        $this->call([
            CompleteLocalSeeder::class,
        ]);
    }
}
