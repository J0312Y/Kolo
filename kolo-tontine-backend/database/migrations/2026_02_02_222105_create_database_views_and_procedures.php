<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates views and stored procedures for:
     * - Bank credit scoring and loan verification
     * - Enterprise tontine reporting
     * - Automated monthly payout processing
     * - Financial auditing and compliance
     */
    public function up(): void
    {
        // Stored procedures and some views are MySQL-only; skip on SQLite
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

        // ============================================
        // VIEW 1: User Credit Score (For Banks)
        // ============================================
        DB::statement("
            CREATE VIEW user_credit_score AS
            SELECT
                u.id AS user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.kyc_status,

                -- Circle participation
                COUNT(DISTINCT lm.like_lemba_id) AS total_circles_joined,
                COUNT(DISTINCT CASE WHEN l.status = 'completed' THEN l.id END) AS circles_completed,

                -- Payment reliability
                COUNT(DISTINCT p.id) AS total_payments,
                COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) AS successful_payments,
                ROUND((COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) * 100.0) / NULLIF(COUNT(DISTINCT p.id), 0), 2) AS payment_success_rate,

                -- Financial metrics
                COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) AS total_amount_paid,
                COALESCE(MAX(p.paid_at), NULL) AS last_payment_date,
                DATEDIFF(NOW(), u.created_at) AS account_age_days,

                -- Payout received (shows they completed cycles)
                COUNT(DISTINCT CASE WHEN lm.has_received_payout = 1 THEN lm.id END) AS payouts_received,

                -- Credit Score (0-1000)
                LEAST(1000, GREATEST(0,
                    (COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) * 5) + -- 5 points per payment
                    (COUNT(DISTINCT CASE WHEN l.status = 'completed' THEN l.id END) * 100) + -- 100 points per completed circle
                    (COUNT(DISTINCT CASE WHEN lm.has_received_payout = 1 THEN lm.id END) * 50) + -- 50 points per payout received
                    (CASE WHEN u.kyc_status = 'verified' THEN 100 ELSE 0 END) + -- 100 points for KYC
                    (LEAST(365, DATEDIFF(NOW(), u.created_at)) / 365 * 100) -- Up to 100 for 1 year account age
                )) AS credit_score,

                -- Risk level for banks
                CASE
                    WHEN (COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) * 100.0) / NULLIF(COUNT(DISTINCT p.id), 0) >= 95 THEN 'LOW'
                    WHEN (COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) * 100.0) / NULLIF(COUNT(DISTINCT p.id), 0) >= 80 THEN 'MEDIUM'
                    ELSE 'HIGH'
                END AS credit_risk_level,

                u.created_at AS member_since

            FROM users u
            LEFT JOIN like_lemba_members lm ON u.id = lm.user_id
            LEFT JOIN like_lemba l ON lm.like_lemba_id = l.id
            LEFT JOIN payments p ON u.id = p.user_id
            GROUP BY u.id
        ");

        // ============================================
        // VIEW 2: User Payment History (For Banks & Audits)
        // ============================================
        DB::statement("
            CREATE VIEW user_payment_history AS
            SELECT
                u.id AS user_id,
                u.first_name,
                u.last_name,
                l.id AS circle_id,
                l.name AS circle_name,
                p.id AS payment_id,
                p.amount,
                p.status,
                p.method,
                p.reference,
                p.cycle_number,
                p.paid_at,
                p.created_at AS payment_date,

                -- Punctuality check (paid before due date)
                CASE
                    WHEN p.paid_at IS NOT NULL AND p.paid_at <= l.next_payout_date THEN 'ON_TIME'
                    WHEN p.paid_at IS NOT NULL AND p.paid_at > l.next_payout_date THEN 'LATE'
                    WHEN p.status = 'pending' AND NOW() > l.next_payout_date THEN 'OVERDUE'
                    ELSE 'PENDING'
                END AS payment_punctuality,

                DATEDIFF(p.paid_at, l.next_payout_date) AS days_difference

            FROM users u
            JOIN payments p ON u.id = p.user_id
            JOIN like_lemba l ON p.like_lemba_id = l.id
            ORDER BY u.id, p.created_at DESC
        ");

        // ============================================
        // VIEW 3: Circle Performance (For Enterprise Reporting)
        // ============================================
        DB::statement("
            CREATE VIEW circle_performance AS
            SELECT
                l.id AS circle_id,
                l.name AS circle_name,
                l.status,
                l.contribution_amount,
                l.duration_months,
                l.total_slots,
                l.current_members,
                ROUND((l.current_members * 100.0) / l.total_slots, 2) AS fill_rate_percentage,

                -- Admin info
                u.first_name AS admin_first_name,
                u.last_name AS admin_last_name,
                u.email AS admin_email,

                -- Financial metrics
                COUNT(DISTINCT p.id) AS total_payments,
                COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) AS successful_payments,
                COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) AS total_collected,
                (l.contribution_amount * l.duration_months * l.current_members) AS expected_total,

                -- Collection rate
                ROUND(
                    (COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) * 100.0) /
                    NULLIF((l.contribution_amount * l.duration_months * l.current_members), 0),
                    2
                ) AS collection_rate_percentage,

                -- Member participation
                COUNT(DISTINCT lm.user_id) AS active_members,
                COUNT(DISTINCT CASE WHEN lm.has_received_payout = 1 THEN lm.user_id END) AS members_paid_out,

                -- Dates
                l.start_date,
                l.next_payout_date,
                l.created_at AS circle_created_at,
                DATEDIFF(NOW(), l.created_at) AS circle_age_days

            FROM like_lemba l
            JOIN users u ON l.admin_id = u.id
            LEFT JOIN like_lemba_members lm ON l.id = lm.like_lemba_id
            LEFT JOIN payments p ON l.id = p.like_lemba_id
            GROUP BY l.id
        ");

        // ============================================
        // VIEW 4: Enterprise Statistics (For Corporate Clients)
        // ============================================
        DB::statement("
            CREATE VIEW enterprise_statistics AS
            SELECT
                -- Overall metrics
                COUNT(DISTINCT u.id) AS total_users,
                COUNT(DISTINCT l.id) AS total_circles,
                COUNT(DISTINCT CASE WHEN l.status = 'active' THEN l.id END) AS active_circles,
                COUNT(DISTINCT CASE WHEN l.status = 'completed' THEN l.id END) AS completed_circles,

                -- Financial metrics
                COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) AS total_money_circulated,
                COALESCE(SUM(u.wallet_balance), 0) AS total_wallet_balance,
                COALESCE(AVG(u.wallet_balance), 0) AS avg_user_balance,

                -- Engagement metrics
                COUNT(DISTINCT lm.user_id) AS users_in_circles,
                ROUND((COUNT(DISTINCT lm.user_id) * 100.0) / NULLIF(COUNT(DISTINCT u.id), 0), 2) AS user_engagement_rate,
                AVG(circle_counts.circles_per_user) AS avg_circles_per_user,

                -- Payment metrics
                COUNT(DISTINCT p.id) AS total_transactions,
                COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) AS successful_transactions,
                ROUND((COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) * 100.0) / NULLIF(COUNT(DISTINCT p.id), 0), 2) AS transaction_success_rate,

                -- Time period
                MIN(u.created_at) AS platform_start_date,
                DATEDIFF(NOW(), MIN(u.created_at)) AS platform_age_days

            FROM users u
            LEFT JOIN like_lemba_members lm ON u.id = lm.user_id
            LEFT JOIN like_lemba l ON lm.like_lemba_id = l.id
            LEFT JOIN payments p ON u.id = p.user_id
            CROSS JOIN (
                SELECT AVG(circle_count) AS circles_per_user
                FROM (
                    SELECT user_id, COUNT(*) AS circle_count
                    FROM like_lemba_members
                    GROUP BY user_id
                ) AS user_circles
            ) AS circle_counts
        ");

        // ============================================
        // VIEW 5: User Financial Summary (For Audits)
        // ============================================
        DB::statement("
            CREATE VIEW user_financial_summary AS
            SELECT
                u.id AS user_id,
                CONCAT(u.first_name, ' ', u.last_name) AS full_name,
                u.email,
                u.phone,
                u.wallet_balance,
                u.card_balance,
                u.kyc_status,
                u.plan_tier,

                -- Income (payouts received)
                COALESCE(SUM(CASE WHEN t.type = 'payout' AND t.status = 'completed' THEN t.amount ELSE 0 END), 0) AS total_payouts_received,

                -- Expenses (contributions paid)
                COALESCE(SUM(CASE WHEN t.type = 'payment' AND t.status = 'completed' THEN t.amount ELSE 0 END), 0) AS total_contributions_paid,

                -- Deposits & Withdrawals
                COALESCE(SUM(CASE WHEN t.type = 'deposit' AND t.status = 'completed' THEN t.amount ELSE 0 END), 0) AS total_deposits,
                COALESCE(SUM(CASE WHEN t.type = 'withdrawal' AND t.status = 'completed' THEN t.amount ELSE 0 END), 0) AS total_withdrawals,

                -- Fees
                COALESCE(SUM(CASE WHEN t.type = 'fee' AND t.status = 'completed' THEN t.amount ELSE 0 END), 0) AS total_fees_paid,

                -- Net position
                (u.wallet_balance + u.card_balance +
                 COALESCE(SUM(CASE WHEN t.type = 'payout' AND t.status = 'completed' THEN t.amount ELSE 0 END), 0) -
                 COALESCE(SUM(CASE WHEN t.type = 'payment' AND t.status = 'completed' THEN t.amount ELSE 0 END), 0)
                ) AS net_financial_position,

                -- Activity
                COUNT(DISTINCT t.id) AS total_transactions,
                MAX(t.created_at) AS last_transaction_date,
                u.created_at AS account_created_at

            FROM users u
            LEFT JOIN transactions t ON u.id = t.user_id
            GROUP BY u.id
        ");

        // ============================================
        // PROCEDURE 1: Calculate User Credit Score
        // ============================================
        DB::statement("
            CREATE PROCEDURE calculate_user_credit_score(IN target_user_id BIGINT UNSIGNED)
            BEGIN
                SELECT
                    user_id,
                    CONCAT(first_name, ' ', last_name) AS full_name,
                    credit_score,
                    credit_risk_level,
                    total_circles_joined,
                    circles_completed,
                    payment_success_rate,
                    total_amount_paid,
                    payouts_received,
                    account_age_days,
                    kyc_status
                FROM user_credit_score
                WHERE user_id = target_user_id;
            END
        ");

        // ============================================
        // PROCEDURE 2: Process Monthly Payouts
        // ============================================
        DB::statement("
            CREATE PROCEDURE process_monthly_payouts()
            BEGIN
                DECLARE done INT DEFAULT FALSE;
                DECLARE circle_id BIGINT UNSIGNED;
                DECLARE next_member_id BIGINT UNSIGNED;
                DECLARE payout_amount DECIMAL(15,2);

                DECLARE circle_cursor CURSOR FOR
                    SELECT id FROM like_lemba
                    WHERE status = 'active'
                    AND next_payout_date <= CURDATE();

                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

                OPEN circle_cursor;

                read_loop: LOOP
                    FETCH circle_cursor INTO circle_id;
                    IF done THEN
                        LEAVE read_loop;
                    END IF;

                    -- Get next member to receive payout
                    SELECT lm.user_id, (l.contribution_amount * l.current_members)
                    INTO next_member_id, payout_amount
                    FROM like_lemba l
                    JOIN like_lemba_members lm ON l.id = lm.like_lemba_id
                    WHERE l.id = circle_id
                    AND lm.has_received_payout = 0
                    ORDER BY lm.slot_number
                    LIMIT 1;

                    IF next_member_id IS NOT NULL THEN
                        -- Mark member as received payout
                        UPDATE like_lemba_members
                        SET has_received_payout = 1,
                            payout_received_date = CURDATE()
                        WHERE like_lemba_id = circle_id AND user_id = next_member_id;

                        -- Add to user wallet
                        UPDATE users
                        SET wallet_balance = wallet_balance + payout_amount
                        WHERE id = next_member_id;

                        -- Create transaction record
                        INSERT INTO transactions (user_id, type, status, title, description, amount, reference, like_lemba_id, created_at, updated_at)
                        VALUES (
                            next_member_id,
                            'payout',
                            'completed',
                            'Monthly Circle Payout',
                            CONCAT('Payout from circle ID: ', circle_id),
                            payout_amount,
                            CONCAT('PAYOUT-', circle_id, '-', next_member_id, '-', UNIX_TIMESTAMP()),
                            circle_id,
                            NOW(),
                            NOW()
                        );

                        -- Update circle next payout date
                        UPDATE like_lemba
                        SET next_payout_date = DATE_ADD(next_payout_date, INTERVAL 1 MONTH),
                            current_cycle = current_cycle + 1
                        WHERE id = circle_id;
                    END IF;
                END LOOP;

                CLOSE circle_cursor;

                SELECT 'Monthly payouts processed successfully' AS message;
            END
        ");

        // ============================================
        // PROCEDURE 3: Generate Payment Reminders
        // ============================================
        DB::statement("
            CREATE PROCEDURE generate_payment_reminders()
            BEGIN
                -- Find users with payments due in next 3 days
                INSERT INTO notifications (user_id, type, title, message, icon, color, `read`, like_lemba_id, created_at, updated_at)
                SELECT
                    lm.user_id,
                    'payment',
                    'Payment Reminder',
                    CONCAT('Your payment for \"', l.name, '\" is due on ', DATE_FORMAT(l.next_payout_date, '%d/%m/%Y')),
                    'alert-circle',
                    'warning',
                    0,
                    l.id,
                    NOW(),
                    NOW()
                FROM like_lemba l
                JOIN like_lemba_members lm ON l.id = lm.like_lemba_id
                WHERE l.status = 'active'
                AND l.next_payout_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
                AND NOT EXISTS (
                    SELECT 1 FROM payments p
                    WHERE p.like_lemba_id = l.id
                    AND p.user_id = lm.user_id
                    AND p.cycle_number = l.current_cycle
                    AND p.status = 'completed'
                );

                SELECT ROW_COUNT() AS reminders_sent;
            END
        ");

        // ============================================
        // PROCEDURE 4: Get Enterprise Report
        // ============================================
        DB::statement("
            CREATE PROCEDURE get_enterprise_report(IN start_date DATE, IN end_date DATE)
            BEGIN
                -- Overall statistics
                SELECT * FROM enterprise_statistics;

                -- Top performing circles
                SELECT
                    circle_name,
                    status,
                    collection_rate_percentage,
                    total_collected,
                    active_members
                FROM circle_performance
                WHERE circle_created_at BETWEEN start_date AND end_date
                ORDER BY collection_rate_percentage DESC
                LIMIT 10;

                -- User engagement
                SELECT
                    COUNT(*) AS total_users,
                    COUNT(CASE WHEN last_transaction_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) AS active_last_30_days,
                    AVG(total_transactions) AS avg_transactions_per_user
                FROM user_financial_summary
                WHERE account_created_at BETWEEN start_date AND end_date;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

        // Drop procedures
        DB::statement('DROP PROCEDURE IF EXISTS get_enterprise_report');
        DB::statement('DROP PROCEDURE IF EXISTS generate_payment_reminders');
        DB::statement('DROP PROCEDURE IF EXISTS process_monthly_payouts');
        DB::statement('DROP PROCEDURE IF EXISTS calculate_user_credit_score');

        // Drop views
        DB::statement('DROP VIEW IF EXISTS user_financial_summary');
        DB::statement('DROP VIEW IF EXISTS enterprise_statistics');
        DB::statement('DROP VIEW IF EXISTS circle_performance');
        DB::statement('DROP VIEW IF EXISTS user_payment_history');
        DB::statement('DROP VIEW IF EXISTS user_credit_score');
    }
};
