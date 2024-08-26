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
        Schema::table('leave_request_approval', function (Blueprint $table) {
            $table->renameColumn('action_talen_by', 'action_taken_by');
        });
        Schema::dropIfExists('user_leave_record');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_request_approval', function (Blueprint $table) {
            //
        });
    }
};
