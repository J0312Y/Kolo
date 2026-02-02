<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    const UPDATED_AT = null; // No updated_at column

    protected $fillable = [
        'likeLemba_id',
        'user_id',
        'message',
    ];

    /**
     * Relationships
     */
    
    public function likeLemba()
    {
        return $this->belongsTo(LikeLemba::class, 'likeLemba_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scopes
     */
    
    public function scopeRecent($query, $limit = 50)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Helper methods
     */
    
    public function isOwnMessage($userId)
    {
        return $this->user_id === $userId;
    }

    public function getTimeAgo()
    {
        return $this->created_at->diffForHumans();
    }
}
