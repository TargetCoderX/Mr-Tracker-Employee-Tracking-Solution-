<?php

use App\Http\Controllers\AuthenticationController;
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
            Route::get("/manually-save-users", 'manuallySaveUsers')->name("manually-save-users");
            Route::post("/upload-user-csv", "uploadUserCsv")->name("upload-user-csv");
        });
    });
});
