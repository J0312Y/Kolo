<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LikeLembaController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\GoalController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\ReferralController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes - Kolo Tontine
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::prefix('v1')->group(function () {
    
    // Authentication
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/verify-phone', [AuthController::class, 'verifyPhone']);
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
    
    // LikeLemba invitation validation (public)
    Route::get('/likeLembas/validate-code/{code}', [LikeLembaController::class, 'validateInvitationCode']);
});

// Protected routes (require authentication)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    
    // ============================================
    // AUTH & USER
    // ============================================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/change-password', [UserController::class, 'changePassword']);
    Route::put('/user/change-passcode', [UserController::class, 'changePasscode']);
    Route::post('/user/upload-document', [UserController::class, 'uploadDocument']);
    
    // ============================================
    // LIKELEMBAS (Tontine Circles)
    // ============================================
    
    // List & Search
    Route::get('/likeLembas', [LikeLembaController::class, 'index']); // User's circles
    Route::get('/likeLembas/discover', [LikeLembaController::class, 'discover']); // Public circles
    Route::get('/likeLembas/{id}', [LikeLembaController::class, 'show']);
    
    // Create & Manage
    Route::post('/likeLembas', [LikeLembaController::class, 'create']);
    Route::put('/likeLembas/{id}', [LikeLembaController::class, 'update']);
    Route::delete('/likeLembas/{id}', [LikeLembaController::class, 'delete']);
    
    // Join & Leave
    Route::post('/likeLembas/{id}/join', [LikeLembaController::class, 'join']);
    Route::post('/likeLembas/join-with-code', [LikeLembaController::class, 'joinWithCode']);
    Route::post('/likeLembas/{id}/leave', [LikeLembaController::class, 'leave']);
    
    // Members
    Route::get('/likeLembas/{id}/members', [LikeLembaController::class, 'getMembers']);
    Route::post('/likeLembas/{id}/remove-member', [LikeLembaController::class, 'removeMember']);
    
    // Slot Selection
    Route::get('/likeLembas/{id}/available-slots', [LikeLembaController::class, 'getAvailableSlots']);
    Route::post('/likeLembas/{id}/select-slot', [LikeLembaController::class, 'selectSlot']);
    
    // Chat
    Route::get('/likeLembas/{id}/chat', [LikeLembaController::class, 'getChatMessages']);
    Route::post('/likeLembas/{id}/chat', [LikeLembaController::class, 'sendChatMessage']);
    
    // Statistics
    Route::get('/likeLembas/{id}/stats', [LikeLembaController::class, 'getStats']);
    Route::get('/likeLembas/{id}/payout-schedule', [LikeLembaController::class, 'getPayoutSchedule']);
    
    // ============================================
    // PAYMENTS
    // ============================================
    
    // Payment Methods
    Route::get('/payment-methods', [PaymentController::class, 'getPaymentMethods']);
    Route::post('/payment-methods', [PaymentController::class, 'addPaymentMethod']);
    Route::put('/payment-methods/{id}', [PaymentController::class, 'updatePaymentMethod']);
    Route::delete('/payment-methods/{id}', [PaymentController::class, 'deletePaymentMethod']);
    Route::post('/payment-methods/{id}/set-default', [PaymentController::class, 'setDefaultPaymentMethod']);
    
    // Payments
    Route::get('/payments', [PaymentController::class, 'index']); // User's payment history
    Route::get('/payments/upcoming', [PaymentController::class, 'getUpcomingPayments']);
    Route::get('/payments/overdue', [PaymentController::class, 'getOverduePayments']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    
    // Make Payment
    Route::post('/payments/contribute', [PaymentController::class, 'makeContribution']);
    Route::post('/payments/{id}/retry', [PaymentController::class, 'retryPayment']);
    
    // Payment Calendar
    Route::get('/payments/calendar/{year}/{month}', [PaymentController::class, 'getPaymentCalendar']);
    
    // Virtual Card
    Route::post('/card/top-up', [PaymentController::class, 'topUpCard']);
    Route::post('/card/withdraw', [PaymentController::class, 'withdrawFromCard']);
    Route::get('/card/balance', [PaymentController::class, 'getCardBalance']);
    Route::get('/card/transactions', [PaymentController::class, 'getCardTransactions']);
    Route::post('/card/freeze', [PaymentController::class, 'freezeCard']);
    Route::post('/card/unfreeze', [PaymentController::class, 'unfreezeCard']);
    
    // ============================================
    // GOALS
    // ============================================
    Route::get('/goals', [GoalController::class, 'index']);
    Route::get('/goals/{id}', [GoalController::class, 'show']);
    Route::post('/goals', [GoalController::class, 'create']);
    Route::put('/goals/{id}', [GoalController::class, 'update']);
    Route::delete('/goals/{id}', [GoalController::class, 'delete']);
    Route::post('/goals/{id}/contribute', [GoalController::class, 'contribute']);
    Route::post('/goals/{id}/withdraw', [GoalController::class, 'withdraw']);
    Route::get('/goals/{id}/progress', [GoalController::class, 'getProgress']);
    
    // Savings Programs
    Route::get('/savings-programs', [GoalController::class, 'getSavingsPrograms']);
    Route::post('/savings-programs/{id}/enroll', [GoalController::class, 'enrollInProgram']);
    
    // ============================================
    // TRANSACTIONS
    // ============================================
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::get('/transactions/filter/{type}', [TransactionController::class, 'filterByType']);
    Route::get('/transactions/date-range', [TransactionController::class, 'getByDateRange']);
    
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);

    // Financial Dashboard
    Route::get('/dashboard/financial', [TransactionController::class, 'getFinancialDashboard']);
    
    // ============================================
    // REFERRALS
    // ============================================
    Route::get('/referrals', [ReferralController::class, 'index']);
    Route::get('/referrals/stats', [ReferralController::class, 'getStats']);
    Route::post('/referrals/apply-code', [ReferralController::class, 'applyReferralCode']);
    Route::get('/referrals/my-code', [ReferralController::class, 'getMyReferralCode']);
    
    // ============================================
    // NOTIFICATIONS
    // ============================================
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'getUnread']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'delete']);
    
    // ============================================
    // SUBSCRIPTION PLANS
    // ============================================
    Route::get('/plans', [UserController::class, 'getPlans']);
    Route::post('/plans/upgrade', [UserController::class, 'upgradePlan']);
    Route::get('/plans/features', [UserController::class, 'getPlanFeatures']);
    
    // ============================================
    // SUPPORT
    // ============================================
    Route::post('/support/ticket', [UserController::class, 'createSupportTicket']);
    Route::get('/support/tickets', [UserController::class, 'getSupportTickets']);
    Route::get('/support/faq', [UserController::class, 'getFAQ']);
});

// Webhook routes (for payment gateways)
Route::prefix('webhooks')->group(function () {
    Route::post('/payment/callback', [PaymentController::class, 'paymentCallback']);
    Route::post('/mtn/callback', [PaymentController::class, 'mtnCallback']);
    Route::post('/airtel/callback', [PaymentController::class, 'airtelCallback']);
});
