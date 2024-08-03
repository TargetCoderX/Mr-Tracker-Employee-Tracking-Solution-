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
        Schema::create('account_details', function (Blueprint $table) {
            $table->id();
            $table->string('account_id');
            $table->string("account_name");
            $table->string("company_name");
            $table->string("phone_number");
            $table->string("country");
            $table->string("state");
            $table->string("city");
            $table->string("address");
            $table->string("pin_code");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_details');
    }
};
