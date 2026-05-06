<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Todo;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    public function index()
    {
        $todos = Auth::user()->todos()->latest()->get();
        return \Inertia\Inertia::render('Todos/Index', compact('todos'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'due_date' => 'nullable|date',
        ]);

        Auth::user()->todos()->create($validated);

        return redirect()->back()->with('success', 'Task added successfully.');
    }

    public function update(Request $request, Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $todo->update([
            'is_completed' => $request->has('is_completed') ? $request->is_completed : !$todo->is_completed,
        ]);

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
