<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeneratePaymentReminders extends Command
{
    protected $signature = 'reminders:generate {--days=3 : Days before due date}';
    protected $description = 'Generate payment reminder notifications for users';

    public function handle()
    {
        $days = $this->option('days');

        $this->info("🔔 Generating Payment Reminders ({$days} days before due)...");
        $this->newLine();

        try {
            $result = DB::select('CALL generate_payment_reminders()');

            $remindersSent = $result[0]->reminders_sent ?? 0;

            if ($remindersSent > 0) {
                $this->info("✅ {$remindersSent} reminder(s) sent successfully");

                // Show details
                $this->showReminderDetails();
            } else {
                $this->comment('ℹ️  No reminders needed today');
            }

            Log::info('Payment reminders generated', [
                'date' => now(),
                'reminders_sent' => $remindersSent,
            ]);

        } catch (\Exception $e) {
            $this->error("❌ Error generating reminders: " . $e->getMessage());

            Log::error('Failed to generate payment reminders', [
                'error' => $e->getMessage(),
            ]);

            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }

    private function showReminderDetails()
    {
        $this->newLine();
        $this->line('📋 Recent reminders sent:');

        $recentReminders = DB::table('notifications')
            ->where('type', 'payment')
            ->where('created_at', '>=', now()->subMinutes(5))
            ->join('users', 'notifications.user_id', '=', 'users.id')
            ->select(
                'users.first_name',
                'users.last_name',
                'notifications.title',
                'notifications.message'
            )
            ->limit(5)
            ->get();

        foreach ($recentReminders as $reminder) {
            $this->line("  • {$reminder->first_name} {$reminder->last_name}");
            $this->comment("    {$reminder->message}");
        }
    }
}
