<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class Task extends Model
{
    use HasFactory;
    protected $table = "tasks";
    protected $fillable = [
        "task_name",
        "task_description",
        "account_id",
        "created_by_user",
        "assigned_to_user",
        "dependent_users",
        "start_time_stamp",
        "end_time_stamp",
        "expected_total_time",
        "project_id",
        "board_id",
        "task_type",
        "task_id"
    ];
    public function task_type()
    {
        return $this->hasOne(TaskTypes::class, 'id', "task_type");
    }
    public function assigned_user()
    {
        return $this->hasOne(User::class, 'id', 'assigned_to_user');
    }

   /*  public function task_status($user_id, $date)
    {
        return TimeEntries::where('user_id', Auth::id())
            ->where('status', 'Active')
            ->whereNull('end_time')
            ->where('date', $date)
            ->exists();
    } */
    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->task_id)) {
                $model->task_id = (string) Str::uuid();
            }
        });
    }
}
