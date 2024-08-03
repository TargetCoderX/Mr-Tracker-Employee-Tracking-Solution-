<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetails extends Model
{
    use HasFactory;
    protected $table = "users_details";
    protected $fillable = [
        'account_id',
        'user_id',
        'user_details_json',
    ];
}
