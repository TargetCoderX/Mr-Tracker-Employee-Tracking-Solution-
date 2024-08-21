<?php

namespace App\Http\Controllers;

use App\Models\AccountLeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccountProfileController extends Controller
{
    public function profile()
    {
        $getLeaveDetails = $this->getAllLeaves();
        return Inertia::render('Profile/Profile', ["leavesAccount" => $getLeaveDetails]);
    }

    /* save account profile information */
    public function saveAccountProfile(Request $request)
    {
        try {
            $leavesSettings = $request->leaves;
            $response = $this->leaveAccount($leavesSettings);
            if ($response['status'] == 0)
                return response()->json($response);


            return response()->json([
                "status" => 1,
                "message" => "Account Profile Updated Successfully",
                "leaves" => $this->getAllLeaves(),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => 0,
                "message" => "Something went wrong",
                "error" => $th->getMessage(),
            ]);
        }
    }

    /* add leaves to account */
    public function leaveAccount($leaves)
    {
        try {
            AccountLeaveType::where("account_id", Auth::user()->account_id)->delete();
            foreach ($leaves as $key => $leave) {
                AccountLeaveType::create([
                    "account_id" => Auth::user()->account_id,
                    "leave_type" => $leave['leave_name'],
                    "leave_amount" => $leave['amount'],
                ]);
            }
            return [
                "status" => 1,
                "message" => "Leave Updated Successfully"
            ];
        } catch (\Throwable $th) {
            return [
                "status" => 0,
                "message" => "Something went wrong",
                "error" => $th->getMessage(),
            ];
        }
    }

    /* get all leaves for this account */
    public function getAllLeaves()
    {
        return AccountLeaveType::select('leave_type as leave_name', 'leave_amount as amount')->where('account_id', Auth::user()->account_id)->get();
    }
}
