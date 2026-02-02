# ⚙️ Guide d'Automatisation - Kolo Tontine

Ce guide explique comment utiliser et configurer les tâches automatisées de la plateforme Kolo Tontine.

---

## 📋 Table des Matières

1. [Commandes Artisan Disponibles](#commandes-artisan-disponibles)
2. [Tâches Planifiées](#tâches-planifiées)
3. [Configuration du Cron](#configuration-du-cron)
4. [Tests et Développement](#tests-et-développement)
5. [Monitoring et Logs](#monitoring-et-logs)

---

## 🔧 Commandes Artisan Disponibles

### 1. Test des Vues SQL

Tester toutes les vues de la base de données:

```bash
php artisan db:test-views
```

Tester une vue spécifique:

```bash
php artisan db:test-views --view=user_credit_score
php artisan db:test-views --view=circle_performance
```

**Sortie:**
```
🧪 Testing Database Views...

📊 Testing: User Credit Score (For Banks)
✅ Found 5 records

+----------+------------+--------------+-------------+
| user_id  | first_name | credit_score | risk_level  |
+----------+------------+--------------+-------------+
| 1        | Jean       | 850          | LOW         |
+----------+------------+--------------+-------------+
```

---

### 2. Traitement des Payouts Mensuels

**Mode Aperçu (Dry Run)** - Voir ce qui sera traité sans exécuter:

```bash
php artisan payouts:process --dry-run
```

**Exécution Réelle:**

```bash
php artisan payouts:process
```

**Sortie:**
```
💰 Processing Monthly Payouts...

  • Circle: Épargne Employés 2026
    Next Beneficiary: Jean Dupont (Slot #3)
    Payout Amount: 500 000 XAF

✅ Monthly payouts processed successfully
📧 Admin notifications sent
```

**Ce que fait cette commande:**
- ✅ Trouve tous les cercles actifs avec échéance atteinte
- ✅ Identifie le prochain bénéficiaire (selon slot_number)
- ✅ Ajoute le montant au wallet de l'utilisateur
- ✅ Crée une transaction de type `payout`
- ✅ Met à jour `has_received_payout = 1`
- ✅ Décale la date du prochain payout d'un mois
- ✅ Log toutes les opérations

---

### 3. Génération des Rappels de Paiement

Envoyer des rappels aux utilisateurs avec paiements dus:

```bash
php artisan reminders:generate
```

Personnaliser le délai d'avance:

```bash
php artisan reminders:generate --days=5
```

**Sortie:**
```
🔔 Generating Payment Reminders (3 days before due)...

✅ 45 reminder(s) sent successfully

📋 Recent reminders sent:
  • Jean Dupont
    Your payment for "Épargne Employés" is due on 05/02/2026
  • Marie Martin
    Your payment for "Tontine Amis" is due on 06/02/2026
```

---

### 4. Rapport d'Entreprise

Générer un rapport complet:

```bash
# Rapport mensuel (par défaut)
php artisan report:enterprise

# Rapport trimestriel
php artisan report:enterprise --period=quarter

# Rapport annuel
php artisan report:enterprise --period=year

# Format JSON pour intégration
php artisan report:enterprise --format=json
```

**Sortie (format table):**
```
📊 Generating Enterprise Report (month)...

Period: 2026-02-01 to 2026-02-28

📈 Overall Statistics
+---------------------------+---------------+
| Metric                    | Value         |
+---------------------------+---------------+
| Total Users               | 1,245         |
| Total Circles             | 87            |
| Active Circles            | 52            |
| Money Circulated          | 125,500,000 XAF |
| User Engagement Rate      | 78.5%         |
| Transaction Success Rate  | 97.2%         |
+---------------------------+---------------+

🏆 Top Performing Circles
+-------------------------+---------+-----------------+------------------+
| Circle Name             | Members | Collection Rate | Amount Collected |
+-------------------------+---------+-----------------+------------------+
| Épargne Employés        | 10/10   | 100.0%          | 5,000,000 XAF    |
| Tontine Amis            | 8/10    | 95.5%           | 3,820,000 XAF    |
+-------------------------+---------+-----------------+------------------+
```

---

## 📅 Tâches Planifiées

Les tâches suivantes s'exécutent automatiquement via Laravel Scheduler:

### Planning Complet

| Tâche | Fréquence | Heure | Commande |
|-------|-----------|-------|----------|
| **Payouts Mensuels** | 1er de chaque mois | 08:00 | `payouts:process` |
| **Rappels de Paiement** | Quotidien | 09:00 | `reminders:generate` |
| **Rapport Hebdomadaire** | Lundi | 10:00 | `report:enterprise --period=month` |
| **Rapport Mensuel** | Dernier jour du mois | 18:00 | `report:enterprise --period=month --format=json` |
| **Nettoyage Base** | Quotidien | 03:00 | `model:prune` |

### Fichier de Configuration

📁 `routes/console.php`

```php
// Payouts mensuels
Schedule::command('payouts:process')
    ->monthlyOn(1, '08:00')
    ->timezone('Africa/Brazzaville')
    ->withoutOverlapping();

// Rappels quotidiens
Schedule::command('reminders:generate')
    ->dailyAt('09:00')
    ->timezone('Africa/Brazzaville');
```

---

## ⏰ Configuration du Cron

Pour activer l'exécution automatique, ajoutez cette ligne au crontab:

### Sur Linux/Mac:

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne:
* * * * * cd /path/to/kolo-tontine-backend && php artisan schedule:run >> /dev/null 2>&1
```

### Sur Windows (Task Scheduler):

1. Ouvrir **Task Scheduler**
2. Créer une tâche de base
3. **Déclencheur:** Quotidien, toutes les minutes
4. **Action:**
   ```
   Programme: C:\php\php.exe
   Arguments: C:\path\to\kolo-tontine-backend\artisan schedule:run
   ```

### Vérifier que le Scheduler Fonctionne:

```bash
# Afficher les tâches planifiées
php artisan schedule:list

# Tester manuellement
php artisan schedule:run

# Tester une tâche spécifique
php artisan schedule:test
```

---

## 🧪 Tests et Développement

### Tester les Tâches Localement

```bash
# 1. Tester les vues
php artisan db:test-views

# 2. Tester payouts en mode dry-run
php artisan payouts:process --dry-run

# 3. Générer des rappels de test
php artisan reminders:generate

# 4. Rapport de test
php artisan report:enterprise --period=month
```

### Exécuter le Scheduler Manuellement

```bash
# Exécuter toutes les tâches dues maintenant
php artisan schedule:run

# Forcer l'exécution d'une tâche spécifique
php artisan payouts:process
```

### Mode Verbeux pour Debugging

```bash
php artisan payouts:process -v
php artisan reminders:generate -vvv
```

---

## 📊 Monitoring et Logs

### Fichiers de Log

Tous les événements sont loggés dans:

```
storage/logs/laravel.log
```

**Exemples de logs:**

```
[2026-02-01 08:00:00] local.INFO: ✅ Monthly payouts processed successfully
[2026-02-01 09:00:00] local.INFO: Payment reminders generated {"reminders_sent":45}
[2026-02-01 10:00:00] local.INFO: ✅ Weekly enterprise report generated
```

### Surveiller les Tâches en Temps Réel

```bash
# Suivre les logs en direct
tail -f storage/logs/laravel.log

# Filtrer uniquement les tâches planifiées
tail -f storage/logs/laravel.log | grep "schedule"
```

### Erreurs Courantes

**1. Aucune tâche ne s'exécute:**
- ✅ Vérifier que le cron est configuré: `crontab -l`
- ✅ Tester manuellement: `php artisan schedule:run`
- ✅ Vérifier les permissions: `chmod -R 775 storage`

**2. "No scheduled commands are ready to run":**
- C'est normal si aucune tâche n'est due maintenant
- Utiliser `php artisan schedule:list` pour voir le planning

**3. Erreur de base de données:**
```bash
# Vérifier que les vues/procédures existent
php artisan db:test-views

# Relancer les migrations si nécessaire
php artisan migrate:fresh
```

---

## 🎯 Cas d'Usage Pratiques

### 1. Tester Avant Production

```bash
# 1. Vérifier toutes les vues
php artisan db:test-views

# 2. Test dry-run des payouts
php artisan payouts:process --dry-run

# 3. Générer un rapport de test
php artisan report:enterprise --period=month

# 4. Vérifier les tâches planifiées
php artisan schedule:list
```

### 2. Debug d'un Payout Échoué

```bash
# 1. Vérifier les logs
tail -n 100 storage/logs/laravel.log | grep "payout"

# 2. Tester en mode dry-run
php artisan payouts:process --dry-run

# 3. Vérifier les cercles actifs
php artisan db:test-views --view=circle_performance

# 4. Exécuter avec mode verbeux
php artisan payouts:process -vvv
```

### 3. Rapport Mensuel Manuel

```bash
# Générer le rapport du mois précédent
php artisan report:enterprise --period=month --format=json > monthly_report.json

# Afficher en tableau
php artisan report:enterprise --period=month

# Envoyer par email (après configuration)
php artisan report:enterprise --period=month --email=admin@kolo.com
```

---

## 🔐 Sécurité et Bonnes Pratiques

### 1. Logs Sensibles

Ne jamais logger:
- ❌ Mots de passe
- ❌ Tokens API
- ❌ Numéros de carte complets
- ❌ CVV

Toujours logger:
- ✅ Montants des transactions
- ✅ Statuts des opérations
- ✅ Références de paiement
- ✅ Erreurs et exceptions

### 2. Gestion des Erreurs

```php
// Exemple dans console.php
Schedule::command('payouts:process')
    ->monthlyOn(1, '08:00')
    ->onFailure(function () {
        // Alerter les admins
        Mail::to('admin@kolo.com')->send(new PayoutFailedAlert());

        // Logger l'erreur
        Log::error('❌ Critical: Monthly payout failed');
    });
```

### 3. Backup Avant Opérations Critiques

```bash
# Backup avant les payouts
php artisan backup:run
php artisan payouts:process
```

---

## 📞 Support

**Problèmes ou Questions?**

1. Consulter les logs: `tail -f storage/logs/laravel.log`
2. Tester les commandes manuellement
3. Vérifier la configuration du cron
4. Contacter l'équipe technique

---

## 📝 Checklist de Déploiement

Avant de mettre en production:

- [ ] Migrations exécutées (`php artisan migrate`)
- [ ] Vues SQL testées (`php artisan db:test-views`)
- [ ] Cron configuré (voir section Configuration du Cron)
- [ ] Logs configurés et accessibles
- [ ] Timezone correcte (`Africa/Brazzaville`)
- [ ] Emails de notification configurés
- [ ] Backup automatique activé
- [ ] Tests manuels réussis

---

**Dernière mise à jour:** 2026-02-02
**Version:** 1.0.0
