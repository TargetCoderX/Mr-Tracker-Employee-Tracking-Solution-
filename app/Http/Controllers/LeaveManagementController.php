<?php

namespace App\Http\Controllers;

use App\Mail\leaveApprovalMail;
use App\Mail\leaveRequestApproveMail;
use App\Models\AccountLeaveType;
use App\Models\HolidayLists;
use App\Models\LeaveRequest;
use App\Models\LeaveRequestApproval;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class LeaveManagementController extends Controller
{
    /* member leave page show */
    public function showMemberLeavePage()
    {
        $getAllLeaveTypes = $this->getAllLeaves();
        $getMemberLeaveList = $this->memberLeaveList();
        return Inertia::render('Leave_Management/Member_leave/MemberLeave', ['accountLeaves' => $getAllLeaveTypes, 'requestedLeaves' => $getMemberLeaveList]);
    }

    /* get all leaves for this account */
    public function getAllLeaves()
    {
        $totalLeavesAndType = AccountLeaveType::select('leave_type as leave_name', 'leave_amount as amount', 'id')->where('account_id', Auth::user()->account_id)->get();

        $approvedLeaveDays = DB::table('leave_request_approval')
            ->select('account_leave_types.leave_type', DB::raw('SUM(leave_request.days) as total_used'))
            ->join('leave_request', 'leave_request_approval.leave_id', '=', 'leave_request.id')
            ->join('account_leave_types', 'leave_request.leave_type', '=', 'account_leave_types.id')
            ->where('leave_request_approval.account_id', Auth::user()->account_id)
            ->where('leave_request_approval.status', 'approved')
            ->groupBy('account_leave_types.leave_type')
            ->get();

        $remainingLeaves = $totalLeavesAndType->map(function ($leave) use ($approvedLeaveDays) {
            $usedLeave = $approvedLeaveDays->firstWhere('leave_type', $leave->leave_name);
            $leave->remaining_amount = $leave->amount - ($usedLeave->total_used ?? 0);
            return $leave;
        });

        return $remainingLeaves;
    }

    /* leave list with status */
    public function memberLeaveList()
    {
        $getLeaves = LeaveRequest::where("account_id", Auth::user()->account_id)
            ->where('user_id', Auth::id())
            ->with(['requestApproval', 'leaveType'])
            ->get();
        return $getLeaves;
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
            $dayDiff = 0.5;
            $leaveShift = ucwords(str_replace('_', " ", $request->leave_shift));
            if ($request->leave_shift == 'full_day') {
                $date1 = Carbon::parse($request->start_date);
                $date2 = Carbon::parse($request->end_date);
                $dayDiff = $date1->diffInDays($date2);
            }

            $leaveRecord = LeaveRequest::create([
                'user_id' => Auth::id(),
                'account_id' => Auth::user()->account_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'leave_type' => $request->leave_type,
                'leave_shift' => $request->leave_shift,
                'reason_of_leave' => $request->reason_of_leave,
                'days' => $dayDiff,
            ]);
            $data = [
                "leave_id" => $leaveRecord->leave_UUID,
                "requester_first_name" => Auth::user()->first_name,
                "requester_last_name" => Auth::user()->last_name,
                "start_date" => $request->start_date,
                "end_date" => $request->end_date,
                "leave_type" => $request->leave_type,
                "leave_shift" => $leaveShift,
                "reason_of_leave" => $request->reason_of_leave,
                "total_days" => $dayDiff,
                "link" => URL::temporarySignedRoute(
                    'approve-leave',
                    Carbon::now()->addDays(5),
                    ['id' => $leaveRecord->leave_UUID]
                )
            ];
            $mail = config('constraints.development_mail_id');
            if (env('APP_ENV') == 'production')
                $mail = strtolower(Auth::user()->email);

            Mail::to($mail)->send(new leaveApprovalMail($data));
            $getAllLeaveTypes = $this->getAllLeaves();
            $getMemberLeaveList = $this->memberLeaveList();
            return [
                "status" => 1,
                "message" => "Leave applied, and pending for approval",
                "getAllLeaveTypes" => $getAllLeaveTypes,
                "getMemberLeaveList" => $getMemberLeaveList,
            ];
        } catch (\Throwable $th) {
            return [
                "status" => 0,
                "message" => $th->getMessage(),
            ];
        }
    }

    /* leave approve */
    public function approveLeave($leave_uuid)
    {
        return redirect()->route('leave-requests', ['uuid' => $leave_uuid]);
    }

    /* leave requests */
    public function leaveRequests()
    {
        return Inertia::render('Leave_Management/Leave_requests/LeaveRequests');
    }

    /* get leave details */
    public function getLeaveDetails($uuid)
    {
        try {
            $getLeave = LeaveRequest::where('leave_UUID', $uuid)
                ->with(['requestApproval', 'leaveType', 'userData'])
                ->first();
            if ($getLeave->exists())
                return response()->json(['status' => 1, 'message' => "", 'data' => $getLeave]);
            else
                return response()->json(['status' => 0, 'message' => "Something went wrong"]);
        } catch (\Throwable $th) {
            return response()->json(['status' => 0, 'message' => "Something went wrong", "error" => $th->getMessage()]);
        }
    }

    /* action leave */
    public function actionLeave(Request $request)
    {
        try {
            $getLeave = LeaveRequest::where('leave_UUID', $request->leave_id)->with(['userData', 'leaveType'])->first();
            if ($getLeave) {
                LeaveRequestApproval::create([
                    'leave_id' => $getLeave->id,
                    'account_id' => Auth::user()->account_id,
                    'action_taken_by' => Auth::id(),
                    'status' => $request->action == 'approve' ? 'approved' : 'rejected',
                    'action_date' => Carbon::today()->toDateString(),
                    'reason' => "",
                ]);
                $data = [
                    "user" => $getLeave->userData,
                    "action_user" => Auth::user(),
                    "action" => $request->action == 'approve' ? 'Approved' : 'Rejected',
                    "leave_data" => $getLeave,
                ];
                $mail = config('constraints.development_mail_id');
                if (env('APP_ENV') == 'production')
                    $mail = strtolower($getLeave->userData->email);
                Mail::to($mail)->send(new leaveRequestApproveMail($data));
            }
            return response()->json([
                "status" => 1,
                "message" => "Leave Request Approved",
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => 0,
                "message" => "Something went wrong",
                "error" => $th->getMessage(),
            ]);
        }
    }

    // delete leave request
    public function deleteLeaveRequests($id)
    {
        try {
            $getLeave = LeaveRequest::where('leave_UUID', $id);
            if ($getLeave->exists()) {
                $getLeave->delete();
                $getAllLeaveTypes = $this->getAllLeaves();
                $getMemberLeaveList = $this->memberLeaveList();
                return response()->json([
                    "status" => 1,
                    "message" => "Leave Request Deleted",
                    "getAllLeaveTypes" => $getAllLeaveTypes,
                    "getMemberLeaveList" => $getMemberLeaveList,
                ]);
            } else {
                return response()->json([
                    "status" => 0,
                    "message" => "Something went wrong",
                ]);
            }
        } catch (\Throwable $th) {
            return response()->json([
                "status" => 0,
                "message" => "Something went wrong",
                "error" => $th->getMessage(),
            ]);
        }
    }

    /* show holiday page */
    public function holidayPageShow()
    {
        $evnets = $this->getAllEvents();
        return Inertia::render('Leave_Management/Holiday_list/HolidayList', ["getEvents" => $evnets]);
    }

    /* save holiday leaves */
    public function createHolidayList(Request $request)
    {
        try {
            if (count($request->listArray) > 0) {
                /* delete all leave for the selected year and re enter */
                HolidayLists::where('account_id', Auth::user()->account_id)
                    ->where('year', $request->year)
                    ->delete();
                /* re-enter the values */
                foreach ($request->listArray as $key => $holiday) {
                    HolidayLists::create([
                        "account_id" => Auth::user()->account_id,
                        "added_by_user" => Auth::id(),
                        "from_date" => $holiday['start'] ?? '',
                        "to_date" => $holiday['end'] ?? '',
                        "holiday_name" => $holiday['title'] ?? '',
                        "holiday_description" => $holiday['description'] ?? '',
                        "year" => $request->year,
                    ]);
                }
            }
            return response()->json([
                "status" => 1,
                "message" => "Holiday List Updated",
                "events" => $this->getAllEvents(),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => 1,
                "message" => "",
                "error" => $th->getMessage(),
                "events" => $this->getAllEvents(),
            ]);
        }
    }

    /* public function get all events */
    public function getAllEvents()
    {
        return HolidayLists::select("to_date as end", "from_date as start", "holiday_name as title")->where('account_id', Auth::user()->account_id)->get();
    }
}
