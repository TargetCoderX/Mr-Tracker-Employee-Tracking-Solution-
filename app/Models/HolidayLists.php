<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HolidayLists extends Model
{
    use HasFactory;
    protected $fillable = [
        "account_id",
        "added_by_user",
        "from_date",
        "to_date",
        "holiday_name",
        "holiday_description",
        "year",
    ];
}
