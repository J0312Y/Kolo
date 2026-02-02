<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LikeLemba;
use App\Models\LikeLembaMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LikeLembaController extends Controller
{
    /**
     * Get user's likeLembas (circles)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $likeLembas = LikeLemba::whereHas('members', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['admin', 'members.user'])
        ->get()
        ->map(function($likeLemba) use ($user) {
            $member = $likeLemba->members->where('user_id', $user->id)->first();
            
            return [
                'id' => $likeLemba->id,
                'name' => $likeLemba->name,
                'description' => $likeLemba->description,
                'contribution_amount' => $likeLemba->contribution_amount,
                'duration_months' => $likeLemba->duration_months,
                'total_slots' => $likeLemba->total_slots,
                'current_members' => $likeLemba->current_members,
                'status' => $likeLemba->status,
                'next_payout_date' => $likeLemba->next_payout_date,
                'is_admin' => $likeLemba->admin_id === $user->id,
                'my_slot' => $member ? $member->slot_number : null,
                'payments_made' => $member ? $member->payments_made : 0,
                'payments_remaining' => $member ? $member->payments_remaining : 0,
                'total_paid' => $member ? $member->total_paid : 0,
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => $likeLembas
        ]);
    }
    
    /**
     * Get single likeLemba details
     */
    public function show($id)
    {
        $likeLemba = LikeLemba::with(['admin', 'members.user'])->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $likeLemba
        ]);
    }
    
    /**
     * Create new likeLemba
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'contribution_amount' => 'required|numeric|min:1000',
            'duration_months' => 'required|integer|min:3|max:24',
            'total_slots' => 'required|integer|min:2|max:50',
            'is_private' => 'boolean'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = $request->user();
        
        // Generate unique invitation code
        $invitationCode = strtoupper(Str::random(8));
        while (LikeLemba::where('invitation_code', $invitationCode)->exists()) {
            $invitationCode = strtoupper(Str::random(8));
        }
        
        DB::beginTransaction();
        
        try {
            // Create likeLemba
            $likeLemba = LikeLemba::create([
                'admin_id' => $user->id,
                'name' => $request->name,
                'description' => $request->description,
                'invitation_code' => $invitationCode,
                'contribution_amount' => $request->contribution_amount,
                'duration_months' => $request->duration_months,
                'total_slots' => $request->total_slots,
                'is_private' => $request->is_private ?? false,
                'status' => 'pending',
                'current_members' => 1
            ]);
            
            // Add admin as first member (slot 1)
            LikeLembaMember::create([
                'likeLemba_id' => $likeLemba->id,
                'user_id' => $user->id,
                'slot_number' => 1,
                'payout_month' => 1,
                'payments_remaining' => $request->duration_months
            ]);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'LikeLemba created successfully',
                'data' => $likeLemba
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create likeLemba',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Join likeLemba with invitation code
     */
    public function joinWithCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'invitation_code' => 'required|string',
            'slot_number' => 'required|integer|min:1'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = $request->user();
        $likeLemba = LikeLemba::where('invitation_code', $request->invitation_code)->first();
        
        if (!$likeLemba) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid invitation code'
            ], 404);
        }
        
        // Check if user already member
        if ($likeLemba->members()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'You are already a member of this circle'
            ], 400);
        }
        
        // Check if circle is full
        if ($likeLemba->current_members >= $likeLemba->total_slots) {
            return response()->json([
                'success' => false,
                'message' => 'This circle is already full'
            ], 400);
        }
        
        // Check if slot is available
        if ($likeLemba->members()->where('slot_number', $request->slot_number)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This slot is already taken'
            ], 400);
        }
        
        DB::beginTransaction();
        
        try {
            // Add member
            LikeLembaMember::create([
                'likeLemba_id' => $likeLemba->id,
                'user_id' => $user->id,
                'slot_number' => $request->slot_number,
                'payout_month' => $request->slot_number,
                'payments_remaining' => $likeLemba->duration_months
            ]);
            
            // Update member count
            $likeLemba->increment('current_members');
            
            // Start circle if all slots filled
            if ($likeLemba->current_members >= $likeLemba->total_slots) {
                $likeLemba->update([
                    'status' => 'active',
                    'start_date' => now(),
                    'next_payout_date' => now()->addMonth()
                ]);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully joined the circle',
                'data' => $likeLemba->fresh()
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to join circle',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get available slots
     */
    public function getAvailableSlots($id)
    {
        $likeLemba = LikeLemba::findOrFail($id);
        
        $takenSlots = $likeLemba->members()->pluck('slot_number')->toArray();
        $allSlots = range(1, $likeLemba->total_slots);
        $availableSlots = array_diff($allSlots, $takenSlots);
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_slots' => $likeLemba->total_slots,
                'taken_slots' => $takenSlots,
                'available_slots' => array_values($availableSlots)
            ]
        ]);
    }
    
    /**
     * Get likeLemba members
     */
    public function getMembers($id)
    {
        $likeLemba = LikeLemba::findOrFail($id);
        
        $members = $likeLemba->members()
            ->with('user')
            ->orderBy('slot_number')
            ->get()
            ->map(function($member) {
                return [
                    'id' => $member->id,
                    'user' => [
                        'id' => $member->user->id,
                        'name' => $member->user->first_name . ' ' . $member->user->last_name,
                        'phone' => $member->user->phone
                    ],
                    'slot_number' => $member->slot_number,
                    'payout_month' => $member->payout_month,
                    'total_paid' => $member->total_paid,
                    'payments_made' => $member->payments_made,
                    'payments_remaining' => $member->payments_remaining,
                    'status' => $member->status,
                    'has_received_payout' => $member->has_received_payout
                ];
            });
        
        return response()->json([
            'success' => true,
            'data' => $members
        ]);
    }
    
    /**
     * Get chat messages
     */
    public function getChatMessages($id)
    {
        $likeLemba = LikeLemba::findOrFail($id);
        
        $messages = $likeLemba->chatMessages()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get()
            ->map(function($message) {
                return [
                    'id' => $message->id,
                    'user' => [
                        'id' => $message->user->id,
                        'name' => $message->user->first_name . ' ' . $message->user->last_name
                    ],
                    'message' => $message->message,
                    'created_at' => $message->created_at->toDateTimeString()
                ];
            });
        
        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }
    
    /**
     * Send chat message
     */
    public function sendChatMessage(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = $request->user();
        $likeLemba = LikeLemba::findOrFail($id);
        
        // Check if user is member
        if (!$likeLemba->members()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Only members can send messages'
            ], 403);
        }
        
        $message = $likeLemba->chatMessages()->create([
            'user_id' => $user->id,
            'message' => $request->message
        ]);
        
        return response()->json([
            'success' => true,
            'data' => $message
        ]);
    }
    
    /**
     * Validate invitation code (public)
     */
    public function validateInvitationCode($code)
    {
        $likeLemba = LikeLemba::where('invitation_code', $code)
            ->with('admin')
            ->first();
        
        if (!$likeLemba) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid invitation code'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $likeLemba->id,
                'name' => $likeLemba->name,
                'description' => $likeLemba->description,
                'contribution_amount' => $likeLemba->contribution_amount,
                'duration_months' => $likeLemba->duration_months,
                'total_slots' => $likeLemba->total_slots,
                'current_members' => $likeLemba->current_members,
                'available_slots' => $likeLemba->total_slots - $likeLemba->current_members,
                'admin_name' => $likeLemba->admin->first_name . ' ' . $likeLemba->admin->last_name
            ]
        ]);
    }
}
