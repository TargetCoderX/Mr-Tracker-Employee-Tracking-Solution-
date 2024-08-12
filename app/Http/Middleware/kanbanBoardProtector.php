<?php

namespace App\Http\Middleware;

use App\Models\Projects;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class kanbanBoardProtector
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $projectId = $request->route('project_id');
        if (Auth::user()->role != 0) {
            $checkIfprojctassigned = Projects::where('project_assigned_to_id', Auth::id())->first();
            if ($checkIfprojctassigned)
                return $next($request);
            else
                return back();
        } else {
            return $next($request);
        }
    }
}
