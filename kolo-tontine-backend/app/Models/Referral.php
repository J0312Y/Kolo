<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasFactory;

    protected $fillable = [
        'referrer_id',
        'referred_id',
        'referral_code',
        'reward_amount',
        'reward_status',
        'reward_paid_at',
        'referred_completed_first_circle',
    ];

    protected $casts = [
        'reward_amount' => 'decimal:2',
        'referred_completed_first_circle' => 'boolean',
        'reward_paid_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    
    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referred()
    {
        return $this->belongsTo(User::class, 'referred_id');
    }

    /**
     * Scopes
     */
    
    public function scopePending($query)
    {
        return $query->where('reward_status', 'pending');
    }

    public function scopeEarned($query)
    {
        return $query->where('reward_status', 'earned');
    }

    public function scopePaid($query)
    {
        return $query->where('reward_status', 'paid');
    }

    /**
     * Helper methods
     */
    
    public function markAsEarned()
    {
        $this->update(['reward_status' => 'earned']);
    }

    public function payReward()
    {
        if ($this->reward_status !== 'earned') {
            throw new \Exception('Reward not earned yet');
        }

        // Add reward to referrer's wallet
        $this->referrer->addToWallet(
            $this->reward_amount,
            "Referral reward for inviting {$this->referred->full_name}"
        );

        $this->update([
            'reward_status' => 'paid',
            'reward_paid_at' => now(),
        ]);

        // Create notification
        Notification::create([
            'user_id' => $this->referrer_id,
            'type' => 'referral_reward',
            'title' => 'Referral Reward Earned!',
            'message' => "You earned {$this->reward_amount} XAF for referring {$this->referred->full_name}",
            'data' => json_encode([
                'referral_id' => $this->id,
                'amount' => $this->reward_amount,
            ]),
        ]);
    }

    public function checkEligibility()
    {
        // Check if referred user completed first circle
        $firstCircle = LikeLembaMember::where('user_id', $this->referred_id)
            ->where('status', 'completed')
            ->first();

        if ($firstCircle && !$this->referred_completed_first_circle) {
            $this->update([
                'referred_completed_first_circle' => true,
                'reward_status' => 'earned',
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

        static::created(function ($referral) {
            // Send notification to referrer
            Notification::create([
                'user_id' => $referral->referrer_id,
                'type' => 'new_referral',
                'title' => 'New Referral!',
                'message' => "{$referral->referred->full_name} joined using your referral code",
                'data' => json_encode([
                    'referral_id' => $referral->id,
                    'referred_user' => $referral->referred->full_name,
                ]),
            ]);
        });
    }
}
