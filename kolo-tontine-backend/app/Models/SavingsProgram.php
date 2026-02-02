<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavingsProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'goal_id',
        'type',
        'name',
        'description',
        'is_active',
        'config',
        'total_saved',
        'last_executed_at',
        'next_execution_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config' => 'array',
        'total_saved' => 'decimal:2',
        'last_executed_at' => 'datetime',
        'next_execution_at' => 'datetime',
    ];

    /**
     * Program types:
     * - auto_save: Automatic weekly/monthly deposits
     * - round_up: Round up purchases to nearest 1000
     * - match_savings: Platform bonus (5% match)
     * - likelemba_to_goal: Auto-transfer payout to goal
     */

    /**
     * Relationships
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function goal()
    {
        return $this->belongsTo(Goal::class);
    }

    /**
     * Scopes
     */
    
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeAutoSave($query)
    {
        return $query->where('type', 'auto_save');
    }

    public function scopeRoundUp($query)
    {
        return $query->where('type', 'round_up');
    }

    public function scopeDueForExecution($query)
    {
        return $query->where('is_active', true)
                    ->where('next_execution_at', '<=', now());
    }

    /**
     * Helper methods
     */
    
    public function activate()
    {
        $this->update([
            'is_active' => true,
            'next_execution_at' => $this->calculateNextExecution(),
        ]);
    }

    public function deactivate()
    {
        $this->update(['is_active' => false]);
    }

    public function executeAutoSave()
    {
        if ($this->type !== 'auto_save' || !$this->is_active) {
            return false;
        }

        $amount = $this->config['amount'] ?? 0;
        $frequency = $this->config['frequency'] ?? 'weekly';

        if ($amount <= 0) {
            return false;
        }

        // Check user balance
        if ($this->user->wallet_balance < $amount) {
            // Notify user
            Notification::create([
                'user_id' => $this->user_id,
                'type' => 'auto_save_failed',
                'title' => 'Auto-Save Failed',
                'message' => "Insufficient balance for auto-save of {$amount} XAF",
                'data' => ['program_id' => $this->id],
            ]);
            return false;
        }

        // Deduct from wallet
        $this->user->deductFromWallet($amount, "Auto-save: {$this->name}");

        // Add to goal if linked
        if ($this->goal_id) {
            $this->goal->contribute($amount, "Auto-save contribution");
        }

        // Update program
        $this->increment('total_saved', $amount);
        $this->update([
            'last_executed_at' => now(),
            'next_execution_at' => $this->calculateNextExecution(),
        ]);

        return true;
    }

    public function executeRoundUp($transactionAmount)
    {
        if ($this->type !== 'round_up' || !$this->is_active) {
            return false;
        }

        $roundTo = $this->config['round_to'] ?? 1000;
        $remainder = $transactionAmount % $roundTo;
        
        if ($remainder === 0) {
            return false; // Already rounded
        }

        $roundUpAmount = $roundTo - $remainder;

        // Check balance
        if ($this->user->wallet_balance < $roundUpAmount) {
            return false;
        }

        // Deduct from wallet
        $this->user->deductFromWallet($roundUpAmount, "Round-up savings");

        // Add to goal
        if ($this->goal_id) {
            $this->goal->contribute($roundUpAmount, "Round-up contribution");
        }

        $this->increment('total_saved', $roundUpAmount);
        $this->update(['last_executed_at' => now()]);

        return true;
    }

    public function executeMatchSavings($contributionAmount)
    {
        if ($this->type !== 'match_savings' || !$this->is_active) {
            return false;
        }

        $matchPercentage = $this->config['match_percentage'] ?? 5;
        $matchAmount = ($contributionAmount * $matchPercentage) / 100;
        $maxMatch = $this->config['max_match'] ?? 10000;

        $matchAmount = min($matchAmount, $maxMatch);

        // Platform gives bonus (no deduction from user)
        if ($this->goal_id) {
            $this->goal->contribute($matchAmount, "Match savings bonus ({$matchPercentage}%)");
        }

        $this->increment('total_saved', $matchAmount);
        $this->update(['last_executed_at' => now()]);

        // Notify user
        Notification::create([
            'user_id' => $this->user_id,
            'type' => 'match_bonus',
            'title' => 'Match Savings Bonus! 🎉',
            'message' => "You earned {$matchAmount} XAF bonus ({$matchPercentage}% match)",
            'data' => ['program_id' => $this->id, 'amount' => $matchAmount],
        ]);

        return true;
    }

    public function executeLikeLembaToGoal($payoutAmount, $likeLembaId)
    {
        if ($this->type !== 'likelemba_to_goal' || !$this->is_active) {
            return false;
        }

        // Transfer percentage or full amount
        $percentage = $this->config['percentage'] ?? 100;
        $transferAmount = ($payoutAmount * $percentage) / 100;

        if ($this->goal_id) {
            $this->goal->contribute($transferAmount, "LikeLemba payout auto-transfer");
        }

        $this->increment('total_saved', $transferAmount);
        $this->update(['last_executed_at' => now()]);

        return true;
    }

    protected function calculateNextExecution()
    {
        if ($this->type !== 'auto_save') {
            return null;
        }

        $frequency = $this->config['frequency'] ?? 'weekly';

        return match($frequency) {
            'daily' => now()->addDay(),
            'weekly' => now()->addWeek(),
            'monthly' => now()->addMonth(),
            default => now()->addWeek(),
        };
    }

    /**
     * Static factory methods
     */
    
    public static function createAutoSave($userId, $amount, $frequency = 'weekly', $goalId = null)
    {
        return static::create([
            'user_id' => $userId,
            'goal_id' => $goalId,
            'type' => 'auto_save',
            'name' => 'Auto-Save ' . ucfirst($frequency),
            'description' => "Automatic {$frequency} savings of {$amount} XAF",
            'is_active' => true,
            'config' => [
                'amount' => $amount,
                'frequency' => $frequency,
            ],
            'next_execution_at' => now()->addWeek(),
        ]);
    }

    public static function createRoundUp($userId, $roundTo = 1000, $goalId = null)
    {
        return static::create([
            'user_id' => $userId,
            'goal_id' => $goalId,
            'type' => 'round_up',
            'name' => 'Round-Up Savings',
            'description' => "Round up purchases to nearest {$roundTo} XAF",
            'is_active' => true,
            'config' => [
                'round_to' => $roundTo,
            ],
        ]);
    }

    public static function createMatchSavings($userId, $matchPercentage = 5, $goalId = null)
    {
        return static::create([
            'user_id' => $userId,
            'goal_id' => $goalId,
            'type' => 'match_savings',
            'name' => 'Match Savings',
            'description' => "{$matchPercentage}% bonus on all savings",
            'is_active' => true,
            'config' => [
                'match_percentage' => $matchPercentage,
                'max_match' => 10000,
            ],
        ]);
    }
}
