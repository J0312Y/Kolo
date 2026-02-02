<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ticket_number',
        'category',
        'subject',
        'description',
        'priority',
        'status',
        'assigned_to',
        'resolved_at',
        'closed_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    /**
     * Categories: account, payment, circle, technical, other
     * Priority: low, medium, high, urgent
     * Status: open, in_progress, resolved, closed
     */

    /**
     * Relationships
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function messages()
    {
        return $this->hasMany(SupportTicketMessage::class, 'ticket_id');
    }

    /**
     * Scopes
     */
    
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function scopeUrgent($query)
    {
        return $query->where('priority', 'urgent');
    }

    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Helper methods
     */
    
    public function assignTo($adminId)
    {
        $this->update([
            'assigned_to' => $adminId,
            'status' => 'in_progress',
        ]);
    }

    public function resolve()
    {
        $this->update([
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);

        // Notify user
        Notification::create([
            'user_id' => $this->user_id,
            'type' => 'ticket_resolved',
            'title' => 'Ticket Resolved',
            'message' => "Your support ticket #{$this->ticket_number} has been resolved",
            'data' => ['ticket_id' => $this->id],
        ]);
    }

    public function close()
    {
        $this->update([
            'status' => 'closed',
            'closed_at' => now(),
        ]);
    }

    public function reopen()
    {
        $this->update([
            'status' => 'open',
            'resolved_at' => null,
            'closed_at' => null,
        ]);
    }

    public function addMessage($userId, $message, $isStaff = false)
    {
        return SupportTicketMessage::create([
            'ticket_id' => $this->id,
            'user_id' => $userId,
            'message' => $message,
            'is_staff' => $isStaff,
        ]);
    }

    public function getResponseTime()
    {
        $firstMessage = $this->messages()->where('is_staff', true)->first();
        
        if (!$firstMessage) {
            return null;
        }

        return $this->created_at->diffInMinutes($firstMessage->created_at);
    }

    public function getResolutionTime()
    {
        if (!$this->resolved_at) {
            return null;
        }

        return $this->created_at->diffInHours($this->resolved_at);
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ticket) {
            // Generate ticket number
            if (!$ticket->ticket_number) {
                $year = date('Y');
                $count = static::whereYear('created_at', $year)->count() + 1;
                $ticket->ticket_number = "TKT-{$year}-" . str_pad($count, 5, '0', STR_PAD_LEFT);
            }

            // Default status
            if (!$ticket->status) {
                $ticket->status = 'open';
            }

            // Default priority
            if (!$ticket->priority) {
                $ticket->priority = 'medium';
            }
        });

        static::created(function ($ticket) {
            // Notify admins of new ticket
            // This would typically send to admin queue
        });
    }
}
