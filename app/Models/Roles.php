<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    use HasFactory;
    protected $table = 'roles';
    protected $fillable = [
        "account_id",
        "role_name",
    ];

    public function setRoleNameAttribute($value)
    {
        $this->attributes['role_name'] = trim(ucwords($value));
    }
}
