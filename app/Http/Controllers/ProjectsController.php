<?php

namespace App\Http\Controllers;

use App\Models\Projects;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectsController extends Controller
{
    /* go to projects page */
    public function gotoProjectPage()
    {
        return Inertia::render('Projects/Projects');
    }

    /* get all projects */
    public function getAllProject()
    {
        try {
            $getProjects = new Projects();
            if (Auth::user()->role == 0)
                $getProjects->where('account_id', Auth::user()->account_id);
            else
                $getProjects->where('account_id', Auth::user()->account_id)->where("project_assigned_to_id", Auth::id());

            $getAssignedProjects = $getProjects->with('userDetails')->get();
            $getAllUsers = User::where('account_id', Auth::user()->account_id)->get();
            return response()->json([
                "status" => 1,
                "message" => "",
                "projects" => $getAssignedProjects,
                "users" => $getAllUsers,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => 0,
                "message" => "Something Went Wrong",
                "projects" => [],
            ]);
        }
    }

    /* save projects */
    public function saveProjects(Request $request)
    {
        try {
            Projects::create([
                "project_name" => $request->project_name,
                "project_assigned_to_id" => $request->assignee,
                "project_creation_date" => $request->start_date,
                "project_deadline" => $request->end_date,
                'account_id' => Auth::user()->account_id,
            ]);
            $getallProjects = $this->getAllProject();
            return response()->json([
                "status" => 1,
                "message" => "Project created successfully",
                "projects" => $getallProjects,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => 0,
                "message" => "Something went wrong",
                "error" => $th->getMessage(),
            ]);
        }
    }
}
