<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RolesController extends Controller
{
    public function showRoles(Request $request)
    {
        return Inertia::render('Roles/Roles');
    }

    /* save roles */
    public function saveRoles(Request $request)
    {
        $accountId = Auth::user()->account_id;
        try {
            $checkIfExist = Roles::where("account_id", $accountId)
                ->whereRaw("LOWER(role_name)=?", [strtolower($request->roleText)])
                ->first();
            if (!$checkIfExist) {
                if ($request->action == "new") {
                    Roles::create(["role_name" => $request->roleText, "account_id" => $accountId]);
                } else if ($request->action == "edit") {
                    $getRole = Roles::find($request->editedId);
                    $getRole->role_name = $request->roleText;
                    $getRole->save();
                }
                $allRoles =  $this->getAllRoles();
                return response()->json(["status" => 1, "roles" => $allRoles]);
            } else {
                return response()->json(["status" => 0, "message" => "Role already exists for this account"]);
            }
        } catch (\Throwable $th) {
            return response()->json(["status" => 0, "message" => "Something went wrong"]);
        }
    }

    /* get all role for this account */
    public function getAllRoles()
    {
        return Roles::where("account_id", Auth::user()->account_id)->get();
    }

    /* delete roles */
    public function deleteRoles(Request $request)
    {
        if ($request->has("role_id")) {
            try {
                Roles::find($request->role_id)->delete();
                $getRole = $this->getAllRoles();
                return response()->json(["status" => 1, "roles" => $getRole]);
            } catch (\Throwable $th) {
                return response()->json(["status" => 0, "message" => "Cannot delete the role,Something went wrong"]);
            }
        }
    }
}
