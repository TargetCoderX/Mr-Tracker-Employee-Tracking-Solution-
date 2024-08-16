<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveManagementController extends Controller
{
    /* member leave page show */
    public function showMemberLeavePage()
    {
        return Inertia::render('Leave_Management/Member_leave/MemberLeave');
    }
}
