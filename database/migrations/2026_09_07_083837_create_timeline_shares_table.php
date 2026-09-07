<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('timeline_shares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('shared_with_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['owner_id', 'shared_with_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timeline_shares');
    }
};
