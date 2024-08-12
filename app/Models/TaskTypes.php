<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskTypes extends Model
{
    use HasFactory;
    protected $table = 'task_types';
    protected $fillable = [
        'account_id',
        'task_type_name',
    ];
}
