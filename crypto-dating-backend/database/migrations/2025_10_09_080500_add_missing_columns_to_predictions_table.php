<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('predictions')) {
            return; // Nothing to patch
        }

        Schema::table('predictions', function (Blueprint $table) {
            if (!Schema::hasColumn('predictions', 'client_id')) {
                $table->string('client_id')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('predictions', 'type')) {
                $table->string('type')->nullable()->after('client_id');
            }
            if (!Schema::hasColumn('predictions', 'payload')) {
                $table->json('payload');
            }
            if (!Schema::hasColumn('predictions', 'score')) {
                $table->decimal('score', 8, 3)->nullable();
            }
        });

        // Add unique index on (user_id, client_id) if missing
        try {
            // Detect existing indexes via information_schema to avoid duplicate creation
            $hasIndex = false;
            try {
                $connection = config('database.connections.' . config('database.default') . '.database');
                $result = DB::select(
                    'SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND NON_UNIQUE = 0 AND INDEX_NAME <> "PRIMARY"',
                    [$connection, 'predictions']
                );
                foreach ($result as $row) {
                    if (isset($row->INDEX_NAME) && $row->INDEX_NAME) {
                        // If a composite unique exists on user_id+client_id, assume it's fine
                        // We can't easily inspect columns portably across drivers here
                        $hasIndex = true; break;
                    }
                }
            } catch (\Throwable $ignored) {
                // Fallback to attempting index creation
            }

            if (!$hasIndex) {
                Schema::table('predictions', function (Blueprint $table) {
                    $table->unique(['user_id', 'client_id']);
                });
            }
        } catch (\Throwable $ignored) {
            // Ignore if index already exists or can't be created (will not block saves)
        }

        // Optional index for queries by user_id and type
        try {
            Schema::table('predictions', function (Blueprint $table) {
                $table->index(['user_id', 'type']);
            });
        } catch (\Throwable $ignored) {
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('predictions')) {
            return;
        }

        // Drop indexes if they exist; ignore errors
        try {
            Schema::table('predictions', function (Blueprint $table) {
                $table->dropUnique(['user_id', 'client_id']);
            });
        } catch (\Throwable $ignored) {
        }
        try {
            Schema::table('predictions', function (Blueprint $table) {
                $table->dropIndex(['user_id', 'type']);
            });
        } catch (\Throwable $ignored) {
        }

        Schema::table('predictions', function (Blueprint $table) {
            if (Schema::hasColumn('predictions', 'score')) {
                $table->dropColumn('score');
            }
            if (Schema::hasColumn('predictions', 'payload')) {
                $table->dropColumn('payload');
            }
            if (Schema::hasColumn('predictions', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('predictions', 'client_id')) {
                $table->dropColumn('client_id');
            }
        });
    }
};
