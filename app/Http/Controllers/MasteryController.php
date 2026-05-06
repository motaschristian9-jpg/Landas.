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
        return Inertia::render('Mastery/Index', [
            'goals' => Goal::with(['category', 'priority', 'milestones'])
                ->where('user_id', auth()->id())
                ->orderBy('target_date', 'asc')
                ->get(),
            'categories' => \App\Models\Category::all(),
            'priorities' => \App\Models\Priority::all(),
        ]);
    }
}
