# RMBPay Admin Dashboard — wired to real data

This replaces the previous mock-data version. It's a Vite + React app (same
tooling your repo already uses) connected directly to the **same Supabase
project as the RMBPay user app** (`rgfzrrfrshywpaoqbxvz`), so every real
transaction, KYC submission, wallet change, exchange rate, and service
status update shows up here live via Supabase Realtime.

## How to add this to your GitHub repo

1. In your `AdminDash` repo, **delete everything** except `.git` (or start
   from a clean checkout).
2. Copy every file from this package into the repo root, preserving the
   folder structure (`src/`, `src/lib/`, `src/pages/`, plus the root config
   files: `package.json`, `vite.config.js`, `tailwind.config.js`,
   `postcss.config.js`, `index.html`).
3. Commit and push to `main`. Vercel will build and deploy automatically
   (it's already linked to this repo).

## Environment variables (optional but recommended)

The Supabase URL and anon key are hardcoded as a fallback in
`src/lib/supabaseClient.js`, so it will work even with no env vars set.
For production hygiene, in Vercel → Project Settings → Environment
Variables, add:

- `VITE_SUPABASE_URL` = `https://rgfzrrfrshywpaoqbxvz.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `sb_publishable_7xfyOE_s3JUxk6sZwoi91w_HdLtPeRk`

Then redeploy. (The anon/publishable key is safe to expose client-side —
it's protected by Row Level Security, not secrecy.)

## Logging in

Sign in with an account that has a row in the `admin_roles` table on the
`rmbpay` Supabase project. Currently that's:

- **icesplashyt@icloud.com** (role: `superadmin`)

Any account without an `admin_roles` row will be rejected at login, even
if the Supabase Auth credentials are valid.

## What's wired to real data

- **Stat cards** — total balance, users, transactions, today's volume,
  failed transactions (all from live SQL views).
- **Transaction Volume chart** — real last-7-days data, zero-filled.
- **Live Transactions / Recent KYC** — realtime, updates the moment the
  user app writes a new row.
- **Payments Overview, System Status, Exchange Rates** — real tables.
- **Security Alerts** — from the real `audit_log` table.
- **KYC approve/reject** — calls the existing `admin_review_kyc()` Postgres
  function (already built into your backend), which validates the
  submission, updates `profiles.kyc_verified`, logs to `audit_log`, and
  notifies the user.
- **Update Exchange Rates** — writes directly to `exchange_rates`
  (requires `finance` or `superadmin` role).

## Database changes made to support this

Applied directly to the `rmbpay` Supabase project (not a separate one):

- Added 6 read-only views: `admin_v_dashboard_stats`,
  `admin_v_transaction_volume_daily`, `admin_v_kyc_counts`,
  `admin_v_payments_overview`, `admin_v_recent_transactions`,
  `admin_v_security_alerts`.
- Enabled Realtime on `transactions`, `kyc_submissions`, `audit_log`,
  `wallets`.

No changes were made to the user-facing app or its tables — this is
additive only.
