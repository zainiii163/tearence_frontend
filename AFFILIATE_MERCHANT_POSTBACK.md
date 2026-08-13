# Merchant checklist — affiliate postback

Use this when a sale closes on **your** checkout so World Wide Adverts can credit the affiliate.

---

## 1. Get your credentials

1. Log in → **Dashboard → Affiliates → Sell**
2. Open your offer → expand **Record conversions & postback**
3. Copy:
   - **Postback URL**
   - **Offer postback token**

Keep the token secret. Rotate it if it leaks.

---

## 2. Capture the affiliate on landing

Hop links redirect buyers to your site with:

```text
?aff=TRACKING_CODE
```

**Do this on your site:**

1. Read `aff` from the query string when the visitor lands  
2. Store it (cookie / session / localStorage) for the cookie window (same days as your offer)  
3. At checkout, send that value as `tracking_code` in the postback  

Example (browser):

```js
const params = new URLSearchParams(window.location.search);
const aff = params.get('aff');
if (aff) {
  document.cookie = `wwa_aff=${encodeURIComponent(aff)}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax`;
}
```

---

## 3. Fire the postback on purchase

**Endpoint**

```text
POST https://api.worldwideadverts.info/api/v1/affiliates/conversions/postback
```

**Headers**

| Header | Value |
|--------|--------|
| `Content-Type` | `application/json` |
| `X-WWA-Postback-Token` | your offer token from the dashboard |

Alternate header name: `X-Affiliate-Postback-Token`  
Or put the same value in the JSON body as `postback_token`.

**JSON body**

| Field | Required | Notes |
|-------|----------|--------|
| `tracking_code` | Yes* | From `?aff=` (or WWA cookie if same domain) |
| `amount` | Recommended | Sale total; used for `%` commission |
| `order_id` | Strongly recommended | Your unique order id — blocks duplicates |
| `offer_id` | Optional | Your WWA offer id (extra safety check) |

\*Required for external checkouts. Prefer always sending it.

---

## 4. Sample curl

Replace `YOUR_TOKEN`, `AFFILIATE_TRACKING_CODE`, and `ORDER-123`:

```bash
curl -X POST "https://api.worldwideadverts.info/api/v1/affiliates/conversions/postback" \
  -H "Content-Type: application/json" \
  -H "X-WWA-Postback-Token: YOUR_TOKEN" \
  -d "{
    \"tracking_code\": \"AFFILIATE_TRACKING_CODE\",
    \"amount\": 49.99,
    \"order_id\": \"ORDER-123\",
    \"offer_id\": 12
  }"
```

**Success (201/200):** JSON with `commission`, `tracking_code`, conversion row.  
**Common errors**

| Code | Meaning |
|------|---------|
| `401` | Bad / missing token |
| `404` | Unknown tracking code |
| `422` | No hop click yet, cookie expired, or duplicate `order_id` |

---

## 5. Rules that must be true

1. Visitor clicked the affiliate **hop link** first (WWA logs the hop).  
2. Purchase is still inside your offer’s **cookie days**.  
3. You send the same **`tracking_code`** that came from `?aff=`.  
4. Use a unique **`order_id`** per sale.

---

## 6. No webhook yet? Use the dashboard

**Sell → Report sale** → pick promoter tracking code → amount → optional order ID.

Same ledger; no coding required.

---

## 7. Quick test

1. Join your own offer as a test affiliate (or use a promoter’s hop).  
2. Open the hop link once (creates the click).  
3. Fire the curl with that tracking code + a unique `order_id`.  
4. Check **Sell → Conversions** and the affiliate’s **Earnings** tab.

---

## Support

Marketplace: https://worldwideadverts.info/affiliates  
API base: https://api.worldwideadverts.info/api/v1  
