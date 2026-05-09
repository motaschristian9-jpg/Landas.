<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
$habitService = app(App\Services\HabitService::class);

$allHabits = $user->habits()->get();
$sortedHabits = $allHabits->sortBy(function($habit) use ($habitService) {
    $isDue = $habitService->isDueToday($habit);
    $isCompleted = $habitService->isCompletedToday($habit);
    
    if ($isDue && !$isCompleted) return 1; // Priority 1: Due and not completed
    if ($isDue && $isCompleted) return 2;  // Priority 2: Due and completed
    return 3;                              // Priority 3: Not due
})->values();

foreach($sortedHabits as $habit) {
    $isDue = $habitService->isDueToday($habit);
    $isCompleted = $habitService->isCompletedToday($habit);
    $priority = ($isDue && !$isCompleted) ? 1 : (($isDue && $isCompleted) ? 2 : 3);
    echo "ID: {$habit->id} | Title: {$habit->title} | Due: " . ($isDue ? 'Y' : 'N') . " | Completed: " . ($isCompleted ? 'Y' : 'N') . " | Priority: $priority" . PHP_EOL;
}
