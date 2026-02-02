<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'balance_before',
        'balance_after',
        'related_type',
        'related_id',
        'transaction_id',
        'status',
        'description',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_before' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'metadata' => 'array',
    ];

    /**
     * Relationships
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function related()
    {
        return $this->morphTo();
    }

    /**
     * Scopes
     */
    
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeDeposits($query)
    {
        return $query->where('type', 'deposit');
    }

    public function scopeWithdrawals($query)
    {
        return $query->where('type', 'withdrawal');
    }

    public function scopePayments($query)
    {
        return $query->where('type', 'payment');
    }

    public function scopeTransfers($query)
    {
        return $query->where('type', 'transfer');
    }

    public function scopeThisMonth($query)
    {
        return $query->whereYear('created_at', now()->year)
                    ->whereMonth('created_at', now()->month);
    }

    public function scopeLastMonth($query)
    {
        return $query->whereYear('created_at', now()->subMonth()->year)
                    ->whereMonth('created_at', now()->subMonth()->month);
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Accessors
     */
    
    public function getIsIncomeAttribute()
    {
        return in_array($this->type, ['deposit', 'refund', 'bonus']);
    }

    public function getIsExpenseAttribute()
    {
        return in_array($this->type, ['withdrawal', 'payment', 'fee']);
    }

    public function getAmountWithSignAttribute()
    {
        return $this->is_income ? "+{$this->amount}" : "-{$this->amount}";
    }

    /**
     * Helper methods
     */
    
    public function getRelatedModel()
    {
        if (!$this->related_type || !$this->related_id) {
            return null;
        }

        $modelClass = "App\\Models\\" . ucfirst($this->related_type);
        
        if (class_exists($modelClass)) {
            return $modelClass::find($this->related_id);
        }

        return null;
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            // Generate unique transaction ID if not set
            if (!$transaction->transaction_id) {
                do {
                    $txnId = 'TXN-' . strtoupper(uniqid());
                } while (static::where('transaction_id', $txnId)->exists());
                
                $transaction->transaction_id = $txnId;
            }
        });
    }
}
