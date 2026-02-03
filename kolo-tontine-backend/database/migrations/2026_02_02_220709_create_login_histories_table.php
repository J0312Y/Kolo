<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('login_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_type')->nullable();
            $table->string('device_name')->nullable();
            $table->string('browser')->nullable();
            $table->string('platform')->nullable();
            $table->string('location_city')->nullable();
            $table->string('location_country')->nullable();
            $table->decimal('location_latitude', 10, 8)->nullable();
            $table->decimal('location_longitude', 11, 8)->nullable();
            $table->boolean('login_successful')->default(true);
            $table->string('failure_reason')->nullable();
            $table->timestamp('logout_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login_histories');
    }
};
