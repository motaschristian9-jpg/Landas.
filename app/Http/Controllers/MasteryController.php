<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasteryController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        return Inertia::render('Mastery/Index', [
            'goals' => Goal::with(['category', 'priority', 'milestones'])
                ->where('user_id', $user->id)
                ->orderBy('target_date', 'asc')
                ->paginate(4),
            'total_completed' => Goal::where('user_id', $user->id)
                ->where('status', 'completed')
                ->count(),
            'categories' => \App\Models\Category::all(),
            'priorities' => \App\Models\Priority::all(),
        ]);
    }
}
