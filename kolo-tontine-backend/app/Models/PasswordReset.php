<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PasswordReset extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'email',
        'phone',
        'token',
        'otp',
        'expires_at',
        'used_at',
        'ip_address',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    protected $hidden = [
        'token',
        'otp',
    ];

    /**
     * Scopes
     */
    
    public function scopeValid($query)
    {
        return $query->whereNull('used_at')
                    ->where('expires_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    public function scopeUsed($query)
    {
        return $query->whereNotNull('used_at');
    }

    /**
     * Helper methods
     */
    
    public function isValid()
    {
        return is_null($this->used_at) && $this->expires_at->isFuture();
    }

    public function isExpired()
    {
        return $this->expires_at->isPast();
    }

    public function isUsed()
    {
        return !is_null($this->used_at);
    }

    public function markAsUsed()
    {
        $this->update(['used_at' => now()]);
    }

    public function verifyOTP($otp)
    {
        return $this->otp === $otp && $this->isValid();
    }

    public function verifyToken($token)
    {
        return hash_equals($this->token, hash('sha256', $token)) && $this->isValid();
    }

    /**
     * Static factory methods
     */
    
    public static function createForEmail($email, $ipAddress = null)
    {
        // Invalidate previous tokens
        static::where('email', $email)
            ->whereNull('used_at')
            ->delete();

        $token = Str::random(60);

        return static::create([
            'email' => $email,
            'token' => hash('sha256', $token),
            'expires_at' => now()->addHour(),
            'ip_address' => $ipAddress,
        ]);
    }

    public static function createForPhone($phone, $ipAddress = null)
    {
        // Invalidate previous OTPs
        static::where('phone', $phone)
            ->whereNull('used_at')
            ->delete();

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        return static::create([
            'phone' => $phone,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(10),
            'ip_address' => $ipAddress,
        ]);
    }

    public static function findByEmailAndToken($email, $token)
    {
        return static::where('email', $email)
            ->valid()
            ->get()
            ->first(function ($reset) use ($token) {
                return hash_equals($reset->token, hash('sha256', $token));
            });
    }

    public static function findByPhoneAndOTP($phone, $otp)
    {
        return static::where('phone', $phone)
            ->where('otp', $otp)
            ->valid()
            ->first();
    }

    /**
     * Clean up expired tokens
     */
    public static function cleanExpired()
    {
        static::expired()->delete();
        static::used()->where('used_at', '<', now()->subDays(7))->delete();
    }
}
