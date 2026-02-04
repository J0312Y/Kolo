<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    /**
     * SQLite cannot ALTER a column type in-place.
     * Recreate the notifications table with type as string.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('notifications', function (Blueprint $table) {
                $table->string('type', 50)->default('system')->change();
            });
            return;
        }

        // SQLite workaround: rename → create → copy → drop
        DB::statement('ALTER TABLE notifications RENAME TO notifications_old');

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type', 50)->default('system');
            $table->string('title');
            $table->text('message');
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->boolean('read')->default(false);
            $table->foreignId('like_lemba_id')->nullable()->constrained('like_lemba')->onDelete('cascade');
            $table->json('data')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        DB::statement('INSERT INTO notifications SELECT * FROM notifications_old');
        DB::statement('DROP TABLE IF EXISTS notifications_old');
    }

    public function down(): void
    {
        // No-op: reverting to enum would be lossy
    }
};
