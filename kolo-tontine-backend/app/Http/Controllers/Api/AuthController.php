<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Referral;
use App\Models\UserSettings;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Register new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email|max:255',
            'phone' => [
                'required',
                'unique:users,phone',
                'regex:/^\+242[0-9]{9}$/'
            ],
            'password' => 'required|min:8|confirmed',
            'referral_code' => 'nullable|string|exists:users,referral_code',
        ], [
            'email.unique' => 'Cet email est déjà utilisé',
            'phone.unique' => 'Ce numéro est déjà utilisé',
            'phone.regex' => 'Format invalide. Utilisez +242XXXXXXXXX',
            'password.confirmed' => 'Les mots de passe ne correspondent pas',
            'referral_code.exists' => 'Code de parrainage invalide',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Generate unique referral code
            do {
                $userReferralCode = strtoupper(Str::random(8));
            } while (User::where('referral_code', $userReferralCode)->exists());

            // Create user
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => strtolower($request->email),
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'referral_code' => $userReferralCode,
                'account_status' => 'pending_verification',
            ]);

            // Create user settings with defaults
            UserSettings::create([
                'user_id' => $user->id,
            ]);

            // Handle referral code if provided
            if ($request->referral_code) {
                $referrer = User::where('referral_code', $request->referral_code)->first();
                
                if ($referrer) {
                    // Update user's referred_by
                    $user->update(['referred_by' => $referrer->id]);

                    // Create referral record
                    Referral::create([
                        'referrer_id' => $referrer->id,
                        'referred_id' => $user->id,
                        'referral_code' => $request->referral_code,
                        'reward_amount' => 300.00,
                        'reward_status' => 'pending',
                    ]);

                    // Give immediate welcome bonus to new user
                    $user->addToWallet(300, 'Bonus de bienvenue avec code de parrainage');

                    // Notify referrer
                    Notification::create([
                        'user_id' => $referrer->id,
                        'type' => 'new_referral',
                        'title' => 'Nouveau filleul !',
                        'message' => "{$user->full_name} s'est inscrit avec votre code",
                        'data' => json_encode(['referred_user_id' => $user->id]),
                    ]);
                }
            }

            // Generate OTP for email verification
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Store OTP in cache for 10 minutes
            cache()->put("email_otp_{$user->id}", $otp, 600);

            // Send verification email
            $this->sendVerificationEmail($user, $otp);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'referral_code' => $user->referral_code,
                        'has_referral_bonus' => $request->referral_code ? true : false,
                    ],
                    'otp_sent' => true,
                ],
                'message' => 'Compte créé avec succès. Vérifiez votre email.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du compte',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify email with OTP
     */
    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail($request->user_id);

        // Check if already verified
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email déjà vérifié'
            ], 400);
        }

        // Get stored OTP
        $storedOtp = cache()->get("email_otp_{$user->id}");

        if (!$storedOtp) {
            return response()->json([
                'success' => false,
                'message' => 'Code expiré. Demandez un nouveau code.'
            ], 400);
        }

        if ($storedOtp !== $request->otp) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide'
            ], 400);
        }

        // Verify email
        $user->update([
            'email_verified_at' => now(),
            'account_status' => 'active',
        ]);

        // Clear OTP
        cache()->forget("email_otp_{$user->id}");

        // Create auth token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Welcome notification
        Notification::create([
            'user_id' => $user->id,
            'type' => 'welcome',
            'title' => 'Bienvenue sur Kolo ! 🎉',
            'message' => 'Votre compte est maintenant activé. Commencez à épargner !',
            'data' => json_encode([]),
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'user' => $user,
            ],
            'message' => 'Email vérifié avec succès'
        ]);
    }

    /**
     * Resend verification email
     */
    public function resendVerificationEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email déjà vérifié'
            ], 400);
        }

        // Generate new OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store OTP
        cache()->put("email_otp_{$user->id}", $otp, 600);

        // Send email
        $this->sendVerificationEmail($user, $otp);

        return response()->json([
            'success' => true,
            'message' => 'Code de vérification renvoyé'
        ]);
    }

    /**
     * Login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        if ($user->account_status === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'Compte suspendu. Contactez le support.'
            ], 403);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Veuillez vérifier votre email avant de vous connecter',
                'needs_verification' => true,
                'user_id' => $user->id
            ], 403);
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Update last login
        $user->update(['last_login_at' => now()]);

        // Log login
        \App\Models\LoginHistory::logLogin($user, $request, true);

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'user' => $user,
            ],
            'message' => 'Connexion réussie'
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Forgot password
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Generate reset token
        $token = Str::random(60);
        
        // Create password reset record
        \App\Models\PasswordReset::createForEmail(
            $request->email,
            $request->ip()
        );

        // Send reset email
        // Mail::to($user->email)->send(new ResetPasswordMail($token));

        return response()->json([
            'success' => true,
            'message' => 'Email de réinitialisation envoyé'
        ]);
    }

    /**
     * Verify phone with OTP
     */
    public function verifyPhone(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail($request->user_id);

        // Get stored OTP
        $storedOtp = cache()->get("phone_otp_{$user->id}");

        if (!$storedOtp || $storedOtp !== $request->otp) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide'
            ], 400);
        }

        // Verify phone
        $user->update(['phone_verified_at' => now()]);

        // Clear OTP
        cache()->forget("phone_otp_{$user->id}");

        return response()->json([
            'success' => true,
            'message' => 'Téléphone vérifié'
        ]);
    }

    /**
     * Helper: Send verification email
     */
    protected function sendVerificationEmail($user, $otp)
    {
        // In production, use actual email service
        // For now, just log it
        \Log::info("Verification OTP for {$user->email}: {$otp}");

        // Example with Laravel Mail:
        // Mail::to($user->email)->send(new VerificationMail($otp));
    }
}
