<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountLeaveType extends Model
{
    use HasFactory;
    protected $table = "account_leave_types";
    protected $fillable = [
        "account_id",
        "leave_type",
        "leave_amount",
    ];
}
