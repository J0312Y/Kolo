<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginHistory extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'device_type',
        'device_name',
        'browser',
        'platform',
        'location_city',
        'location_country',
        'location_latitude',
        'location_longitude',
        'login_successful',
        'failure_reason',
        'logout_at',
    ];

    protected $casts = [
        'login_successful' => 'boolean',
        'location_latitude' => 'decimal:8',
        'location_longitude' => 'decimal:8',
        'logout_at' => 'datetime',
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
    
    public function scopeSuccessful($query)
    {
        return $query->where('login_successful', true);
    }

    public function scopeFailed($query)
    {
        return $query->where('login_successful', false);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeFromIp($query, $ip)
    {
        return $query->where('ip_address', $ip);
    }

    /**
     * Helper methods
     */
    
    public function markLogout()
    {
        $this->update(['logout_at' => now()]);
    }

    public function getSessionDuration()
    {
        if (!$this->logout_at) {
            return null;
        }

        return $this->created_at->diffInMinutes($this->logout_at);
    }

    public function isNewDevice()
    {
        // Check if this device logged in before
        return static::where('user_id', $this->user_id)
            ->where('device_name', $this->device_name)
            ->where('id', '!=', $this->id)
            ->doesntExist();
    }

    public function isSuspiciousLocation()
    {
        if (!$this->location_country) {
            return false;
        }

        // Check if user normally logs in from different country
        $usualCountry = static::where('user_id', $this->user_id)
            ->where('login_successful', true)
            ->where('id', '!=', $this->id)
            ->groupBy('location_country')
            ->orderByRaw('COUNT(*) DESC')
            ->value('location_country');

        return $usualCountry && $usualCountry !== $this->location_country;
    }

    /**
     * Static helpers
     */
    
    public static function logLogin($user, $request, $successful = true, $failureReason = null)
    {
        $userAgent = $request->userAgent();
        
        return static::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $userAgent,
            'device_type' => static::detectDeviceType($userAgent),
            'device_name' => static::detectDeviceName($userAgent),
            'browser' => static::detectBrowser($userAgent),
            'platform' => static::detectPlatform($userAgent),
            'login_successful' => $successful,
            'failure_reason' => $failureReason,
            // Location data would come from IP geolocation service
        ]);
    }

    protected static function detectDeviceType($userAgent)
    {
        if (preg_match('/mobile|android|iphone/i', $userAgent)) {
            return 'mobile';
        } elseif (preg_match('/tablet|ipad/i', $userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }

    protected static function detectDeviceName($userAgent)
    {
        if (preg_match('/iPhone/i', $userAgent)) return 'iPhone';
        if (preg_match('/iPad/i', $userAgent)) return 'iPad';
        if (preg_match('/Android/i', $userAgent)) return 'Android Device';
        return 'Desktop';
    }

    protected static function detectBrowser($userAgent)
    {
        if (preg_match('/Chrome/i', $userAgent)) return 'Chrome';
        if (preg_match('/Safari/i', $userAgent)) return 'Safari';
        if (preg_match('/Firefox/i', $userAgent)) return 'Firefox';
        if (preg_match('/Edge/i', $userAgent)) return 'Edge';
        return 'Unknown';
    }

    protected static function detectPlatform($userAgent)
    {
        if (preg_match('/Windows/i', $userAgent)) return 'Windows';
        if (preg_match('/Mac/i', $userAgent)) return 'macOS';
        if (preg_match('/Linux/i', $userAgent)) return 'Linux';
        if (preg_match('/Android/i', $userAgent)) return 'Android';
        if (preg_match('/iOS/i', $userAgent)) return 'iOS';
        return 'Unknown';
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($login) {
            // Alert user of new device login
            if ($login->login_successful && $login->isNewDevice()) {
                Notification::create([
                    'user_id' => $login->user_id,
                    'type' => 'new_device_login',
                    'title' => 'New Device Login',
                    'message' => "Login detected from new {$login->device_type}: {$login->device_name}",
                    'data' => ['login_id' => $login->id],
                ]);
            }

            // Alert of suspicious location
            if ($login->login_successful && $login->isSuspiciousLocation()) {
                Notification::create([
                    'user_id' => $login->user_id,
                    'type' => 'suspicious_login',
                    'title' => 'Unusual Login Location',
                    'message' => "Login detected from {$login->location_city}, {$login->location_country}",
                    'data' => ['login_id' => $login->id],
                ]);
            }
        });
    }
}
