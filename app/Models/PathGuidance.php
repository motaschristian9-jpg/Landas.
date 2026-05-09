<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PathGuidance extends Model
{
    protected $fillable = [
        'user_id',
        'message',
        'signals_snapshot',
        'acknowledged_at',
    ];

    protected $casts = [
        'signals_snapshot' => 'array',
        'acknowledged_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
