<?php

namespace App\Http\Controllers;

use App\Models\AccountInformation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AuthenticationController extends Controller
{
    /* show login */
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    /* do login */
    public function doLogin(Request $request)
    {
        if (Auth::attempt(["email" => $request->email, "password" => $request->password])) {
            return response()->json(["status" => 1, "message" => "User Loggedin Successfully", "user" => Auth::user()]);
        } else {
            return response()->json(["status" => 0, "message" => "User Not found"]);
        }
    }

    /* register */
    public function showRegister(Request $request)
    {
        return Inertia::render("Auth/Register");
    }

    public function doRegister(Request $request)
    {
        $validated = $request->validate([
            "first_name" => "required",
            "last_name" => "required",
            'email' => 'required|unique:users',
            'password' => 'required|min:8|confirmed',
            'password_confirmation' => 'required',
        ]);

        if ($validated) {
            try {
                User::create([
                    "first_name" => $request->first_name,
                    "last_name" => $request->last_name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'account_id' => Str::uuid()
                ]);
                Auth::attempt(["email" => $request->email, "password" => $request->password]);
                return response()->json(["status" => 1, "message" => "New Account Created Successfully"]);
            } catch (\Throwable $th) {
                return response()->json(["status" => 0, "message" => "Something Went Wrong"]);
                // return $th->getMessage();
            }
        }
    }

    /* save account information */
    public function saveAccountInformation(Request $request)
    {
        $inputs = $request->all();
        $inputs['account_id'] = Auth::user()->account_id;
        try {
            if (AccountInformation::create($inputs)) {
                $user = User::find(Auth::id());
                $user->is_account_details = 1;
                $user->save();
            } else {
                return response()->json(["status" => 0, "message" => "Something went wrong, Please contact Customer Care"]);
            }
            return response()->json(["status" => 1, "message" => "Account Information Added Successfully"]);
        } catch (\Throwable $th) {
            return response()->json(["status" => 0, "message" => "Something went wrong, Please contact Customer Care"]);
        }
    }

    /* logout */
    public function logout()
    {
        if (Auth::check())
            Auth::logout();
        return redirect()->route("login");
    }

    /* show account details */
    public function showAccountDetails()
    {
        return Inertia::render("Auth/AccountInformation");
    }
}
