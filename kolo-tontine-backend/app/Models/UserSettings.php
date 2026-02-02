<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSettings extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'language',
        'currency',
        'timezone',
        'theme',
        'notification_email',
        'notification_sms',
        'notification_push',
        'notification_payment_due',
        'notification_payout_received',
        'notification_member_joined',
        'notification_chat_message',
        'notification_goal_milestone',
        'notification_referral',
        'privacy_show_phone',
        'privacy_show_email',
        'privacy_show_in_search',
        'security_biometric_enabled',
        'security_require_passcode_on_launch',
        'display_balance_on_home',
    ];

    protected $casts = [
        'notification_email' => 'boolean',
        'notification_sms' => 'boolean',
        'notification_push' => 'boolean',
        'notification_payment_due' => 'boolean',
        'notification_payout_received' => 'boolean',
        'notification_member_joined' => 'boolean',
        'notification_chat_message' => 'boolean',
        'notification_goal_milestone' => 'boolean',
        'notification_referral' => 'boolean',
        'privacy_show_phone' => 'boolean',
        'privacy_show_email' => 'boolean',
        'privacy_show_in_search' => 'boolean',
        'security_biometric_enabled' => 'boolean',
        'security_require_passcode_on_launch' => 'boolean',
        'display_balance_on_home' => 'boolean',
    ];

    /**
     * Relationships
     */
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper methods
     */
    
    public function enableAllNotifications()
    {
        $this->update([
            'notification_email' => true,
            'notification_sms' => true,
            'notification_push' => true,
            'notification_payment_due' => true,
            'notification_payout_received' => true,
            'notification_member_joined' => true,
            'notification_chat_message' => true,
            'notification_goal_milestone' => true,
            'notification_referral' => true,
        ]);
    }

    public function disableAllNotifications()
    {
        $this->update([
            'notification_email' => false,
            'notification_sms' => false,
            'notification_push' => false,
            'notification_payment_due' => false,
            'notification_payout_received' => false,
            'notification_member_joined' => false,
            'notification_chat_message' => false,
            'notification_goal_milestone' => false,
            'notification_referral' => false,
        ]);
    }

    public function shouldNotify($type)
    {
        $setting = "notification_{$type}";
        
        return $this->$setting ?? true;
    }

    public function setLanguage($language)
    {
        $this->update(['language' => $language]);
        
        // Update user's language preference
        $this->user->update(['language' => $language]);
    }

    /**
     * Static helpers
     */
    
    public static function getDefaults()
    {
        return [
            'language' => 'fr',
            'currency' => 'XAF',
            'timezone' => 'Africa/Brazzaville',
            'theme' => 'light',
            'notification_email' => true,
            'notification_sms' => true,
            'notification_push' => true,
            'notification_payment_due' => true,
            'notification_payout_received' => true,
            'notification_member_joined' => true,
            'notification_chat_message' => true,
            'notification_goal_milestone' => true,
            'notification_referral' => true,
            'privacy_show_phone' => true,
            'privacy_show_email' => false,
            'privacy_show_in_search' => true,
            'security_biometric_enabled' => false,
            'security_require_passcode_on_launch' => false,
            'display_balance_on_home' => true,
        ];
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($settings) {
            // Set defaults if not provided
            $defaults = static::getDefaults();
            
            foreach ($defaults as $key => $value) {
                if (!isset($settings->$key)) {
                    $settings->$key = $value;
                }
            }
        });
    }
}
