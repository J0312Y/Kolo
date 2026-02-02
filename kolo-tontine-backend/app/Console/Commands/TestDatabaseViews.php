<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TestDatabaseViews extends Command
{
    protected $signature = 'db:test-views {--view= : Specific view to test}';
    protected $description = 'Test all database views and display sample data';

    public function handle()
    {
        $specificView = $this->option('view');

        $this->info('🧪 Testing Database Views...');
        $this->newLine();

        if ($specificView) {
            $this->testView($specificView);
        } else {
            $this->testAllViews();
        }

        return Command::SUCCESS;
    }

    private function testAllViews()
    {
        $views = [
            'user_credit_score' => 'User Credit Score (For Banks)',
            'user_payment_history' => 'User Payment History',
            'circle_performance' => 'Circle Performance',
            'enterprise_statistics' => 'Enterprise Statistics',
            'user_financial_summary' => 'User Financial Summary',
        ];

        foreach ($views as $view => $description) {
            $this->testView($view, $description);
            $this->newLine();
        }
    }

    private function testView($view, $description = null)
    {
        try {
            $this->info("📊 Testing: " . ($description ?? $view));

            $data = DB::table($view)->limit(5)->get();

            if ($data->isEmpty()) {
                $this->warn("⚠️  No data found in {$view}");
                $this->comment("💡 Tip: Run database seeders to populate test data");
            } else {
                $this->line("✅ Found {$data->count()} records");

                // Display first record as sample
                $first = $data->first();
                $this->table(
                    array_keys((array)$first),
                    [$first]
                );
            }

        } catch (\Exception $e) {
            $this->error("❌ Error testing {$view}: " . $e->getMessage());
        }
    }
}
