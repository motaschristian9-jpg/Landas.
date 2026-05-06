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
            $table->foreignId('goal_id')->nullable()->after('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('completed_at')->nullable()->after('is_completed');
        });

        Schema::table('goals', function (Blueprint $table) {
            $table->timestamp('completed_at')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('todos', function (Blueprint $table) {
            $table->dropConstrainedForeignId('goal_id');
            $table->dropColumn('completed_at');
        });

        Schema::table('goals', function (Blueprint $table) {
            $table->dropColumn('completed_at');
        });
    }
};
