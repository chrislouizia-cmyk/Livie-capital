# Livie Capital Release Readiness

## Overall Status

**Needs Work**

Livie Capital has a strong product foundation: the public dashboard is branded, Supabase-backed, documented, and buildable. The main release blocker is admin security. Admin write workflows exist and use server-side Supabase access, but admin routes and Server Actions must be consistently protected before public deployment.

## 1. Product Readiness

**Status: Needs Work**

The product has a clear institutional dashboard, admin entry flows, Supabase-backed data reads, report generation, and a coherent brand system. The public experience is visually mature and aligned with the Livie Capital positioning.

Recommendations:

- Add a final navigation pass for admin routes so all admin tools are discoverable from `/admin`.
- Add empty-state guidance for first-time production databases.
- Add a small operational checklist for daily portfolio updates, trade entry, report generation, and verification.
- Confirm mobile layouts on physical devices before launch.

## 2. Data Architecture

**Status: Ready**

The data model is finance-native enough for the current product stage. Core tables exist for portfolio snapshots, assets, positions, trades, reports, and performance metrics. Shared TypeScript finance types exist, Supabase query utilities are centralized, and the base reporting currency has moved to USD.

Recommendations:

- Rename the legacy `mxn_usd` column in a future migration to a neutral name such as `fx_rate` or `usd_fx_rate`.
- Add typed Supabase generated database types to reduce manual row casting.
- Add unique constraints where operational duplicates should be prevented, especially for repeated report periods and trade imports.
- Decide whether trade entry should formally include quantity, fees, strategy, broker, and realized/unrealized classification.

## 3. Security

**Status: Critical**

Public RLS policies correctly allow read-only access for dashboard tables. Service-role usage is server-side only, which is the right direction. However, admin write actions currently exist and can insert data through server actions. Admin authentication helpers exist, but the admin pages and write actions must enforce `requireAdmin()` consistently before release.

Recommendations:

- Add `requireAdmin()` to every admin page that displays private workflows.
- Add `requireAdmin()` inside every Server Action that writes to Supabase.
- Keep `SUPABASE_SERVICE_ROLE_KEY` only in server environment variables and never in client code.
- Rotate the service role key if it was ever shared outside a secure environment.
- Add middleware or route-level protection for `/admin/*`.
- Add audit logging for admin inserts and updates before allowing production writes.

## 4. Supabase Configuration

**Status: Needs Work**

The schema, seed data, RLS policy migration, admin users table, and read utilities are in place. Public SELECT is allowed for dashboard tables and writes are reserved for server-side/admin workflows. The configuration is close, but production hardening remains.

Recommendations:

- Run all migrations in production in order and verify table counts from `/supabase-data-test`.
- Confirm RLS is enabled on all public dashboard tables in the production Supabase project.
- Confirm no INSERT, UPDATE, or DELETE policies exist for anon users.
- Manually create the first admin user in `admin_users` only after Supabase Auth user creation.
- Add database backups and a rollback plan before launch.
- Keep `.env.local` out of git and configure Vercel environment variables directly.

## 5. Admin Workflows

**Status: Critical**

Admin workflows exist for portfolio snapshots, trade entry, report generation, and broader insert actions. The UI direction is consistent with the brand. The blocker is authorization: these workflows must not be reachable or executable without verified admin status.

Recommendations:

- Protect `/admin`, `/admin/portfolio`, `/admin/trades/new`, `/admin/snapshots/new`, and `/admin/reports/generate`.
- Protect all insert actions in `app/admin/actions.ts`.
- Add confirmation screens for destructive or financially material actions when edit/delete workflows are introduced.
- Add form-level validation for domain rules, not only required fields and number checks.
- Add success states that include the inserted record date/symbol for easier operator verification.

## 6. Dashboard Stability

**Status: Ready**

The dashboard reads from Supabase, uses fallback and empty states in key components, and the project builds successfully. The dashboard design remains consistent with the premium dark Livie Capital style.

Recommendations:

- Add smoke tests for the main dashboard and Supabase data test route.
- Add a production monitoring path for Supabase read failures.
- Add typed response mapping so dashboard components do not depend directly on raw database column names.
- Confirm report generation print output in Chrome, Safari, and mobile browsers.

## 7. Documentation Completeness

**Status: Ready**

The documentation set is strong for this stage. Founding principles, investment policy, North Star, anti-goals, founder letter, and brand guidelines are present. The project has a clear operating philosophy and institutional language.

Recommendations:

- Add a deployment guide for Vercel and Supabase environment variables.
- Add an admin operations guide.
- Add a data dictionary for each Supabase table and field.
- Add a release checklist that references this readiness document.

## Release Gate

Livie Capital should not be considered production-ready until admin authorization is enforced across all admin pages and write actions.

Minimum pre-release checklist:

1. Protect every `/admin/*` route.
2. Protect every admin Server Action with `requireAdmin()`.
3. Verify public dashboard tables remain SELECT-only for anon users.
4. Rotate any exposed service role credentials.
5. Run `npm run lint`.
6. Run `npm run build`.
7. Verify Supabase production reads and seed data.
8. Test PDF report generation from production data.
