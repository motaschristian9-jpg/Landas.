<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'priority',
        'time_slot',
        'estimated_minutes',
        'is_completed',
        'due_date',
        'completed_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
