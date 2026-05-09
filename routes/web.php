<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\MasteryController;
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

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('goals', GoalController::class);
    Route::post('/goals/{goal}/milestones', [GoalController::class, 'addMilestone'])->name('goals.milestones.store');
    Route::patch('/goals/{goal}/milestones/{milestone}', [GoalController::class, 'toggleMilestone'])->name('goals.milestones.toggle');
    Route::delete('/goals/{goal}/milestones/{milestone}', [GoalController::class, 'deleteMilestone'])->name('goals.milestones.destroy');
    Route::resource('todos', TodoController::class);
    Route::delete('/todos/bulk/date', [TodoController::class, 'destroyByDate'])->name('todos.destroyByDate');
    Route::resource('habits', HabitController::class);
    Route::post('/habits/{habit}/log', [HabitController::class, 'log'])->name('habits.log');
    Route::post('/habits/{habit}/recover', [HabitController::class, 'recover'])->name('habits.recover');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/theme', [ProfileController::class, 'updateTheme'])->name('profile.theme.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/mastery', [MasteryController::class, 'index'])->name('mastery.index');
    Route::post('/guidance/{guidance}/acknowledge', [\App\Http\Controllers\GuidanceController::class, 'acknowledge'])->name('guidance.acknowledge');
});

require __DIR__.'/auth.php';

