<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'icon',
        'color',
        'target_amount',
        'current_amount',
        'target_date',
        'status',
        'auto_save_enabled',
        'auto_save_amount',
        'auto_save_frequency',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'auto_save_amount' => 'decimal:2',
        'target_date' => 'date',
        'auto_save_enabled' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return Transaction::where('related_type', 'goal')
            ->where('related_id', $this->id);
    }

    /**
     * Scopes
     */
    
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Accessors
     */
    
    public function getProgressPercentageAttribute()
    {
        if ($this->target_amount == 0) {
            return 0;
        }
        
        return round(($this->current_amount / $this->target_amount) * 100, 2);
    }

    public function getRemainingAmountAttribute()
    {
        return max(0, $this->target_amount - $this->current_amount);
    }

    public function getDaysRemainingAttribute()
    {
        if (!$this->target_date) {
            return null;
        }
        
        return max(0, now()->diffInDays($this->target_date, false));
    }

    /**
     * Helper methods
     */
    
    public function contribute($amount, $description = null)
    {
        if ($this->status !== 'active') {
            throw new \Exception('Goal is not active');
        }

        $this->increment('current_amount', $amount);

        // Create transaction
        Transaction::create([
            'user_id' => $this->user_id,
            'type' => 'deposit',
            'amount' => $amount,
            'balance_before' => $this->current_amount - $amount,
            'balance_after' => $this->current_amount,
            'related_type' => 'goal',
            'related_id' => $this->id,
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'description' => $description ?? "Contribution to {$this->name}",
            'status' => 'completed',
        ]);

        // Check if goal completed
        if ($this->current_amount >= $this->target_amount) {
            $this->markAsCompleted();
        }

        return $this;
    }

    public function withdraw($amount, $description = null)
    {
        if ($this->current_amount < $amount) {
            throw new \Exception('Insufficient balance in goal');
        }

        $this->decrement('current_amount', $amount);

        // Create transaction
        Transaction::create([
            'user_id' => $this->user_id,
            'type' => 'withdrawal',
            'amount' => $amount,
            'balance_before' => $this->current_amount + $amount,
            'balance_after' => $this->current_amount,
            'related_type' => 'goal',
            'related_id' => $this->id,
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'description' => $description ?? "Withdrawal from {$this->name}",
            'status' => 'completed',
        ]);

        return $this;
    }

    public function markAsCompleted()
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function cancel()
    {
        // Transfer balance to user wallet
        if ($this->current_amount > 0) {
            $this->user->addToWallet($this->current_amount, "Cancelled goal: {$this->name}");
        }

        $this->update([
            'status' => 'cancelled',
            'current_amount' => 0,
        ]);
    }

    public function isOnTrack()
    {
        if (!$this->target_date) {
            return true;
        }

        $totalDays = $this->started_at->diffInDays($this->target_date);
        $daysPassed = $this->started_at->diffInDays(now());
        
        if ($totalDays == 0) {
            return $this->current_amount >= $this->target_amount;
        }

        $expectedProgress = ($daysPassed / $totalDays) * $this->target_amount;
        
        return $this->current_amount >= $expectedProgress;
    }

    public function getMonthlyTargetAmount()
    {
        if (!$this->target_date) {
            return 0;
        }

        $monthsRemaining = max(1, now()->diffInMonths($this->target_date));
        return $this->remaining_amount / $monthsRemaining;
    }
}
