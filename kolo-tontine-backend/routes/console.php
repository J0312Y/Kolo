<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Tasks
|--------------------------------------------------------------------------
|
| Automated tasks for Kolo Tontine platform:
| - Monthly payouts processing
| - Daily payment reminders
| - Weekly and monthly reports
|
*/

// ============================================
// MONTHLY PAYOUTS - 1st of every month at 08:00
// ============================================
Schedule::command('payouts:process')
    ->monthlyOn(1, '08:00')
    ->timezone('Africa/Brazzaville')
    ->withoutOverlapping()
    ->onSuccess(function () {
        \Log::info('✅ Monthly payouts processed successfully');
    })
    ->onFailure(function () {
        \Log::error('❌ Monthly payouts processing failed');
        // TODO: Send alert to admin
    });

// ============================================
// PAYMENT REMINDERS - Daily at 09:00
// ============================================
Schedule::command('reminders:generate')
    ->dailyAt('09:00')
    ->timezone('Africa/Brazzaville')
    ->withoutOverlapping()
    ->onSuccess(function () {
        \Log::info('✅ Payment reminders sent');
    });

// ============================================
// WEEKLY REPORTS - Every Monday at 10:00
// ============================================
Schedule::command('report:enterprise --period=month')
    ->weeklyOn(1, '10:00')
    ->timezone('Africa/Brazzaville')
    ->onSuccess(function () {
        \Log::info('✅ Weekly enterprise report generated');
        // TODO: Email report to admins
    });

// ============================================
// MONTHLY REPORTS - Last day of month at 18:00
// ============================================
Schedule::call(function () {
    Artisan::call('report:enterprise', ['--period' => 'month', '--format' => 'json']);

    // TODO: Email monthly report to stakeholders
    \Log::info('✅ Monthly report generated', [
        'output' => Artisan::output(),
    ]);
})->monthlyOn(now()->endOfMonth()->day, '18:00')
    ->timezone('Africa/Brazzaville');

// ============================================
// DATABASE CLEANUP - Daily at 03:00
// ============================================
Schedule::command('model:prune')
    ->daily()
    ->at('03:00');

// ============================================
// BACKUP DATABASE - Daily at 02:00
// ============================================
// Schedule::command('backup:run')
//     ->daily()
//     ->at('02:00');
