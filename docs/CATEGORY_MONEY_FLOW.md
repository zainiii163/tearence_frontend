# Category money flow (Clive)

Per-category ledger so super admin can see money separately for each marketplace.

## Buckets (every category)

| Bucket | Meaning |
|--------|---------|
| **Our money** (`platform`) | Products, listing fees, adverts, commissions / platform take (15% sales) |
| **Seller payouts** (`seller_payout`) | Amounts owed/paid to customers selling |
| **Other** (`other`) | Donations, funding pledges, pass-through |

## Where to view

- **Filament:** Dashboards → **Category Money**
- **Frontend admin:** `/admin/category-money`
- **API:** `GET /api/v1/admin/category-money/summary` (admin JWT)

## Deploy

```bash
php artisan migrate --force
php artisan money:backfill-category-flows
php artisan optimize:clear
```

Accept the WWA PayPal business invite, then set live PayPal credentials in Hostinger `.env` (`PAYPAL_MODE=live` + live client id/secret) when ready to leave sandbox.

## PayPal note

Payment verification (`PaymentVerificationService`) already guards confirms. New sales write into `category_money_flows` after verify. Backfill fills historical paid store/service/buy-sell/template orders.
