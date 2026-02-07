<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GoalController extends Controller
{
    /**
     * Get all goals for the authenticated user
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            $query = Goal::where('user_id', $user->id);

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $goals = $query->orderBy('created_at', 'desc')->get();

            // Add computed attributes
            $goals = $goals->map(function ($goal) {
                return [
                    'id' => $goal->id,
                    'name' => $goal->name,
                    'description' => $goal->description,
                    'icon' => $goal->icon,
                    'color' => $goal->color,
                    'target_amount' => (float) $goal->target_amount,
                    'current_amount' => (float) $goal->current_amount,
                    'target_date' => $goal->target_date?->format('Y-m-d'),
                    'status' => $goal->status,
                    'auto_save_enabled' => $goal->auto_save_enabled,
                    'auto_save_amount' => (float) $goal->auto_save_amount,
                    'auto_save_frequency' => $goal->auto_save_frequency,
                    'progress_percentage' => $goal->progress_percentage,
                    'remaining_amount' => $goal->remaining_amount,
                    'days_remaining' => $goal->days_remaining,
                    'is_on_track' => $goal->isOnTrack(),
                    'monthly_target' => $goal->getMonthlyTargetAmount(),
                    'created_at' => $goal->created_at->toISOString(),
                    'updated_at' => $goal->updated_at->toISOString(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $goals,
                'message' => 'Goals retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve goals',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific goal
     */
    public function show($id)
    {
        try {
            $user = Auth::user();

            $goal = Goal::where('user_id', $user->id)->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $goal->id,
                    'name' => $goal->name,
                    'description' => $goal->description,
                    'icon' => $goal->icon,
                    'color' => $goal->color,
                    'target_amount' => (float) $goal->target_amount,
                    'current_amount' => (float) $goal->current_amount,
                    'target_date' => $goal->target_date?->format('Y-m-d'),
                    'status' => $goal->status,
                    'auto_save_enabled' => $goal->auto_save_enabled,
                    'auto_save_amount' => (float) $goal->auto_save_amount,
                    'auto_save_frequency' => $goal->auto_save_frequency,
                    'progress_percentage' => $goal->progress_percentage,
                    'remaining_amount' => $goal->remaining_amount,
                    'days_remaining' => $goal->days_remaining,
                    'is_on_track' => $goal->isOnTrack(),
                    'monthly_target' => $goal->getMonthlyTargetAmount(),
                    'created_at' => $goal->created_at->toISOString(),
                    'updated_at' => $goal->updated_at->toISOString(),
                ],
                'message' => 'Goal retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Goal not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new goal
     */
    public function create(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'icon' => 'nullable|string',
                'color' => 'nullable|string',
                'target_amount' => 'required|numeric|min:0',
                'target_date' => 'nullable|date|after:today',
                'auto_save_enabled' => 'boolean',
                'auto_save_amount' => 'nullable|numeric|min:0',
                'auto_save_frequency' => 'nullable|in:daily,weekly,monthly',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();

            $goal = Goal::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'description' => $request->description,
                'icon' => $request->icon ?? '🎯',
                'color' => $request->color ?? '#3B82F6',
                'target_amount' => $request->target_amount,
                'current_amount' => 0,
                'target_date' => $request->target_date,
                'status' => 'active',
                'auto_save_enabled' => $request->auto_save_enabled ?? false,
                'auto_save_amount' => $request->auto_save_amount,
                'auto_save_frequency' => $request->auto_save_frequency ?? 'monthly',
            ]);

            return response()->json([
                'success' => true,
                'data' => $goal,
                'message' => 'Goal created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create goal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a goal
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $goal = Goal::where('user_id', $user->id)->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'icon' => 'nullable|string',
                'color' => 'nullable|string',
                'target_amount' => 'sometimes|numeric|min:0',
                'target_date' => 'nullable|date',
                'auto_save_enabled' => 'boolean',
                'auto_save_amount' => 'nullable|numeric|min:0',
                'auto_save_frequency' => 'nullable|in:daily,weekly,monthly',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $goal->update($request->only([
                'name', 'description', 'icon', 'color', 'target_amount',
                'target_date', 'auto_save_enabled', 'auto_save_amount', 'auto_save_frequency'
            ]));

            return response()->json([
                'success' => true,
                'data' => $goal->fresh(),
                'message' => 'Goal updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update goal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a goal
     */
    public function delete($id)
    {
        try {
            $user = Auth::user();
            $goal = Goal::where('user_id', $user->id)->findOrFail($id);

            $goal->cancel(); // This will transfer balance to user wallet
            $goal->delete();

            return response()->json([
                'success' => true,
                'message' => 'Goal deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete goal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Make a contribution to a goal
     */
    public function contribute(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:0',
                'description' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            $goal = Goal::where('user_id', $user->id)->findOrFail($id);

            $goal->contribute($request->amount, $request->description);

            return response()->json([
                'success' => true,
                'data' => $goal->fresh(),
                'message' => 'Contribution successful'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to make contribution',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Withdraw from a goal
     */
    public function withdraw(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:0',
                'description' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            $goal = Goal::where('user_id', $user->id)->findOrFail($id);

            $goal->withdraw($request->amount, $request->description);

            return response()->json([
                'success' => true,
                'data' => $goal->fresh(),
                'message' => 'Withdrawal successful'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process withdrawal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get goal progress
     */
    public function getProgress($id)
    {
        try {
            $user = Auth::user();
            $goal = Goal::where('user_id', $user->id)->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'goal_id' => $goal->id,
                    'goal_name' => $goal->name,
                    'target_amount' => (float) $goal->target_amount,
                    'current_amount' => (float) $goal->current_amount,
                    'remaining_amount' => $goal->remaining_amount,
                    'progress_percentage' => $goal->progress_percentage,
                    'is_on_track' => $goal->isOnTrack(),
                    'days_remaining' => $goal->days_remaining,
                    'monthly_target' => $goal->getMonthlyTargetAmount(),
                    'status' => $goal->status
                ],
                'message' => 'Progress retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve progress',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available savings programs
     */
    public function getSavingsPrograms()
    {
        try {
            // Predefined savings programs
            $programs = [
                [
                    'id' => 1,
                    'name' => 'School Tuition',
                    'description' => 'Save for your children\'s education',
                    'icon' => '✏️',
                    'color' => '#3B82F6',
                    'category' => 'education',
                    'recommended_duration' => 12,
                    'min_amount' => 10000,
                ],
                [
                    'id' => 2,
                    'name' => 'Summer Holidays',
                    'description' => 'Plan your dream vacation',
                    'icon' => '🌴',
                    'color' => '#10B981',
                    'category' => 'travel',
                    'recommended_duration' => 6,
                    'min_amount' => 50000,
                ],
                [
                    'id' => 3,
                    'name' => 'Emergency Fund',
                    'description' => 'Build a safety net for unexpected expenses',
                    'icon' => '🔒',
                    'color' => '#EF4444',
                    'category' => 'emergency',
                    'recommended_duration' => 24,
                    'min_amount' => 100000,
                ],
                [
                    'id' => 4,
                    'name' => 'Business Investment',
                    'description' => 'Save to start or grow your business',
                    'icon' => '💼',
                    'color' => '#8B5CF6',
                    'category' => 'business',
                    'recommended_duration' => 18,
                    'min_amount' => 200000,
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $programs,
                'message' => 'Savings programs retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve savings programs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Enroll in a savings program
     */
    public function enrollInProgram(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'target_amount' => 'required|numeric|min:0',
                'duration_months' => 'required|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get program details (would come from database in production)
            $programs = [
                1 => ['name' => 'School Tuition', 'icon' => '✏️', 'color' => '#3B82F6'],
                2 => ['name' => 'Summer Holidays', 'icon' => '🌴', 'color' => '#10B981'],
                3 => ['name' => 'Emergency Fund', 'icon' => '🔒', 'color' => '#EF4444'],
                4 => ['name' => 'Business Investment', 'icon' => '💼', 'color' => '#8B5CF6'],
            ];

            if (!isset($programs[$id])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Savings program not found'
                ], 404);
            }

            $program = $programs[$id];
            $user = Auth::user();

            $goal = Goal::create([
                'user_id' => $user->id,
                'name' => $program['name'],
                'description' => 'Savings program: ' . $program['name'],
                'icon' => $program['icon'],
                'color' => $program['color'],
                'target_amount' => $request->target_amount,
                'current_amount' => 0,
                'target_date' => now()->addMonths($request->duration_months),
                'status' => 'active',
                'auto_save_enabled' => false,
            ]);

            return response()->json([
                'success' => true,
                'data' => $goal,
                'message' => 'Successfully enrolled in savings program'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to enroll in program',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
