<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string("project_id");
            $table->uuid("task_id")->unique();
            $table->string("account_id")->nullable();
            $table->integer("created_by_user")->nullable();
            $table->string("assigned_to_user")->nullable();
            $table->string("dependent_users")->nullable();
            $table->string("start_time_stamp")->nullable();
            $table->string("end_time_stamp")->nullable();
            $table->string("expected_total_time")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
