/**
 * Generates Clive planner / budget / captions packs under public/templates/
 * Run: node scripts/generate-clive-planners.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const packsRoot = path.join(root, 'public', 'templates', 'packs');
const stubsRoot = path.join(root, 'public', 'templates');

const STYLE = fs.readFileSync(
  path.join(packsRoot, 'weekly-planner', 'style.css'),
  'utf8'
);

const SHARED_JS = `const AUTO_SAVE_DELAY = 700;
const el = (s, r = document) => r.querySelector(s);
const els = (s, r = document) => Array.from(r.querySelectorAll(s));
const STORAGE_KEY = document.body.dataset.storageKey || 'wwa_template_v1';

const showToast = (msg, time = 2800) => {
  const toast = el('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  requestAnimationFrame(() => { toast.style.opacity = '1'; });
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 280);
  }, time);
};

const debounce = (fn, wait) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
};

let isDirty = false;
const markDirty = () => { isDirty = true; };
const scheduleSave = debounce(() => saveNow(false), AUTO_SAVE_DELAY);

function wireInputs(root = document) {
  els('input, textarea, select', root).forEach((node) => {
    node.addEventListener('input', () => { markDirty(); scheduleSave(); });
    node.addEventListener('change', () => { markDirty(); scheduleSave(); });
  });
}

function collect() {
  const data = { fields: {}, checks: {}, rows: {} };
  els('#tpl-form input, #tpl-form textarea, #tpl-form select').forEach((node) => {
    if (!node.name) return;
    if (node.type === 'checkbox') data.checks[node.name] = node.checked;
    else data.fields[node.name] = node.value;
  });
  els('[data-row-table]').forEach((table) => {
    const key = table.dataset.rowTable;
    data.rows[key] = [];
    els('tbody tr', table).forEach((tr) => {
      const row = {};
      els('input, textarea, select', tr).forEach((n) => {
        if (!n.name) return;
        row[n.name] = n.type === 'checkbox' ? n.checked : n.value;
      });
      data.rows[key].push(row);
    });
  });
  return data;
}

function apply(data) {
  if (!data) return;
  Object.entries(data.fields || {}).forEach(([k, v]) => {
    const node = el(\`#tpl-form [name="\${k}"]\`);
    if (node && node.type !== 'checkbox') node.value = v ?? '';
  });
  Object.entries(data.checks || {}).forEach(([k, v]) => {
    const node = el(\`#tpl-form [name="\${k}"]\`);
    if (node && node.type === 'checkbox') node.checked = !!v;
  });
  Object.entries(data.rows || {}).forEach(([key, rows]) => {
    const table = el(\`[data-row-table="\${key}"]\`);
    if (!table || !Array.isArray(rows)) return;
    const tbody = table.querySelector('tbody');
    const addBtn = el(\`[data-add-row="\${key}"]\`);
    tbody.innerHTML = '';
    rows.forEach((row) => {
      if (typeof window.__addRow === 'function') window.__addRow(key, row);
      else if (addBtn) {
        addBtn.click();
        const tr = tbody.lastElementChild;
        if (!tr) return;
        Object.entries(row).forEach(([n, v]) => {
          const input = tr.querySelector(\`[name="\${n}"]\`);
          if (!input) return;
          if (input.type === 'checkbox') input.checked = !!v;
          else input.value = v ?? '';
        });
      }
    });
  });
}

function saveNow(announce = true) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collect()));
    isDirty = false;
    if (announce) showToast('Saved on this device');
  } catch (e) {
    showToast('Could not save');
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    apply(JSON.parse(raw));
    showToast('Restored saved draft', 1800);
  } catch (_) { /* ignore */ }
}

function resetAll() {
  if (!confirm('Clear all fields and saved draft?')) return;
  localStorage.removeItem(STORAGE_KEY);
  el('#tpl-form')?.reset();
  els('[data-row-table] tbody').forEach((tb) => { tb.innerHTML = ''; });
  if (typeof window.__seedRows === 'function') window.__seedRows();
  isDirty = false;
  showToast('Reset');
}

function validateForm() {
  const required = els('#tpl-form [required]');
  let ok = true;
  required.forEach((node) => {
    if (!String(node.value || '').trim()) {
      ok = false;
      node.style.outline = '2px solid #ef4444';
    } else node.style.outline = '';
  });
  showToast(ok ? 'Looks good — ready to print' : 'Fill highlighted required fields');
  return ok;
}

document.addEventListener('DOMContentLoaded', () => {
  wireInputs();
  if (typeof window.__seedRows === 'function') window.__seedRows();
  load();
  el('#btn-save')?.addEventListener('click', () => saveNow(true));
  el('#btn-validate')?.addEventListener('click', validateForm);
  el('#btn-reset')?.addEventListener('click', resetAll);
  el('#btn-print')?.addEventListener('click', () => window.print());
  window.addEventListener('beforeunload', (e) => {
    if (isDirty) { e.preventDefault(); e.returnValue = ''; }
  });
});
`;

function stub(slug, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="0;url=/templates/packs/${slug}/index.html" />
  <title>${title}</title>
  <link rel="canonical" href="/templates/packs/${slug}/index.html" />
</head>
<body style="font-family:system-ui;padding:2rem;text-align:center">
  <p>Opening ${title}…</p>
  <p><a href="/templates/packs/${slug}/index.html">Click here if you are not redirected</a></p>
</body>
</html>
`;
}

function shell({ title, subtitle, how, tips = [], example, body, storageKey, extraScript = '' }) {
  const tipsHtml = tips.length
    ? `<ul class="tips">${tips.map((t) => `<li>${t}</li>`).join('')}</ul>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title} | Worldwide Adverts</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body data-storage-key="${storageKey}">
  <header class="site-header">
    <div class="container header-grid">
      <div>
        <h1 class="brand">${title}</h1>
        <p class="subtitle">${subtitle}</p>
      </div>
      <div class="header-actions no-print">
        <button type="button" id="btn-save" class="btn primary">Save</button>
        <button type="button" id="btn-validate" class="btn">Validate</button>
        <button type="button" id="btn-reset" class="btn danger">Reset</button>
        <button type="button" id="btn-print" class="btn">Print / PDF</button>
      </div>
    </div>
  </header>
  <main class="container">
    <section class="card intro no-print">
      <div class="intro-grid">
        <div>
          <h2>How to fill this template</h2>
          <p class="muted">${how}</p>
          ${tipsHtml}
        </div>
        <aside class="example-box">
          <h3>Filled example</h3>
          <p class="small example">${example}</p>
        </aside>
      </div>
    </section>
    <form id="tpl-form" class="card form" autocomplete="off">
${body}
      <fieldset class="section">
        <legend>Ready checklist</legend>
        <div class="checklist"><ul>
          <li><label><input type="checkbox" name="chk_complete"> All required fields filled</label></li>
          <li><label><input type="checkbox" name="chk_reviewed"> Reviewed against the example</label></li>
          <li><label><input type="checkbox" name="chk_print"> Ready to print / PDF / share</label></li>
        </ul></div>
      </fieldset>
    </form>
  </main>
  <div id="toast" class="toast" style="display:none"></div>
  <script src="script.js"></script>
  ${extraScript ? `<script>${extraScript}</script>` : ''}
</body>
</html>
`;
}

const packs = [];

function add(slug, title, subtitle, how, example, body, extraScript = '', tips = []) {
  packs.push({
    slug,
    title,
    html: shell({
      title,
      subtitle,
      how,
      tips,
      example,
      body,
      storageKey: `wwa_${slug.replace(/-/g, '_')}_v1`,
      extraScript,
    }),
  });
}

const days7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

add(
  'meal-planner',
  'Meal Planner',
  'Weekly meals · shopping list · prep · autosave · print/PDF',
  'Plan breakfast, lunch, dinner and snacks for each day. Build a shopping list from your plan and note prep batches. Print and stick on the fridge.',
  'Mon dinner: Grilled chicken + rice + salad<br/>Shop: chicken, rice, greens, olive oil<br/>Prep Sunday: cook grains, chop veg',
  `
      <fieldset class="section">
        <legend>Week setup</legend>
        <div class="form-grid">
          <label>Week commencing * <input name="week_start" type="date" required /></label>
          <label>Household size * <input name="household" type="number" min="1" placeholder="e.g. 3" required /></label>
          <label>Weekly food budget <input name="food_budget" placeholder="e.g. $120" /></label>
          <label>Preferred cuisine <input name="cuisine" placeholder="e.g. Mixed · Mediterranean" /></label>
          <label class="full">Diet notes / allergies *
            <textarea name="diet_notes" rows="2" required placeholder="e.g. No shellfish · Prefer high protein"></textarea>
            <span class="field-hint">Example: Halal · lactose-free · 1800 kcal target</span>
          </label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Daily meals</legend>
        <div class="table-scroll">
          <table class="fill-table">
            <thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th><th>Snacks</th></tr></thead>
            <tbody>
              ${days7.map((d, i) => `<tr>
                <td><strong>${d}</strong></td>
                <td><textarea name="bf_${i}" rows="2" placeholder="e.g. Oats + berries"></textarea></td>
                <td><textarea name="ln_${i}" rows="2" placeholder="e.g. Chicken wrap"></textarea></td>
                <td><textarea name="dn_${i}" rows="2" placeholder="e.g. Salmon + veg"></textarea></td>
                <td><textarea name="sn_${i}" rows="2" placeholder="e.g. Yoghurt"></textarea></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Shopping & prep</legend>
        <div class="form-grid">
          <label class="full">Shopping list (by aisle) * <textarea name="shopping" rows="5" required placeholder="Produce…&#10;Protein…&#10;Dairy…&#10;Pantry…"></textarea></label>
          <label class="full">Batch prep plan <textarea name="prep" rows="3" placeholder="Sunday: chop veg, cook grains, portion snacks…"></textarea></label>
          <label class="full">Leftover / reuse notes <textarea name="leftovers" rows="2" placeholder="Tue lunch uses Mon roast leftovers"></textarea></label>
        </div>
      </fieldset>
  `,
  '',
  [
    '<strong>Plan protein first</strong> — then build sides around it.',
    '<strong>Repeat 2 dinners</strong> mid-week to cut cooking time.',
    '<strong>Shop from the list only</strong> — stick to budget.',
  ]
);

add(
  'fitness-planner',
  'Fitness Planner',
  'Goals · weekly workouts · recovery · autosave · print/PDF',
  'Set fitness goals, schedule workouts by day, track sets/reps or cardio, and plan recovery.',
  'Goal: 3× strength + 2× cardio<br/>Mon: Upper body 45m · Wed: Run 5k',
  `
      <fieldset class="section">
        <legend>Goals</legend>
        <div class="form-grid">
          <label>Start date * <input name="start" type="date" required /></label>
          <label>Primary goal * <input name="goal" required placeholder="e.g. Build strength / lose 4kg" /></label>
          <label>Days per week * <input name="days_week" type="number" min="1" max="7" required placeholder="4" /></label>
          <label>Level <select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
          <label class="full">Limitations / injuries <textarea name="limits" rows="2" placeholder="Knee — avoid deep squats"></textarea></label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Weekly schedule</legend>
        <div class="table-scroll">
          <table class="fill-table">
            <thead><tr><th>Day</th><th>Focus</th><th>Exercises / plan</th><th>Duration</th></tr></thead>
            <tbody>
              ${days7.map((d, i) => `<tr>
                <td><strong>${d}</strong></td>
                <td><input name="focus_${i}" placeholder="Strength / Cardio / Rest" /></td>
                <td><textarea name="plan_${i}" rows="2" placeholder="Exercises, sets, reps"></textarea></td>
                <td><input name="dur_${i}" placeholder="45 min" /></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Recovery</legend>
        <div class="form-grid">
          <label class="full">Sleep / recovery plan <textarea name="recovery" rows="2" placeholder="Sleep 7–8h · stretch after sessions"></textarea></label>
          <label class="full">Weekly check-in <textarea name="checkin" rows="2" placeholder="Energy, PRs, adjustments"></textarea></label>
        </div>
      </fieldset>
  `
);

add(
  'diet-planner',
  'Diet Planner',
  'Macros · meal targets · grocery · autosave · print/PDF',
  'Define calorie/macro targets, daily meal structure, and a grocery list aligned to your diet.',
  'Target: 2000 kcal · P 140g · C 180g · F 60g<br/>Rule: protein at every meal',
  `
      <fieldset class="section">
        <legend>Targets</legend>
        <div class="form-grid">
          <label>Diet style * <input name="style" required placeholder="e.g. Balanced / Keto / Mediterranean" /></label>
          <label>Daily calories * <input name="cals" required placeholder="2000" /></label>
          <label>Protein (g) <input name="protein" placeholder="140" /></label>
          <label>Carbs (g) <input name="carbs" placeholder="180" /></label>
          <label>Fat (g) <input name="fat" placeholder="60" /></label>
          <label>Water goal <input name="water" placeholder="3 litres" /></label>
          <label class="full">Foods to include * <textarea name="include" rows="2" required placeholder="Eggs, fish, oats, berries, yoghurt…"></textarea></label>
          <label class="full">Foods to limit <textarea name="limit" rows="2" placeholder="Sugary drinks, deep fried…"></textarea></label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Daily structure</legend>
        <div class="form-grid">
          <label>Breakfast template <textarea name="bf_t" rows="2"></textarea></label>
          <label>Lunch template <textarea name="ln_t" rows="2"></textarea></label>
          <label>Dinner template <textarea name="dn_t" rows="2"></textarea></label>
          <label>Snacks template <textarea name="sn_t" rows="2"></textarea></label>
          <label class="full">Grocery list * <textarea name="grocery" rows="4" required></textarea></label>
        </div>
      </fieldset>
  `
);

add(
  'event-planner',
  'Event Planner',
  'Brief · timeline · budget · vendors · autosave · print/PDF',
  'Capture event brief, guest count, venue, run-of-show timeline, budget and vendor contacts.',
  'Event: Product launch · 120 guests · Venue: City Hall foyer · Budget: $4,500',
  `
      <fieldset class="section">
        <legend>Event brief</legend>
        <div class="form-grid">
          <label>Event name * <input name="name" required placeholder="e.g. Client appreciation night" /></label>
          <label>Date * <input name="date" type="date" required /></label>
          <label>Start time <input name="start" type="time" /></label>
          <label>End time <input name="end" type="time" /></label>
          <label>Venue * <input name="venue" required /></label>
          <label>Guest count * <input name="guests" type="number" required /></label>
          <label class="full">Purpose / outcome * <textarea name="purpose" rows="2" required placeholder="What success looks like"></textarea></label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Run of show</legend>
        <div class="table-scroll">
          <table class="fill-table" data-row-table="timeline">
            <thead><tr><th>Time</th><th>Activity</th><th>Owner</th><th class="no-print"></th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
        <button type="button" class="btn secondary no-print" data-add-row="timeline" id="add-timeline">+ Add timeline row</button>
      </fieldset>
      <fieldset class="section">
        <legend>Budget & vendors</legend>
        <div class="form-grid">
          <label>Total budget * <input name="budget" required placeholder="$" /></label>
          <label>Spent so far <input name="spent" placeholder="$" /></label>
          <label class="full">Vendors / contacts <textarea name="vendors" rows="3" placeholder="Caterer — name — phone"></textarea></label>
          <label class="full">Risks / contingency <textarea name="risks" rows="2"></textarea></label>
        </div>
      </fieldset>
  `,
  `
window.__addRow = function(key, data = {}) {
  if (key !== 'timeline') return;
  const tr = document.createElement('tr');
  tr.innerHTML = \`<td><input name="time" value="\${data.time||''}" placeholder="18:00" /></td>
    <td><textarea name="activity" rows="1">\${data.activity||''}</textarea></td>
    <td><input name="owner" value="\${data.owner||''}" /></td>
    <td class="no-print"><button type="button" class="icon-btn">Remove</button></td>\`;
  tr.querySelector('button').onclick = () => tr.remove();
  document.querySelector('[data-row-table="timeline"] tbody').appendChild(tr);
  document.querySelectorAll('#tpl-form input, #tpl-form textarea').forEach((n)=>{
    n.addEventListener('input', ()=>document.getElementById('btn-save'));
  });
};
window.__seedRows = () => { for (let i=0;i<3;i++) window.__addRow('timeline'); };
document.getElementById('add-timeline')?.addEventListener('click', () => window.__addRow('timeline'));
`
);

add(
  'party-planner',
  'Party Planner',
  'Theme · guest list · menu · checklist · autosave · print/PDF',
  'Plan theme, guests, food/drink, décor, playlist and a day-of checklist.',
  'Theme: Garden BBQ · 25 guests · Menu: burgers, salads, mocktails',
  `
      <fieldset class="section">
        <legend>Party details</legend>
        <div class="form-grid">
          <label>Party name * <input name="name" required /></label>
          <label>Date * <input name="date" type="date" required /></label>
          <label>Theme * <input name="theme" required placeholder="e.g. Retro disco" /></label>
          <label>Location * <input name="location" required /></label>
          <label>Guest count <input name="guests" type="number" /></label>
          <label>Budget <input name="budget" placeholder="$" /></label>
          <label class="full">Guest list notes <textarea name="guest_list" rows="3" placeholder="Names / RSVP"></textarea></label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Food, drink & vibe</legend>
        <div class="form-grid">
          <label class="full">Menu * <textarea name="menu" rows="3" required></textarea></label>
          <label class="full">Drinks <textarea name="drinks" rows="2"></textarea></label>
          <label class="full">Décor / playlist <textarea name="decor" rows="2"></textarea></label>
          <label class="full">Day-of checklist <textarea name="checklist" rows="3" placeholder="Ice · speakers · cleanup bags"></textarea></label>
        </div>
      </fieldset>
  `
);

add(
  'wedding-planner',
  'Wedding Planner',
  'Couple details · vendors · timeline · budget · autosave · print/PDF',
  'Organise ceremony and reception details, vendors, guest estimate, budget and day-of timeline.',
  'Venue: Oak Hall · Guests: 80 · Budget: $12,000 · Photographer booked',
  `
      <fieldset class="section">
        <legend>Couple & date</legend>
        <div class="form-grid">
          <label>Partner 1 * <input name="p1" required /></label>
          <label>Partner 2 * <input name="p2" required /></label>
          <label>Wedding date * <input name="date" type="date" required /></label>
          <label>Guest estimate * <input name="guests" type="number" required /></label>
          <label>Ceremony venue * <input name="ceremony" required /></label>
          <label>Reception venue <input name="reception" /></label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Vendors</legend>
        <div class="form-grid">
          <label>Photographer <input name="photo" /></label>
          <label>Caterer <input name="caterer" /></label>
          <label>Florist <input name="florist" /></label>
          <label>Music / DJ <input name="music" /></label>
          <label class="full">Other vendors <textarea name="other_vendors" rows="2"></textarea></label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Budget & day-of</legend>
        <div class="form-grid">
          <label>Total budget * <input name="budget" required /></label>
          <label>Deposit paid <input name="deposit" /></label>
          <label class="full">Day-of timeline * <textarea name="timeline" rows="4" required placeholder="09:00 Hair · 13:00 Ceremony…"></textarea></label>
          <label class="full">Notes <textarea name="notes" rows="2"></textarea></label>
        </div>
      </fieldset>
  `
);

add(
  'travel-planner',
  'Travel Planner',
  'Itinerary · bookings · budget · packing · autosave · print/PDF',
  'Plan trip dates, daily itinerary, bookings, budget and packing list.',
  'Trip: Istanbul 5 nights · Flight + hotel booked · Daily budget $80',
  `
      <fieldset class="section">
        <legend>Trip overview</legend>
        <div class="form-grid">
          <label>Trip name * <input name="name" required placeholder="e.g. Family summer trip" /></label>
          <label>Destination * <input name="dest" required /></label>
          <label>Depart * <input name="depart" type="date" required /></label>
          <label>Return * <input name="ret" type="date" required /></label>
          <label>Travellers <input name="travellers" type="number" /></label>
          <label>Total budget <input name="budget" /></label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Bookings</legend>
        <div class="form-grid">
          <label class="full">Flights / transport <textarea name="flights" rows="2"></textarea></label>
          <label class="full">Hotels / stays <textarea name="hotels" rows="2"></textarea></label>
          <label class="full">Activities booked <textarea name="activities" rows="2"></textarea></label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Daily itinerary</legend>
        <div class="table-scroll">
          <table class="fill-table" data-row-table="days">
            <thead><tr><th>Day</th><th>Plan</th><th>Notes</th><th class="no-print"></th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
        <button type="button" class="btn secondary no-print" id="add-day">+ Add day</button>
        <div class="form-grid" style="margin-top:1rem">
          <label class="full">Packing list * <textarea name="packing" rows="3" required></textarea></label>
        </div>
      </fieldset>
  `,
  `
window.__addRow = function(key, data = {}) {
  if (key !== 'days') return;
  const tr = document.createElement('tr');
  tr.innerHTML = \`<td><input name="day" value="\${data.day||''}" placeholder="Day 1" /></td>
    <td><textarea name="plan" rows="2">\${data.plan||''}</textarea></td>
    <td><textarea name="notes" rows="2">\${data.notes||''}</textarea></td>
    <td class="no-print"><button type="button" class="icon-btn">Remove</button></td>\`;
  tr.querySelector('button').onclick = () => tr.remove();
  document.querySelector('[data-row-table="days"] tbody').appendChild(tr);
};
window.__seedRows = () => { for (let i=1;i<=3;i++) window.__addRow('days',{day:'Day '+i}); };
document.getElementById('add-day')?.addEventListener('click', () => window.__addRow('days'));
`
);

function budgetBody(periodLabel, periodInput) {
  return `
      <fieldset class="section">
        <legend>${periodLabel} setup</legend>
        <div class="form-grid">
          ${periodInput}
          <label>Currency <input name="currency" placeholder="USD / GBP / EUR" value="USD" /></label>
          <label>Income total * <input name="income" required placeholder="0.00" /></label>
          <label>Savings goal <input name="savings_goal" placeholder="0.00" /></label>
        </div>
      </fieldset>
      <fieldset class="section">
        <legend>Income lines</legend>
        <div class="table-scroll">
          <table class="fill-table" data-row-table="income">
            <thead><tr><th>Source</th><th>Amount</th><th class="no-print"></th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
        <button type="button" class="btn secondary no-print" data-add="income">+ Add income</button>
      </fieldset>
      <fieldset class="section">
        <legend>Expense lines</legend>
        <div class="table-scroll">
          <table class="fill-table" data-row-table="expense">
            <thead><tr><th>Category</th><th>Planned</th><th>Actual</th><th class="no-print"></th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
        <button type="button" class="btn secondary no-print" data-add="expense">+ Add expense</button>
        <div class="form-grid" style="margin-top:1rem">
          <label class="full">Notes / adjustments <textarea name="notes" rows="2"></textarea></label>
        </div>
      </fieldset>
  `;
}

const budgetExtra = `
function addMoneyRow(kind, data = {}) {
  const table = document.querySelector('[data-row-table="'+kind+'"] tbody');
  const tr = document.createElement('tr');
  if (kind === 'income') {
    tr.innerHTML = '<td><input name="source" value="'+(data.source||'')+'" placeholder="Salary / side hustle" /></td>'+
      '<td><input name="amount" value="'+(data.amount||'')+'" placeholder="0.00" /></td>'+
      '<td class="no-print"><button type="button" class="icon-btn">Remove</button></td>';
  } else {
    tr.innerHTML = '<td><input name="category" value="'+(data.category||'')+'" placeholder="Rent / Food / Ads" /></td>'+
      '<td><input name="planned" value="'+(data.planned||'')+'" placeholder="0.00" /></td>'+
      '<td><input name="actual" value="'+(data.actual||'')+'" placeholder="0.00" /></td>'+
      '<td class="no-print"><button type="button" class="icon-btn">Remove</button></td>';
  }
  tr.querySelector('button').onclick = () => tr.remove();
  table.appendChild(tr);
}
window.__addRow = (key, data) => addMoneyRow(key, data || {});
window.__seedRows = () => {
  addMoneyRow('income'); addMoneyRow('income');
  ['Housing','Food','Transport','Utilities','Fun'].forEach((c) => addMoneyRow('expense',{category:c}));
};
document.querySelectorAll('[data-add]').forEach((btn) => {
  btn.addEventListener('click', () => addMoneyRow(btn.getAttribute('data-add')));
});
`;

add(
  'budget-tracker-weekly',
  'Weekly Budget Tracker',
  'Income · expenses · variance · autosave · print/PDF',
  'Track weekly income and expenses. Compare planned vs actual and note adjustments.',
  'Income: $900 · Expenses planned: $720 · Left to save: $180',
  budgetBody(
    'Week',
    '<label>Week commencing * <input name="period" type="date" required /></label>'
  ),
  budgetExtra
);

add(
  'budget-tracker-monthly',
  'Monthly Budget Tracker',
  'Monthly income · bills · categories · autosave · print/PDF',
  'Set the month, list income sources and category budgets, then record actual spend.',
  'Month: August · Rent 1200 · Groceries 400 · Ads 150',
  budgetBody(
    'Month',
    '<label>Month * <input name="period" type="month" required /></label>'
  ),
  budgetExtra
);

add(
  'budget-tracker-yearly',
  'Yearly Budget Tracker',
  'Annual goals · categories · review · autosave · print/PDF',
  'Plan yearly income and major expense categories. Review mid-year and year-end.',
  'Year: 2026 · Income goal: $48k · Emergency fund: $6k',
  budgetBody(
    'Year',
    '<label>Year * <input name="period" type="number" min="2020" max="2100" required placeholder="2026" /></label>'
  ),
  budgetExtra
);

add(
  'social-media-captions',
  'Social Media Captions Pack',
  'Niches · hooks · CTAs · hashtags · autosave · print/PDF',
  'Fill brand voice, then write caption sets for each niche. Each block has hook, body, CTA and hashtags — ready to copy.',
  'Niche: Real estate<br/>Hook: “3 viewing mistakes that cost sellers money…”',
  `
      <fieldset class="section">
        <legend>Brand voice</legend>
        <div class="form-grid">
          <label>Brand / account * <input name="brand" required placeholder="e.g. WWA Property Desk" /></label>
          <label>Primary platform * <select name="platform" required>
            <option>Instagram</option><option>Facebook</option><option>LinkedIn</option>
            <option>TikTok</option><option>X / Twitter</option><option>Mixed</option>
          </select></label>
          <label class="full">Tone * <input name="tone" required placeholder="Friendly expert · bold · warm" /></label>
          <label class="full">Audience <textarea name="audience" rows="2" placeholder="First-time buyers, SMEs…"></textarea></label>
        </div>
      </fieldset>
      ${[
        ['Real estate / property', 're'],
        ['Fitness & wellness', 'fit'],
        ['Food & restaurants', 'food'],
        ['Fashion & retail', 'fashion'],
        ['Business / B2B services', 'biz'],
        ['Travel & hospitality', 'travel'],
        ['Beauty & lifestyle', 'beauty'],
        ['Jobs & careers', 'jobs'],
      ].map(([label, key]) => `
      <fieldset class="section">
        <legend>${label}</legend>
        <div class="form-grid">
          <label class="full">Hook * <input name="${key}_hook" required placeholder="Scroll-stopping first line" /></label>
          <label class="full">Caption body * <textarea name="${key}_body" rows="3" required placeholder="Value + story + proof"></textarea></label>
          <label>CTA * <input name="${key}_cta" required placeholder="Book a call / Shop now / Comment YES" /></label>
          <label>Hashtags <input name="${key}_tags" placeholder="#property #tips" /></label>
        </div>
      </fieldset>`).join('')}
  `
);

for (const p of packs) {
  const dir = path.join(packsRoot, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'style.css'), STYLE);
  fs.writeFileSync(path.join(dir, 'script.js'), SHARED_JS);
  fs.writeFileSync(path.join(dir, 'index.html'), p.html);
  fs.writeFileSync(path.join(stubsRoot, `${p.slug}.html`), stub(p.slug, p.title));
  console.log('Wrote', p.slug);
}

console.log('Done:', packs.length, 'packs');
