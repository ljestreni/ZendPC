<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedConfig extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'configuration', 'total_price'];

    protected $casts = [
        'configuration' => 'array',
        'total_price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
