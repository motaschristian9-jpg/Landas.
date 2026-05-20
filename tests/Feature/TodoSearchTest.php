<?php

use App\Models\User;
use App\Models\Todo;
use Inertia\Testing\AssertableInertia as Assert;

it('can filter tasks by search query', function () {
    $user = User::factory()->create();
    
    // Create matching and non-matching tasks
    $matchingTodo = Todo::factory()->create([
        'user_id' => $user->id,
        'title' => 'Architect system logic',
    ]);
    
    $nonMatchingTodo = Todo::factory()->create([
        'user_id' => $user->id,
        'title' => 'Review marketing guidelines',
    ]);

    $response = $this->actingAs($user)
        ->get(route('todos.index', ['search' => 'Architect']));

    $response->assertStatus(200);
    
    // Assert only matching todo is returned in Inertia
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Todos/Index')
        ->has('todos.data', 1)
        ->where('todos.data.0.id', $matchingTodo->id)
        ->where('filters.search', 'Architect')
    );
});

it('does not leak search results from other users', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $todoA = Todo::factory()->create([
        'user_id' => $userA->id,
        'title' => 'User A secret plan',
    ]);

    $todoB = Todo::factory()->create([
        'user_id' => $userB->id,
        'title' => 'User B secret plan',
    ]);

    $response = $this->actingAs($userA)
        ->get(route('todos.index', ['search' => 'secret']));

    $response->assertStatus(200);

    // Assert only User A's matching todo is returned
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Todos/Index')
        ->has('todos.data', 1)
        ->where('todos.data.0.id', $todoA->id)
    );
});
