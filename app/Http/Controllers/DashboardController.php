<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\Habit;
use App\Models\Todo;
use App\Services\GamificationService;
use App\Services\GoalService;
use App\Services\HabitService;
use App\Services\SuggestionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(
        HabitService $habitService,
        GoalService $goalService,
        GamificationService $gamificationService,
        SuggestionService $suggestionService
    ) {
        $user = auth()->user();
        
        // 1. Gamification Stats
        $stats = $user->stats()->firstOrCreate(['user_id' => $user->id]);
        $gamificationService->checkBadgeUnlocks($user); // Update badges before showing

        // 2. Pillar 1: Today's Tasks (Fresh Start Logic)
        $todayTodos = $user->todos()
            ->where(function($query) {
                // Show incomplete tasks or those completed today
                $query->where('is_completed', false)
                      ->orWhere(function($q) {
                          $q->where('is_completed', true)
                            ->whereDate('completed_at', Carbon::today());
                      });
            })
            ->orderBy('is_completed', 'asc')
            ->orderByRaw("CASE WHEN priority = 'high' THEN 1 WHEN priority = 'medium' THEN 2 WHEN priority = 'low' THEN 3 ELSE 4 END")
            ->orderBy('due_date', 'asc')
            ->paginate(5, ['*'], 'todos_page');

        // 3. Pillar 2: Today's Habits
        $allHabits = $user->habits()->get();
        $habits = [
            'data' => $allHabits->map(function($habit) use ($habitService) {
                return [
                    'id' => $habit->id,
                    'title' => $habit->title,
                    'is_due' => $habitService->isDueToday($habit),
                    'is_completed' => $habitService->isCompletedToday($habit),
                    'streak' => $habitService->calculateStreak($habit),
                    'total_logs' => $habit->logs()->count(),
                    'frequency' => $habit->frequency,
                ];
            })->all()
        ];

        // 4. Pillar 3: Goal Progress
        $goals = $user->goals()->with('milestones')->paginate(3, ['*'], 'goals_page')->through(function($goal) use ($goalService) {
            return [
                'id' => $goal->id,
                'title' => $goal->title,
                'description' => $goal->description,
                'progress' => $goalService->getProgress($goal),
                'is_at_risk' => $goalService->isAtRisk($goal),
                'milestones_count' => $goal->milestones()->count(),
                'completed_milestones' => $goal->milestones()->where('is_completed', true)->count(),
                'milestones' => $goal->milestones,
            ];
        });

        // 5. Smart Suggestions
        $suggestions = $suggestionService->getSuggestions($user);

        return Inertia::render('Dashboard', [
            'stats' => [
                'xp' => $stats->xp,
                'level' => $stats->level,
                'xp_needed' => $gamificationService->getXPForNextLevel($stats->level),
                'badges' => $stats->badges ?? [],
            ],
            'todayTodos' => $todayTodos,
            'dailyHabits' => $habits,
            'goals' => $goals,
            'suggestions' => $suggestions,
            'heartsCount' => $user->hearts_count,
        ]);
    }
}
