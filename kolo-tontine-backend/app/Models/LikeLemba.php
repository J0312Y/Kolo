<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikeLemba extends Model
{
    use HasFactory;

    protected $table = 'likeLembas';

    protected $fillable = [
        'admin_id',
        'name',
        'description',
        'invitation_code',
        'contribution_amount',
        'duration_months',
        'total_slots',
        'status',
        'current_members',
        'start_date',
        'end_date',
        'next_payout_date',
        'allow_join',
        'is_private',
    ];

    protected $casts = [
        'contribution_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'next_payout_date' => 'date',
        'allow_join' => 'boolean',
        'is_private' => 'boolean',
    ];

    /**
     * Relationships
     */
    
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function members()
    {
        return $this->hasMany(LikeLembaMember::class, 'likeLemba_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'likeLemba_members')
            ->withPivot('slot_number', 'payout_month', 'total_paid', 'payments_made', 'payments_remaining', 'status')
            ->withTimestamps();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'likeLemba_id');
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class, 'likeLemba_id');
    }

    /**
     * Scopes
     */
    
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePublic($query)
    {
        return $query->where('is_private', false)
                    ->where('allow_join', true)
                    ->where('status', 'pending')
                    ->whereColumn('current_members', '<', 'total_slots');
    }

    /**
     * Helper methods
     */
    
    public function isFull()
    {
        return $this->current_members >= $this->total_slots;
    }

    public function canJoin()
    {
        return $this->allow_join && 
               !$this->isFull() && 
               $this->status === 'pending';
    }

    public function isUserMember($userId)
    {
        return $this->members()->where('user_id', $userId)->exists();
    }

    public function isUserAdmin($userId)
    {
        return $this->admin_id === $userId;
    }

    public function getAvailableSlots()
    {
        $takenSlots = $this->members()->pluck('slot_number')->toArray();
        $allSlots = range(1, $this->total_slots);
        return array_values(array_diff($allSlots, $takenSlots));
    }

    public function getTotalContributed()
    {
        return $this->payments()
            ->where('status', 'completed')
            ->where('payment_type', 'contribution')
            ->sum('amount');
    }

    public function getExpectedTotal()
    {
        return $this->contribution_amount * $this->duration_months * $this->total_slots;
    }

    public function getNextPayoutMember()
    {
        return $this->members()
            ->where('has_received_payout', false)
            ->orderBy('slot_number')
            ->first();
    }

    public function calculateMonthlyPayout()
    {
        return $this->contribution_amount * $this->current_members;
    }

    public function startCircle()
    {
        if ($this->isFull()) {
            $this->update([
                'status' => 'active',
                'start_date' => now(),
                'end_date' => now()->addMonths($this->duration_months),
                'next_payout_date' => now()->addMonth(),
            ]);
            
            return true;
        }
        
        return false;
    }

    public function processMonthlyPayout()
    {
        $nextMember = $this->getNextPayoutMember();
        
        if (!$nextMember) {
            // All members received payout, complete circle
            $this->update(['status' => 'completed']);
            return null;
        }

        $payoutAmount = $this->calculateMonthlyPayout();

        // Mark member as received payout
        $nextMember->update([
            'has_received_payout' => true,
            'payout_date' => now(),
            'payout_amount' => $payoutAmount,
        ]);

        // Add to user's wallet
        $nextMember->user->addToWallet($payoutAmount, "Payout from {$this->name}");

        // Update next payout date
        $this->update([
            'next_payout_date' => now()->addMonth(),
        ]);

        return $nextMember;
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($likeLemba) {
            // Generate unique invitation code if not set
            if (!$likeLemba->invitation_code) {
                do {
                    $code = strtoupper(substr(md5(uniqid()), 0, 8));
                } while (static::where('invitation_code', $code)->exists());
                
                $likeLemba->invitation_code = $code;
            }
        });
    }
}
