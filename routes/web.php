<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AccountDetailsForceFillup;
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
    Route::middleware(AccountDetailsForceFillup::class)->group(function(){
        Route::get("/account-information", [AuthenticationController::class,"showAccountDetails"])->name('account-information');

        /* users controller group */
        Route::controller(UserController::class)->group(function(){
            Route::get('/user-list','showUserList')->name('user-list');
        });

        /* roles controller group */
        Route::controller(RolesController::class)->group(function(){
            Route::get('/roles','showRoles')->name('roles');

        });

        /* testing routes */
        Route::get("/dashboard", function () {return Inertia::render("Dashboard");})->name('dashboard');
        Route::get("/kanban-board", function () {return Inertia::render("Projects/Kanban");})->name('kanban-board');
    });
});

require __DIR__ . '/backend.php';
