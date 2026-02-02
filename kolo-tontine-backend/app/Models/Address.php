<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'label',
        'street_address',
        'apartment',
        'city',
        'state',
        'postal_code',
        'country',
        'is_default',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
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
    
    public function scopeHome($query)
    {
        return $query->where('type', 'home');
    }

    public function scopeWork($query)
    {
        return $query->where('type', 'work');
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Accessors
     */
    
    public function getFullAddressAttribute()
    {
        $parts = array_filter([
            $this->street_address,
            $this->apartment,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country,
        ]);

        return implode(', ', $parts);
    }

    public function getShortAddressAttribute()
    {
        $parts = array_filter([
            $this->street_address,
            $this->city,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Helper methods
     */
    
    public function setAsDefault()
    {
        // Unset other default addresses for this user
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }

    public function isComplete()
    {
        return !empty($this->street_address) && 
               !empty($this->city) && 
               !empty($this->country);
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($address) {
            // If this is the first address, make it default
            $userAddressCount = static::where('user_id', $address->user_id)->count();
            
            if ($userAddressCount === 0) {
                $address->is_default = true;
            }
        });

        static::deleting(function ($address) {
            // If deleting default address, set another as default
            if ($address->is_default) {
                $nextAddress = static::where('user_id', $address->user_id)
                    ->where('id', '!=', $address->id)
                    ->first();

                if ($nextAddress) {
                    $nextAddress->update(['is_default' => true]);
                }
            }
        });
    }
}
