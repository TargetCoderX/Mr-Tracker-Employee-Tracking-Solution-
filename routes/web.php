<?php

use App\Http\Controllers\AccountProfileController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\LeaveManagementController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AccountDetailsForceFillup;
use App\Http\Middleware\kanbanBoardProtector;
use App\Models\AccountInformation;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


/* non authenticate route */
Route::middleware('guest')->group(function () {
    Route::get("/login", [AuthenticationController::class, 'showLogin'])->name('login');
    Route::get("/register", [AuthenticationController::class, 'showRegister'])->name('register');
});

/* authenticated routes */
Route::middleware('auth')->group(function () {
    Route::middleware(AccountDetailsForceFillup::class)->group(function () {
        Route::get("/account-information", [AuthenticationController::class, "showAccountDetails"])->name('account-information');

        /* users controller group */
        Route::controller(UserController::class)->group(function () {
            Route::get('/user-list', 'showUserList')->name('user-list');
        });

        /* roles controller group */
        Route::controller(RolesController::class)->group(function () {
            Route::get('/roles', 'showRoles')->name('roles');
        });

        /* projects controller group */
        Route::controller(ProjectsController::class)->group(function () {
            Route::get('/projects', 'gotoProjectPage')->name('projects');
            Route::get('/kanban-board/{project_id}', 'showKanbanBoard')->middleware(kanbanBoardProtector::class)->name('kanban-board');
        });

        /* leave management controller group */
        Route::controller(LeaveManagementController::class)->group(function () {
            Route::get('/member-leaves', 'showMemberLeavePage')->name('member-leaves');
        });

        /* profile controller group */
        Route::controller(AccountProfileController::class)->group(function () {
            Route::get('/account-profile', 'profile')->name('account-profile');
        });


        /* testing routes */
        Route::get("/dashboard", function () {
            return Inertia::render("Dashboard");
        })->name('dashboard');
    });
});

require __DIR__ . '/backend.php';
