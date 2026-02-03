# 📊 Database Views & Stored Procedures Guide

## Vue d'Ensemble

Ce document explique comment utiliser les vues SQL et procédures stockées de Kolo Tontine pour:
- 🏦 **Intégration bancaire** (scoring de crédit, vérification de prêts)
- 🏢 **Tontines d'entreprise** (reporting, statistiques employés)
- 📊 **Audits & Conformité** (traçabilité financière complète)
- ⚙️ **Automatisation** (payouts mensuels, rappels)

---

## 📋 5 Vues SQL Disponibles

### 1. `user_credit_score` - Score de Crédit pour Banques

**Usage:** Vérifier la solvabilité d'un utilisateur avant d'accorder un prêt

```sql
-- Obtenir le score de crédit d'un utilisateur
SELECT
    user_id,
    first_name,
    last_name,
    credit_score,              -- Score 0-1000
    credit_risk_level,          -- LOW, MEDIUM, HIGH
    payment_success_rate,       -- Pourcentage de paiements réussis
    total_amount_paid,          -- Montant total géré
    circles_completed,          -- Cercles complétés
    payouts_received,           -- Payouts reçus
    account_age_days,           -- Ancienneté du compte
    kyc_status                  -- Statut KYC
FROM user_credit_score
WHERE user_id = 123;
```

**Calcul du Score (0-1000):**
- 5 points par paiement réussi
- 100 points par cercle complété
- 50 points par payout reçu
- 100 points pour KYC vérifié
- Jusqu'à 100 points pour ancienneté (1 an = 100 points)

**Niveaux de Risque:**
- `LOW`: Taux de réussite ≥ 95%
- `MEDIUM`: Taux de réussite ≥ 80%
- `HIGH`: Taux de réussite < 80%

**Exemple d'Utilisation par une Banque:**
```sql
-- Trouver les utilisateurs éligibles pour un prêt de 500 000 XAF
SELECT user_id, first_name, last_name, credit_score, total_amount_paid
FROM user_credit_score
WHERE credit_score >= 700
  AND credit_risk_level = 'LOW'
  AND kyc_status = 'verified'
  AND total_amount_paid >= 500000
ORDER BY credit_score DESC;
```

---

### 2. `user_payment_history` - Historique de Paiements

**Usage:** Analyser la ponctualité et fiabilité des paiements

```sql
-- Historique des paiements d'un utilisateur
SELECT
    circle_name,
    amount,
    status,
    payment_punctuality,      -- ON_TIME, LATE, OVERDUE, PENDING
    days_difference,          -- Jours de retard/avance
    paid_at,
    payment_date
FROM user_payment_history
WHERE user_id = 123
ORDER BY payment_date DESC
LIMIT 20;
```

**États de Ponctualité:**
- `ON_TIME`: Payé avant la date d'échéance
- `LATE`: Payé après la date d'échéance
- `OVERDUE`: En attente et échéance dépassée
- `PENDING`: En attente, échéance non atteinte

**Exemple - Taux de Ponctualité:**
```sql
-- Calculer le taux de ponctualité d'un utilisateur
SELECT
    user_id,
    first_name,
    last_name,
    COUNT(*) AS total_payments,
    SUM(CASE WHEN payment_punctuality = 'ON_TIME' THEN 1 ELSE 0 END) AS on_time_payments,
    ROUND(
        (SUM(CASE WHEN payment_punctuality = 'ON_TIME' THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
        2
    ) AS punctuality_rate
FROM user_payment_history
WHERE user_id = 123
GROUP BY user_id;
```

---

### 3. `circle_performance` - Performance des Cercles

**Usage:** Reporting pour entreprises et administrateurs

```sql
-- Top 10 des cercles les plus performants
SELECT
    circle_name,
    status,
    admin_first_name,
    admin_last_name,
    current_members,
    total_slots,
    fill_rate_percentage,
    total_collected,
    expected_total,
    collection_rate_percentage
FROM circle_performance
WHERE status = 'active'
ORDER BY collection_rate_percentage DESC
LIMIT 10;
```

**Métriques Clés:**
- `fill_rate_percentage`: Taux de remplissage (members/slots)
- `collection_rate_percentage`: Taux de collecte (collecté/attendu)
- `total_collected`: Montant total collecté
- `expected_total`: Montant attendu total

**Exemple - Dashboard Entreprise:**
```sql
-- Statistiques des cercles d'une entreprise
SELECT
    COUNT(*) AS total_circles,
    AVG(collection_rate_percentage) AS avg_collection_rate,
    SUM(total_collected) AS total_enterprise_savings,
    AVG(active_members) AS avg_members_per_circle
FROM circle_performance
WHERE admin_email LIKE '%@entreprise.com';
```

---

### 4. `enterprise_statistics` - Statistiques Globales

**Usage:** Vue d'ensemble de la plateforme pour clients corporate

```sql
-- Statistiques globales de la plateforme
SELECT
    total_users,
    total_circles,
    active_circles,
    completed_circles,
    total_money_circulated,
    total_wallet_balance,
    avg_user_balance,
    users_in_circles,
    user_engagement_rate,
    avg_circles_per_user,
    total_transactions,
    transaction_success_rate,
    platform_age_days
FROM enterprise_statistics;
```

**Exemple - Rapport Mensuel:**
```sql
-- Rapport mensuel pour la direction
SELECT
    total_users AS 'Utilisateurs Totaux',
    users_in_circles AS 'Utilisateurs Actifs',
    CONCAT(user_engagement_rate, '%') AS 'Taux d\'Engagement',
    CONCAT(FORMAT(total_money_circulated, 0), ' XAF') AS 'Argent Circulé',
    CONCAT(transaction_success_rate, '%') AS 'Taux de Succès'
FROM enterprise_statistics;
```

---

### 5. `user_financial_summary` - Résumé Financier

**Usage:** Audits, conformité, traçabilité complète

```sql
-- Résumé financier d'un utilisateur
SELECT
    full_name,
    email,
    wallet_balance,
    total_payouts_received,
    total_contributions_paid,
    total_deposits,
    total_withdrawals,
    total_fees_paid,
    net_financial_position,
    total_transactions,
    last_transaction_date
FROM user_financial_summary
WHERE user_id = 123;
```

**Exemple - Audit Mensuel:**
```sql
-- Utilisateurs avec position nette négative (risque)
SELECT
    full_name,
    email,
    net_financial_position,
    total_transactions,
    kyc_status
FROM user_financial_summary
WHERE net_financial_position < 0
ORDER BY net_financial_position ASC;
```

---

## ⚙️ 4 Procédures Stockées

### 1. `calculate_user_credit_score(user_id)` - Calculer Score de Crédit

**Usage:** API pour banques

```sql
-- Calculer le score d'un utilisateur
CALL calculate_user_credit_score(123);
```

**Retour:**
```
user_id | full_name      | credit_score | credit_risk_level | circles_completed | payment_success_rate
--------|----------------|--------------|-------------------|-------------------|---------------------
123     | Jean Dupont    | 850          | LOW               | 5                 | 98.50
```

**Utilisation dans Laravel:**
```php
// Dans un contrôleur
public function getCreditScore($userId)
{
    $result = DB::select('CALL calculate_user_credit_score(?)', [$userId]);

    return response()->json([
        'user_id' => $result[0]->user_id,
        'credit_score' => $result[0]->credit_score,
        'risk_level' => $result[0]->credit_risk_level,
        'eligible_for_loan' => $result[0]->credit_score >= 700,
    ]);
}
```

---

### 2. `process_monthly_payouts()` - Traiter Payouts Mensuels

**Usage:** Automatisation via Cron/Laravel Scheduler

```sql
-- Traiter tous les payouts mensuels
CALL process_monthly_payouts();
```

**Que Fait Cette Procédure:**
1. Trouve tous les cercles actifs avec échéance atteinte
2. Identifie le prochain membre à recevoir le payout
3. Met à jour `has_received_payout = 1`
4. Ajoute le montant au wallet de l'utilisateur
5. Crée une transaction de type `payout`
6. Décale la date du prochain payout d'un mois
7. Incrémente le `current_cycle`

**Automatisation Laravel (app/Console/Kernel.php):**
```php
protected function schedule(Schedule $schedule)
{
    // Exécuter le 1er de chaque mois à 8h
    $schedule->call(function () {
        DB::statement('CALL process_monthly_payouts()');

        // Envoyer notification admin
        Notification::send(
            User::where('role', 'admin')->get(),
            new MonthlyPayoutsProcessedNotification()
        );
    })->monthlyOn(1, '08:00');
}
```

---

### 3. `generate_payment_reminders()` - Générer Rappels de Paiement

**Usage:** Automatisation des rappels 3 jours avant échéance

```sql
-- Générer les rappels de paiement
CALL generate_payment_reminders();
```

**Retour:**
```
reminders_sent
--------------
45
```

**Automatisation Laravel:**
```php
protected function schedule(Schedule $schedule)
{
    // Exécuter tous les jours à 9h
    $schedule->call(function () {
        $result = DB::select('CALL generate_payment_reminders()');

        Log::info("Payment reminders sent: " . $result[0]->reminders_sent);
    })->dailyAt('09:00');
}
```

---

### 4. `get_enterprise_report(start_date, end_date)` - Rapport Entreprise

**Usage:** Générer rapports périodiques pour clients corporate

```sql
-- Rapport du premier trimestre 2026
CALL get_enterprise_report('2026-01-01', '2026-03-31');
```

**Retourne 3 Jeux de Résultats:**

1. **Statistiques Globales**
2. **Top 10 Cercles Performants**
3. **Engagement Utilisateurs**

**Utilisation dans Laravel:**
```php
public function getQuarterlyReport(Request $request)
{
    $startDate = $request->input('start_date', now()->startOfQuarter());
    $endDate = $request->input('end_date', now()->endOfQuarter());

    $results = DB::select('CALL get_enterprise_report(?, ?)', [$startDate, $endDate]);

    return view('reports.enterprise', [
        'statistics' => $results[0],
        'top_circles' => $results[1] ?? [],
        'user_engagement' => $results[2] ?? null,
    ]);
}
```

---

## 🚀 Cas d'Usage Réels

### 1. API pour Partenaire Bancaire

```php
// routes/api.php
Route::get('/bank/credit-check/{userId}', function ($userId) {
    $score = DB::select('CALL calculate_user_credit_score(?)', [$userId]);

    if (empty($score)) {
        return response()->json(['error' => 'User not found'], 404);
    }

    $data = $score[0];

    return response()->json([
        'user_id' => $data->user_id,
        'full_name' => $data->full_name,
        'credit_score' => $data->credit_score,
        'risk_level' => $data->credit_risk_level,
        'loan_eligible' => $data->credit_score >= 700 && $data->kyc_status === 'verified',
        'max_loan_amount' => $data->total_amount_paid * 2, // 2x ce qu'il a déjà géré
        'payment_reliability' => $data->payment_success_rate,
    ]);
});
```

### 2. Dashboard Entreprise

```php
// App\Http\Controllers\EnterpriseController.php
public function dashboard()
{
    $stats = DB::table('enterprise_statistics')->first();
    $topCircles = DB::table('circle_performance')
        ->where('status', 'active')
        ->orderBy('collection_rate_percentage', 'desc')
        ->limit(5)
        ->get();

    return view('enterprise.dashboard', compact('stats', 'topCircles'));
}
```

### 3. Audit Trail Export

```php
public function exportFinancialAudit(Request $request)
{
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');

    $users = DB::table('user_financial_summary')
        ->whereBetween('account_created_at', [$startDate, $endDate])
        ->get();

    return Excel::download(new FinancialAuditExport($users), 'audit_' . $startDate . '_' . $endDate . '.xlsx');
}
```

---

## 📅 Automatisation Recommandée

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // 1. Payouts mensuels (1er du mois à 8h)
    $schedule->call(function () {
        DB::statement('CALL process_monthly_payouts()');
    })->monthlyOn(1, '08:00');

    // 2. Rappels de paiement (tous les jours à 9h)
    $schedule->call(function () {
        DB::statement('CALL generate_payment_reminders()');
    })->dailyAt('09:00');

    // 3. Rapport mensuel (dernier jour du mois)
    $schedule->call(function () {
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();

        DB::select('CALL get_enterprise_report(?, ?)', [$startDate, $endDate]);

        // Envoyer par email aux admins
    })->monthlyOn(now()->endOfMonth()->day, '18:00');
}
```

---

## 🔒 Sécurité & Performance

### Bonnes Pratiques:

1. **Indexation:** Les vues utilisent des index existants sur foreign keys
2. **Permissions:** Restreindre l'accès aux vues sensibles (credit_score)
3. **Cache:** Mettre en cache les résultats des vues pour reporting
4. **Monitoring:** Logger les appels aux procédures critiques

### Exemple de Cache:

```php
// Cacher le score de crédit 24h
$creditScore = Cache::remember("credit_score_{$userId}", 86400, function () use ($userId) {
    $result = DB::select('CALL calculate_user_credit_score(?)', [$userId]);
    return $result[0] ?? null;
});
```

---

## 📊 Métriques de Performance

Les vues sont optimisées mais peuvent être lentes sur de grandes bases:

- `user_credit_score`: ~100ms pour 10K users
- `circle_performance`: ~50ms pour 1K circles
- `enterprise_statistics`: ~200ms (calculs lourds)

**Solution:** Utiliser des vues matérialisées si MySQL 8.0+

---

## 🆘 Support & Questions

Pour toute question sur l'utilisation des vues et procédures:

1. Consulter ce guide
2. Vérifier les logs Laravel
3. Tester en développement avant production
4. Contacter l'équipe technique

---

**Dernière mise à jour:** 2026-02-02
**Version:** 1.0.0
