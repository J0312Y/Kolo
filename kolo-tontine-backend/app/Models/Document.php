<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    const UPDATED_AT = null; // No updated_at column

    protected $fillable = [
        'user_id',
        'type',
        'file_path',
        'status',
        'notes',
        'verified_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
        'verified_at' => 'datetime',
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
    
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeNationalId($query)
    {
        return $query->where('type', 'national_id');
    }

    public function scopeUtilityBill($query)
    {
        return $query->where('type', 'utility_bill');
    }

    public function scopeProofOfIncome($query)
    {
        return $query->where('type', 'proof_income');
    }

    /**
     * Helper methods
     */
    
    public function approve($notes = null)
    {
        $this->update([
            'status' => 'approved',
            'verified_at' => now(),
            'notes' => $notes,
        ]);

        // Notify user
        Notification::create([
            'user_id' => $this->user_id,
            'type' => 'document_approved',
            'title' => 'Document Approved',
            'message' => "Your {$this->getTypeLabel()} has been approved",
            'data' => ['document_id' => $this->id],
        ]);
    }

    public function reject($reason)
    {
        $this->update([
            'status' => 'rejected',
            'notes' => $reason,
        ]);

        // Notify user
        Notification::create([
            'user_id' => $this->user_id,
            'type' => 'document_rejected',
            'title' => 'Document Rejected',
            'message' => "Your {$this->getTypeLabel()} was rejected: {$reason}",
            'data' => ['document_id' => $this->id],
        ]);
    }

    public function getFileUrl()
    {
        return asset('storage/' . $this->file_path);
    }

    public function getTypeLabel()
    {
        return match($this->type) {
            'national_id' => 'National ID',
            'utility_bill' => 'Utility Bill',
            'proof_income' => 'Proof of Income',
            default => 'Document',
        };
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isRejected()
    {
        return $this->status === 'rejected';
    }
}
