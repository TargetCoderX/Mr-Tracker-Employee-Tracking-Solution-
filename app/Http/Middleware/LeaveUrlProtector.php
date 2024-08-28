<?php

namespace App\Http\Middleware;

use App\Models\LeaveRequest;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LeaveUrlProtector
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $leaveid = $request->route('id');
        $getLeaveData = LeaveRequest::where('leave_UUID', $leaveid)->with('requestApproval')->first();
        if (!$request->hasValidSignature() || $getLeaveData->requestApproval)
            abort(410);
        else
            return $next($request);
    }
}
