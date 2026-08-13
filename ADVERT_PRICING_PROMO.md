# Advert posting pricing (launch promotional offer)

**Editable in:** Filament → **Marketing & Ads → Promo Pricing Plans**  
**API:** `GET /api/v1/promo/pricing-plans` (optional `?vertical=` / `?listing_tiers=1`)

Change price or duration in Filament — the site loads from the API. Fallbacks below apply only if the DB/API is empty.

## Listing tiers (all marketplaces)

| Tier | Duration | Price (USD) |
|------|----------|-------------|
| **Free** | 3 days | $0 |
| **Paid** | 1 week (7 days) | $10 |
| **Promoted** | 1 week | $20 |
| **Featured** | 1 week | $30 |
| **Sponsored** | 1 week | $40 |

## Affiliate cookie / hop packages (posted on WWA for advertising)

| Package | Cookie + listing window | Price (USD) |
|---------|-------------------------|-------------|
| **cookie_30** | 30 days | $20 |
| **cookie_60** | 60 days | $30 |
| **cookie_90** | 90 days | $40 |

## How to change requirements

1. Open Filament → **Promo Pricing Plans**
2. Edit the plan’s `price_usd` and/or `duration_days`
3. Toggle `is_active` to hide a package
4. Frontend checkout / forms pick up changes on next load (no code deploy required for price edits)

## Ops after deploy

```bash
cd ~/domains/api.worldwideadverts.info/public_html
php artisan db:seed --class=PromoPricingPlanSeeder --force
php artisan optimize:clear
```

## Code touchpoints

- Backend: `PromoPricingService`, `PromoPricingPlanSeeder`, `PromoPricingPlanResource`
- Frontend fallbacks: `listingTierOptions.js`, `promoPricing.js`
- Affiliate form cookie packages: `AffiliateModalForm.jsx`
