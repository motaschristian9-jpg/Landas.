<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    
    $totalGoals = \App\Models\Goal::where('user_id', $user->id)->count();
    $completedGoals = \App\Models\Goal::where('user_id', $user->id)->where('status', 'completed')->count();
    $inProgressGoals = \App\Models\Goal::where('user_id', $user->id)->where('status', 'in_progress')->count();
    
    $upcomingGoals = \App\Models\Goal::where('user_id', $user->id)
        ->where('status', '!=', 'completed')
        ->whereNotNull('target_date')
        ->orderBy('target_date', 'asc')
        ->with(['category', 'priority'])
        ->limit(3)
        ->get();
        
    $todayTodos = \App\Models\Todo::where('user_id', $user->id)
        ->whereDate('due_date', \Carbon\Carbon::today())
        ->get();

    // Mock activity data for the chart (last 7 days)
    $activityData = collect(range(0, 6))->map(function($days) {
        return [
            'day' => \Carbon\Carbon::today()->subDays(6 - $days)->format('D'),
            'count' => rand(2, 10) // In a real app, this would be based on completed tasks
        ];
    });

    return Inertia::render('Dashboard', [
        'totalGoals' => $totalGoals,
        'completedGoals' => $completedGoals,
        'inProgressGoals' => $inProgressGoals,
        'upcomingGoals' => $upcomingGoals,
        'todayTodos' => $todayTodos,
        'activityData' => $activityData,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('goals', \App\Http\Controllers\GoalController::class);
    Route::resource('todos', \App\Http\Controllers\TodoController::class);
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
