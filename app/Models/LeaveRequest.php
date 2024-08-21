<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];
}
