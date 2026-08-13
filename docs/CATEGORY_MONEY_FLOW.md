# Category money flow (Clive)

Per-category ledger so super admin can see money separately for each marketplace.

## Two payment types (important)

| What the user pays for | Who keeps the money |
|------------------------|---------------------|
| **Listing / advert fee** — Free, Paid ($10), Promoted ($20), Featured ($30), Sponsored ($40), affiliate cookies | **100% Worldwide Adverts** (platform) |
| **Product purchase** — buyer buys a book, buy-sell item, image, service, template, etc. | Buyer pays **WWA checkout** → **~15% platform fee** + **~85% credited to the seller** |

Sellers withdraw their balance via **Dashboard → Sales & Purchases → Seller earnings** (crypto USDT/USDC). Admin approves in Filament **Seller payouts**.

Platform-owned products (e.g. business tools) stay **100% WWA**.

## Buckets (every category)

| Bucket | Meaning |
|--------|---------|
| **Our money** (`platform`) | Products we sell, listing fees, adverts, commissions / platform take (15% sales) |
| **Seller payouts** (`seller_payout`) | Amounts owed/paid to customers selling |
| **Other** (`other`) | Donations, funding pledges, pass-through |

## Where to view

- **Filament:** Dashboards → **Category Money** · Commerce → **Seller payouts**
- **Frontend admin:** `/admin/category-money`
- **Seller UI:** `/dashboard?tab=commerce&sub=earnings`
- **API:** `GET /api/v1/admin/category-money/summary` · `GET /api/v1/seller/earnings`

## Deploy

```bash
php artisan migrate --force
php artisan money:backfill-category-flows
php artisan optimize:clear
```

Accept the WWA PayPal business invite, then set live PayPal credentials in Hostinger `.env` (`PAYPAL_MODE=live` + live client id/secret) when ready to leave sandbox.

## PayPal note

Payment verification (`PaymentVerificationService`) already guards confirms. New sales write into `category_money_flows` after verify. Backfill fills historical paid store/service/buy-sell/template orders.
