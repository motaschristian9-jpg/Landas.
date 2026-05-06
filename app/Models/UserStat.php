<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStat extends Model
{
    protected $fillable = ['user_id', 'xp', 'level', 'badges'];

    protected $casts = [
        'badges' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
