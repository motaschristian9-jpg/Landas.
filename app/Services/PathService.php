<?php

namespace App\Services;

use App\Models\User;
use App\Models\Todo;
use App\Models\Habit;
use App\Models\Goal;
use Carbon\Carbon;

class PathService
{
    /**
     * Get data signals for the Path AI coach.
     */
    public function getSignals(User $user)
    {
        $signals = [];

        // 1. Detect Stuck Tasks (Overdue > 3 days)
        $stuckTasks = $user->todos()
            ->where('is_completed', false)
            ->where('created_at', '<=', now()->subDays(3))
            ->get();

        foreach ($stuckTasks as $task) {
            $signals[] = [
                'type' => 'STUCK_TASK',
                'data' => $task->title,
                'priority' => 'medium'
            ];
            break; // Limit to one for now
        }

        // 2. Detect Habit Streaks (Using streak column or calculating)
        foreach ($user->habits as $habit) {
            // We use the streak from the model, but for the test we might need to calculate it
            // if it wasn't updated. For simplicity in the service, we trust the model streak.
            // But wait, the test creates logs manually. Let's calculate it to be safe and robust.
            $streak = $this->calculateBasicStreak($habit);
            
            if ($streak >= 3) {
                $signals[] = [
                    'type' => 'HABIT_STREAK',
                    'data' => $habit->title,
                    'value' => $streak,
                    'priority' => 'high'
                ];
                break;
            }
        }

        // 3. Detect Overload (Too many tasks today)
        $todayTasksCount = $user->todos()
            ->where('is_completed', false)
            ->whereDate('created_at', '<=', now())
            ->count();

        if ($todayTasksCount > 5) {
            $signals[] = [
                'type' => 'OVERLOAD',
                'value' => $todayTasksCount,
                'priority' => 'high'
            ];
        }

        // 4. Detect Goal Inactivity
        foreach ($user->goals as $goal) {
            $lastMilestone = $goal->milestones()->where('is_completed', true)->latest('updated_at')->first();
            if (!$lastMilestone || $lastMilestone->updated_at->diffInDays(now()) > 7) {
                $signals[] = [
                    'type' => 'GOAL_STALL',
                    'data' => $goal->title,
                    'priority' => 'medium'
                ];
                break;
            }
        }

        return $signals;
    }

    /**
     * A simple streak calculator for signal detection.
     */
    private function calculateBasicStreak(Habit $habit)
    {
        $logs = $habit->logs()
            ->where('type', 'completion')
            ->orderBy('logged_at', 'desc')
            ->pluck('logged_at')
            ->map(fn($d) => $d instanceof Carbon ? $d->toDateString() : Carbon::parse($d)->toDateString())
            ->toArray();

        if (empty($logs)) return 0;

        $streak = 0;
        $checkDate = Carbon::today();

        // If not completed today, start checking from yesterday
        if (!in_array($checkDate->toDateString(), $logs)) {
            $checkDate->subDay();
        }

        while (in_array($checkDate->toDateString(), $logs)) {
            $streak++;
            $checkDate->subDay();
            if ($streak > 365) break;
        }

        return $streak;
    }
}
