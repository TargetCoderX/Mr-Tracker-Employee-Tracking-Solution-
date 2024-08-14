<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectAssignee extends Model
{
    use HasFactory;
    protected $table = 'proejct_assignee';
    protected $fillable = [
        "account_id",
        "project_id",
        "user_id",
    ];

    public function userRelation()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
