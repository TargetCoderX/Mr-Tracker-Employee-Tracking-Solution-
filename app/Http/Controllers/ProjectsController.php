<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Projects;
use App\Models\Task;
use App\Models\TaskTypes;
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

            $getAssignedProjects = $getProjects->with('userDetails')->orderby('id', 'desc')->get()->groupBy('project_id')->map(function ($project) {
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
        $boards = $this->getBoards($project_id);
        $taskTypes = $this->getTaskTypes();
        $getAssignedUsers = $this->getProjectUsers($project_id);
        return Inertia::render("Projects/Kanban", [
            "project_boards" => $boards,
            "project_id" => $project_id,
            "task_types" => $taskTypes,
            "assigned_users" => $getAssignedUsers,
        ]);
    }

    /* get tasks */
    public function getTasks($project_id) {}

    /* save tasks */
    public function saveTasks(Request $request)
    {
        try {
            if (isset($request->task_type['__isNew__']) && $request->task_type['__isNew__'] == true) {
                /* create new task type */
                $checkIfExist = TaskTypes::where('task_type_name', strtolower($request->task_type['value']))
                    ->where('account_id', Auth::user()->account_id)
                    ->first();
                $taskTypeId = "";
                if (!$checkIfExist) {
                    $taskTypeId = TaskTypes::create([
                        "account_id" => Auth::user()->account_id,
                        "task_type_name" => $request->task_type['value'],
                    ])->id;
                } else {
                    $taskTypeId = $checkIfExist->id;
                }
            } else {
                $taskTypeId = $request->task_type['value'];
            }

            Task::create([
                "task_name" => $request->task_name,
                "task_description" => $request->task_description,
                "account_id" => Auth::user()->account_id,
                "created_by_user" => Auth::id(),
                "assigned_to_user" => $request->assigned_user['value'],
                "dependent_users" => json_encode($request->dependent_users),
                "start_time_stamp" => $request->task_start_date,
                "end_time_stamp" => $request->task_end_date,
                "expected_total_time" => $request->total_day,
                "project_id" => $request->project_id,
                "board_id" => $request->board_id,
                "task_type" => $taskTypeId,
            ]);
            $boards = $this->getBoards($request->project_id);
            $taskTypes = $this->getTaskTypes();
            $getAssignedUsers = $this->getProjectUsers($request->project_id);

            return response()->json([
                "status" => 1,
                "message" => "Task Created",
                "boards" => $boards,
                "task_types" => $taskTypes,
                "assigned_users" => $getAssignedUsers,

            ]);
        } catch (\Throwable $th) {
            $boards = $this->getBoards($request->project_id);
            $taskTypes = $this->getTaskTypes();
            $getAssignedUsers = $this->getProjectUsers($request->project_id);

            return response()->json([
                "status" => 0,
                "message" => "Something went wrong",
                "boards" => $boards,
                "task_types" => $taskTypes,
                "assigned_users" => $getAssignedUsers,

                "error" => $th->getMessage(),
            ]);
        }
    }

    /* get boards */
    public function getBoards($project_id)
    {
        return Board::where("account_id", Auth::user()->account_id)
            ->where('project_id', $project_id)
            ->orderBy('id', 'asc')
            ->with(['tasks.task_type'])
            ->get();
    }

    /* save boards */
    public function saveBoards(Request $request)
    {
        try {
            Board::create([
                "board_name" => $request->board_name,
                "board_description" => $request->description,
                "project_id" => $request->project_id,
                "account_id" => Auth::user()->account_id,
            ]);
            $getAllBords = $this->getBoards($request->project_id);
            return response()->json([
                "status" => 1,
                "message" => "Board Created successfully",
                "boards" => $getAllBords,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => 0,
                "message" => "Soemthing went wrong",
                "error" => $th->getMessage(),
            ]);
        }
    }

    /* get task types */
    public function getTaskTypes()
    {
        return TaskTypes::select('id as value', 'task_type_name as label')->where('account_id', Auth::user()->account_id)->get();
    }

    /* get all project users */
    public function getProjectUsers($project_id)
    {
        try {
            return Projects::where("project_id", $project_id)
                ->with("userDetails")
                ->get()
                ->pluck('userDetails')
                ->flatten()
                ->unique('id');;
        } catch (\Throwable $th) {
            return [];
        }
    }

    /* update task board */
    public function updateTaskBoard(Request $request)
    {
        try {
            $findTask = Task::find($request->task_id);
            if ($findTask) {
                $findTask->board_id = $request->board_id;
                $findTask->save();
            }
            return response()->json([
                "status" => 1,
                "message" => "Task Updated Successfully",
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => 0,
                "message" => "Soemthing went wrong",
                "error" => $th->getMessage(),
            ]);
        }
    }

    /* delete board */
    public function deleteBoard(Request $request)
    {
        try {
            $findBoard = Board::find($request->board_id);
            $project_id = "";
            if ($findBoard) {
                if ($findBoard->account_id == Auth::user()->account_id) {
                    $project_id = $findBoard->project_id;
                    $findBoard->delete();

                    // delete tasks
                    Task::where('board_id', $request->board_id)->delete();
                }
            }
            $boards = $this->getBoards($project_id);
            $taskTypes = $this->getTaskTypes();
            $getAssignedUsers = $this->getProjectUsers($project_id);
            return response()->json([
                "status" => 1,
                "messgage" => "Board Deleted Successfully",
                "project_boards" => $boards,
                "task_types" => $taskTypes,
                "assigned_users" => $getAssignedUsers,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => 0,
                "messgage" => "Soemthing went wrong",
                "error" => $th->getMessage(),
            ]);
        }
    }

    /* delete task */
    public function deleteTasks(Request $request)
    {
        try {
            $getTask = Task::where('id', $request->task_id)->where('project_id', $request->project_id)->first();
            $getTask->delete();
            $boards = $this->getBoards($request->project_id);
            $taskTypes = $this->getTaskTypes();
            $getAssignedUsers = $this->getProjectUsers($request->project_id);
            return response()->json([
                "status" => 1,
                "message" => "Task deleted Successfully",
                "project_boards" => $boards,
                "task_types" => $taskTypes,
                "assigned_users" => $getAssignedUsers,
            ]);
        } catch (\Throwable $th) {
            $boards = $this->getBoards($request->project_id);
            $taskTypes = $this->getTaskTypes();
            $getAssignedUsers = $this->getProjectUsers($request->project_id);
            return response()->json([
                "status" => 0,
                "message" => "Soemthing went wrong",
                "error" => $th->getMessage(),
                "project_boards" => $boards,
                "task_types" => $taskTypes,
                "assigned_users" => $getAssignedUsers,
            ]);
        }
    }
}
