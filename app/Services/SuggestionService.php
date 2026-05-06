<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class SuggestionService
{
    /**
     * Get proactive suggestions for the user.
     */
    public function getSuggestions(User $user)
    {
        $suggestions = [];

        // 1. Monday Blues Check
        $mondayHabits = $user->habits->filter(function($habit) {
            return in_array('mon', $habit->scheduled_days ?? []);
        });

        foreach ($mondayHabits as $habit) {
            $missedMondays = $habit->logs()
                ->whereRaw("DAYNAME(logged_at) = 'Monday'")
                ->where('type', '!=', 'completion')
                ->count();
            
            if ($missedMondays >= 2) {
                $suggestions[] = [
                    'type' => 'habit_improvement',
                    'message' => "You've missed '{$habit->title}' on several Mondays. Try moving it to Tuesday or setting a reminder?",
                    'priority' => 'medium'
                ];
                break; // Only one such suggestion to avoid clutter
            }
        }

        // 2. Stuck Tasks Check
        $stuckTasks = $user->todos()
            ->where('is_completed', false)
            ->where('created_at', '<=', now()->subDays(3))
            ->get();

        if ($stuckTasks->count() > 0) {
            $task = $stuckTasks->first();
            $suggestions[] = [
                'type' => 'stuck_task',
                'message' => "The task '{$task->title}' has been open for 3 days. Should we break it down into smaller steps?",
                'priority' => 'low'
            ];
        }

        // 3. Goal Momentum Check
        foreach ($user->goals as $goal) {
            $lastActivity = $goal->milestones()->where('is_completed', true)->latest('updated_at')->first();
            if (!$lastActivity || $lastActivity->updated_at->diffInDays(now()) > 7) {
                $suggestions[] = [
                    'type' => 'goal_momentum',
                    'message' => "You haven't updated your goal '{$goal->title}' in a week. Small steps lead to big wins!",
                    'priority' => 'high'
                ];
                break;
            }
        }

        return $suggestions;
    }
}
