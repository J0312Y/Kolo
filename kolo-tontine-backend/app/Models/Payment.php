<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'likeLemba_id',
        'payment_method_id',
        'amount',
        'payment_type',
        'status',
        'transaction_id',
        'payment_gateway',
        'metadata',
        'notes',
        'due_date',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array',
        'due_date' => 'date',
        'paid_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likeLemba()
    {
        return $this->belongsTo(LikeLemba::class, 'likeLemba_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    /**
     * Scopes
     */
    
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'pending')
                    ->where('due_date', '<', now());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'pending')
                    ->where('due_date', '>=', now())
                    ->where('due_date', '<=', now()->addDays(7));
    }

    public function scopeContributions($query)
    {
        return $query->where('payment_type', 'contribution');
    }

    public function scopePayouts($query)
    {
        return $query->where('payment_type', 'payout');
    }

    /**
     * Helper methods
     */
    
    public function isOverdue()
    {
        return $this->status === 'pending' && 
               $this->due_date && 
               $this->due_date->isPast();
    }

    public function isDueThisWeek()
    {
        return $this->status === 'pending' && 
               $this->due_date &&
               $this->due_date->between(now(), now()->addWeek());
    }

    public function markAsPaid()
    {
        $this->update([
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        // Update member's payment record
        if ($this->payment_type === 'contribution') {
            $member = LikeLembaMember::where('user_id', $this->user_id)
                ->where('likeLemba_id', $this->likeLemba_id)
                ->first();

            if ($member) {
                $member->recordPayment($this->amount);
            }
        }

        // Create transaction record
        Transaction::create([
            'user_id' => $this->user_id,
            'type' => 'payment',
            'amount' => $this->amount,
            'balance_before' => $this->user->wallet_balance + $this->amount,
            'balance_after' => $this->user->wallet_balance,
            'related_type' => 'likeLemba',
            'related_id' => $this->likeLemba_id,
            'transaction_id' => $this->transaction_id,
            'description' => "Payment for {$this->likeLemba->name}",
            'status' => 'completed',
        ]);
    }

    public function markAsFailed($reason = null)
    {
        $this->update([
            'status' => 'failed',
            'notes' => $reason,
        ]);
    }

    public function retry()
    {
        if ($this->status === 'failed') {
            $this->update([
                'status' => 'pending',
                'notes' => null,
            ]);
            
            return true;
        }
        
        return false;
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            // Generate unique transaction ID if not set
            if (!$payment->transaction_id) {
                do {
                    $txnId = 'TXN-' . strtoupper(uniqid());
                } while (static::where('transaction_id', $txnId)->exists());
                
                $payment->transaction_id = $txnId;
            }
        });
    }
}
