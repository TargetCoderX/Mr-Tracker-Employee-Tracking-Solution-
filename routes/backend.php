<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->as('api.')->group(function () {

    /* non authenticated routes */
    Route::post("/login", [AuthenticationController::class, "doLogin"])->name('login');
    Route::post("/register", [AuthenticationController::class, "doRegister"])->name('register');

    Route::middleware('auth')->group(function () {

        /* auth controller group */
        Route::controller(AuthenticationController::class)->group(function () {
            Route::post("/save-account-information", "saveAccountInformation")->name("save-account-information");
            Route::get("/logout", "logout")->name("logout");
        });

        /* roles controller group */
        Route::controller(RolesController::class)->group(function () {
            Route::get("all-roles", "getAllRoles")->name("all-roles");
            Route::post("save-roles", "saveRoles")->name("save-roles");
            Route::post("delete-roles", "deleteRoles")->name("delete-roles");
        });

        /* usees controller group */
        Route::controller(UserController::class)->group(function () {
            Route::get("/get-all-users", 'getAllUsers')->name("get-all-users");
            Route::post("/manually-save-users", 'manuallySaveUsers')->name("manually-save-users");
            Route::patch("/update-user", 'updateUserData')->name("update-user");
            Route::post("/upload-user-csv", "uploadUserCsv")->name("upload-user-csv");
        });

        /* projects controller group */
        Route::controller(ProjectsController::class)->group(function () {
            Route::get("/get-all-projects", "getAllProject")->name('get-all-projects');
            Route::post('/save-project', 'saveProjects')->name('save-project');
            Route::post('/delete-project', 'deleteProjects')->name('delete-project');
            Route::post('/save-board', 'saveBoards')->name('save-board');
            Route::put('/delete-board', 'deleteBoard')->name('delete-board');
            Route::post('/save-task', 'saveTasks')->name('save-task');
            Route::post('/delete-task', 'deleteTasks')->name('delete-task');
            Route::put('/update-task-board', 'updateTaskBoard')->name('update-task-board');
            Route::post("add-users-project", 'addUsersProject')->name('add-users-project');
            Route::post("remove-users-project", 'removeUsersProject')->name('remove-users-project');
        });
    });
});
