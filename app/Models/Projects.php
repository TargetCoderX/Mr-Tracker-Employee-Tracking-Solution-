<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Projects extends Model
{
    use HasFactory;
    protected $table = 'projects';
    protected $fillable = [
        "project_name",
        "project_assigned_to_id",
        "project_creation_date",
        "project_deadline",
        "account_id",
    ];

    public function userDetails()
    {
        return $this->hasOne(User::class, 'id', 'project_assigned_to_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->project_id)) {
                $model->project_id = (string) Str::uuid();
            }
        });
    }
}
