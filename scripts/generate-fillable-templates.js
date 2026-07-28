/**
 * Clive: generate paid-quality FILLABLE templates (LawDepot / HubSpot style).
 * Run: node scripts/generate-fillable-templates.js
 *
 * Gold standard for Vikas & Shihab = Startup Business Plan pack.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public', 'templates');

const SHARED_CSS = `
  :root {
    --ink:#0f172a; --muted:#64748b; --line:#e2e8f0; --brand:#0f766e;
    --fill:#eff6ff; --fill-border:#93c5fd; --paper:#fff;
  }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Georgia, 'Times New Roman', serif; color:var(--ink); background:#f1f5f9; line-height:1.55; }
  .toolbar {
    position:sticky; top:0; z-index:20; display:flex; flex-wrap:wrap; gap:8px; align-items:center;
    justify-content:space-between; padding:10px 16px; background:#0f172a; color:#fff;
    font-family: system-ui, sans-serif; font-size:13px;
  }
  .toolbar button, .toolbar a {
    appearance:none; border:0; border-radius:6px; padding:7px 12px; font-weight:700; cursor:pointer;
    font-size:12px; text-decoration:none; color:#0f172a; background:#fff;
  }
  .toolbar .ghost { background:transparent; color:#fff; border:1px solid #475569; }
  .sheet { max-width:860px; margin:20px auto 48px; background:var(--paper); border:1px solid var(--line);
    padding:36px 44px; box-shadow:0 10px 30px rgba(15,23,42,.06); }
  .brand { font-family:system-ui,sans-serif; font-size:10px; letter-spacing:.14em; text-transform:uppercase;
    color:var(--brand); font-weight:700; margin-bottom:8px; }
  h1 { font-size:26px; margin:0 0 6px; }
  h2 { font-family:system-ui,sans-serif; font-size:15px; margin:26px 0 10px; color:var(--brand);
    border-bottom:2px solid var(--brand); padding-bottom:6px; }
  h3 { font-family:system-ui,sans-serif; font-size:13px; margin:16px 0 6px; color:#334155; }
  .sub { font-family:system-ui,sans-serif; font-size:13px; color:var(--muted); margin-bottom:18px; }
  p, li { font-size:14px; color:#1e293b; }
  .guide { background:#f0fdfa; border:1px solid #99f6e4; border-radius:8px; padding:12px 14px;
    font-family:system-ui,sans-serif; font-size:12.5px; color:#115e59; margin:12px 0 18px; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
  @media (max-width:700px){ .grid2,.grid3{ grid-template-columns:1fr; } .sheet{ padding:22px 18px; margin:12px; } }
  label.fill-label { display:block; font-family:system-ui,sans-serif; font-size:11px; font-weight:700;
    letter-spacing:.04em; text-transform:uppercase; color:#475569; margin:10px 0 4px; }
  input.fill, textarea.fill, select.fill {
    width:100%; border:1.5px solid var(--fill-border); background:var(--fill); border-radius:8px;
    padding:10px 12px; font-family:system-ui,sans-serif; font-size:14px; color:var(--ink);
  }
  textarea.fill { min-height:88px; resize:vertical; }
  input.fill:focus, textarea.fill:focus, select.fill:focus {
    outline:2px solid #38bdf8; outline-offset:1px; background:#fff;
  }
  .checkrow { display:flex; flex-wrap:wrap; gap:10px 16px; font-family:system-ui,sans-serif; font-size:13px; margin:8px 0; }
  .checkrow label { display:flex; align-items:center; gap:6px; cursor:pointer; }
  table.fill-table { width:100%; border-collapse:collapse; margin:10px 0; font-family:system-ui,sans-serif; font-size:13px; }
  table.fill-table th, table.fill-table td { border:1px solid var(--line); padding:8px; vertical-align:top; }
  table.fill-table th { background:#f8fafc; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.04em; }
  table.fill-table input.fill, table.fill-table textarea.fill { border:0; background:transparent; padding:4px; border-radius:0; }
  .footer { margin-top:28px; padding-top:12px; border-top:1px solid var(--line);
    font-family:system-ui,sans-serif; font-size:11px; color:#94a3b8; }
  .example { font-family:system-ui,sans-serif; font-size:11px; color:#64748b; font-style:italic; margin-top:4px; }
  @media print {
    body { background:#fff; }
    .toolbar { display:none !important; }
    .sheet { box-shadow:none; border:none; margin:0; max-width:none; padding:12px; }
    input.fill, textarea.fill, select.fill { border:none; border-bottom:1px solid #cbd5e1; background:transparent; border-radius:0; }
  }
`;

const SAVE_SCRIPT = `
<script>
(function(){
  var KEY = document.body.getAttribute('data-storage-key') || location.pathname;
  function save(){
    var data = {};
    document.querySelectorAll('[data-field]').forEach(function(el){
      if (el.type === 'checkbox') data[el.getAttribute('data-field')] = el.checked;
      else data[el.getAttribute('data-field')] = el.value;
    });
    try { localStorage.setItem('wwa-tpl:'+KEY, JSON.stringify(data)); } catch(e){}
  }
  function load(){
    try {
      var raw = localStorage.getItem('wwa-tpl:'+KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      document.querySelectorAll('[data-field]').forEach(function(el){
        var k = el.getAttribute('data-field');
        if (!(k in data)) return;
        if (el.type === 'checkbox') el.checked = !!data[k];
        else el.value = data[k];
      });
    } catch(e){}
  }
  document.addEventListener('DOMContentLoaded', function(){
    load();
    document.querySelectorAll('[data-field]').forEach(function(el){
      el.addEventListener('input', save);
      el.addEventListener('change', save);
    });
    var btn = document.getElementById('btn-clear');
    if (btn) btn.addEventListener('click', function(){
      if (!confirm('Clear all filled fields on this template?')) return;
      localStorage.removeItem('wwa-tpl:'+KEY);
      location.reload();
    });
  });
})();
</script>
`;

function toolbar(title) {
  return `<div class="toolbar">
  <div><strong>${title}</strong> · Fill the blue fields · Auto-saves in this browser</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button type="button" onclick="window.print()">Print / Save PDF</button>
    <button type="button" class="ghost" id="btn-clear">Clear fields</button>
  </div>
</div>`;
}

function field(id, label, opts = {}) {
  const ph = opts.placeholder || '';
  const ex = opts.example ? `<div class="example">Example: ${opts.example}</div>` : '';
  if (opts.type === 'textarea') {
    return `<label class="fill-label" for="${id}">${label}</label>
<textarea class="fill" id="${id}" data-field="${id}" rows="${opts.rows || 4}" placeholder="${ph}"></textarea>${ex}`;
  }
  if (opts.type === 'select') {
    const options = (opts.options || []).map((o) => `<option value="${o}">${o}</option>`).join('');
    return `<label class="fill-label" for="${id}">${label}</label>
<select class="fill" id="${id}" data-field="${id}"><option value="">Select…</option>${options}</select>${ex}`;
  }
  return `<label class="fill-label" for="${id}">${label}</label>
<input class="fill" id="${id}" data-field="${id}" type="${opts.type || 'text'}" placeholder="${ph}" />${ex}`;
}

function wrapDoc({ title, storageKey, body, pageNote = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title} | Worldwide Adverts Template</title>
<style>${SHARED_CSS}</style>
</head>
<body data-storage-key="${storageKey}">
${toolbar(title)}
<div class="sheet">
  <div class="brand">Worldwide Adverts · Fillable template</div>
  <h1>${title}</h1>
  ${pageNote ? `<p class="sub">${pageNote}</p>` : ''}
  <div class="guide">
    <strong>How to use:</strong> Type your details in the blue fields (or copy into Word).
    Your answers auto-save in this browser. When finished, click <em>Print / Save PDF</em>.
    This is a real document people pay for — every section should be completed.
  </div>
  ${body}
  <div class="footer">© Worldwide Adverts — fillable business template. Customise for your company. Not legal advice.</div>
</div>
${SAVE_SCRIPT}
</body>
</html>`;
}

function wrapPage({ packTitle, pageTitle, pageOf, storageKey, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${pageTitle} · ${packTitle}</title>
<style>${SHARED_CSS}
  .toolbar { display:none; }
  body { background:#fff; }
  .sheet { box-shadow:none; border:none; margin:0; max-width:720px; padding:28px 32px; }
</style>
</head>
<body data-storage-key="${storageKey}">
<div class="sheet">
  <div class="brand">Worldwide Adverts · Template page</div>
  <h1>${pageTitle}</h1>
  <p class="sub">${packTitle} — page ${pageOf}</p>
  <div class="guide">Fill every blue field. Leave blank only if not applicable — then write “N/A”.</div>
  ${body}
</div>
${SAVE_SCRIPT}
</body>
</html>`;
}

function write(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('wrote', rel, `(${content.length} bytes)`);
}

// ——— BUSINESS PLAN (gold standard) ———
const bpPages = [
  {
    file: '01-cover-and-business-details.html',
    title: 'Cover & business details',
    body: `
<p>Start with who you are. Banks, partners and investors open here first.</p>
<div class="grid2">
  ${field('bp_business_name', 'Legal / trading name', { placeholder: 'e.g. VoltRide Electric Bikes Ltd', example: 'Electric bike showroom brand name' })}
  ${field('bp_trading_as', 'Trading as (if different)', { placeholder: 'Brand customers see' })}
</div>
<div class="grid2">
  ${field('bp_owner', 'Owner / founder name', { placeholder: 'Full legal name' })}
  ${field('bp_role', 'Your role', { placeholder: 'e.g. Managing Director' })}
</div>
<div class="grid2">
  ${field('bp_email', 'Business email', { type: 'email', placeholder: 'hello@company.com' })}
  ${field('bp_phone', 'Phone', { placeholder: '+44 …' })}
</div>
${field('bp_address', 'Registered / trading address', { type: 'textarea', rows: 3, placeholder: 'Street, city, postcode, country' })}
<div class="grid3">
  ${field('bp_structure', 'Legal structure', { type: 'select', options: ['Sole trader', 'Partnership', 'Limited company (Ltd)', 'LLC', 'Other'] })}
  ${field('bp_start_date', 'Planned start date', { type: 'date' })}
  ${field('bp_industry', 'Industry', { placeholder: 'e.g. Electric vehicle retail' })}
</div>
${field('bp_one_liner', 'One-sentence business description', { type: 'textarea', rows: 2, placeholder: 'We sell and service urban e-bikes from a high-street showroom…', example: 'Premium electric bike showroom with workshop + accessories.' })}
`,
  },
  {
    file: '02-executive-summary.html',
    title: 'Executive summary',
    body: `
<p>Write this last, show it first. Keep to half a page when printed.</p>
${field('bp_exec_opportunity', 'The opportunity', { type: 'textarea', rows: 4, placeholder: 'What market gap do you fill? Why now?', example: 'City commuting is shifting to e-bikes; local buyers lack a trusted showroom + service centre.' })}
${field('bp_exec_offer', 'What you sell', { type: 'textarea', rows: 3, placeholder: 'Products / services in plain English' })}
${field('bp_exec_customer', 'Who buys', { type: 'textarea', rows: 3, placeholder: 'Primary customer segment + secondary' })}
${field('bp_exec_advantage', 'Why you win', { type: 'textarea', rows: 3, placeholder: 'Differentiation vs competitors' })}
${field('bp_exec_ask', 'Funding / goal ask (if any)', { type: 'textarea', rows: 3, placeholder: 'Amount, use of funds, 12-month outcome' })}
`,
  },
  {
    file: '03-company-description.html',
    title: 'Company description',
    body: `
${field('bp_mission', 'Mission', { type: 'textarea', rows: 3, placeholder: 'Why the company exists' })}
${field('bp_vision', 'Vision (3–5 years)', { type: 'textarea', rows: 3, placeholder: 'Where you want to be' })}
${field('bp_history', 'Background / story so far', { type: 'textarea', rows: 4, placeholder: 'Founders’ experience, research, soft launch…' })}
${field('bp_location_why', 'Why this location', { type: 'textarea', rows: 3, placeholder: 'Footfall, parking, catchment, rent rationale' })}
<h3>Goals for year 1</h3>
${field('bp_goal_1', 'Goal 1 (measurable)', { placeholder: 'e.g. 420 e-bike units sold' })}
${field('bp_goal_2', 'Goal 2 (measurable)', { placeholder: 'e.g. £X service revenue' })}
${field('bp_goal_3', 'Goal 3 (measurable)', { placeholder: 'e.g. Net promoter score / repeat rate' })}
`,
  },
  {
    file: '04-market-analysis.html',
    title: 'Market analysis',
    body: `
${field('bp_market_size', 'Market size & trends', { type: 'textarea', rows: 4, placeholder: 'TAM / SAM / SOM or local demand signals', example: 'UK e-bike sales growth; local council cycle schemes; fuel costs driving adoption.' })}
${field('bp_customer_persona', 'Ideal customer profile', { type: 'textarea', rows: 4, placeholder: 'Age, income, commute, pain points, buying triggers' })}
${field('bp_competitors', 'Competitors (name + weakness)', { type: 'textarea', rows: 5, placeholder: 'Competitor A — online only, slow service…' })}
${field('bp_positioning', 'Your positioning', { type: 'textarea', rows: 3, placeholder: 'Premium / value / specialist niche' })}
${field('bp_swot', 'SWOT (Strengths, Weaknesses, Opportunities, Threats)', { type: 'textarea', rows: 6, placeholder: 'S: …\\nW: …\\nO: …\\nT: …' })}
`,
  },
  {
    file: '05-products-and-services.html',
    title: 'Products & services',
    body: `
${field('bp_product_lines', 'Product / service lines', { type: 'textarea', rows: 5, placeholder: '1) Commuter e-bikes  2) Cargo  3) Servicing  4) Accessories…' })}
${field('bp_pricing', 'Pricing approach', { type: 'textarea', rows: 3, placeholder: 'Entry / mid / premium bands; margins; packages' })}
${field('bp_suppliers', 'Key suppliers / brands', { type: 'textarea', rows: 3, placeholder: 'Brand partners, lead times, exclusivity' })}
${field('bp_roadmap', '12-month product roadmap', { type: 'textarea', rows: 4, placeholder: 'New lines, rental, corporate fleet, workshop expansion…' })}
<table class="fill-table">
  <thead><tr><th>Offer</th><th>Price (from)</th><th>Gross margin %</th><th>Notes</th></tr></thead>
  <tbody>
    ${[1, 2, 3, 4].map((n) => `<tr>
      <td><input class="fill" data-field="bp_offer_${n}_name" placeholder="Offer ${n}"/></td>
      <td><input class="fill" data-field="bp_offer_${n}_price" placeholder="£"/></td>
      <td><input class="fill" data-field="bp_offer_${n}_margin" placeholder="%"/></td>
      <td><input class="fill" data-field="bp_offer_${n}_notes" placeholder=""/></td>
    </tr>`).join('')}
  </tbody>
</table>
`,
  },
  {
    file: '06-marketing-and-sales.html',
    title: 'Marketing & sales strategy',
    body: `
${field('bp_channels', 'Acquisition channels', { type: 'textarea', rows: 4, placeholder: 'Google Ads, Meta, local SEO, showroom events, partners…' })}
${field('bp_sales_process', 'Sales process', { type: 'textarea', rows: 4, placeholder: 'Walk-in → test ride → quote → finance → delivery / assembly' })}
${field('bp_budget_mkt', 'Monthly marketing budget', { placeholder: '£ / $ amount + mix' })}
${field('bp_kpis', 'KPIs you will track', { type: 'textarea', rows: 3, placeholder: 'Leads, conversion %, CAC, AOV, service attachments' })}
<div class="checkrow">
  <label><input type="checkbox" data-field="bp_ch_seo"/> Local SEO</label>
  <label><input type="checkbox" data-field="bp_ch_ads"/> Paid ads</label>
  <label><input type="checkbox" data-field="bp_ch_social"/> Social content</label>
  <label><input type="checkbox" data-field="bp_ch_email"/> Email / CRM</label>
  <label><input type="checkbox" data-field="bp_ch_pr"/> PR / local press</label>
  <label><input type="checkbox" data-field="bp_ch_partners"/> B2B partners</label>
</div>
`,
  },
  {
    file: '07-operations-and-team.html',
    title: 'Operations & team',
    body: `
${field('bp_ops_hours', 'Opening hours & capacity', { type: 'textarea', rows: 2, placeholder: 'Days/hours; appointments vs walk-in' })}
${field('bp_ops_process', 'Day-to-day operations', { type: 'textarea', rows: 4, placeholder: 'Stock, assembly, workshop workflow, deliveries' })}
${field('bp_tools', 'Systems & tools', { type: 'textarea', rows: 3, placeholder: 'POS, inventory, booking, accounting software' })}
${field('bp_team', 'Team & roles (now + year 1)', { type: 'textarea', rows: 5, placeholder: 'Founder, sales advisor, technician… salaries/contractors' })}
${field('bp_risks', 'Key risks & mitigation', { type: 'textarea', rows: 4, placeholder: 'Supply delays, theft, seasonality — and your plan' })}
`,
  },
  {
    file: '08-financial-plan.html',
    title: 'Financial plan',
    body: `
<p>Replace placeholders with your numbers. Lenders expect startup costs, monthly burn, and a simple forecast.</p>
<table class="fill-table">
  <thead><tr><th>Startup cost item</th><th>Amount</th><th>Notes</th></tr></thead>
  <tbody>
    ${['Fit-out / deposit', 'Opening stock', 'Tools & equipment', 'Licences & insurance', 'Marketing launch', 'Working capital buffer'].map((label, i) => `<tr>
      <td>${label}</td>
      <td><input class="fill" data-field="bp_cost_${i}" placeholder="0"/></td>
      <td><input class="fill" data-field="bp_cost_${i}_note" placeholder=""/></td>
    </tr>`).join('')}
  </tbody>
</table>
<div class="grid2">
  ${field('bp_rev_m1', 'Expected monthly revenue (month 6)', { placeholder: 'Currency amount' })}
  ${field('bp_breakeven', 'Break-even month', { placeholder: 'e.g. Month 9' })}
</div>
${field('bp_assumptions', 'Key assumptions', { type: 'textarea', rows: 4, placeholder: 'Average order value, units/month, service attach rate, rent…' })}
${field('bp_year_summary', 'Year-1 summary (revenue, COGS, opex, profit/loss)', { type: 'textarea', rows: 4, placeholder: 'Short narrative + totals' })}
`,
  },
  {
    file: '09-funding-request.html',
    title: 'Funding request',
    body: `
${field('bp_fund_amount', 'Amount requested', { placeholder: 'e.g. £75,000' })}
${field('bp_fund_type', 'Type of funding', { type: 'select', options: ['Bank loan', 'Grant', 'Equity investment', 'Friends & family', 'Crowdfunding', 'Mixed', 'None — self-funded'] })}
${field('bp_use_of_funds', 'Use of funds (line items)', { type: 'textarea', rows: 5, placeholder: '40% stock · 25% fit-out · 20% working capital · 15% marketing' })}
${field('bp_milestones', 'Milestones tied to funding', { type: 'textarea', rows: 4, placeholder: 'Open date, units sold, second technician hire…' })}
${field('bp_repay', 'Repayment / return for funder', { type: 'textarea', rows: 3, placeholder: 'Loan term, equity %, revenue share…' })}
`,
  },
  {
    file: '10-appendix-checklist.html',
    title: 'Appendix & checklist',
    body: `
<p>Attach supporting documents when you share this plan. Tick what you have ready.</p>
<div class="checkrow">
  <label><input type="checkbox" data-field="bp_ap_cvs"/> Founder CVs</label>
  <label><input type="checkbox" data-field="bp_ap_quotes"/> Supplier quotes</label>
  <label><input type="checkbox" data-field="bp_ap_lease"/> Lease / premises docs</label>
  <label><input type="checkbox" data-field="bp_ap_forecast"/> Spreadsheet forecast</label>
  <label><input type="checkbox" data-field="bp_ap_photos"/> Premises / product photos</label>
  <label><input type="checkbox" data-field="bp_ap_market"/> Market research notes</label>
  <label><input type="checkbox" data-field="bp_ap_insurance"/> Insurance quotes</label>
  <label><input type="checkbox" data-field="bp_ap_permits"/> Permits / licences</label>
</div>
${field('bp_appendix_notes', 'Appendix notes / links', { type: 'textarea', rows: 4, placeholder: 'File names or URLs for attachments' })}
${field('bp_declaration', 'Declaration', { type: 'textarea', rows: 2, placeholder: 'I confirm the information is accurate to the best of my knowledge. Name + date.' })}
`,
  },
];

// Build combined business plan
const bpCombinedBody = bpPages
  .map(
    (p, i) => `
<section id="page-${i + 1}">
  <h2>${i + 1}. ${p.title}</h2>
  ${p.body}
</section>`
  )
  .join('\n');

write(
  'startup-business-plan.html',
  wrapDoc({
    title: 'Startup Business Plan',
    storageKey: 'startup-business-plan',
    pageNote:
      'HubSpot / LawDepot-style fillable plan — detailed sections with real fields. Example industry in placeholders: electric bike showroom.',
    body: bpCombinedBody,
  })
);

bpPages.forEach((p, i) => {
  write(
    path.join('packs', 'startup-business-plan', 'pages', p.file),
    wrapPage({
      packTitle: 'Startup Business Plan',
      pageTitle: p.title,
      pageOf: `${i + 1} of ${bpPages.length}`,
      storageKey: `startup-business-plan-${p.file}`,
      body: p.body,
    })
  );
});

// ——— INVOICE ———
write(
  'professional-invoice.html',
  wrapDoc({
    title: 'Professional Invoice',
    storageKey: 'professional-invoice',
    pageNote: 'Fill seller & buyer details, line items, tax and payment terms — then print or save PDF.',
    body: `
<div class="grid2">
  ${field('inv_from_name', 'From (your business)', { placeholder: 'Company name' })}
  ${field('inv_to_name', 'Bill to (customer)', { placeholder: 'Customer / company' })}
</div>
<div class="grid2">
  ${field('inv_from_address', 'Your address', { type: 'textarea', rows: 3 })}
  ${field('inv_to_address', 'Customer address', { type: 'textarea', rows: 3 })}
</div>
<div class="grid3">
  ${field('inv_number', 'Invoice number', { placeholder: 'INV-1001' })}
  ${field('inv_date', 'Invoice date', { type: 'date' })}
  ${field('inv_due', 'Due date', { type: 'date' })}
</div>
<table class="fill-table">
  <thead><tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead>
  <tbody>
    ${[1, 2, 3, 4, 5].map((n) => `<tr>
      <td><input class="fill" data-field="inv_line_${n}_desc" placeholder="Item or service"/></td>
      <td><input class="fill" data-field="inv_line_${n}_qty" placeholder="1"/></td>
      <td><input class="fill" data-field="inv_line_${n}_unit" placeholder="0.00"/></td>
      <td><input class="fill" data-field="inv_line_${n}_amt" placeholder="0.00"/></td>
    </tr>`).join('')}
  </tbody>
</table>
<div class="grid3">
  ${field('inv_subtotal', 'Subtotal', { placeholder: '0.00' })}
  ${field('inv_tax', 'Tax / VAT', { placeholder: '0.00' })}
  ${field('inv_total', 'Total due', { placeholder: '0.00' })}
</div>
${field('inv_payment', 'Payment instructions', { type: 'textarea', rows: 3, placeholder: 'Bank name, account, sort code / IBAN, PayPal…' })}
${field('inv_notes', 'Notes / terms', { type: 'textarea', rows: 3, placeholder: 'Payment due in 14 days. Late fees…' })}
`,
  })
);

write(
  path.join('packs', 'professional-invoice', 'pages', '01-invoice.html'),
  wrapPage({
    packTitle: 'Professional Invoice',
    pageTitle: 'Invoice details',
    pageOf: '1 of 1',
    storageKey: 'professional-invoice-page',
    body: `<p>Use the full downloadable invoice template for line items, tax and payment fields.</p>
${field('inv_preview_from', 'From', { placeholder: 'Your business' })}
${field('inv_preview_to', 'Bill to', { placeholder: 'Customer' })}
${field('inv_preview_total', 'Total due', { placeholder: 'Currency amount' })}`,
  })
);

// ——— CALENDAR & PLANNER ———
write(
  'monthly-calendar-planner.html',
  wrapDoc({
    title: 'Monthly Calendar & Planner',
    storageKey: 'monthly-calendar-planner',
    pageNote: 'Set the month, goals, and day notes — print for desk or PDF archive.',
    body: `
<div class="grid2">
  ${field('cal_month', 'Month', { type: 'select', options: ['January','February','March','April','May','June','July','August','September','October','November','December'] })}
  ${field('cal_year', 'Year', { placeholder: '2026' })}
</div>
${field('cal_theme', 'Focus theme for the month', { placeholder: 'e.g. Launch showroom · Content sprint · Sales push' })}
${field('cal_goals', 'Top 3 monthly goals', { type: 'textarea', rows: 3, placeholder: '1)… 2)… 3)…' })}
<table class="fill-table">
  <thead><tr><th>Week</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat/Sun</th></tr></thead>
  <tbody>
    ${[1, 2, 3, 4, 5].map((w) => `<tr>
      <td><strong>W${w}</strong></td>
      ${['mon','tue','wed','thu','fri','weekend'].map((d) => `<td><textarea class="fill" data-field="cal_w${w}_${d}" rows="2" placeholder="…"></textarea></td>`).join('')}
    </tr>`).join('')}
  </tbody>
</table>
${field('cal_review', 'End-of-month review', { type: 'textarea', rows: 3, placeholder: 'What worked · What to change' })}
`,
  })
);

write(
  'weekly-planner.html',
  wrapDoc({
    title: 'Weekly Planner',
    storageKey: 'weekly-planner',
    pageNote: 'Priorities, schedule blocks and habit tracker for one week.',
    body: `
<div class="grid2">
  ${field('wk_start', 'Week commencing', { type: 'date' })}
  ${field('wk_role', 'Role / project focus', { placeholder: 'e.g. Sales week · Content · Ops' })}
</div>
${field('wk_big3', 'Big 3 outcomes this week', { type: 'textarea', rows: 3 })}
${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day, i) => `
<h3>${day}</h3>
${field(`wk_day_${i}`, `${day} schedule & tasks`, { type: 'textarea', rows: 3, placeholder: 'AM · PM · Must-do' })}
`).join('')}
${field('wk_habits', 'Habits to track', { type: 'textarea', rows: 2, placeholder: 'Exercise · Outreach · Learning…' })}
${field('wk_notes', 'Notes / parking lot', { type: 'textarea', rows: 3 })}
`,
  })
);

// ——— DESIGN: flyer, banner, wedding, birthday ———
function designDoc(title, key, intro, fieldsHtml) {
  write(
    path.join('design', `${key}.html`),
    wrapDoc({
      title,
      storageKey: key,
      pageNote: intro,
      body: fieldsHtml + `
<div class="guide" style="margin-top:20px">
  <strong>Design tip:</strong> Fill the copy fields first, then export PDF and place text into Canva / Illustrator,
  or print this sheet as a briefing document for your designer.
</div>`,
    })
  );
}

designDoc(
  'Marketing Flyer',
  'marketing-flyer',
  'Fillable flyer brief + printable layout fields for events, sales and promotions.',
  `
${field('fly_headline', 'Headline (max ~8 words)', { placeholder: 'E-BIKE OPENING WEEKEND' })}
${field('fly_sub', 'Sub-headline', { placeholder: 'Test rides · 0% finance · Free lock with every bike' })}
${field('fly_body', 'Body copy', { type: 'textarea', rows: 4, placeholder: 'Who it’s for, offer, urgency' })}
${field('fly_offer', 'Offer / CTA', { placeholder: 'Book your test ride today' })}
<div class="grid2">
  ${field('fly_when', 'Date / time', { placeholder: 'Sat 12 Apr, 10am–4pm' })}
  ${field('fly_where', 'Location', { placeholder: 'Address or “Online”' })}
</div>
${field('fly_contact', 'Contact / URL / QR text', { placeholder: 'www… · phone · @handle' })}
<div class="checkrow">
  <label><input type="checkbox" data-field="fly_size_a5"/> A5</label>
  <label><input type="checkbox" data-field="fly_size_a4"/> A4</label>
  <label><input type="checkbox" data-field="fly_size_dl"/> DL</label>
  <label><input type="checkbox" data-field="fly_print_color"/> Colour print</label>
</div>
`
);

designDoc(
  'Event / Promo Banner',
  'event-banner',
  'Banner copy sheet for web headers, shop windows and social covers.',
  `
${field('ban_headline', 'Banner headline', { placeholder: 'SUMMER E-BIKE SALE' })}
${field('ban_sub', 'Supporting line', { placeholder: 'Up to 20% off selected models' })}
${field('ban_cta', 'Button / CTA text', { placeholder: 'Shop now' })}
${field('ban_url', 'Link / landing page', { placeholder: 'https://…' })}
<div class="grid2">
  ${field('ban_size', 'Size / placement', { type: 'select', options: ['Web hero 1920×600', 'Shop window', 'Facebook cover', 'LinkedIn banner', 'Email header', 'Other'] })}
  ${field('ban_dates', 'Live dates', { placeholder: 'From–to' })}
</div>
${field('ban_legal', 'Legal / T&Cs line', { type: 'textarea', rows: 2, placeholder: 'While stocks last…' })}
`
);

designDoc(
  'Wedding Invitation',
  'wedding-invitation',
  'Fill couple details, ceremony, reception and RSVP — then print or hand to a designer.',
  `
<div class="grid2">
  ${field('wed_name1', 'Partner 1 full name', { placeholder: '' })}
  ${field('wed_name2', 'Partner 2 full name', { placeholder: '' })}
</div>
${field('wed_hosts', 'Hosted by', { placeholder: 'Together with their families…' })}
<div class="grid2">
  ${field('wed_date', 'Ceremony date', { type: 'date' })}
  ${field('wed_time', 'Ceremony time', { placeholder: '2:30 pm' })}
</div>
${field('wed_venue', 'Ceremony venue & address', { type: 'textarea', rows: 3 })}
${field('wed_reception', 'Reception details', { type: 'textarea', rows: 3, placeholder: 'Venue, time, dress code' })}
${field('wed_rsvp', 'RSVP by + method', { placeholder: 'Reply by 1 June · email / website' })}
${field('wed_extras', 'Gift list / notes / hashtag', { type: 'textarea', rows: 3 })}
`
);

designDoc(
  'Birthday Invitation Card',
  'birthday-invitation',
  'Kids or adult birthday invite — fill party details and print.',
  `
${field('bd_who', 'Birthday person’s name & age', { placeholder: 'Maya is turning 8!' })}
${field('bd_headline', 'Invite headline', { placeholder: 'You’re invited to a birthday party' })}
<div class="grid2">
  ${field('bd_date', 'Date', { type: 'date' })}
  ${field('bd_time', 'Time', { placeholder: '3:00–5:30 pm' })}
</div>
${field('bd_place', 'Place / address', { type: 'textarea', rows: 3 })}
${field('bd_theme', 'Theme / activities', { placeholder: 'Superheroes · Games · Cake' })}
${field('bd_rsvp', 'RSVP contact', { placeholder: 'Name · phone · email · by date' })}
${field('bd_notes', 'Notes for parents / guests', { type: 'textarea', rows: 3, placeholder: 'Allergies, drop-off, gifts…' })}
`
);

// Also copy design templates to top-level short paths for resolveTemplateFile
['marketing-flyer', 'event-banner', 'wedding-invitation', 'birthday-invitation'].forEach((k) => {
  const src = path.join(ROOT, 'design', `${k}.html`);
  const dest = path.join(ROOT, `${k}.html`);
  fs.copyFileSync(src, dest);
  console.log('copied', k);
});

// Update PAGE_TEMPLATE for Vikas/Shihab
write(
  path.join('packs', '_PAGE_TEMPLATE.html'),
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!--
    VIKAS / SHIHAB — FILLABLE PAGE STANDARD (Clive)
    ------------------------------------------------
    A template is a DOCUMENT people fill in — not a list of titles.
    Every page must include:
      1) Short guidance paragraph (what this page is for)
      2) Real fill fields: <input class="fill" data-field="unique_id"> or <textarea>
      3) Optional example under the field
      4) Checkboxes / tables when choices or numbers are needed

    Reference gold standard:
      public/templates/startup-business-plan.html
      public/templates/packs/startup-business-plan/pages/

    Also study: HubSpot sample plans + LawDepot business plan structure.
  -->
  <title>PAGE_TITLE · TEMPLATE_NAME</title>
  <style>${SHARED_CSS}
    .toolbar { display:none; }
    body { background:#fff; }
    .sheet { box-shadow:none; border:none; margin:0; max-width:720px; padding:28px 32px; }
  </style>
</head>
<body data-storage-key="pack-page-draft">
  <div class="sheet">
    <div class="brand">Worldwide Adverts · Template page</div>
    <h1>PAGE_TITLE</h1>
    <p class="sub">TEMPLATE_NAME — page N of N</p>
    <div class="guide">Explain in 1–2 sentences what the customer should complete on this page.</div>
    <label class="fill-label" for="example_field">Field label</label>
    <input class="fill" id="example_field" data-field="example_field" type="text" placeholder="Helpful placeholder…" />
    <div class="example">Example: concrete sample answer</div>
    <label class="fill-label" for="example_notes">Details</label>
    <textarea class="fill" id="example_notes" data-field="example_notes" rows="4" placeholder="Write several sentences…"></textarea>
  </div>
</body>
</html>`
);

write(
  path.join('packs', 'VIKAS_SHIHAB_GUIDE.md'),
  `# Template quality standard (Clive → Vikas / Shihab)

Clive: *“Each page should be detailed with options to fill details. A template is a document you can fill in or copy and add your details.”*

We need templates people are **happy to pay for** — not title lists.

## Gold standard (study this first)

Open and complete:

- \`/templates/startup-business-plan.html\` (full fillable plan)
- Pack pages in \`packs/startup-business-plan/pages/\`

Benchmarks Clive shared:

- HubSpot sample business plans
- LawDepot business plan structure
- Electric Bike Showroom Business Plan PDF (detail level)

## Every page must have

1. Purpose paragraph  
2. Multiple **fillable** fields (\`input\` / \`textarea\` / checkboxes / tables)  
3. Placeholders + at least one **Example:** line where useful  
4. Enough substance that printing the page feels like a real form  

## Do NOT ship

- Empty dashed boxes with only “fill this in”
- Page titles with no fields
- One-sentence pages

## Other packs Clive asked for

Invoice · Calendar · Weekly planner · Flyer · Banner · Wedding invitation · Birthday card  

Already generated under \`public/templates/\` and \`public/templates/design/\`.
`
);

console.log('\\nDone. Gold standard = startup-business-plan.html');
