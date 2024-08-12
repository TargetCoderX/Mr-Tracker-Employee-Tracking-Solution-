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
        "sort_order",
        "board_name",
    ];
}
