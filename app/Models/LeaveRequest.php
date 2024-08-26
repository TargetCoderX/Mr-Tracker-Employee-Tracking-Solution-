<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class LeaveRequest extends Model
{
    use HasFactory;
    protected $table = 'leave_request';
    protected $fillable = [
        'user_id',
        'account_id',
        'start_date',
        'end_date',
        'leave_type',
        'leave_shift',
        'reason_of_leave',
        'days',
    ];

    public function requestApproval()
    {
        return $this->hasOne(LeaveRequestApproval::class, 'leave_id', 'id');
    }
    public function leaveType()
    {
        return $this->hasOne(AccountLeaveType::class, 'id', 'leave_type');
    }
    public function userData()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->leave_UUID)) {
                $model->leave_UUID = (string) Str::uuid();
            }
        });
    }
}
