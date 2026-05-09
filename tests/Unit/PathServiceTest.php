<?php

use App\Models\User;
use App\Models\Todo;
use App\Models\Habit;
use App\Services\PathService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

test('it can detect stuck tasks', function () {
    $user = User::factory()->create();
    $service = new PathService();

    // Create a task that is 4 days old and not completed
    Todo::factory()->create([
        'user_id' => $user->id,
        'title' => 'Stuck Task',
        'is_completed' => false,
        'created_at' => now()->subDays(4)
    ]);

    $signals = $service->getSignals($user);

    expect($signals)->toContain([
        'type' => 'STUCK_TASK',
        'data' => 'Stuck Task',
        'priority' => 'medium'
    ]);
});

test('it can detect habit streaks', function () {
    $user = User::factory()->create();
    $service = new PathService();

    $habit = Habit::factory()->create([
        'user_id' => $user->id,
        'title' => 'Daily Meditation',
    ]);

    // Create logs for 3 consecutive days
    for ($i = 0; $i < 3; $i++) {
        $habit->logs()->create([
            'logged_at' => now()->subDays($i),
            'type' => 'completion'
        ]);
    }

    $signals = $service->getSignals($user);

    expect($signals)->toContain([
        'type' => 'HABIT_STREAK',
        'data' => 'Daily Meditation',
        'value' => 3,
        'priority' => 'high'
    ]);
});

test('it can detect overload', function () {
    $user = User::factory()->create();
    $service = new PathService();

    // Create 6 tasks for today
    Todo::factory()->count(6)->create([
        'user_id' => $user->id,
        'is_completed' => false,
        'created_at' => now()
    ]);

    $signals = $service->getSignals($user);

    expect($signals)->toContain([
        'type' => 'OVERLOAD',
        'value' => 6,
        'priority' => 'high'
    ]);
});
