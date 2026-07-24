const fs = require('fs');
const path = require('path');

const shell = (title, sub, body) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title} | Worldwide Adverts Template</title>
<style>
  :root { --ink:#0f172a; --muted:#475569; --line:#e2e8f0; --brand:#0f766e; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: var(--ink); margin: 0; background: #f8fafc; line-height: 1.5; }
  .sheet { max-width: 820px; margin: 24px auto; background: #fff; border: 1px solid var(--line); padding: 40px 48px; box-shadow: 0 8px 30px rgba(15,23,42,.06); }
  .brand { font-family: system-ui, sans-serif; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--brand); font-weight: 700; margin-bottom: 8px; }
  h1 { font-size: 28px; margin: 0 0 8px; }
  .sub { font-family: system-ui, sans-serif; color: var(--muted); font-size: 14px; margin-bottom: 28px; }
  h2 { font-size: 16px; margin: 28px 0 10px; border-bottom: 2px solid var(--brand); padding-bottom: 6px; font-family: system-ui, sans-serif; }
  p, li { font-size: 15px; color: #1e293b; }
  .field { border: 1px dashed #cbd5e1; border-radius: 8px; padding: 12px 14px; margin: 10px 0; background: #f8fafc; font-family: system-ui, sans-serif; font-size: 13px; color: var(--muted); }
  .hint { font-family: system-ui, sans-serif; font-size: 12px; color: #64748b; }
  ul { padding-left: 1.2rem; }
  .footer { margin-top: 36px; padding-top: 14px; border-top: 1px solid var(--line); font-family: system-ui, sans-serif; font-size: 11px; color: #94a3b8; }
  @media print { body { background:#fff; } .sheet { box-shadow:none; border:none; margin:0; max-width:none; } }
</style>
</head>
<body>
<div class="sheet">
  <div class="brand">Worldwide Adverts · Business Template</div>
  <h1>${title}</h1>
  <p class="sub">${sub}</p>
  ${body}
  <div class="footer">Template provided by Worldwide Adverts. Customise the highlighted fields. Print or Save as PDF from your browser.</div>
</div>
</body>
</html>
`;

const f = (label) => `<div class="field">${label}</div>`;

const templates = [
  {
    file: 'investor-pitch-deck.html',
    title: 'Investor Pitch Deck',
    sub: '10–15 slide outline for fundraising. Fill each section, then copy into PowerPoint or Google Slides.',
    body: `
<h2>1. Title &amp; Vision</h2>${f('[Company name] · [One-line vision] · [Founder / date]')}
<h2>2. Problem</h2>${f('[Who has the pain?] [How costly is it today?]')}
<ul><li>Customer segment</li><li>Current alternatives</li><li>Why now</li></ul>
<h2>3. Solution</h2>${f('[Your product/service in 2–3 sentences]')}
<h2>4. Market Opportunity</h2>${f('TAM / SAM / SOM · Growth rate · Geography')}
<h2>5. Product</h2>${f('[Key features] · Demo / workflow')}
<h2>6. Business Model</h2>${f('Pricing · Revenue streams · CAC / LTV')}
<h2>7. Traction</h2>${f('Users · Revenue · Partnerships · Growth')}
<h2>8. Go-to-Market</h2>${f('Channels · Sales motion · Launch plan')}
<h2>9. Competition</h2>${f('Landscape · Unfair advantage')}
<h2>10. Team</h2>${f('Founders · Advisors · Why this team wins')}
<h2>11. Financials</h2>${f('3-year revenue · Burn · Path to profitability')}
<h2>12. The Ask</h2>${f('Amount · Use of funds · Milestones')}
<p class="hint">Keep one idea per slide. Speak the story; use the deck as backup.</p>`,
  },
  {
    file: 'grant-application-pack.html',
    title: 'Grant Application Pack',
    sub: 'Structure for government, foundation or innovation grants.',
    body: `
<h2>Organisation summary</h2>${f('Legal name · Registration · Address · Contact · Mission')}
<h2>Need / problem statement</h2>${f('Who is affected · Evidence · Urgency')}
<h2>Project goals &amp; objectives</h2>${f('SMART objectives · Outcomes at 6 / 12 / 24 months')}
<h2>Activities &amp; methods</h2>${f('Deliverables · Timeline · Partners')}
<h2>Beneficiaries &amp; impact</h2>${f('Numbers reached · Geography · Equity')}
<h2>Evaluation plan</h2>${f('KPIs · Data collection · Reporting')}
<h2>Budget summary</h2>${f('Personnel · Equipment · Programme · Overhead · Total ask')}
<ul><li>Item · Amount · Justification</li><li>Item · Amount · Justification</li></ul>
<h2>Match funding / sustainability</h2>${f('Other income · Continuity after the grant')}
<h2>Risks &amp; mitigation</h2>${f('Key risks · Contingency plans')}
<p class="hint">Attach accounts, support letters and CVs as the funder requires.</p>`,
  },
  {
    file: 'startup-business-plan.html',
    title: 'Startup Business Plan',
    sub: 'Concise plan for banks, accelerators, partners or internal alignment.',
    body: `
<h2>Executive summary</h2>${f('What you do · For whom · Why it wins · Funding need')}
<h2>Problem &amp; solution</h2>${f('Problem · Solution · Proof')}
<h2>Market analysis</h2>${f('Customers · Size · Trends · Competitors')}
<h2>Products &amp; services</h2>${f('Offers · Pricing · Roadmap')}
<h2>Go-to-market</h2>${f('Channels · Sales · Partnerships')}
<h2>Operations</h2>${f('Team · Tools · Suppliers · Locations')}
<h2>Financial plan</h2>${f('Startup costs · Burn · Forecast · Break-even')}
<h2>Funding request</h2>${f('Amount · Use of funds · Milestones')}
<p class="hint">Keep written plan short (5–10 pages). Pair with a pitch deck.</p>`,
  },
  {
    file: 'client-proposal-sow.html',
    title: 'Client Proposal &amp; Statement of Work',
    sub: 'Agency / freelancer pack for scoping paid work.',
    body: `
<h2>Client &amp; project</h2>${f('Client · Contact · Project title · Date')}
<h2>Background &amp; objectives</h2>${f('What success looks like')}
<h2>Scope of work</h2>
<ul><li>Deliverable 1 — description — due date</li><li>Deliverable 2 — description — due date</li><li>Deliverable 3 — description — due date</li></ul>
<h2>Out of scope</h2>${f('Exclusions to avoid scope creep')}
<h2>Timeline &amp; milestones</h2>${f('Kick-off · Draft · Review · Final · Launch')}
<h2>Investment</h2>${f('Fees · Payment schedule · Expenses · Taxes')}
<h2>Assumptions &amp; client responsibilities</h2>${f('Access · Feedback turnaround · Assets')}
<h2>Acceptance &amp; revisions</h2>${f('Revision rounds · Change-request process')}
<h2>Signatures</h2>${f('Provider signature / date · Client signature / date')}`,
  },
  {
    file: 'agency-pitch-deck.html',
    title: 'Agency Capability Pitch Deck',
    sub: 'Win clients with a clear capabilities presentation.',
    body: `
<h2>About us</h2>${f('Who we are · Years · Locations · Specialty')}
<h2>What we do</h2>${f('Services · Industries')}
<h2>How we work</h2>${f('Discovery → Strategy → Delivery → Measure')}
<h2>Case studies</h2>${f('Client · Challenge · Solution · Result')}${f('Client · Challenge · Solution · Result')}
<h2>Team</h2>${f('Key people · Roles · Experience')}
<h2>Engagement models</h2>${f('Project · Retainer · Hybrid — starting prices')}
<h2>Next steps</h2>${f('Discovery call · Proposal · Kick-off')}`,
  },
  {
    file: 'restaurant-business-plan.html',
    title: 'Restaurant Business Plan',
    sub: 'Concept, covers, food cost and funding ask for food businesses.',
    body: `
<h2>Concept</h2>${f('Cuisine · Price point · Atmosphere · USP')}
<h2>Location &amp; capacity</h2>${f('Address · Covers · Hours · Lease')}
<h2>Menu &amp; food cost</h2>${f('Signature dishes · Food cost % · Suppliers')}
<h2>Operations</h2>${f('Staffing · Kitchen flow · POS')}
<h2>Marketing</h2>${f('Launch · Local partners · Online')}
<h2>Financials</h2>${f('Startup costs · Opex · Break-even · 12-month P&amp;L')}
<h2>Funding ask</h2>${f('Amount · Fit-out · Equipment · Working capital')}`,
  },
  {
    file: 'saas-pitch-deck.html',
    title: 'App / SaaS Pitch Deck',
    sub: 'Product fundraising deck for software and digital products.',
    body: `
<h2>Problem</h2>${f('Who · Pain · Frequency · Cost of status quo')}
<h2>Product</h2>${f('What it does · Workflow · Moat')}
<h2>Market</h2>${f('TAM/SAM/SOM · ICP · Competition')}
<h2>Business model</h2>${f('Pricing · MRR drivers · Expansion revenue')}
<h2>Traction</h2>${f('Users · MRR · Retention · Logos')}
<h2>Go-to-market</h2>${f('Channels · Sales motion')}
<h2>Roadmap</h2>${f('Next 3 / 6 / 12 months')}
<h2>Team &amp; ask</h2>${f('Team · Raise · Use of funds')}`,
  },
  {
    file: 'sale-prospectus.html',
    title: 'Business Sale Prospectus',
    sub: 'Teaser pack for listing a business for sale.',
    body: `
<h2>Business overview</h2>${f('Trading name · Sector · Years · Location / online')}
<h2>Reason for sale</h2>${f('Retirement · Relocation · New venture · Other')}
<h2>Operations snapshot</h2>${f('Products · Customers · Staff · Systems')}
<h2>Financial highlights</h2>${f('Turnover · Gross · Net · Last 3 years')}
<h2>Assets included</h2>${f('Stock · Equipment · IP · Domains · Contracts')}
<h2>Asking price &amp; terms</h2>${f('Price · Stock · Deposit · Handover')}
<h2>Next steps</h2>${f('NDA · Full accounts · Viewing / demo')}
<p class="hint">Share sensitive figures only after NDA.</p>`,
  },
  {
    file: 'book-proposal.html',
    title: 'Book Proposal Pack',
    sub: 'For authors pitching publishers or self-publishing partners.',
    body: `
<h2>Working title &amp; genre</h2>${f('Title · Subtitle · Genre · Word count')}
<h2>One-paragraph pitch</h2>${f('Hook in 4–6 lines')}
<h2>Target reader</h2>${f('Who buys this · Comparable titles')}
<h2>Outline</h2>${f('Chapter-by-chapter or section map')}
<h2>Author bio &amp; platform</h2>${f('Credentials · Audience · Social / email · Media')}
<h2>Marketing ideas</h2>${f('Launch · Partnerships · Events')}
<h2>Sample</h2>${f('Attach sample chapters / TOC')}`,
  },
  {
    file: 'marketing-campaign-proposal.html',
    title: 'Marketing Campaign Proposal',
    sub: 'Pitch a paid campaign with goals, channels, budget and KPIs.',
    body: `
<h2>Campaign overview</h2>${f('Client · Objective · Dates · Offer')}
<h2>Audience</h2>${f('Primary ICP · Geos · Insights')}
<h2>Strategy &amp; channels</h2>${f('Paid social · Search · Email · Content · Influencers')}
<h2>Creative direction</h2>${f('Messages · Formats · Brand rules')}
<h2>Budget</h2>${f('Media · Production · Fees · Contingency · Total')}
<h2>KPIs &amp; reporting</h2>${f('Leads · CPA · ROAS · Report cadence')}
<h2>Timeline</h2>${f('Brief · Creative · Launch · Optimise · Wrap')}`,
  },
  {
    file: 'website-project-proposal.html',
    title: 'Website Project Proposal',
    sub: 'Scope a web build for freelancers and agencies.',
    body: `
<h2>Project summary</h2>${f('Client · Site type · Goals · Deadline')}
<h2>Discovery</h2>${f('Audience · Brand · Content inventory')}
<h2>Deliverables</h2>
<ul><li>Sitemap &amp; wireframes</li><li>Design (desktop + mobile)</li><li>Build &amp; CMS</li><li>QA &amp; launch</li></ul>
<h2>Tech stack</h2>${f('Platform · Hosting · Integrations')}
<h2>Timeline</h2>${f('Phases and dates')}
<h2>Investment</h2>${f('Fixed fee or phases · Deposit · Balance')}
<h2>Maintenance (optional)</h2>${f('Retainer · Updates · Support hours')}`,
  },
  {
    file: 'it-audit-roadmap.html',
    title: 'IT Audit &amp; Roadmap Pack',
    sub: 'Consultancy template for assessments and transformation plans.',
    body: `
<h2>Engagement overview</h2>${f('Client · Scope · Dates · Lead consultant')}
<h2>Current state</h2>${f('Stack · Processes · Risks observed')}
<h2>Findings</h2>
<ul><li>Finding · Severity · Recommendation</li><li>Finding · Severity · Recommendation</li></ul>
<h2>Priority roadmap</h2>${f('30 / 60 / 90 day actions · Owners')}
<h2>Investment estimate</h2>${f('Quick wins · Medium projects · Strategic bets')}
<h2>Next workshop</h2>${f('Agenda · Decisions needed')}`,
  },
];

const dirs = [
  path.join('d:', 'live', 'WWA-Frontend-New-main', 'public', 'templates'),
  path.join('d:', 'live', 'WWA-backend-New_main', 'public', 'templates'),
];

for (const dir of dirs) {
  fs.mkdirSync(dir, { recursive: true });
  for (const t of templates) {
    fs.writeFileSync(path.join(dir, t.file), shell(t.title, t.sub, t.body), 'utf8');
  }
}

console.log(`Wrote ${templates.length} templates to:`);
dirs.forEach((d) => console.log(' -', d));
