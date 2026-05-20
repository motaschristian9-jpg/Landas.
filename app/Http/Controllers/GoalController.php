<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Goal;
use App\Models\Category;
use App\Models\Priority;

class GoalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return redirect()->route('mastery.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'priority_id' => 'nullable|exists:priorities,id',
            'target_date' => 'nullable|date',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        auth()->user()->goals()->create($validated);

        return redirect()->route('mastery.index')->with('success', 'Vision launched successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Goal $goal)
    {
        return redirect()->route('mastery.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Goal $goal)
    {
        return redirect()->route('mastery.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Goal $goal)
    {
        if ($goal->user_id !== auth()->id()) {
            abort(403);
        }
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category_id' => 'nullable|exists:categories,id',
                'priority_id' => 'nullable|exists:priorities,id',
                'target_date' => 'nullable|date',
                'status' => 'required|in:pending,in_progress,completed',
            ]);

            $data = $validated;
            if ($data['status'] === 'completed' && $goal->status !== 'completed') {
                $data['completed_at'] = now();
            } elseif ($data['status'] !== 'completed') {
                $data['completed_at'] = null;
            }

            $goal->update($data);

            return redirect()->route('mastery.index')->with('success', 'Vision updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Goal $goal)
    {
        if ($goal->user_id !== auth()->id()) {
            abort(403);
        }
        $goal->delete();

        return redirect()->route('mastery.index')->with('success', 'Vision removed successfully.');
    }

    public function addMilestone(Request $request, Goal $goal)
    {
        if ($goal->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $goal->milestones()->create($validated);

        return redirect()->back()->with('success', 'Milestone added.');
    }

    public function toggleMilestone(Goal $goal, \App\Models\GoalMilestone $milestone, \App\Services\GamificationService $gamificationService)
    {
        if ($goal->user_id !== auth()->id()) {
            abort(403);
        }

        if ($milestone->goal_id !== $goal->id) {
            abort(404);
        }

        $wasCompleted = $milestone->is_completed;
        $milestone->update(['is_completed' => !$milestone->is_completed]);

        if ($milestone->is_completed && !$wasCompleted) {
            $gamificationService->awardXP(auth()->user(), 5);
        }

        return redirect()->back()->with('success', 'Milestone updated.');
    }

    public function deleteMilestone(Goal $goal, \App\Models\GoalMilestone $milestone)
    {
        if ($goal->user_id !== auth()->id()) {
            abort(403);
        }

        if ($milestone->goal_id !== $goal->id) {
            abort(404);
        }

        $milestone->delete();

        return redirect()->back()->with('success', 'Milestone removed.');
    }
}
