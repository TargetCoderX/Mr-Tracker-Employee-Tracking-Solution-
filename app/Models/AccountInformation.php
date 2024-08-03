<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountInformation extends Model
{
    use HasFactory;
    protected $table = 'account_details';
    protected $fillable = [
        "account_id",
        "account_name",
        "company_name",
        "phone_number",
        "country",
        "state",
        "city",
        "address",
        "pin_code",
    ];
}
