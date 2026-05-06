<?php

namespace App\Services;

use App\Models\Goal;

class GoalService
{
    /**
     * Calculate the progress percentage of a goal.
     */
    public function getProgress(Goal $goal)
    {
        $total = $goal->milestones()->count();
        
        if ($total === 0) {
            return 0;
        }

        $completed = $goal->milestones()->where('is_completed', true)->count();

        return round(($completed / $total) * 100);
    }

    /**
     * Determine if a goal is "At Risk" based on deadline and progress.
     */
    public function isAtRisk(Goal $goal)
    {
        if (!$goal->target_date || $goal->status === 'completed') {
            return false;
        }

        $progress = $this->getProgress($goal);
        $daysRemaining = now()->diffInDays($goal->target_date, false);

        // If less than 20% of time remains but progress is under 50%
        if ($daysRemaining < 7 && $progress < 50) {
            return true;
        }

        return false;
    }
}
