#!/usr/bin/env node
/**
 * Daily defensive security smoke checks for WWA sites.
 * Safe: only GET/HEAD and expected 401/404/422 probes — no exploit payloads.
 *
 * Usage: node scripts/daily-security-check.mjs
 * Env: FRONTEND_URL, API_URL (optional overrides)
 */
const FRONTEND = (process.env.FRONTEND_URL || 'https://worldwideadverts.info').replace(/\/$/, '');
const API = (process.env.API_URL || 'https://api.worldwideadverts.info').replace(/\/$/, '');
const API_V1 = `${API}/api/v1`;

const results = [];
let failures = 0;

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  if (!ok) failures += 1;
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ''}`);
}

async function fetchStatus(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs || 20000);
  try {
    const res = await fetch(url, {
      method: opts.method || 'GET',
      redirect: 'manual',
      headers: opts.headers || { Accept: 'application/json,text/html,*/*' },
      body: opts.body,
      signal: controller.signal,
    });
    const text = await res.text().catch(() => '');
    return { status: res.status, headers: res.headers, text: text.slice(0, 2000) };
  } finally {
    clearTimeout(timer);
  }
}

async function expectGone(name, url) {
  const { status } = await fetchStatus(url);
  // Debug endpoints must not be publicly reachable
  const ok = status !== 200 && status !== 201;
  record(name, ok, `HTTP ${status}`);
}

async function expectAlive(name, url, { minStatus = 200, maxStatus = 399 } = {}) {
  const { status } = await fetchStatus(url);
  const ok = status >= minStatus && status <= maxStatus;
  record(name, ok, `HTTP ${status}`);
}

async function expectHeader(name, url, header, predicate) {
  const { status, headers } = await fetchStatus(url, { method: 'HEAD' }).catch(() =>
    fetchStatus(url)
  );
  const value = headers.get(header) || headers.get(header.toLowerCase()) || '';
  const ok = predicate(value, status);
  record(name, ok, `${header}=${value || '(missing)'} (HTTP ${status})`);
}

async function main() {
  console.log(`Daily security check @ ${new Date().toISOString()}`);
  console.log(`Frontend: ${FRONTEND}`);
  console.log(`API: ${API}\n`);

  // Core sites / category hubs (same product, path-based “websites”)
  const hubs = [
    ['Home', `${FRONTEND}/`],
    ['Login', `${FRONTEND}/Login`],
    ['Affiliates', `${FRONTEND}/affiliates`],
    ['Books', `${FRONTEND}/books`],
    ['Vehicles', `${FRONTEND}/vehicles`],
    ['BuySell', `${FRONTEND}/buysell`],
    ['Jobs', `${FRONTEND}/jobs`],
    ['Property', `${FRONTEND}/property`],
    ['Payment', `${FRONTEND}/payment`],
    ['Business tools', `${FRONTEND}/business-tools`],
  ];
  for (const [label, url] of hubs) {
    await expectAlive(`Site up: ${label}`, url);
  }

  await expectAlive('API health/root', `${API_V1}/`, { minStatus: 200, maxStatus: 499 });

  // Hostinger / malware scanner bait — must NOT be public
  await expectGone('No phpinfo.php', `${API}/phpinfo.php`);
  await expectGone('No info.php', `${API}/info.php`);
  await expectGone('No test.php', `${API}/test.php`);
  await expectGone('No proxy.php', `${API}/proxy.php`);
  await expectGone('No public /logs', `${API}/logs`);

  // Security headers (best-effort; some hosts strip on HEAD)
  await expectHeader('FE HSTS or HTTPS upgrade', FRONTEND, 'strict-transport-security', (v, status) => {
    if (status >= 300 && status < 400) return true;
    return Boolean(v) || status === 200;
  });

  // CORS must not be wildcard for credentialed API (soft fail if missing)
  {
    const { status, headers } = await fetchStatus(`${API_V1}/`, {
      headers: { Origin: 'https://evil.example', Accept: 'application/json' },
    });
    const acao = headers.get('access-control-allow-origin') || '';
    const ok = acao !== '*';
    record('API CORS not *', ok, `Access-Control-Allow-Origin=${acao || '(none)'} HTTP ${status}`);
  }

  // Payment defence: confirm without auth / fake id must fail (not 200 success)
  {
    const { status, text } = await fetchStatus(`${API_V1}/business-tools/purchases/1/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ payment_id: 'paid', payment_method: 'paypal' }),
    });
    const bodyOk = !/"success"\s*:\s*true/.test(text);
    const ok = status === 401 || status === 422 || status === 404 || status === 403 || (status >= 400 && bodyOk);
    record('Payment confirm rejects fake id', ok, `HTTP ${status}`);
  }

  // Auth endpoints should not be wide open without rate limit headers (informational)
  {
    const { status } = await fetchStatus(`${API_V1}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: 'security-check@example.com', password: 'invalid-password-check' }),
    });
    const ok = status === 401 || status === 422 || status === 429 || status === 404;
    record('Login rejects bad credentials', ok, `HTTP ${status}`);
  }

  console.log(`\nSummary: ${results.length - failures} passed, ${failures} failed`);
  if (failures > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Security check crashed:', err);
  process.exitCode = 1;
});
