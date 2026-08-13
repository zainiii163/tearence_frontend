# Crypto payments — site-wide (Worldwide Adverts)

**Scope:** Every checkout that uses `PaymentProcessor` / `AuthenticCheckoutModal` (ads, listings, books, services, stores, donations, funding, templates, software, etc.) — **not affiliates only**.  
**Affiliate payouts** remain a separate *outflow* use of the same rail (optional Phase 2).  
**Last updated:** August 2026  

---

## 1. What we built

Crypto is a **first-class payment method** next to PayPal on the shared checkout UI.

| Layer | What |
|-------|------|
| FE | `PaymentProcessor` → radio **PayPal** \| **Crypto** |
| BE | `POST /api/v1/crypto/invoices`, status, mock confirm, IPN webhook |
| Verify | `PaymentVerificationService` accepts `CRYPTO-MOCK-*` and `NP-*` ids |
| Products | Confirm endpoints accept `payment_method: crypto` |

**Default provider:** [NOWPayments](https://nowpayments.io/) (USDT/USDC/BTC/ETH).  
**Without API keys:** `CRYPTO_MOCK=auto` → mock invoices (same idea as PayPal sandbox mock).

---

## 2. User flow (all site products)

1. User opens checkout (banner, book, service order, listing upgrade, …).  
2. Chooses **Crypto** and a coin/network (e.g. USDT TRC20).  
3. App creates an invoice → shows address / amount (or hosted invoice URL).  
4. User pays on-chain (or taps **Confirm mock payment** in mock mode).  
5. FE calls product `confirm-payment` with `payment_id` + `payment_method: crypto`.  
6. Backend verifies via completed cache / NOWPayments → unlocks purchase.

---

## 3. Architecture

```text
Any product page
    → AuthenticCheckoutModal / PaymentProcessor
        → PayPal  OR  Crypto
            → POST /crypto/invoices
            → (live) NOWPayments + IPN webhook
            → (mock) confirm-mock
        → onSuccess({ paymentId, paymentMethod: 'crypto' })
    → product confirm-payment (existing)
        → PaymentVerificationService
```

One choke point: **do not** add crypto UI per product — they already share `PaymentProcessor`.

---

## 4. API

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/crypto/config` | public | enabled, mock, pay_currencies |
| POST | `/api/v1/crypto/invoices` | JWT | Create invoice |
| GET | `/api/v1/crypto/invoices/{id}` | JWT | Status poll |
| POST | `/api/v1/crypto/invoices/{id}/confirm-mock` | JWT | Mock complete |
| POST | `/api/v1/crypto/webhook` | IPN sig | NOWPayments callback |

Ledger ids:

- Mock: `CRYPTO-MOCK-…`  
- Live: `NP-{nowpayments_payment_id}`

---

## 5. Env (backend)

```env
CRYPTO_PAYMENTS_ENABLED=true
CRYPTO_PROVIDER=nowpayments
CRYPTO_FIAT_CURRENCY=USD
CRYPTO_SETTLE_CURRENCY=usdttrc20
CRYPTO_PAY_CURRENCIES=usdttrc20,usdterc20,usdcmatic,btc,eth
CRYPTO_MOCK=auto
NOWPAYMENTS_API_KEY=
NOWPAYMENTS_IPN_SECRET=
NOWPAYMENTS_SANDBOX=false
```

Set `NOWPAYMENTS_API_KEY` (+ IPN secret) for live. Leave empty for mock QA.

IPN URL to configure at NOWPayments:

`https://api.worldwideadverts.info/api/v1/crypto/webhook`

---

## 6. Key files

**Backend**

- `config/crypto.php`
- `app/Services/NowPaymentsClient.php`
- `app/Http/Controllers/Api/CryptoPaymentController.php`
- `app/Services/PaymentVerificationService.php` (crypto branch)
- `routes/api.php` (`/crypto/*`)

**Frontend**

- `src/Component/Payment/PaymentProcessor.jsx`
- `src/utils/cryptoConfig.js`
- `src/utils/paymentDefence.js`

---

## 7. Products covered (via shared checkout)

Ads / banners / sponsored · listings & upsells · books · buy-sell · services · store orders · business templates/tools · software · video templates · donations · funding pledges · affiliate listing fees · `/payment` universal page  

Anything still hardcoding a fake “paid” button (e.g. old sponsored sandbox page) should be migrated to `PaymentProcessor` later.

---

## 8. Affiliate note (payouts ≠ checkout)

| Direction | Mechanism |
|-----------|-----------|
| **User pays WWA** (checkout) | Crypto method above — **live now** |
| **WWA pays affiliate** | Still Filament / payout request; mass-payout API can reuse NOWPayments later |

Do not confuse merchant **postback** (sale attribution) with **crypto checkout**.

---

## 9. Ops checklist

1. Create NOWPayments account → API key + IPN secret.  
2. Set env on API server; `php artisan config:clear`.  
3. Deploy frontend build so `PaymentProcessor` shows Crypto.  
4. Test mock path locally, then one live USDT payment.  
5. Confirm Filament / verified_payment_references shows `nowpayments` / `crypto_mock`.

---

## 10. Compliance (short)

- Prefer **stablecoins** (USDT/USDC).  
- Platform does **not** hold user wallet balances in Phase 1.  
- Wrong-network risk: show network labels clearly in UI.  
- Not legal advice — confirm licensing for your regions.

---

## 11. One-line summary

**Crypto is a site-wide checkout option beside PayPal; affiliates are one product among many that use the same `PaymentProcessor` rail.**
