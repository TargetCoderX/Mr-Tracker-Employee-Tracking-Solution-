<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountProfileController extends Controller
{
    public function profile()
    {
        return Inertia::render('Profile/Profile');
    }
}
