<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Priority extends Model
{
    protected $fillable = ['name', 'level', 'color'];

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }
}
