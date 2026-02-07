<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Get all transactions for authenticated user
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            $query = Transaction::where('user_id', $user->id);

            // Filter by type if provided
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by date range if provided
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->dateRange($request->start_date, $request->end_date);
            }

            // Order by most recent first
            $transactions = $query->orderBy('created_at', 'desc')
                                  ->limit(100)
                                  ->get();

            // Format transactions for response
            $formattedTransactions = $transactions->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'transaction_id' => $transaction->transaction_id,
                    'type' => $transaction->type,
                    'amount' => (float) $transaction->amount,
                    'balance_before' => (float) $transaction->balance_before,
                    'balance_after' => (float) $transaction->balance_after,
                    'description' => $transaction->description,
                    'status' => $transaction->status,
                    'related_type' => $transaction->related_type,
                    'related_id' => $transaction->related_id,
                    'metadata' => $transaction->metadata,
                    'is_income' => $transaction->is_income,
                    'is_expense' => $transaction->is_expense,
                    'created_at' => $transaction->created_at->toISOString(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedTransactions,
                'message' => 'Transactions retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific transaction
     */
    public function show($id)
    {
        try {
            $user = Auth::user();

            $transaction = Transaction::where('user_id', $user->id)
                                      ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $transaction->id,
                    'transaction_id' => $transaction->transaction_id,
                    'type' => $transaction->type,
                    'amount' => (float) $transaction->amount,
                    'balance_before' => (float) $transaction->balance_before,
                    'balance_after' => (float) $transaction->balance_after,
                    'description' => $transaction->description,
                    'status' => $transaction->status,
                    'related_type' => $transaction->related_type,
                    'related_id' => $transaction->related_id,
                    'metadata' => $transaction->metadata,
                    'is_income' => $transaction->is_income,
                    'is_expense' => $transaction->is_expense,
                    'created_at' => $transaction->created_at->toISOString(),
                ],
                'message' => 'Transaction retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Filter transactions by type
     */
    public function filterByType($type)
    {
        try {
            $user = Auth::user();

            $transactions = Transaction::where('user_id', $user->id)
                                       ->where('type', $type)
                                       ->orderBy('created_at', 'desc')
                                       ->limit(100)
                                       ->get();

            return response()->json([
                'success' => true,
                'data' => $transactions,
                'message' => "Transactions of type '{$type}' retrieved successfully"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get transactions by date range
     */
    public function getByDateRange(Request $request)
    {
        try {
            $user = Auth::user();

            $query = Transaction::where('user_id', $user->id);

            if ($request->has('start_date') && $request->has('end_date')) {
                $query->dateRange($request->start_date, $request->end_date);
            }

            $transactions = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $transactions,
                'message' => 'Transactions retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get financial dashboard data
     */
    public function getFinancialDashboard()
    {
        try {
            $user = Auth::user();

            // This month transactions
            $thisMonthTransactions = Transaction::where('user_id', $user->id)
                                                ->thisMonth()
                                                ->completed()
                                                ->get();

            // Last month transactions
            $lastMonthTransactions = Transaction::where('user_id', $user->id)
                                                ->lastMonth()
                                                ->completed()
                                                ->get();

            // Calculate totals
            $thisMonthIncome = $thisMonthTransactions->where('is_income', true)->sum('amount');
            $thisMonthExpense = $thisMonthTransactions->where('is_expense', true)->sum('amount');

            $lastMonthIncome = $lastMonthTransactions->where('is_income', true)->sum('amount');
            $lastMonthExpense = $lastMonthTransactions->where('is_expense', true)->sum('amount');

            return response()->json([
                'success' => true,
                'data' => [
                    'current_month' => [
                        'income' => (float) $thisMonthIncome,
                        'expense' => (float) $thisMonthExpense,
                        'net' => (float) ($thisMonthIncome - $thisMonthExpense),
                    ],
                    'last_month' => [
                        'income' => (float) $lastMonthIncome,
                        'expense' => (float) $lastMonthExpense,
                        'net' => (float) ($lastMonthIncome - $lastMonthExpense),
                    ],
                    'recent_transactions' => $thisMonthTransactions->take(10),
                ],
                'message' => 'Financial dashboard data retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve financial dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
