<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequestApproval extends Model
{
    use HasFactory;
    protected $table = 'leave_request_approval';
    protected $fillable = [
        'leave_id',
        'account_id',
        'approved_by',
        'status',
        'approval_date',
        'reason',
    ];
}
