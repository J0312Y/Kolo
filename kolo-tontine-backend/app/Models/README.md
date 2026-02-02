# 📦 KOLO TONTINE - LARAVEL MODELS

## 📋 MODELS CRÉÉS (20 TOTAL)

### ✅ Core Models (8)
1. **User.php** - Utilisateurs et authentification
2. **LikeLemba.php** - Cercles de tontine
3. **LikeLembaMember.php** - Membres des cercles
4. **Payment.php** - Paiements et contributions
5. **PaymentMethod.php** - Méthodes de paiement
6. **Goal.php** - Objectifs d'épargne
7. **Transaction.php** - Historique transactions
8. **Referral.php** - Système de parrainage

### ✅ Feature Models (3)
9. **Notification.php** - Notifications utilisateurs
10. **ChatMessage.php** - Messages de groupe
11. **Document.php** - Documents KYC

### ✅ Additional Features (3)
12. **Address.php** - Adresses (Home/Work)
13. **SavingsProgram.php** - Programmes d'épargne automatique
14. **WithdrawalRequest.php** - Demandes de retrait

### ✅ Support & Settings (4)
15. **UserSettings.php** - Préférences utilisateur
16. **SupportTicket.php** - Tickets support
17. **SupportTicketMessage.php** - Messages support
18. **FAQ.php** - Base de connaissances

### ✅ Security Models (3)
19. **LoginHistory.php** - Historique connexions
20. **PasswordReset.php** - Reset password/OTP
21. **DeviceToken.php** - Push notifications

**TOTAL: 21 MODELS COMPLETS** 🎉

---

## 🚀 INSTALLATION

### Étape 1: Copier les models

```bash
# Copier tous les models dans app/Models/
cp Models/*.php /path/to/laravel/app/Models/
```

### Étape 2: Vérifier

```bash
cd your-laravel-project
php artisan tinker
```

Dans Tinker:
```php
User::count();           // Doit fonctionner
LikeLemba::count();      // Doit fonctionner
```

---

## 📖 GUIDE D'UTILISATION

### 1. USER MODEL

#### Créer un utilisateur:
```php
use App\Models\User;

$user = User::create([
    'first_name' => 'John',
    'last_name' => 'Doe',
    'email' => 'john@example.com',
    'phone' => '+242060000000',
    'password' => bcrypt('password123'),
    'referral_code' => 'JOHN2024',
]);
```

#### Relations:
```php
// LikeLembas où user est admin
$user->adminLikeLembas;

// Tous les likeLembas (admin + membre)
$user->likeLembas;

// Payment methods
$user->paymentMethods;

// Goals
$user->goals;

// Transactions
$user->transactions;
```

#### Helper methods:
```php
// Ajouter au wallet
$user->addToWallet(50000, 'Top up from MTN');

// Déduire du wallet
$user->deductFromWallet(25000, 'Payment for circle');

// Vérifier plan
$user->hasActivePlan();

// Vérifier si peut créer cercle
$user->canCreateLikeLemba();

// Full name
$user->full_name; // "John Doe"
```

---

### 2. LIKELEMBA MODEL

#### Créer un cercle:
```php
use App\Models\LikeLemba;

$likeLemba = LikeLemba::create([
    'admin_id' => $user->id,
    'name' => 'Family Savings',
    'description' => 'Monthly family savings',
    'contribution_amount' => 50000,
    'duration_months' => 6,
    'total_slots' => 6,
    'status' => 'pending',
]);

// Invitation code généré automatiquement
echo $likeLemba->invitation_code; // Ex: "ABC12345"
```

#### Relations:
```php
$likeLemba->admin;        // User admin
$likeLemba->members;      // LikeLembaMember[]
$likeLemba->users;        // User[] (via pivot)
$likeLemba->payments;     // Payment[]
$likeLemba->chatMessages; // ChatMessage[]
```

#### Helper methods:
```php
// Vérifier si plein
$likeLemba->isFull();

// Peut rejoindre
$likeLemba->canJoin();

// Slots disponibles
$likeLemba->getAvailableSlots(); // [3, 5, 7]

// Vérifier si user est membre
$likeLemba->isUserMember($userId);

// Démarrer le cercle (si plein)
$likeLemba->startCircle();

// Processus payout mensuel
$member = $likeLemba->processMonthlyPayout();

// Prochain membre à recevoir
$nextMember = $likeLemba->getNextPayoutMember();

// Total contribué
$total = $likeLemba->getTotalContributed();
```

#### Scopes:
```php
LikeLemba::active()->get();      // Cercles actifs
LikeLemba::pending()->get();     // En attente
LikeLemba::public()->get();      // Publics et ouverts
```

---

### 3. LIKELEMBAMEMBER MODEL

#### Ajouter un membre:
```php
use App\Models\LikeLembaMember;

$member = LikeLembaMember::create([
    'likeLemba_id' => $likeLemba->id,
    'user_id' => $user->id,
    'slot_number' => 3,
    'payout_month' => 3,
    'payments_remaining' => 6,
]);
```

#### Relations:
```php
$member->likeLemba;  // LikeLemba
$member->user;       // User
$member->payments;   // Payment[]
```

#### Helper methods:
```php
// Progress du paiement
$progress = $member->getPaymentProgress();
// [
//   'paid' => 2,
//   'remaining' => 4,
//   'total' => 6,
//   'percentage' => 33.33
// ]

// Paiement en retard?
$member->isPaymentDue();

// Date du prochain paiement
$member->getNextPaymentDueDate();

// Enregistrer un paiement
$member->recordPayment(50000);

// Marquer en défaut
$member->markAsDefaulted();
```

---

### 4. PAYMENT MODEL

#### Créer un paiement:
```php
use App\Models\Payment;

$payment = Payment::create([
    'user_id' => $user->id,
    'likeLemba_id' => $likeLemba->id,
    'payment_method_id' => $paymentMethod->id,
    'amount' => 50000,
    'payment_type' => 'contribution',
    'status' => 'pending',
    'due_date' => now()->addDays(7),
]);
```

#### Helper methods:
```php
// Marquer comme payé
$payment->markAsPaid();

// Marquer comme échoué
$payment->markAsFailed('Insufficient funds');

// Réessayer
$payment->retry();

// Vérifier si en retard
$payment->isOverdue();

// Dû cette semaine?
$payment->isDueThisWeek();
```

#### Scopes:
```php
Payment::pending()->get();           // En attente
Payment::completed()->get();         // Complétés
Payment::overdue()->get();          // En retard
Payment::upcoming()->get();         // À venir (7 jours)
Payment::contributions()->get();    // Type contribution
```

---

### 5. PAYMENTMETHOD MODEL

#### Ajouter une carte:
```php
use App\Models\PaymentMethod;

$card = PaymentMethod::create([
    'user_id' => $user->id,
    'type' => 'card',
    'provider' => 'Visa',
    'card_last4' => '4582',
    'card_brand' => 'Visa',
    'card_expiry' => '12/28',
    'is_verified' => true,
]);
```

#### Ajouter mobile money:
```php
$mobileMoney = PaymentMethod::create([
    'user_id' => $user->id,
    'type' => 'mobile_money',
    'provider' => 'MTN Mobile Money',
    'mobile_number' => '+242064663469',
    'is_verified' => true,
]);
```

#### Helper methods:
```php
// Définir comme défaut
$card->setAsDefault();

// Vérifier
$card->verify();

// Vérifie si expiré
$card->isExpired();

// Peut être utilisé?
$card->canBeUsed();

// Display name
$card->display_name; // "Visa ••••4582"

// Numéro masqué
$card->masked_number; // "•••• •••• •••• 4582"
```

---

### 6. GOAL MODEL

#### Créer un objectif:
```php
use App\Models\Goal;

$goal = Goal::create([
    'user_id' => $user->id,
    'name' => 'New Car',
    'description' => 'Save for a new vehicle',
    'icon' => '🚗',
    'color' => 'blue',
    'target_amount' => 5000000,
    'target_date' => now()->addYear(),
]);
```

#### Helper methods:
```php
// Contribuer
$goal->contribute(100000, 'Monthly savings');

// Retirer
$goal->withdraw(50000, 'Emergency');

// Progress
$goal->progress_percentage; // 25.5%

// Montant restant
$goal->remaining_amount; // 3750000

// Jours restants
$goal->days_remaining; // 365

// Sur la bonne voie?
$goal->isOnTrack();

// Target mensuel
$goal->getMonthlyTargetAmount();

// Marquer complété
$goal->markAsCompleted();

// Annuler (rembourse au wallet)
$goal->cancel();
```

---

### 7. TRANSACTION MODEL

#### Créer transaction:
```php
use App\Models\Transaction;

$transaction = Transaction::create([
    'user_id' => $user->id,
    'type' => 'deposit',
    'amount' => 50000,
    'balance_before' => 100000,
    'balance_after' => 150000,
    'description' => 'Top up from MTN',
    'status' => 'completed',
]);
```

#### Accessors:
```php
$transaction->is_income;         // true/false
$transaction->is_expense;        // true/false
$transaction->amount_with_sign;  // "+50000" ou "-50000"
```

#### Scopes:
```php
Transaction::deposits()->get();
Transaction::withdrawals()->get();
Transaction::thisMonth()->get();
Transaction::lastMonth()->get();
Transaction::dateRange($start, $end)->get();
```

---

### 8. REFERRAL MODEL

#### Créer parrainage:
```php
use App\Models\Referral;

$referral = Referral::create([
    'referrer_id' => $user->id,
    'referred_id' => $newUser->id,
    'referral_code' => $user->referral_code,
    'reward_amount' => 300,
]);
```

#### Helper methods:
```php
// Marquer comme gagné
$referral->markAsEarned();

// Payer la récompense
$referral->payReward();

// Vérifier éligibilité
$referral->checkEligibility();
```

---

### 9. NOTIFICATION MODEL

#### Créer notification:
```php
use App\Models\Notification;

// Méthode manuelle
$notification = Notification::create([
    'user_id' => $user->id,
    'type' => 'payment_due',
    'title' => 'Payment Due',
    'message' => 'Your payment is due tomorrow',
    'data' => ['amount' => 50000],
]);

// Helpers statiques
Notification::createPaymentDue($user->id, $likeLemba, 50000, now()->addDays(7));
Notification::createPayoutReceived($user->id, $likeLemba, 300000);
Notification::createMemberJoined($admin->id, $likeLemba, $newMember);
Notification::createGoalCompleted($user->id, $goal);
```

#### Helper methods:
```php
// Marquer comme lu
$notification->markAsRead();

// Marquer comme non lu
$notification->markAsUnread();

// Vérifie si lu
$notification->isRead();
```

#### Scopes:
```php
Notification::unread()->get();
Notification::read()->get();
Notification::type('payment_due')->get();
```

---

### 10. CHATMESSAGE MODEL

#### Envoyer message:
```php
use App\Models\ChatMessage;

$message = ChatMessage::create([
    'likeLemba_id' => $likeLemba->id,
    'user_id' => $user->id,
    'message' => 'Hello everyone!',
]);
```

#### Scopes:
```php
ChatMessage::recent(50)->get();      // 50 derniers
ChatMessage::today()->get();         // Aujourd'hui
ChatMessage::byUser($userId)->get(); // Par user
```

---

### 11. DOCUMENT MODEL

#### Upload document:
```php
use App\Models\Document;

$document = Document::create([
    'user_id' => $user->id,
    'type' => 'national_id',
    'file_path' => 'documents/national_id_123.jpg',
    'status' => 'pending',
]);
```

#### Helper methods:
```php
// Approuver
$document->approve('Document verified');

// Rejeter
$document->reject('Photo unclear');

// URL du fichier
$document->getFileUrl();

// Label du type
$document->getTypeLabel(); // "National ID"

// Vérifications
$document->isApproved();
$document->isPending();
$document->isRejected();
```

---

## 🔗 RELATIONS PRINCIPALES

```
User
├── adminLikeLembas (1:N)
├── likeLembaMemberships (1:N)
├── likeLembas (N:N via likeLemba_members)
├── payments (1:N)
├── paymentMethods (1:N)
├── goals (1:N)
├── transactions (1:N)
├── referralsMade (1:N)
└── notifications (1:N)

LikeLemba
├── admin (N:1)
├── members (1:N)
├── users (N:N)
├── payments (1:N)
└── chatMessages (1:N)

LikeLembaMember
├── likeLemba (N:1)
├── user (N:1)
└── payments (1:N)

Payment
├── user (N:1)
├── likeLemba (N:1)
└── paymentMethod (N:1)
```

---

## ✅ CHECKLIST D'INSTALLATION

- [ ] 11 models copiés dans `app/Models/`
- [ ] Database schema importé
- [ ] Seeder importé
- [ ] `php artisan tinker` fonctionne
- [ ] `User::count()` retourne 10
- [ ] `LikeLemba::count()` retourne 5
- [ ] Relations testées
- [ ] Helper methods testés

---

## 🧪 TESTS RAPIDES

```php
// Dans tinker: php artisan tinker

// Test User
$user = User::first();
echo $user->full_name;
$user->likeLembas->count();

// Test LikeLemba
$likeLemba = LikeLemba::first();
$likeLemba->members->count();
$likeLemba->getAvailableSlots();

// Test Payment
Payment::pending()->count();
Payment::overdue()->count();

// Test Goal
$goal = Goal::first();
echo $goal->progress_percentage . '%';

// Test Notification
Notification::unread()->count();
```

---

**Tous les models sont prêts ! 🎉 Copie-les et commence à coder ! 🚀**
