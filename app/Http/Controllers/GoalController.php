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
        $query = Goal::where('user_id', auth()->id())->with(['category', 'priority']);

        // Search filter
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'oldest': $query->oldest(); break;
            case 'deadline': $query->orderByRaw('target_date IS NULL, target_date ASC'); break;
            default: $query->latest(); break;
        }

        $goals = $query->paginate(10)->withQueryString();
        
        $categories = Category::all();
        $priorities = Priority::orderBy('level', 'asc')->get();
        
        return \Inertia\Inertia::render('Goals/Index', compact('goals', 'categories', 'priorities'));
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

        return redirect()->route('goals.index')->with('success', 'Goal created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Goal $goal)
    {
        $goal->load(['category', 'priority']);
        return \Inertia\Inertia::render('Goals/Show', compact('goal'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Goal $goal)
    {
        $categories = Category::all();
        $priorities = Priority::orderBy('level', 'asc')->get();
        return view('goals.edit', compact('goal', 'categories', 'priorities'));
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

            $goal->update($validated);

            return redirect()->route('goals.index')->with('success', 'Goal updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput()
                ->with('editing_id', $goal->id);
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

        return redirect()->route('goals.index')->with('success', 'Goal deleted successfully.');
    }
}
