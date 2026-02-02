<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicketMessage extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'message',
        'is_staff',
        'attachments',
    ];

    protected $casts = [
        'is_staff' => 'boolean',
        'attachments' => 'array',
    ];

    /**
     * Relationships
     */
    
    public function ticket()
    {
        return $this->belongsTo(SupportTicket::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($message) {
            // Notify user if message is from staff
            if ($message->is_staff && $message->ticket->user_id !== $message->user_id) {
                Notification::create([
                    'user_id' => $message->ticket->user_id,
                    'type' => 'ticket_reply',
                    'title' => 'Ticket Reply',
                    'message' => "New reply on your ticket #{$message->ticket->ticket_number}",
                    'data' => ['ticket_id' => $message->ticket_id],
                ]);
            }
        });
    }
}
