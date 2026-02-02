<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    const UPDATED_AT = null; // No updated_at column

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scopes
     */
    
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Helper methods
     */
    
    public function markAsRead()
    {
        if (is_null($this->read_at)) {
            $this->update(['read_at' => now()]);
        }
    }

    public function markAsUnread()
    {
        $this->update(['read_at' => null]);
    }

    public function isRead()
    {
        return !is_null($this->read_at);
    }

    /**
     * Static helper methods
     */
    
    public static function createPaymentDue($userId, $likeLemba, $amount, $dueDate)
    {
        return static::create([
            'user_id' => $userId,
            'type' => 'payment_due',
            'title' => 'Payment Due',
            'message' => "Your payment of {$amount} XAF for {$likeLemba->name} is due on {$dueDate->format('M d, Y')}",
            'data' => [
                'likeLemba_id' => $likeLemba->id,
                'amount' => $amount,
                'due_date' => $dueDate->toDateString(),
            ],
        ]);
    }

    public static function createPayoutReceived($userId, $likeLemba, $amount)
    {
        return static::create([
            'user_id' => $userId,
            'type' => 'payout_received',
            'title' => 'Payout Received!',
            'message' => "You received {$amount} XAF from {$likeLemba->name}",
            'data' => [
                'likeLemba_id' => $likeLemba->id,
                'amount' => $amount,
            ],
        ]);
    }

    public static function createMemberJoined($userId, $likeLemba, $newMember)
    {
        return static::create([
            'user_id' => $userId,
            'type' => 'member_joined',
            'title' => 'New Member Joined',
            'message' => "{$newMember->full_name} joined {$likeLemba->name}",
            'data' => [
                'likeLemba_id' => $likeLemba->id,
                'new_member_id' => $newMember->id,
            ],
        ]);
    }

    public static function createCircleStarted($userId, $likeLemba)
    {
        return static::create([
            'user_id' => $userId,
            'type' => 'circle_started',
            'title' => 'Circle Started!',
            'message' => "{$likeLemba->name} is now active and ready for contributions",
            'data' => [
                'likeLemba_id' => $likeLemba->id,
            ],
        ]);
    }

    public static function createGoalCompleted($userId, $goal)
    {
        return static::create([
            'user_id' => $userId,
            'type' => 'goal_completed',
            'title' => 'Goal Completed! 🎉',
            'message' => "Congratulations! You've reached your goal: {$goal->name}",
            'data' => [
                'goal_id' => $goal->id,
                'amount' => $goal->target_amount,
            ],
        ]);
    }
}
