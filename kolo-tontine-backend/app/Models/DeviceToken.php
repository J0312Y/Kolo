<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'token',
        'device_type',
        'device_name',
        'platform',
        'app_version',
        'is_active',
        'last_used_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_used_at' => 'datetime',
    ];

    /**
     * Device types: android, ios, web
     */

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
    
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAndroid($query)
    {
        return $query->where('device_type', 'android');
    }

    public function scopeIos($query)
    {
        return $query->where('device_type', 'ios');
    }

    public function scopeWeb($query)
    {
        return $query->where('device_type', 'web');
    }

    /**
     * Helper methods
     */
    
    public function activate()
    {
        $this->update(['is_active' => true]);
    }

    public function deactivate()
    {
        $this->update(['is_active' => false]);
    }

    public function updateLastUsed()
    {
        $this->update(['last_used_at' => now()]);
    }

    public function sendNotification($title, $body, $data = [])
    {
        if (!$this->is_active) {
            return false;
        }

        // This would integrate with FCM, APNs, or Web Push
        // Implementation depends on the push notification service

        $this->updateLastUsed();

        return true;
    }

    /**
     * Static helpers
     */
    
    public static function registerDevice($userId, $token, $deviceType, $deviceInfo = [])
    {
        // Check if token already exists
        $existing = static::where('token', $token)->first();

        if ($existing) {
            // Update existing token
            $existing->update([
                'user_id' => $userId,
                'device_name' => $deviceInfo['device_name'] ?? $existing->device_name,
                'platform' => $deviceInfo['platform'] ?? $existing->platform,
                'app_version' => $deviceInfo['app_version'] ?? $existing->app_version,
                'is_active' => true,
                'last_used_at' => now(),
            ]);

            return $existing;
        }

        // Create new token
        return static::create([
            'user_id' => $userId,
            'token' => $token,
            'device_type' => $deviceType,
            'device_name' => $deviceInfo['device_name'] ?? 'Unknown Device',
            'platform' => $deviceInfo['platform'] ?? 'Unknown',
            'app_version' => $deviceInfo['app_version'] ?? '1.0.0',
            'is_active' => true,
            'last_used_at' => now(),
        ]);
    }

    public static function sendToUser($userId, $title, $body, $data = [])
    {
        $tokens = static::where('user_id', $userId)
            ->active()
            ->get();

        $sentCount = 0;

        foreach ($tokens as $token) {
            if ($token->sendNotification($title, $body, $data)) {
                $sentCount++;
            }
        }

        return $sentCount;
    }

    public static function cleanInactive($days = 90)
    {
        // Remove tokens not used in X days
        static::where('last_used_at', '<', now()->subDays($days))
            ->orWhere('is_active', false)
            ->delete();
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($deviceToken) {
            // Deactivate other tokens for same device
            static::where('user_id', $deviceToken->user_id)
                ->where('device_name', $deviceToken->device_name)
                ->update(['is_active' => false]);
        });
    }
}
