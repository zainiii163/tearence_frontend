# Daily security tests & Hostinger alerts

Scope: `worldwideadverts.info` (all category hubs) + `api.worldwideadverts.info`  
Last updated: 2026-08-13

## Why Hostinger keeps emailing you

Hostinger’s malware / vulnerability scanner often flags:

1. **Debug PHP in `public/`** — `phpinfo.php`, `test.php`, `proxy.php` (these were on the API and cause noisy alerts)
2. **npm / composer dependency CVEs** (Patchstack-style dependency mail)
3. **Heuristic hits** on obfuscated or unusual files (sometimes false positives)

Those debug files are **deleted from the backend repo** and gitignored. After you deploy API, delete them from Hostinger File Manager if they still exist on the server.

## What runs every day

| Where | What |
|-------|------|
| GitHub Actions (frontend) | `npm audit` + live site smoke + block debug PHP in git — 06:00 UTC |
| GitHub Actions (backend) | `composer audit` + live API smoke + payment-defence file check — 06:15 UTC |
| Optional Hostinger cron | `php scripts/daily-security-check.php` (email on failure) |

Manual run:

```bash
# Frontend
npm run security:daily

# Backend
php scripts/daily-security-check.php
```

Checks include: all main hubs up, no `phpinfo`/`test`/`proxy`/`logs`, CORS not `*`, login rejects bad passwords, payment confirm rejects fake `payment_id: paid`.

## Hostinger cron (optional)

hPanel → Advanced → Cron Jobs → Daily:

```bash
/usr/bin/php /home/YOUR_USER/domains/api.worldwideadverts.info/public_html/../scripts/daily-security-check.php
```

Enable “send output to email” so you only get mail when something fails (exit code 1).

## After every API deploy

```bash
php artisan migrate --force
php artisan optimize:clear
# Confirm these 404:
# https://api.worldwideadverts.info/phpinfo.php
# https://api.worldwideadverts.info/test.php
# https://api.worldwideadverts.info/proxy.php
# https://api.worldwideadverts.info/logs
```

## Firewall (still required)

Close public **MySQL 3306** (and review **8080**) in Hostinger firewall. Keep **443**.

## Related

- [SECURITY_HARDENING.md](./SECURITY_HARDENING.md) — code fixes already shipped
- Payment defence: `PaymentVerificationService` on confirm/complete routes
