<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $yable = "tasks";
    protected $fillable = [
        "account_id",
        "created_by_user",
        "assigned_to_user",
        "dependent_users",
        "start_time_stamp",
        "end_time_stamp",
        "expected_total_time",
    ];
}
