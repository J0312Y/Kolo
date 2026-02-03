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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['payment', 'payout', 'deposit', 'withdrawal', 'fee', 'refund']);
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('method')->nullable();
            $table->string('reference')->unique();
            $table->string('category')->nullable();
            $table->foreignId('like_lemba_id')->nullable()->constrained('like_lemba')->onDelete('set null');
            $table->foreignId('goal_id')->nullable()->constrained('goals')->onDelete('set null');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
