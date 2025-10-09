<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('predictions')) {
            return; // Table already exists
        }

        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('client_id')->nullable();
            $table->string('type')->nullable();
            $table->json('payload');
            $table->decimal('score', 8, 3)->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'client_id']);
            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};
