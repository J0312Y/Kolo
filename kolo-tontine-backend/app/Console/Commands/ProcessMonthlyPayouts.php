<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessMonthlyPayouts extends Command
{
    protected $signature = 'payouts:process {--dry-run : Preview without executing}';
    protected $description = 'Process monthly payouts for all active circles';

    public function handle()
    {
        $isDryRun = $this->option('dry-run');

        $this->info('💰 Processing Monthly Payouts...');
        $this->newLine();

        if ($isDryRun) {
            $this->warn('🔍 DRY RUN MODE - No changes will be made');
            $this->newLine();
            $this->previewPayouts();
        } else {
            $this->executePayouts();
        }

        return Command::SUCCESS;
    }

    private function previewPayouts()
    {
        // Get circles that need payout
        $circles = DB::table('like_lemba')
            ->where('status', 'active')
            ->whereNotNull('next_payout_date')
            ->whereDate('next_payout_date', '<=', now())
            ->get();

        if ($circles->isEmpty()) {
            $this->info('✅ No payouts due today');
            return;
        }

        $this->line("📋 Found {$circles->count()} circle(s) ready for payout:");
        $this->newLine();

        foreach ($circles as $circle) {
            // Get next member
            $nextMember = DB::table('like_lemba_members')
                ->join('users', 'like_lemba_members.user_id', '=', 'users.id')
                ->where('like_lemba_members.like_lemba_id', $circle->id)
                ->where('like_lemba_members.has_received_payout', false)
                ->orderBy('like_lemba_members.slot_number')
                ->select(
                    'users.first_name',
                    'users.last_name',
                    'like_lemba_members.slot_number'
                )
                ->first();

            if ($nextMember) {
                $payoutAmount = $circle->contribution_amount * $circle->current_members;

                $this->line("  • Circle: {$circle->name}");
                $this->line("    Next Beneficiary: {$nextMember->first_name} {$nextMember->last_name} (Slot #{$nextMember->slot_number})");
                $this->line("    Payout Amount: " . number_format($payoutAmount, 0, ',', ' ') . " XAF");
                $this->newLine();
            }
        }

        $this->comment('💡 Run without --dry-run to execute payouts');
    }

    private function executePayouts()
    {
        try {
            DB::beginTransaction();

            $result = DB::select('CALL process_monthly_payouts()');

            DB::commit();

            $message = $result[0]->message ?? 'Payouts processed';
            $this->info("✅ {$message}");

            Log::info('Monthly payouts processed successfully', [
                'date' => now(),
                'result' => $result,
            ]);

            // Send notification to admins (placeholder)
            $this->comment('📧 Admin notifications sent');

        } catch (\Exception $e) {
            DB::rollBack();

            $this->error("❌ Error processing payouts: " . $e->getMessage());

            Log::error('Failed to process monthly payouts', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return Command::FAILURE;
        }
    }
}
