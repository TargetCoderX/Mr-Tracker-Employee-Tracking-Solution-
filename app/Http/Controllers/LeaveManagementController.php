<?php

namespace App\Http\Controllers;

use App\Models\AccountLeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaveManagementController extends Controller
{
    /* member leave page show */
    public function showMemberLeavePage()
    {
        $getAllLeaveTypes = $this->getAllLeaves();
        return Inertia::render('Leave_Management/Member_leave/MemberLeave', ['accountLeaves' => $getAllLeaveTypes]);
    }

    /* get all leaves for this account */
    public function getAllLeaves()
    {
        return AccountLeaveType::select('leave_type as leave_name', 'leave_amount as amount')->where('account_id', Auth::user()->account_id)->get();
    }
}
