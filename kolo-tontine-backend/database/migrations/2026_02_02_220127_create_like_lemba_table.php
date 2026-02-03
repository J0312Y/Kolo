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
        Schema::create('like_lemba', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('invitation_code', 10)->unique();
            $table->decimal('contribution_amount', 15, 2);
            $table->integer('duration_months');
            $table->integer('total_slots');
            $table->integer('current_members')->default(0);
            $table->boolean('is_private')->default(false);
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
            $table->date('start_date')->nullable();
            $table->date('next_payout_date')->nullable();
            $table->integer('current_cycle')->default(0);
            $table->timestamps();
        });

        Schema::create('like_lemba_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('like_lemba_id')->constrained('like_lemba')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('slot_number');
            $table->integer('payout_month');
            $table->integer('payments_made')->default(0);
            $table->integer('payments_remaining');
            $table->decimal('total_paid', 15, 2)->default(0);
            $table->boolean('has_received_payout')->default(false);
            $table->date('payout_received_date')->nullable();
            $table->timestamps();

            $table->unique(['like_lemba_id', 'user_id']);
            $table->unique(['like_lemba_id', 'slot_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('like_lemba_members');
        Schema::dropIfExists('like_lemba');
    }
};
