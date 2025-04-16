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
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => 'admin',
                'role' => 'admin'
            ],
            [
                'name' => 'QA',
                'email' => 'qa@example.com',
                'password' => 'qa',
                'role' => 'qa'
            ],
            [
                'name' => 'User',
                'email' => 'user@example.com',
                'password' => 'user',
                'role' => 'user'
            ],
            [
                'name' => 'Swagger',
                'email' => 'swagger@example.com',
                'password' => 'swagger',
                'role' => 'swagger'
            ],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']),
                    'role' => $user['role'],
                ]
            );
        }
    }
}
