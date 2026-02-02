<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerateEnterpriseReport extends Command
{
    protected $signature = 'report:enterprise {--period=month : Report period (month, quarter, year)} {--format=table : Output format (table, json, csv)}';
    protected $description = 'Generate comprehensive enterprise performance report';

    public function handle()
    {
        $period = $this->option('period');
        $format = $this->option('format');

        $this->info("📊 Generating Enterprise Report ({$period})...");
        $this->newLine();

        [$startDate, $endDate] = $this->getDateRange($period);

        $this->line("Period: {$startDate} to {$endDate}");
        $this->newLine();

        try {
            // Get overall statistics
            $stats = DB::table('enterprise_statistics')->first();

            // Get top circles
            $topCircles = DB::table('circle_performance')
                ->whereBetween('circle_created_at', [$startDate, $endDate])
                ->orderBy('collection_rate_percentage', 'desc')
                ->limit(10)
                ->get();

            // Get user engagement
            $engagement = DB::table('user_financial_summary')
                ->whereBetween('account_created_at', [$startDate, $endDate])
                ->selectRaw('
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN last_transaction_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_last_30_days,
                    AVG(total_transactions) as avg_transactions_per_user
                ')
                ->first();

            // Display report
            $this->displayReport($stats, $topCircles, $engagement, $format);

        } catch (\Exception $e) {
            $this->error("❌ Error generating report: " . $e->getMessage());
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }

    private function getDateRange($period)
    {
        return match ($period) {
            'month' => [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()],
            'quarter' => [now()->startOfQuarter()->toDateString(), now()->endOfQuarter()->toDateString()],
            'year' => [now()->startOfYear()->toDateString(), now()->endOfYear()->toDateString()],
            default => [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()],
        };
    }

    private function displayReport($stats, $topCircles, $engagement, $format)
    {
        if ($format === 'json') {
            $this->line(json_encode([
                'statistics' => $stats,
                'top_circles' => $topCircles,
                'engagement' => $engagement,
            ], JSON_PRETTY_PRINT));
            return;
        }

        // Overall Statistics
        $this->info('📈 Overall Statistics');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Total Users', number_format($stats->total_users)],
                ['Total Circles', number_format($stats->total_circles)],
                ['Active Circles', number_format($stats->active_circles)],
                ['Completed Circles', number_format($stats->completed_circles)],
                ['Money Circulated', number_format($stats->total_money_circulated, 0, ',', ' ') . ' XAF'],
                ['User Engagement Rate', $stats->user_engagement_rate . '%'],
                ['Transaction Success Rate', $stats->transaction_success_rate . '%'],
            ]
        );

        $this->newLine();

        // Top Performing Circles
        if ($topCircles->isNotEmpty()) {
            $this->info('🏆 Top Performing Circles');
            $this->table(
                ['Circle Name', 'Members', 'Collection Rate', 'Amount Collected'],
                $topCircles->map(fn($circle) => [
                    $circle->circle_name,
                    "{$circle->current_members}/{$circle->total_slots}",
                    $circle->collection_rate_percentage . '%',
                    number_format($circle->total_collected, 0, ',', ' ') . ' XAF',
                ])
            );

            $this->newLine();
        }

        // User Engagement
        $this->info('👥 User Engagement');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Total Users (Period)', number_format($engagement->total_users)],
                ['Active Last 30 Days', number_format($engagement->active_last_30_days)],
                ['Avg Transactions per User', number_format($engagement->avg_transactions_per_user, 2)],
                ['Activity Rate', round(($engagement->active_last_30_days / $engagement->total_users) * 100, 2) . '%'],
            ]
        );

        $this->newLine();
        $this->comment('💡 Tip: Use --format=json to get machine-readable output');
    }
}
