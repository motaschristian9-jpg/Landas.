<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserStat;

class GamificationService
{
    /**
     * Award XP to a user and handle level ups.
     */
    public function awardXP(User $user, int $amount)
    {
        $stats = $user->stats()->firstOrCreate(['user_id' => $user->id]);
        
        $stats->xp += $amount;
        
        // Simple Level Logic: Each level requires level * 100 XP
        // e.g., Level 1 -> 100 XP to get to Level 2
        // Level 2 -> 200 more XP to get to Level 3
        while ($stats->xp >= $this->getXPForNextLevel($stats->level)) {
            $stats->xp -= $this->getXPForNextLevel($stats->level);
            $stats->level++;
        }

        $stats->save();

        return $stats;
    }

    /**
     * Calculate XP required to reach the next level.
     */
    public function getXPForNextLevel(int $currentLevel)
    {
        return $currentLevel * 100;
    }

    /**
     * Check and award badges based on achievements.
     */
    public function checkBadgeUnlocks(User $user)
    {
        $stats = $user->stats()->first();
        if (!$stats) return [];

        $currentBadges = $stats->badges ?? [];
        $newBadges = [];

        // Example: First Task Badge
        if (!in_array('first_task', $currentBadges)) {
            if ($user->todos()->where('is_completed', true)->count() >= 1) {
                $newBadges[] = 'first_task';
            }
        }

        // Example: Streak Master (7 days)
        if (!in_array('streak_7', $currentBadges)) {
            $has7DayStreak = $user->habits->contains(function($habit) {
                return (new HabitService())->calculateStreak($habit) >= 7;
            });
            if ($has7DayStreak) {
                $newBadges[] = 'streak_7';
            }
        }

        if (!empty($newBadges)) {
            $stats->badges = array_unique(array_merge($currentBadges, $newBadges));
            $stats->save();
        }

        return $newBadges;
    }
}
