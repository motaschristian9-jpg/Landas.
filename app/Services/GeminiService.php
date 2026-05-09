<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected $apiKey;
    protected $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
    }

    /**
     * Generate a supportive coaching message from Path.
     */
    public function generateGuidance(array $signals, string $userName)
    {
        if (!$this->apiKey || empty($signals)) {
            return $this->getFallbackMessage($signals, $userName);
        }

        try {
            $prompt = $this->buildPrompt($signals, $userName);
            
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '?key=' . $this->apiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 150,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? $this->getFallbackMessage($signals, $userName);
            }

            Log::warning('Gemini API failed: ' . $response->body());
            return $this->getFallbackMessage($signals, $userName);

        } catch (\Exception $e) {
            Log::error('Gemini Service Error: ' . $e->getMessage());
            return $this->getFallbackMessage($signals, $userName);
        }
    }

    /**
     * Build the AI prompt based on signals.
     */
    private function buildPrompt(array $signals, string $userName)
    {
        $signalsJson = json_encode($signals);
        
        return "You are 'Path', a minimalist and supportive AI coach for a productivity app called GoalTracker. 
        Your goal is to encourage the user, {$userName}, and help them navigate their day with empathy.
        
        Current User Signals:
        {$signalsJson}
        
        Guidelines:
        - Keep it brief (1-2 sentences max).
        - Use a warm, non-judgmental, and playful minimalist tone.
        - Focus on one major win or offer one gentle pivot for a struggle.
        - Do not use markdown bolding.
        - Refer to yourself as 'Path' if natural, but focus on the user.
        
        Example output:
        I noticed your streak is strong today! Maybe take that momentum to tackle the 'Logo' task you've been sitting on? You've got this.";
    }

    /**
     * Fallback message generation if AI is unavailable.
     */
    private function getFallbackMessage(array $signals, string $userName)
    {
        if (empty($signals)) {
            return "Rise and shine, {$userName}. Every small step today is a victory on your path.";
        }

        $signal = $signals[0]; // Take the highest priority one

        switch ($signal['type']) {
            case 'HABIT_STREAK':
                return "You've crushed '{$signal['data']}' for {$signal['value']} days! That consistency is your superpower, {$userName}.";
            case 'STUCK_TASK':
                return "The task '{$signal['data']}' has been waiting for a bit. How about breaking it into tiny, 5-minute pieces today?";
            case 'OVERLOAD':
                return "You've got {$signal['value']} tasks ahead today. Remember: focus on the most meaningful one first, and it's okay to move the rest.";
            case 'GOAL_STALL':
                return "Your goal '{$signal['data']}' misses you! Even a 2-minute effort today keeps the dream alive.";
            default:
                return "Keep going, {$userName}. You're doing better than you think.";
        }
    }
}
