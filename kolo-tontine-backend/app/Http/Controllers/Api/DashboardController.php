<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics for authenticated user
     */
    public function getStats(Request $request)
    {
        $user = $request->user();

        try {
            // Get user balances
            $walletBalance = $user->wallet_balance;
            $cardBalance = $user->card_balance;

            // Get circles statistics
            $totalCircles = DB::table('like_lemba_members')
                ->where('user_id', $user->id)
                ->count();

            $activeCircles = DB::table('like_lemba_members')
                ->join('like_lemba', 'like_lemba_members.like_lemba_id', '=', 'like_lemba.id')
                ->where('like_lemba_members.user_id', $user->id)
                ->where('like_lemba.status', 'active')
                ->count();

            // Get goals statistics
            $totalGoals = DB::table('goals')
                ->where('user_id', $user->id)
                ->count();

            $activeGoals = DB::table('goals')
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->count();

            // Get transactions count
            $totalTransactions = DB::table('transactions')
                ->where('user_id', $user->id)
                ->count();

            // Get recent transactions (last 5)
            $recentTransactions = DB::table('transactions')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'type' => $transaction->type,
                        'amount' => (float) $transaction->amount,
                        'title' => $transaction->title,
                        'description' => $transaction->description,
                        'status' => $transaction->status,
                        'created_at' => $transaction->created_at,
                    ];
                })
                ->toArray();

            // Get active like lembas with details
            $activeLikeLembas = DB::table('like_lemba_members')
                ->join('like_lemba', 'like_lemba_members.like_lemba_id', '=', 'like_lemba.id')
                ->where('like_lemba_members.user_id', $user->id)
                ->where('like_lemba.status', 'active')
                ->select(
                    'like_lemba.id',
                    'like_lemba.name',
                    'like_lemba.contribution_amount',
                    'like_lemba.current_members',
                    'like_lemba.total_slots',
                    'like_lemba.next_payout_date',
                    'like_lemba_members.slot_number as my_slot',
                    'like_lemba_members.payments_made',
                    'like_lemba_members.payments_remaining'
                )
                ->get()
                ->map(function ($lemba) {
                    return [
                        'id' => $lemba->id,
                        'name' => $lemba->name,
                        'contribution_amount' => (float) $lemba->contribution_amount,
                        'current_members' => $lemba->current_members,
                        'total_slots' => $lemba->total_slots,
                        'next_payout_date' => $lemba->next_payout_date,
                        'my_slot' => $lemba->my_slot,
                        'payments_made' => $lemba->payments_made,
                        'payments_remaining' => $lemba->payments_remaining,
                    ];
                })
                ->toArray();

            return response()->json([
                'success' => true,
                'data' => [
                    'wallet_balance' => (float) $walletBalance,
                    'card_balance' => (float) $cardBalance,
                    'total_circles' => $totalCircles,
                    'active_circles' => $activeCircles,
                    'total_goals' => $totalGoals,
                    'active_goals' => $activeGoals,
                    'total_transactions' => $totalTransactions,
                    'recent_transactions' => $recentTransactions,
                    'active_like_lembas' => $activeLikeLembas,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
