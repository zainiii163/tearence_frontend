# WWA security hardening report (Clive — cybersecurity tools)

Date: 2026-08-11  
Scope: `worldwideadverts.info` + `api.worldwideadverts.info`  
Source: [Clive Facebook reel](https://www.facebook.com/share/r/1ERBFEejes/) (“20 free cybersecurity tools”) used as a **defensive** checklist.

## Tool mapping (what we used)

| Tool style | Action taken |
|------------|--------------|
| Code review / OWASP mindset | Fixed critical auth, CORS, XSS, redirects in FE+BE |
| npm audit | Ran; 75 findings mostly CRA/webpack-dev-server transitive; `npm audit fix` applied where non-breaking |
| composer audit | Not available on this Windows agent (`composer` not installed); run on Hostinger: `composer audit` |
| Headers / TLS | Live FE already has basic headers; HSTS+CSP shipped in `.htaccess` (apply after FE deploy) |
| Nmap-style ports | Probed owned host: **443 open**; **22, 3306, 8080 also open** on `worldwideadverts.info` — MySQL (3306) must not be public |
| OWASP ZAP / Burp / Metasploit / SQLmap / Hydra | Not run as active exploit against production (policy). Re-test with ZAP baseline **after deploy** |

## Code fixes shipped

### Backend
- Removed public `/logs` log viewer route
- Disabled Filament public registration
- CORS no longer falls back to `*`
- Login/register/password routes throttled (`5/min`)
- Stronger register passwords (letters + numbers, min 8)
- Vehicle/image/banner uploads and banner mutate require JWT
- `books/scrape` requires JWT + admin
- Admin API groups + image verify/reject require `admin` middleware
- Affiliate hop: httpOnly + secure cookie; http(s)-only redirect targets
- TrustProxies = `*` for reverse proxy HTTPS
- Debug auth endpoints disabled in production

### Frontend
- DOMPurify on HTML detail sinks
- Safe internal-path allowlist for login/payment redirects
- HSTS + starter CSP + Permissions-Policy in `.htaccess`
- Firebase / Google Maps keys moved to `REACT_APP_*` env

## Live findings (pre-deploy)

- `GET https://api.worldwideadverts.info/logs` still **200** until BE deploy
- API still sends `Access-Control-Allow-Origin: *` until BE deploy
- FE missing HSTS/full CSP until FE deploy (currently only `upgrade-insecure-requests` CSP)
- **Host firewall:** close public **3306** (MySQL) and review **8080**; keep 443 (and 22 only if needed with key auth)

## Production checklist (Hostinger)

1. Pull/deploy BE + FE
2. `APP_DEBUG=false`, `APP_ENV=production`, `SESSION_SECURE_COOKIE=true`
3. Confirm `/logs` returns 404
4. Confirm CORS only reflects `worldwideadverts.info` origins
5. Firewall: deny inbound 3306 from internet
6. Optional: OWASP ZAP baseline crawl of homepage, login, affiliates, payment

## Validation results (2026-08-11)

| Check | Result |
|-------|--------|
| npm audit (all) | ~75 issues (mostly CRA/webpack-dev-server transitive) |
| npm audit `--omit=dev` | 28 production issues (firebase/undici, websocket-driver) — upgrade Firebase later; avoid `audit fix --force` (breaks CRA) |
| composer audit | Not runnable on this Windows agent (`composer` missing). Run on Hostinger: `composer audit` |
| Live FE headers | Basic headers present; full HSTS/CSP **after FE deploy** of `.htaccess` |
| Live API CORS | Still `*` until BE deploy |
| Live `/logs` | Still **200** until BE deploy |
| Ports (`worldwideadverts.info` / API host) | 443 open; **3306 (MySQL) publicly open — close in Hostinger firewall** |

### ZAP / Burp baseline
Deferred until after deploy so scans reflect fixed CORS, `/logs` removal, and CSP. Recommended post-deploy: OWASP ZAP baseline against homepage, `/Login`, `/affiliates`, `/payment`.

## Daily automated tests (2026-08-13)

See [DAILY_SECURITY_TESTS.md](./DAILY_SECURITY_TESTS.md).

- GitHub Actions: daily FE + BE security workflows
- Live smoke found **`test.php` and `proxy.php` still 200 on API host** — delete on Hostinger File Manager after pull (removed from git)
- `phpinfo.php` and `/logs` already 404 on live
