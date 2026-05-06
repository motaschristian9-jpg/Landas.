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
        // User::factory(10)->create();

        \App\Models\Category::create(['name' => 'Career', 'color' => '#4f46e5']);
        \App\Models\Category::create(['name' => 'Health', 'color' => '#10b981']);
        \App\Models\Category::create(['name' => 'Finance', 'color' => '#f59e0b']);
        \App\Models\Category::create(['name' => 'Personal', 'color' => '#ec4899']);

        \App\Models\Priority::create(['name' => 'Low', 'level' => 1, 'color' => '#94a3b8']);
        \App\Models\Priority::create(['name' => 'Medium', 'level' => 2, 'color' => '#3b82f6']);
        \App\Models\Priority::create(['name' => 'High', 'level' => 3, 'color' => '#ef4444']);
    }
}
