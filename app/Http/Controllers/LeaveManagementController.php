<?php

namespace App\Http\Controllers;

use App\Models\AccountLeaveType;
use App\Models\LeaveRequest;
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
        return AccountLeaveType::select('leave_type as leave_name', 'leave_amount as amount', 'id')->where('account_id', Auth::user()->account_id)->get();
    }

    /* save member leave */
    public function saveMemberLeave(Request $request)
    {
        if ($request->action == 'add') {
            return response()->json($this->saveLeave($request));
        }
    }

    /* save leave */
    public function saveLeave($request)
    {
        try {
            LeaveRequest::create([
                'user_id' => Auth::id(),
                'account_id' => Auth::user()->account_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'leave_type' => $request->leave_type,
                'leave_shift' => $request->leave_shift,
                'reason_of_leave' => $request->reason_of_leave,
            ]);
            return [
                "status" => 1,
                "message" => "Leave applied, and pending for approval"
            ];
        } catch (\Throwable $th) {
            return [
                "status" => 0,
                "message" => $th->getMessage(),
            ];
        }
    }
}
