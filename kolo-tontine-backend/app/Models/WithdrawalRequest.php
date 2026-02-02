<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WithdrawalRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'source_type',
        'source_id',
        'destination_type',
        'destination_id',
        'amount',
        'status',
        'reference_number',
        'processing_fee',
        'net_amount',
        'notes',
        'admin_notes',
        'processed_at',
        'completed_at',
        'rejected_at',
        'rejection_reason',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'processing_fee' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /**
     * Source types: wallet, card, goal
     * Destination types: bank_account, mobile_money, payment_method
     * Status: pending, processing, completed, rejected, cancelled
     */

    /**
     * Relationships
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'destination_id');
    }

    /**
     * Scopes
     */
    
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeFromWallet($query)
    {
        return $query->where('source_type', 'wallet');
    }

    public function scopeFromCard($query)
    {
        return $query->where('source_type', 'card');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    /**
     * Helper methods
     */
    
    public function process()
    {
        if ($this->status !== 'pending') {
            throw new \Exception('Only pending withdrawals can be processed');
        }

        $this->update([
            'status' => 'processing',
            'processed_at' => now(),
        ]);

        // Deduct from source
        if ($this->source_type === 'wallet') {
            if ($this->user->wallet_balance < $this->amount) {
                $this->reject('Insufficient wallet balance');
                return false;
            }
            $this->user->deductFromWallet($this->amount, "Withdrawal #{$this->reference_number}");
        } elseif ($this->source_type === 'card') {
            if ($this->user->card_balance < $this->amount) {
                $this->reject('Insufficient card balance');
                return false;
            }
            $this->user->decrement('card_balance', $this->amount);
        }

        return true;
    }

    public function complete()
    {
        if ($this->status !== 'processing') {
            throw new \Exception('Only processing withdrawals can be completed');
        }

        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Create transaction
        Transaction::create([
            'user_id' => $this->user_id,
            'type' => 'withdrawal',
            'amount' => $this->amount,
            'balance_before' => $this->user->wallet_balance + $this->amount,
            'balance_after' => $this->user->wallet_balance,
            'transaction_id' => $this->reference_number,
            'description' => "Withdrawal to {$this->destination_type}",
            'status' => 'completed',
        ]);

        // Notify user
        Notification::create([
            'user_id' => $this->user_id,
            'type' => 'withdrawal_completed',
            'title' => 'Withdrawal Completed',
            'message' => "Your withdrawal of {$this->net_amount} XAF has been completed",
            'data' => ['withdrawal_id' => $this->id],
        ]);
    }

    public function reject($reason)
    {
        $this->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => $reason,
        ]);

        // Refund if already processed
        if ($this->processed_at) {
            if ($this->source_type === 'wallet') {
                $this->user->addToWallet($this->amount, "Refund for rejected withdrawal");
            } elseif ($this->source_type === 'card') {
                $this->user->increment('card_balance', $this->amount);
            }
        }

        // Notify user
        Notification::create([
            'user_id' => $this->user_id,
            'type' => 'withdrawal_rejected',
            'title' => 'Withdrawal Rejected',
            'message' => "Your withdrawal was rejected: {$reason}",
            'data' => ['withdrawal_id' => $this->id],
        ]);
    }

    public function cancel()
    {
        if (!in_array($this->status, ['pending', 'processing'])) {
            throw new \Exception('Only pending/processing withdrawals can be cancelled');
        }

        // Refund if already processed
        if ($this->processed_at) {
            if ($this->source_type === 'wallet') {
                $this->user->addToWallet($this->amount, "Cancelled withdrawal refund");
            } elseif ($this->source_type === 'card') {
                $this->user->increment('card_balance', $this->amount);
            }
        }

        $this->update(['status' => 'cancelled']);
    }

    public function calculateFee()
    {
        // Different fees based on destination
        $feePercentage = match($this->destination_type) {
            'bank_account' => 1.5, // 1.5%
            'mobile_money' => 1.0, // 1.0%
            'payment_method' => 0.5, // 0.5%
            default => 1.0,
        };

        $fee = ($this->amount * $feePercentage) / 100;
        $minFee = 500; // Minimum 500 XAF
        
        return max($fee, $minFee);
    }

    public function getEstimatedCompletionTime()
    {
        return match($this->destination_type) {
            'mobile_money' => 'Instant - 5 minutes',
            'bank_account' => '1-3 business days',
            'payment_method' => '24 hours',
            default => '24-48 hours',
        };
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($withdrawal) {
            // Generate reference number
            if (!$withdrawal->reference_number) {
                do {
                    $ref = 'WD-' . strtoupper(uniqid());
                } while (static::where('reference_number', $ref)->exists());
                
                $withdrawal->reference_number = $ref;
            }

            // Calculate fees
            $withdrawal->processing_fee = $withdrawal->calculateFee();
            $withdrawal->net_amount = $withdrawal->amount - $withdrawal->processing_fee;

            // Default status
            if (!$withdrawal->status) {
                $withdrawal->status = 'pending';
            }
        });

        static::created(function ($withdrawal) {
            // Notify user
            Notification::create([
                'user_id' => $withdrawal->user_id,
                'type' => 'withdrawal_requested',
                'title' => 'Withdrawal Requested',
                'message' => "Your withdrawal of {$withdrawal->amount} XAF is being processed",
                'data' => ['withdrawal_id' => $withdrawal->id],
            ]);
        });
    }
}
