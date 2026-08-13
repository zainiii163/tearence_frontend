# WWA Payment, Affiliates & Money Flow — What Was Implemented

**For:** Clive / Worldwide Adverts team  
**Date:** 13 August 2026  
**Repos:** Frontend `WWA-Frontend-New-main` · Backend `WWA-backend-New_main` (Laravel + Filament)

This document explains **what was built**, **how money moves**, and **where to find each piece** in the admin and user dashboards.

---

## 1. Simple overview (one paragraph)

Users can post ads and sell products across categories (books, buy-sell, services, images, etc.).  
**Paying to post or boost an ad** → money goes to **Worldwide Adverts (the website)**.  
**A buyer purchasing a product** → money is collected by **WWA checkout**, then split: **~15% stays with WWA**, **~85% is credited to the seller**, who can later withdraw via **crypto**.  
**Affiliates** have their own track: businesses pay commission on sales made via a promoter’s link; promoters earn and request payouts.  
Checkout supports **PayPal** (sandbox for now) and **crypto (USDT/USDC)** on all paid flows — not affiliates only.

---

## 2. Advert posting prices (launch promo — editable in admin)

These are the starting offers Clive set. Prices and durations can be changed in the backend (**Filament → Promo Pricing Plans** / API `GET /promo/pricing-plans`).

| Plan | Duration | Price (USD) | Who receives the fee |
|------|----------|-------------|----------------------|
| **Free** | 3 days | $0 | — |
| **Paid** | 1 week | $10 | **100% WWA** |
| **Promoted** | 1 week | $20 | **100% WWA** |
| **Featured** | 1 week | $30 | **100% WWA** |
| **Sponsored** | 1 week | $40 | **100% WWA** |
| **Affiliate cookie 30 days** | 30 days | $20 | **100% WWA** (site advertising package) |
| **Affiliate cookie 60 days** | 60 days | $30 | **100% WWA** |
| **Affiliate cookie 90 days** | 90 days | $40 | **100% WWA** |

After a paid listing is created, the user is sent to **shared checkout** (`/payment` or checkout modal) and can pay with **PayPal or crypto**. The advert goes live only after payment is confirmed.

---

## 3. Money flow — two different payments

### A) Seller posts / promotes an advert (listing fee)

```
Seller chooses Free / Paid / Promoted / Featured / Sponsored
        ↓
Pays WWA (PayPal or crypto) if paid plan
        ↓
100% → Worldwide Adverts (platform)
        ↓
Advert goes live on the category page
```

**Example:** Author posts a book with “Promoted” ($20) → that $20 is **WWA’s money** (advert revenue).

### B) Buyer buys the product (sale)

```
Buyer finds the book (or item) on the category page
        ↓
Pays full price to WWA checkout (PayPal or crypto)
        ↓
Split (default 15% / 85% — configurable via PLATFORM_FEE_PERCENT):
   • ~15% → WWA (platform commission)
   • ~85% → credited to the seller’s balance
        ↓
Seller withdraws via Dashboard → Seller earnings (crypto)
Admin approves & sends in Filament → Seller payouts
```

**Example:** Book costs $40. Buyer pays $40 to WWA.  
→ WWA keeps ~$6 · Seller is credited ~$34.

Platform-owned products (e.g. some business tools) can be **100% WWA** with no seller share.

---

## 4. Super admin — money by category

Clive asked that each category’s money be visible and structured separately.

### Buckets (every category)

| Bucket | Meaning |
|--------|---------|
| **Our money** | Products, listing fees, adverts, commissions (platform take) |
| **Seller payouts** | Amounts owed / paid to sellers |
| **Other** | Donations, funding pledges, pass-through |

### Where to view

| Place | Path |
|-------|------|
| Filament | Dashboards → **Category Money** |
| React admin | `/admin/category-money` |
| API | `GET /api/v1/admin/category-money/summary` |
| Short doc | `docs/CATEGORY_MONEY_FLOW.md` |

Ledger table: `category_money_flows`.

---

## 5. Shared payment system (PayPal + crypto)

### What was built

- **One checkout component** (`PaymentProcessor`) used across ads, buy/sell, books, services, images, banners, jobs upsells, subscriptions, etc.
- Methods: **PayPal** + **Crypto** (USDT TRC20, USDT ERC20, USDC Polygon).
- Crypto invoices via **NOWPayments**; signed IPN webhook; mock mode for testing.
- Payment confirmation on the backend before an advert or order is marked paid (`PaymentVerificationService`).
- Sandbox `/payment/sandbox` for testing without a Pakistan PayPal personal account.

### PayPal status

- Live WWA PayPal account: Clive’s invite (Zain cannot create a personal PK PayPal account).
- Until live credentials are on the server: **sandbox / mock** for testing.
- When ready: put live keys in Hostinger `.env` (`PAYPAL_MODE=live` + client id/secret). Clive can share desk access for that step.

### Crypto status

- **Inflow** (customers paying): available on all paid posts and purchases.
- **Outflow** (paying promoters / sellers): crypto wallet + admin “Approve & send crypto”.

---

## 6. Affiliate system (special money track)

Affiliates are **not** the same as “buyer buys a book from a seller”.

| Role | Pays | Receives |
|------|------|----------|
| **Business** (wants product promoted) | The commission % (or flat) they offered, per attributed sale | Sale revenue minus that commission |
| **Promoter** (uses hop / affiliate link) | Nothing for the sale itself | Commission when a sale is attributed to their link |

### Flows

1. Business creates an offer (commission + cookie package 30/60/90 days if advertising on site).
2. Promoter gets a hop link and promotes.
3. Click → cookie → sale attributed (report sale / postback).
4. Promoter sees **sales & earnings** and can **request payout** (crypto).
5. Business dashboard shows **sales, payouts owed**, and **adverts data** (paid / sponsored / featured / promoted + expiry).

### Dashboards

- **Promoter:** Affiliates → Promoting + Earnings  
- **Business:** Seller programs + Sales & payouts + Adverts & expiry  
- Doc: `docs/AFFILIATE_MONEY_AND_ADVERTS.md`

### Admin

- Filament: **Affiliate payouts** → Approve & send crypto  
- Frontend admin links include affiliate payouts + crypto payments

---

## 7. Repost old adverts (multi-format)

Businesses and users can **repost** an old advert into one or many formats to increase reach:

Free · Paid · Sponsored · Featured · Promoted · Banner · Affiliate  

From **Adverts & expiry → Repost formats**. Same content can be posted in several formats if they want wider reach.

---

## 8. Seller earnings (product sales)

After buyers purchase products (books, buy-sell, images, templates, services, etc.):

| UI | Purpose |
|----|---------|
| Dashboard → **Sales & Purchases → Seller earnings** | See earned / available / paid out; request crypto payout |
| Filament → **Seller payouts** | Admin approve & send |
| API | `GET /api/v1/seller/earnings` · `POST /api/v1/seller/payouts` |

Buyers see a short note on checkout (e.g. books): payment goes to WWA; seller gets their share after the platform fee.

---

## 9. What works end-to-end (checklist)

| Area | Status |
|------|--------|
| Advert prices (Free 3d / Paid–Sponsored matrix) | Done — Filament editable |
| Crypto + PayPal on listing / boost checkout | Done (site-wide, not affiliates-only) |
| Crypto + PayPal on product buys (books, buy-sell, etc.) | Done |
| Paid posts redirected to checkout after create | Done for main verticals (services, vehicles, events, books, images, travel, funding, affiliates, jobs, banners, featured, promoted, sponsored, buy-sell, property) |
| Category money ledger (our / seller / other) | Done |
| Affiliate who-pays / who-is-paid + dashboards | Done |
| Affiliate cookie packages 30/60/90 | Done |
| Repost multi-format | Done |
| Seller 15/85 split on product sales | Done (ledger + seller balance) |
| Seller crypto payout request + Filament approve | Done |
| Live PayPal production keys | Pending Clive access / Hostinger `.env` |
| Local migrate (this machine) | Run on server when MySQL is up |

---

## 10. Deploy commands (server)

```bash
cd /path/to/WWA-backend-New_main
php artisan migrate --force
php artisan money:backfill-category-flows
php artisan config:clear
php artisan optimize:clear
```

Set in `.env` when ready:

- `PLATFORM_FEE_PERCENT=15` (seller sale commission)
- `PAYPAL_*` live or sandbox
- `NOWPAYMENTS_*` + crypto currencies
- IPN: `https://api.worldwideadverts.info/api/v1/crypto/webhook`

---

## 11. Message you can send Clive (copy/paste)

```
Hi Clive — update on payments, affiliates & money flow:

1) ADVERT FEES (Free / Paid $10 / Promoted $20 / Featured $30 / Sponsored $40 / Affiliate cookies 30–90d)
   → Money goes 100% to Worldwide Adverts. Prices editable in admin.

2) PRODUCT SALES (e.g. someone buys a book from a seller)
   → Buyer pays WWA (PayPal or crypto). Split ~15% WWA / ~85% seller.
   → Seller withdraws from Dashboard → Seller earnings (crypto). Admin approves payouts.

3) CRYPTO is site-wide now — ads, buy/sell, posting, checkout — not affiliates only.
   Affiliates still use crypto for promoter payouts.

4) AFFILIATES
   → Business pays the commission % they offered per sale via hop link.
   → Promoter dashboard: sales + earnings + payout request.
   → Business dashboard: sales, payouts, advert types + expiry.
   → Repost old ads in free/paid/sponsored/featured/promoted/banner/affiliate.

5) SUPER ADMIN
   → Per-category money: Our money / Seller payouts / Other (Filament Category Money).

6) PAYPAL
   → Sandbox/testing for now (PK can’t open personal PayPal). Live keys when you share access.

Everything is staged so listing fees ≠ product sales money. Happy to walk through on desk when ready for live PayPal.
```

---

## 12. Related docs

| Doc | Topic |
|-----|--------|
| `docs/CATEGORY_MONEY_FLOW.md` | Platform vs seller buckets |
| `docs/AFFILIATE_MONEY_AND_ADVERTS.md` | Affiliate roles + repost |
| This file | Full implementation handover |

---

*End of handover — August 2026*
