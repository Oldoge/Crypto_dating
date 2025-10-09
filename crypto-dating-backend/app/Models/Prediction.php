<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    protected $fillable = [
        'user_id',
        'client_id',
        'coin_id',
        'type',
        'payload',
        'score',
    ];

    protected $casts = [
        'payload' => 'array',
        'score' => 'decimal:3',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
