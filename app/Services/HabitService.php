<?php

namespace App\Services;

use App\Models\Habit;
use App\Models\HabitLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class HabitService
{
    /**
     * Calculate the current streak for a habit using "Smart Streak" logic.
     * A streak is active if all scheduled days have been completed up to today.
     */
    public function calculateStreak(Habit $habit)
    {
        $scheduledDays = $habit->scheduled_days ?? []; // e.g. ['monday', 'wednesday']
        $logs = $habit->logs()->orderBy('logged_at', 'desc')->pluck('logged_at')->map(function ($date) {
            return $date instanceof \Carbon\Carbon ? $date->toDateString() : \Carbon\Carbon::parse($date)->toDateString();
        })->toArray();
        
        if (empty($logs)) {
            return 0;
        }

        $streak = 0;
        $currentDate = Carbon::today();
        
        // If today is a scheduled day but not completed yet, start checking from yesterday
        $todayDayName = strtolower($currentDate->format('l'));
        if (in_array($todayDayName, $scheduledDays) && !in_array($currentDate->toDateString(), $logs)) {
            $currentDate->subDay();
        }

        // Iterate backwards until we find a missed scheduled day
        while (true) {
            $dayName = strtolower($currentDate->format('l'));
            $dateString = $currentDate->toDateString();

            if (in_array($dateString, $logs)) {
                // Completed! Always increment streak, whether scheduled or not (bonus day)
                $streak++;
            } else {
                // Not completed. Break streak ONLY if it was scheduled.
                if (in_array($dayName, $scheduledDays)) {
                    // Missed a scheduled day - streak broken
                    break;
                }
            }

            // Move to previous day
            $currentDate->subDay();

            // Safety break to prevent infinite loops (limit to 1 year for now)
            if ($currentDate->diffInDays(Carbon::today()) > 365) {
                break;
            }
        }

        return $streak;
    }

    /**
     * Determine if a habit is due today.
     */
    public function isDueToday(Habit $habit)
    {
        $todayDayName = strtolower(Carbon::today()->format('l')); // Full day name: monday
        return in_array($todayDayName, $habit->scheduled_days ?? []);
    }

    public function isCompletedToday(Habit $habit)
    {
        return $habit->logs()->whereDate('logged_at', Carbon::today())->exists();
    }

    public function getCompletionMap(Habit $habit, $days = 30)
    {
        $map = [];
        $logs = $habit->logs()->where('logged_at', '>=', Carbon::today()->subDays($days))->pluck('logged_at')->map(function ($date) {
            return $date instanceof \Carbon\Carbon ? $date->toDateString() : \Carbon\Carbon::parse($date)->toDateString();
        })->toArray();
        $scheduledDays = $habit->scheduled_days ?? [];

        for ($i = 0; $i < $days; $i++) {
            $date = Carbon::today()->subDays($i);
            $dateString = $date->toDateString();
            $dayName = strtolower($date->format('l'));

            $map[] = [
                'date' => $dateString,
                'completed' => in_array($dateString, $logs),
                'scheduled' => in_array($dayName, $scheduledDays),
            ];
        }

        return array_reverse($map);
    }

    public function logCompletion(Habit $habit, $date = null)
    {
        $date = $date ?: Carbon::today()->toDateString();

        $log = HabitLog::updateOrCreate(
            ['habit_id' => $habit->id, 'logged_at' => $date],
            ['type' => 'completion']
        );

        // Update streak immediately
        $habit->update(['streak' => $this->calculateStreak($habit)]);

        return ['status' => 'success', 'log' => $log];
    }

    public function recoverStreak(Habit $habit, $user)
    {
        if ($user->hearts_count <= 0) {
            return ['status' => 'error', 'message' => 'No hearts left to save your streak.'];
        }

        // Find the last missed scheduled day
        $lastMissedDate = null;
        $currentDate = Carbon::today()->subDay();
        $logs = $habit->logs()->pluck('logged_at')->map(function ($date) {
            return $date instanceof \Carbon\Carbon ? $date->toDateString() : \Carbon\Carbon::parse($date)->toDateString();
        })->toArray();
        $scheduledDays = $habit->scheduled_days ?? [];

        for ($i = 0; $i < 30; $i++) {
            $dayName = strtolower($currentDate->format('l'));
            if (in_array($dayName, $scheduledDays) && !in_array($currentDate->toDateString(), $logs)) {
                $lastMissedDate = $currentDate->toDateString();
                break;
            }
            $currentDate->subDay();
        }

        if (!$lastMissedDate) {
            return ['status' => 'error', 'message' => 'No missed days found to recover.'];
        }

        return DB::transaction(function () use ($habit, $lastMissedDate, $user) {
            HabitLog::create([
                'habit_id' => $habit->id,
                'logged_at' => $lastMissedDate,
                'type' => 'heart_used',
            ]);

            $user->decrement('hearts_count');
            
            // Recalculate streak
            $habit->update(['streak' => $this->calculateStreak($habit)]);

            return ['status' => 'success'];
        });
    }

    public function useHeart(Habit $habit, $missingDate)
    {
        // This is a lower-level method, kept for compatibility if needed
        $user = $habit->user;
        if ($user->hearts_count <= 0) throw new \Exception("No hearts available.");

        return DB::transaction(function () use ($habit, $missingDate, $user) {
            $log = HabitLog::create([
                'habit_id' => $habit->id,
                'logged_at' => $missingDate,
                'type' => 'heart_used',
            ]);
            $user->decrement('hearts_count');
            return $log;
        });
    }
}
