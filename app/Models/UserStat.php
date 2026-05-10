<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStat extends Model
{
    protected $fillable = ['user_id', 'xp', 'level', 'badges'];

    protected $casts = [
        'badges' => 'array',
    ];

    protected $attributes = [
        'xp' => 0,
        'level' => 1,
        'badges' => '[]',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
