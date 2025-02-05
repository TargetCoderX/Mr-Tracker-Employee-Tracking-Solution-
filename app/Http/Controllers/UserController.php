<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use App\Models\User;
use App\Models\UserDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    /* show user list page */
    public function showUserList()
    {
        return Inertia::render('Users/UserList');
    }

    /* upload user using CSV */
    public function uploadUserCsv(Request $request)
    {
        $getFiles =  $request->file('files');
        foreach ($getFiles as $key => $file) {
            $path = $file->store('uploads');
            $fileData = $this->processCsv(Storage::path($path));
            if (
                array_key_exists("Email", $fileData[0]) &&
                array_key_exists("Role", $fileData[0]) &&
                array_key_exists("First name", $fileData[0]) &&
                array_key_exists("Last name", $fileData[0]) &&
                array_key_exists("Phone", $fileData[0])
            ) {
                $response = $this->insertIntoDatabase($fileData);
                if ($response == 0)
                    return response()->json(["status" => 0, "message" => "Something went wrong"]);
            } else
                return response()->json(["status" => 0, "message" => "First name,Last name,Email,Role,Phone field must be include in CSV"]);
            Storage::delete($path); // Delete the file after processing
        }
        $getNewUsers = $this->getAllUsers();
        return response()->json(["status" => 1, "message" => "New Users Created Successfully", "users" => $getNewUsers]);
    }

    /* process csv and build array */
    public function processCsv($csvPath)
    {
        $csvData = [];
        if (($handle = fopen($csvPath, 'r')) !== false) {
            $header = null;
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (!$header) {
                    $header = $row; // Save the header row
                } else {
                    $csvData[] = array_combine($header, $row); // Combine header with row values
                }
            }
            fclose($handle);
        }
        return $csvData;
    }

    /* insert database */
    public function insertIntoDatabase($fileData)
    {
        try {
            /* entry user and save user details json */
            array_map(function ($row) {
                $getRole = Roles::select("id")->where('role_name', 'like', '%' . $row['Role'] . '%')->where('account_id', Auth::user()->account_id)->first();
                if (!$getRole) {
                    $getRole = Roles::create(['role_name' => $row['Role'], "account_id" => Auth::user()->account_id]);
                }
                $getRoleId = $getRole->id;
                $userData = [
                    'first_name' => $row['First name'],
                    'last_name' => $row['Last name'],
                    'email' => $row['Email'],
                    'password' => Hash::make("welcome!"),
                    'is_active' => 1,
                    'role' => $getRoleId ?? "",
                    'account_id' => Auth::user()->account_id,
                    'is_account_details' => 1,
                    'phone' => preg_replace("/[^0-9]/", "", $row['Phone']),
                ];
                $lastUserData = User::create($userData);
                /*    unset($row['First name']);
                unset($row['Last name']);
                unset($row['Email']);
                unset($row['Role']);
                unset($row['Phone']);
                UserDetails::create([
                    "account_id" => Auth::user()->account_id,
                    "user_id" => $lastUserData->id,
                    "user_details_json" => json_encode($row),
                ]); */
            }, $fileData);
            return 1;
        } catch (\Throwable $th) {
            // dd($th->getMessage());
            return 0;
        }
    }

    /* get all user of this account */
    public function getAllUsers()
    {
        $users = User::where('account_id', Auth::user()->account_id)->orderBy('id', 'desc')->with('roleRelation')->paginate(10);
        return $users;
    }

    /* manually save users */
    public function manuallySaveUsers(Request $request)
    {
        try {
            $userData = [
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make("welcome!"),
                'is_active' => 1,
                'role' => $request->role,
                'account_id' => Auth::user()->account_id,
                'is_account_details' => 1,
                'phone' => preg_replace("/[^0-9]/", "", $request->phone),
            ];
            User::create($userData);
            $getAllUsers = $this->getAllUsers();
            return response()->json(["status" => 1, "message" => "User Created Successfully", "users" => $getAllUsers]);
        } catch (\Throwable $th) {
            return response()->json(["status" => 0, "message" => "Something went wrong", "error" => $th->getMessage()]);
        }
    }

    /* update user data */
    public function updateUserData(Request $request)
    {
        $findUser = User::find($request->id);
        if ($findUser) {
            $findUser->first_name = $request->first_name;
            $findUser->last_name = $request->last_name;
            $findUser->email = $request->email;
            $findUser->role = $request->role;
            $findUser->phone = $request->phone;
            $findUser->is_active = $request->is_active;
            $status = $findUser->save();
            $getAllUsers = $this->getAllUsers();
            if ($status)
                return response()->json(["status" => 1, "message" => "User updated successfully", "users" => $getAllUsers]);
            else
                return response()->json(["status" => 0, "message" => "Something went wrong", "users" => $getAllUsers]);
        } else {
            return response()->json(["status" => 0, "message" => "User not found"]);
        }
    }

    /* user view */
    public function editUser($user_id)
    {
        $decryptedId = Crypt::decrypt($user_id);
        return Inertia::render('Users/UserView');
    }
}
