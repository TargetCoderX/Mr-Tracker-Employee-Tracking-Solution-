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
        Schema::create('holiday_lists', function (Blueprint $table) {
            $table->id();
            $table->string("account_id");
            $table->string("added_by_user");
            $table->string("from_date");
            $table->string("to_date");
            $table->string("year");
            $table->string("holiday_name");
            $table->string("holiday_description")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('holiday_lists');
    }
};
