<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('language', 5)->default('fr');
            $table->string('currency', 3)->default('XAF');
            $table->string('timezone')->default('Africa/Brazzaville');
            $table->enum('theme', ['light', 'dark', 'auto'])->default('light');
            $table->boolean('notification_email')->default(true);
            $table->boolean('notification_sms')->default(true);
            $table->boolean('notification_push')->default(true);
            $table->boolean('notification_payment_due')->default(true);
            $table->boolean('notification_payout_received')->default(true);
            $table->boolean('notification_member_joined')->default(true);
            $table->boolean('notification_chat_message')->default(true);
            $table->boolean('notification_goal_milestone')->default(true);
            $table->boolean('notification_referral')->default(true);
            $table->boolean('privacy_show_phone')->default(false);
            $table->boolean('privacy_show_email')->default(false);
            $table->boolean('privacy_show_in_search')->default(true);
            $table->boolean('security_biometric_enabled')->default(false);
            $table->boolean('security_require_passcode_on_launch')->default(false);
            $table->boolean('display_balance_on_home')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
