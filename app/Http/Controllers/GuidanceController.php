<?php

namespace App\Http\Controllers;

use App\Models\PathGuidance;
use Illuminate\Http\Request;

class GuidanceController extends Controller
{
    public function acknowledge(PathGuidance $guidance)
    {
        // Ensure user owns this guidance
        if ($guidance->user_id !== auth()->id()) {
            abort(403);
        }

        $guidance->update(['acknowledged_at' => now()]);

        return back();
    }
}
