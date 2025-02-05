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
        Schema::create('leave_request_approval', function (Blueprint $table) {
            $table->id();
            $table->integer('leave_id');
            $table->string('account_id');
            $table->integer('action_talen_by');
            $table->string('status');
            $table->string('action_date');
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_request_approval');
    }
};
