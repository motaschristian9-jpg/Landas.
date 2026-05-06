<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Todo;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $showHistory = $request->has('history');
        
        $query = Auth::user()->todos();

        if (!$showHistory) {
            // Fresh Start: Only show incomplete or completed today
            $query->where(function($q) {
                $q->where('is_completed', false)
                  ->orWhereDate('completed_at', \Carbon\Carbon::today());
            });
        } else {
            // History: Only show completed tasks from before today
            $query->where('is_completed', true)
                  ->whereDate('completed_at', '<', \Carbon\Carbon::today());
        }

        $todos = $query->latest()->get();
        $goals = Auth::user()->goals()->where('status', '!=', 'completed')->get();
        
        return \Inertia\Inertia::render('Todos/Index', [
            'todos' => $todos,
            'goals' => $goals,
            'showingHistory' => $showHistory
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|string|in:low,medium,high',
            'time_slot' => 'nullable|string|in:morning,afternoon,evening',
            'estimated_minutes' => 'nullable|integer|min:1',
        ]);

        Auth::user()->todos()->create($validated);

        return redirect()->back()->with('success', 'Task added successfully.');
    }

    public function update(Request $request, Todo $todo, \App\Services\GamificationService $gamificationService)
    {
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $wasCompleted = $todo->is_completed;
        
        $todo->update($request->only(['title', 'priority', 'time_slot', 'estimated_minutes', 'is_completed', 'due_date']));

        if ($request->has('is_completed')) {
            $todo->update(['completed_at' => $todo->is_completed ? now() : null]);
            
            if ($todo->is_completed && !$wasCompleted) {
                $gamificationService->awardXP(Auth::user(), 10);
            }
        }

        return redirect()->back()->with('success', 'Task updated.');
    }

    public function destroy(Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }
        
        $todo->delete();

        return redirect()->back()->with('success', 'Task deleted.');
    }
}
