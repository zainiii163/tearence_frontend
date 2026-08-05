# WWA Promo Pricing, Duration & Reward Codes — Hostinger deploy

## Backend (`tearence_backend` / live API)

```bash
cd /path/to/WWA-backend
git pull origin main
php artisan migrate --force
php artisan db:seed --class=PromoPricingPlanSeeder
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

Optional one-shot disable of already-expired ads:

```bash
php artisan ads:disable-expired
```

Cron should already pick up `ads:disable-expired` daily (and hard-delete only at 90 days).

## Frontend (`tearence_frontend`)

```bash
cd /path/to/WWA-Frontend-New-main
npm run build
```

Upload **contents of `build/`** to Hostinger `public_html` (include `.htaccess`).

## Clive matrix (live)

| Tier | USD | Duration |
|------|-----|----------|
| Sponsored | 100 | 1 month |
| Featured | 30 | 2 weeks |
| Promoted | 50 | 3 weeks |
| Paid 1w / 2w / 4w | 10 / 15 / 20 | 7 / 14 / 28 days |
| Free posts | — | 30 days then disabled |

## Test reward codes (seeded)

- `WWA10` — 10% off
- `CLIVE20` — $20 off sponsored/featured/promoted
- `POINTS50` — 50 reward points
