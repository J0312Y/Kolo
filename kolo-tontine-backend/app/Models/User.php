<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'date_of_birth',
        'gender',
        'address',
        'city',
        'country',
        'account_status',
        'plan_tier',
        'plan_expires_at',
        'wallet_balance',
        'card_balance',
        'referral_code',
        'referred_by',
        'passcode',
        'two_factor_enabled',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'passcode',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'plan_expires_at' => 'datetime',
        'last_login_at' => 'datetime',
        'date_of_birth' => 'date',
        'wallet_balance' => 'decimal:2',
        'card_balance' => 'decimal:2',
        'two_factor_enabled' => 'boolean',
    ];

    /**
     * Get full name attribute
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Relationships
     */
    
    // LikeLembas where user is admin
    public function adminLikeLembas()
    {
        return $this->hasMany(LikeLemba::class, 'admin_id');
    }

    // LikeLembas where user is member
    public function likeLembaMemberships()
    {
        return $this->hasMany(LikeLembaMember::class);
    }

    // All LikeLembas (admin + member)
    public function likeLembas()
    {
        return $this->belongsToMany(LikeLemba::class, 'likeLemba_members')
            ->withPivot('slot_number', 'payout_month', 'total_paid', 'payments_made', 'payments_remaining', 'status')
            ->withTimestamps();
    }

    // Payments
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Payment Methods
    public function paymentMethods()
    {
        return $this->hasMany(PaymentMethod::class);
    }

    // Goals
    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    // Transactions
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Referrals made by this user
    public function referralsMade()
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }

    // User who referred this user
    public function referredBy()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    // Users referred by this user
    public function referredUsers()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    // Notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // Documents
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    // Chat messages
    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    /**
     * Scopes
     */
    
    public function scopeActive($query)
    {
        return $query->where('account_status', 'active');
    }

    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at')
                    ->whereNotNull('phone_verified_at');
    }

    public function scopeWithPlan($query, $plan)
    {
        return $query->where('plan_tier', $plan);
    }

    /**
     * Helper methods
     */
    
    public function isAdmin()
    {
        return $this->account_status === 'active' && $this->email_verified_at;
    }

    public function hasActivePlan()
    {
        return $this->plan_tier !== 'free' && 
               ($this->plan_expires_at === null || $this->plan_expires_at->isFuture());
    }

    public function canCreateLikeLemba()
    {
        // Free plan: max 1 admin circle
        if ($this->plan_tier === 'free') {
            return $this->adminLikeLembas()->count() < 1;
        }
        
        // Starter: max 3
        if ($this->plan_tier === 'starter') {
            return $this->adminLikeLembas()->count() < 3;
        }
        
        // Pro/Premium: unlimited
        return true;
    }

    public function addToWallet($amount, $description = null)
    {
        $this->increment('wallet_balance', $amount);
        
        // Create transaction record
        $this->transactions()->create([
            'type' => 'deposit',
            'amount' => $amount,
            'balance_before' => $this->wallet_balance - $amount,
            'balance_after' => $this->wallet_balance,
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'description' => $description,
            'status' => 'completed'
        ]);
    }

    public function deductFromWallet($amount, $description = null)
    {
        if ($this->wallet_balance < $amount) {
            throw new \Exception('Insufficient balance');
        }
        
        $this->decrement('wallet_balance', $amount);
        
        $this->transactions()->create([
            'type' => 'withdrawal',
            'amount' => $amount,
            'balance_before' => $this->wallet_balance + $amount,
            'balance_after' => $this->wallet_balance,
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'description' => $description,
            'status' => 'completed'
        ]);
    }
}
