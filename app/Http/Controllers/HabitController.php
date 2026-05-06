<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Services\HabitService;
use App\Services\GamificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HabitController extends Controller
{
    protected $habitService;
    protected $gamificationService;

    public function __construct(HabitService $habitService, GamificationService $gamificationService)
    {
        $this->habitService = $habitService;
        $this->gamificationService = $gamificationService;
    }

    public function index()
    {
        $user = Auth::user();
        $habits = $user->habits()->with('logs')->get()->map(function ($habit) {
            return [
                'id' => $habit->id,
                'title' => $habit->title,
                'description' => $habit->description,
                'icon' => $habit->icon,
                'color' => $habit->color,
                'streak' => $habit->streak,
                'is_completed_today' => $this->habitService->isCompletedToday($habit),
                'scheduled_days' => $habit->scheduled_days,
                'logs_count' => $habit->logs()->count(),
                'last_30_days' => $this->habitService->getCompletionMap($habit, 30),
            ];
        });

        return Inertia::render('Habits/Index', [
            'habits' => $habits,
            'heartsCount' => $user->hearts_count,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'scheduled_days' => 'nullable|array',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['scheduled_days'] = $validated['scheduled_days'] ?? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        Habit::create($validated);

        return redirect()->back()->with('success', 'Habit created! Discipline is key.');
    }

    public function log(Habit $habit)
    {
        if ($habit->user_id !== Auth::id()) abort(403);

        $result = $this->habitService->logCompletion($habit);

        if ($result['status'] === 'success') {
            $this->gamificationService->awardXP(Auth::user(), 20);
            return redirect()->back()->with('success', 'Streak continued! +20 XP');
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function recover(Habit $habit)
    {
        if ($habit->user_id !== Auth::id()) abort(403);

        $result = $this->habitService->recoverStreak($habit, Auth::user());

        if ($result['status'] === 'success') {
            return redirect()->back()->with('success', 'Streak saved! Use your hearts wisely.');
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function update(Request $request, Habit $habit)
    {
        if ($habit->user_id !== Auth::id()) abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'scheduled_days' => 'nullable|array',
        ]);

        $habit->update($validated);

        return redirect()->back()->with('success', 'Habit updated.');
    }

    public function destroy(Habit $habit)
    {
        if ($habit->user_id !== Auth::id()) abort(403);

        $habit->delete();

        return redirect()->back()->with('success', 'Habit removed.');
    }
}
