<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'provider',
        'card_last4',
        'card_brand',
        'card_expiry',
        'mobile_number',
        'bank_name',
        'account_number',
        'account_name',
        'is_default',
        'is_verified',
        'status',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_verified' => 'boolean',
    ];

    protected $hidden = [
        'account_number', // Hide in API responses
    ];

    /**
     * Relationships
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scopes
     */
    
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public function scopeCards($query)
    {
        return $query->where('type', 'card');
    }

    public function scopeMobileMoney($query)
    {
        return $query->where('type', 'mobile_money');
    }

    public function scopeBankAccount($query)
    {
        return $query->where('type', 'bank_account');
    }

    /**
     * Accessors
     */
    
    public function getDisplayNameAttribute()
    {
        switch ($this->type) {
            case 'card':
                return "{$this->card_brand} ••••{$this->card_last4}";
            case 'mobile_money':
                return "{$this->provider} - {$this->mobile_number}";
            case 'bank_account':
                return "{$this->bank_name} - {$this->account_name}";
            default:
                return 'Unknown';
        }
    }

    public function getMaskedNumberAttribute()
    {
        if ($this->type === 'card') {
            return "•••• •••• •••• {$this->card_last4}";
        }
        
        if ($this->type === 'mobile_money' && $this->mobile_number) {
            $number = $this->mobile_number;
            return substr($number, 0, 4) . ' ••• •••• ' . substr($number, -4);
        }
        
        return null;
    }

    /**
     * Helper methods
     */
    
    public function setAsDefault()
    {
        // Unset other default methods for this user
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }

    public function verify()
    {
        $this->update(['is_verified' => true]);
    }

    public function isExpired()
    {
        if ($this->type === 'card' && $this->card_expiry) {
            // Format: MM/YY
            [$month, $year] = explode('/', $this->card_expiry);
            $expiryDate = \Carbon\Carbon::createFromDate("20{$year}", $month, 1)->endOfMonth();
            
            return $expiryDate->isPast();
        }
        
        return false;
    }

    public function canBeUsed()
    {
        return $this->status === 'active' && 
               $this->is_verified && 
               !$this->isExpired();
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($paymentMethod) {
            // If this is the first payment method, make it default
            $userMethodsCount = static::where('user_id', $paymentMethod->user_id)->count();
            
            if ($userMethodsCount === 0) {
                $paymentMethod->is_default = true;
            }
        });

        static::deleting(function ($paymentMethod) {
            // If deleting default method, set another as default
            if ($paymentMethod->is_default) {
                $nextMethod = static::where('user_id', $paymentMethod->user_id)
                    ->where('id', '!=', $paymentMethod->id)
                    ->where('status', 'active')
                    ->first();

                if ($nextMethod) {
                    $nextMethod->update(['is_default' => true]);
                }
            }
        });
    }
}
