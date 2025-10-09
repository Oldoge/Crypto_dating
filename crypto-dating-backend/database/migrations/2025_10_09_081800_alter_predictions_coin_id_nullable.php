<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('predictions')) {
            return;
        }

        // If coin_id doesn't exist, simply add it as nullable string
        if (!Schema::hasColumn('predictions', 'coin_id')) {
            Schema::table('predictions', function (Blueprint $table) {
                $table->string('coin_id')->nullable()->after('client_id');
            });
            return;
        }

        // If coin_id exists but is NOT NULL, make it NULLable using driver-specific SQL to avoid requiring doctrine/dbal
        try {
            $driver = DB::getDriverName();
            if ($driver === 'mysql') {
                DB::statement('ALTER TABLE `predictions` MODIFY `coin_id` VARCHAR(255) NULL');
            }
            // For sqlite or others, skip altering to avoid breaking local envs without dbal
        } catch (\Throwable $e) {
            // Ignore if we cannot alter; controller will still send coin_id on insert
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('predictions')) {
            return;
        }
        // No-op or best-effort revert: keep coin_id as nullable to avoid data loss.
    }
};
