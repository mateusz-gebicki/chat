<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin'),
            'role' => 'admin'
        ]);

        User::factory()->create([
            'name' => 'QA',
            'email' => 'qa@example.com',
            'password' => Hash::make('qa'),
            'role' => 'qa'
        ]);

        User::factory()->create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => Hash::make('user'),
            'role' => 'user'
        ]);

        User::factory()->create([
            'name' => 'Swagger',
            'email' => 'swagger@example.com',
            'password' => Hash::make('swagger'),
            'role' => 'swagger'
        ]);
    }
}
