<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeEntries extends Model
{
    use HasFactory;
    protected $table = 'time_entries';
    protected $fillable = [
        "user_id",
        "account_id",
        "project_id",
        "task_id",
        "start_time",
        "end_time",
        "total_hours",
        "date",
        "week",
        "month",
        "year",
        "status",
    ];
}
