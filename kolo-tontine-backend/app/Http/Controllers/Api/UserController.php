<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'wallet_balance' => $user->wallet_balance ?? 0,
                'card_balance' => $user->card_balance ?? 0,
                'plan' => [
                    'tier' => $user->plan_tier ?? 'bronze',
                    'name' => ucfirst($user->plan_tier ?? 'bronze'),
                ],
            ],
        ]);
    }

    /**
     * Update profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'phone' => [
                'sometimes',
                'required',
                'unique:users,phone,' . $user->id,
                'regex:/^\+242[0-9]{9}$/'
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only(['first_name', 'last_name', 'phone']));

        return response()->json([
            'success' => true,
            'data' => ['user' => $user],
            'message' => 'Profil mis à jour'
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe actuel incorrect'
            ], 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe changé avec succès'
        ]);
    }

    /**
     * Change passcode (4-digit PIN)
     */
    public function changePasscode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'new_passcode' => 'required|digits:4|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $request->user()->update(['passcode' => Hash::make($request->new_passcode)]);

        return response()->json([
            'success' => true,
            'message' => 'Code de sécurité changé'
        ]);
    }

    /**
     * Upload document (KYC)
     */
    public function uploadDocument(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document_type' => 'required|in:national_id,passport,proof_of_address',
            'document_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Document uploadé avec succès'
        ]);
    }

    /**
     * Get support tickets for authenticated user
     */
    public function getSupportTickets(Request $request)
    {
        try {
            $user = $request->user();

            $query = \App\Models\SupportTicket::where('user_id', $user->id);

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by category if provided
            if ($request->has('category')) {
                $query->category($request->category);
            }

            // Order by most recent first
            $tickets = $query->orderBy('created_at', 'desc')->get();

            // Format tickets for response
            $formattedTickets = $tickets->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'category' => $ticket->category,
                    'subject' => $ticket->subject,
                    'description' => $ticket->description,
                    'priority' => $ticket->priority,
                    'status' => $ticket->status,
                    'created_at' => $ticket->created_at->toISOString(),
                    'updated_at' => $ticket->updated_at->toISOString(),
                    'resolved_at' => $ticket->resolved_at?->toISOString(),
                    'closed_at' => $ticket->closed_at?->toISOString(),
                    'message_count' => $ticket->messages()->count(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedTickets,
                'message' => 'Support tickets retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve support tickets',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a support ticket
     */
    public function createSupportTicket(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category' => 'required|in:account,payment,circle,technical,other',
                'subject' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'sometimes|in:low,medium,high,urgent',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            $ticket = \App\Models\SupportTicket::create([
                'user_id' => $user->id,
                'category' => $request->category,
                'subject' => $request->subject,
                'description' => $request->description,
                'priority' => $request->priority ?? 'medium',
                'status' => 'open',
            ]);

            return response()->json([
                'success' => true,
                'data' => $ticket,
                'message' => 'Support ticket created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create support ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get subscription plans
     */
    public function getPlans()
    {
        try {
            $plans = [
                [
                    'id' => 1,
                    'tier' => 'bronze',
                    'name' => 'Bronze',
                    'price' => 0,
                    'features' => [
                        'Join up to 3 circles',
                        'Basic wallet features',
                        'Standard support',
                    ],
                ],
                [
                    'id' => 2,
                    'tier' => 'silver',
                    'name' => 'Silver',
                    'price' => 2500,
                    'features' => [
                        'Join up to 10 circles',
                        'Advanced wallet features',
                        'Priority support',
                        'Transaction history export',
                    ],
                ],
                [
                    'id' => 3,
                    'tier' => 'gold',
                    'name' => 'Gold',
                    'price' => 5000,
                    'features' => [
                        'Unlimited circles',
                        'Premium wallet features',
                        'VIP support',
                        'Advanced analytics',
                        'Custom circle settings',
                    ],
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $plans,
                'message' => 'Plans retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve plans',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get plan features
     */
    public function getPlanFeatures()
    {
        try {
            $features = [
                'bronze' => [
                    'max_circles' => 3,
                    'wallet_advanced' => false,
                    'support_level' => 'standard',
                    'export_transactions' => false,
                    'analytics' => false,
                ],
                'silver' => [
                    'max_circles' => 10,
                    'wallet_advanced' => true,
                    'support_level' => 'priority',
                    'export_transactions' => true,
                    'analytics' => false,
                ],
                'gold' => [
                    'max_circles' => -1, // unlimited
                    'wallet_advanced' => true,
                    'support_level' => 'vip',
                    'export_transactions' => true,
                    'analytics' => true,
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $features,
                'message' => 'Plan features retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve plan features',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upgrade plan
     */
    public function upgradePlan(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'plan_tier' => 'required|in:bronze,silver,gold',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            // Update user's plan
            $user->update(['plan_tier' => $request->plan_tier]);

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user->fresh(),
                    'plan' => [
                        'tier' => $user->plan_tier,
                        'name' => ucfirst($user->plan_tier),
                    ],
                ],
                'message' => 'Plan upgraded successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upgrade plan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get FAQ
     */
    public function getFAQ()
    {
        try {
            $faqs = [
                [
                    'id' => 1,
                    'category' => 'account',
                    'question' => 'How do I reset my password?',
                    'answer' => 'You can reset your password by clicking on "Forgot Password" on the login screen and following the instructions sent to your email.',
                ],
                [
                    'id' => 2,
                    'category' => 'circles',
                    'question' => 'How do I create a circle?',
                    'answer' => 'Go to the Circles tab, click on "Create Circle", and fill in the required information including circle name, amount, and duration.',
                ],
                [
                    'id' => 3,
                    'category' => 'payment',
                    'question' => 'What payment methods are accepted?',
                    'answer' => 'We accept MTN Mobile Money, Airtel Money, and bank transfers.',
                ],
                [
                    'id' => 4,
                    'category' => 'wallet',
                    'question' => 'How do I withdraw from my wallet?',
                    'answer' => 'Go to the Wallet tab, click on "Withdraw", enter the amount and select your preferred withdrawal method.',
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $faqs,
                'message' => 'FAQ retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve FAQ',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
