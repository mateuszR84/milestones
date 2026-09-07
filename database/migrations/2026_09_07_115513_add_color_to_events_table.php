<?php

use App\Models\Event;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('color')->nullable()->after('external_link');
        });

        Event::query()->whereNull('color')->each(function (Event $event) {
            $event->update(['color' => Arr::random(Event::COLORS)]);
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('color');
        });
    }
};
