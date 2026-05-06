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
        Schema::table('todos', function (Blueprint $table) {
            $table->string('priority')->default('medium')->after('title'); // low, medium, high
            $table->string('time_slot')->nullable()->after('priority'); // morning, afternoon, evening
            $table->integer('estimated_minutes')->nullable()->after('time_slot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('todos', function (Blueprint $table) {
            $table->dropColumn(['priority', 'time_slot', 'estimated_minutes']);
        });
    }
};
