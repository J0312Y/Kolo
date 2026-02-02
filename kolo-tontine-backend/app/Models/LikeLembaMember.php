<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikeLembaMember extends Model
{
    use HasFactory;

    protected $table = 'like_lemba_members';

    protected $fillable = [
        'like_lemba_id',
        'user_id',
        'slot_number',
        'payout_month',
        'total_paid',
        'payments_made',
        'payments_remaining',
        'status',
        'has_received_payout',
        'payout_received_date',
        'payout_amount',
    ];

    protected $casts = [
        'total_paid' => 'decimal:2',
        'payout_amount' => 'decimal:2',
        'payout_received_date' => 'date',
        'has_received_payout' => 'boolean',
        'joined_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    
    public function likeLemba()
    {
        return $this->belongsTo(LikeLemba::class, 'like_lemba_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_id', 'user_id')
                    ->where('like_lemba_id', $this->like_lemba_id);
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

    public function scopeDefaulted($query)
    {
        return $query->where('status', 'defaulted');
    }

    public function scopeReceivedPayout($query)
    {
        return $query->where('has_received_payout', true);
    }

    public function scopePendingPayout($query)
    {
        return $query->where('has_received_payout', false);
    }

    /**
     * Helper methods
     */
    
    public function getPaymentProgress()
    {
        return [
            'paid' => $this->payments_made,
            'remaining' => $this->payments_remaining,
            'total' => $this->payments_made + $this->payments_remaining,
            'percentage' => $this->payments_remaining > 0 
                ? round(($this->payments_made / ($this->payments_made + $this->payments_remaining)) * 100, 2)
                : 100,
        ];
    }

    public function isPaymentDue()
    {
        // Check if next payment is due this month
        $likeLemba = $this->likeLemba;
        
        if (!$likeLemba->next_payout_date) {
            return false;
        }

        $lastPayment = $this->payments()
            ->where('status', 'completed')
            ->latest('paid_at')
            ->first();

        if (!$lastPayment) {
            return true; // No payments yet
        }

        // Payment due if last payment was more than a month ago
        return $lastPayment->paid_at->lt(now()->subMonth());
    }

    public function getNextPaymentDueDate()
    {
        $likeLemba = $this->likeLemba;
        return $likeLemba->next_payout_date 
            ? $likeLemba->next_payout_date->subDays(5) // 5 days before payout
            : null;
    }

    public function recordPayment($amount)
    {
        $this->increment('payments_made');
        $this->decrement('payments_remaining');
        $this->increment('total_paid', $amount);

        // Check if completed all payments
        if ($this->payments_remaining === 0) {
            $this->update(['status' => 'completed']);
        }
    }

    public function markAsDefaulted()
    {
        $this->update(['status' => 'defaulted']);
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($member) {
            // Increment likeLemba member count
            $member->likeLemba->increment('current_members');

            // Check if circle should start
            if ($member->likeLemba->isFull()) {
                $member->likeLemba->startCircle();
            }
        });

        static::deleted(function ($member) {
            // Decrement likeLemba member count
            $member->likeLemba->decrement('current_members');
        });
    }
}
