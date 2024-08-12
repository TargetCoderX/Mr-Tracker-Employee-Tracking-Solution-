<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    use HasFactory;
    protected $table = "boards";
    protected $fillable = [
        "account_id",
        "board_name",
        "project_id",
        "board_description",
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'board_id', 'id');
    }
}
