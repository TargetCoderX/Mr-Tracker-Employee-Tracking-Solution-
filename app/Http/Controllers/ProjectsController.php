<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Projects;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use SebastianBergmann\CodeCoverage\Report\Xml\Project;

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
            $getProjects = Projects::query();
            if (Auth::user()->role == 0)
                $getProjects->where('account_id', Auth::user()->account_id);
            else
                $getProjects->where('account_id', Auth::user()->account_id)->where("project_assigned_to_id", Auth::id());

            $getAssignedProjects = $getProjects->with('userDetails')->get()->groupBy('project_id')->map(function ($project) {
                return $project->first();
            })
                ->values()
                ->toArray();
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
            $projectId = Str::uuid();
            foreach ($request->assignee as $key => $assignedto) {
                Projects::create([
                    "project_name" => $request->project_name,
                    "project_assigned_to_id" => $assignedto['value'],
                    "project_creation_date" => $request->start_date,
                    "project_deadline" => $request->end_date,
                    'account_id' => Auth::user()->account_id,
                    'project_id' => $projectId,
                ]);
            }
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

    /* show kanban board */
    public function showKanbanBoard($project_id)
    {
        $boards = $this->getBoards();

        return Inertia::render("Projects/Kanban");
    }

    /* get tasks */
    public function getTasks($project_id) {}

    /* get boards */
    public function getBoards()
    {
        return Board::where("account_id", Auth::user()->account_id)->get();
    }
}
