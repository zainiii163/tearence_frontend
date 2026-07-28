const STORAGE_KEY = 'wwa_weeklyPlanner_v1';
const AUTO_SAVE_DELAY = 700;
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const el = (s, r = document) => r.querySelector(s);
const els = (s, r = document) => Array.from(r.querySelectorAll(s));

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
const markPristine = () => { isDirty = false; };
const scheduleSave = debounce(() => saveNow(false), AUTO_SAVE_DELAY);

function wireInputs(root) {
  els('input, textarea, select', root).forEach((node) => {
    node.addEventListener('input', () => { markDirty(); scheduleSave(); });
    node.addEventListener('change', () => { markDirty(); scheduleSave(); });
  });
}

function buildDays() {
  const wrap = el('#days');
  wrap.innerHTML = DAY_NAMES.map((name, i) => `
    <div class="day-block">
      <h3>${name}</h3>
      <div class="form-grid">
        <label>AM
          <textarea name="day${i}_am" rows="2" placeholder="Meetings · deep work"></textarea>
        </label>
        <label>PM
          <textarea name="day${i}_pm" rows="2" placeholder="Follow-ups · admin"></textarea>
        </label>
        <label class="full">Must-do
          <input name="day${i}_must" type="text" placeholder="One non-negotiable" />
        </label>
      </div>
    </div>
  `).join('');
  wireInputs(wrap);
}

function addHabitRow(data = {}) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input name="habitName" value="${(data.name || '').replace(/"/g, '&quot;')}" placeholder="e.g. Exercise" /></td>
    ${[0,1,2,3,4,5,6].map((i) => `<td style="text-align:center"><input type="checkbox" name="habitDay${i}" ${data[`d${i}`] ? 'checked' : ''} /></td>`).join('')}
    <td class="no-print"><button type="button" class="icon-btn remove-habit">Remove</button></td>
  `;
  tr.querySelector('.remove-habit').addEventListener('click', () => {
    tr.remove(); markDirty(); scheduleSave();
  });
  wireInputs(tr);
  el('#habits-table tbody').appendChild(tr);
}

function collect() {
  const data = { fields: {}, days: {}, habits: [], checks: {} };
  els('#wk-form input, #wk-form textarea, #wk-form select').forEach((node) => {
    if (!node.name) return;
    if (node.name.startsWith('day')) data.days[node.name] = node.value;
    else if (node.name.startsWith('habit')) { /* habits */ }
    else if (node.type === 'checkbox' && node.name.startsWith('chk_')) data.checks[node.name] = node.checked;
    else if (node.type !== 'checkbox') data.fields[node.name] = node.value;
  });
  els('#habits-table tbody tr').forEach((tr) => {
    const name = tr.querySelector('[name=habitName]')?.value || '';
    const days = {};
    for (let i = 0; i < 7; i++) days[`d${i}`] = !!tr.querySelector(`[name=habitDay${i}]`)?.checked;
    data.habits.push({ name, ...days });
  });
  return data;
}

function apply(data = {}) {
  Object.entries(data.fields || {}).forEach(([k, v]) => {
    const node = el(`[name="${k}"]`);
    if (node && node.type !== 'checkbox') node.value = v;
  });
  Object.entries(data.days || {}).forEach(([k, v]) => {
    const node = el(`[name="${k}"]`);
    if (node) node.value = v;
  });
  Object.entries(data.checks || {}).forEach(([k, v]) => {
    const node = el(`[name="${k}"]`);
    if (node) node.checked = !!v;
  });
  el('#habits-table tbody').innerHTML = '';
  (data.habits?.length ? data.habits : [{ name: 'Exercise' }, { name: 'Outreach' }]).forEach(addHabitRow);
  markPristine();
}

function saveNow(toast = true) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collect()));
    markPristine();
    if (toast) showToast('Draft saved');
  } catch (_) {
    if (toast) showToast('Could not save');
  }
}

function validate() {
  for (const name of ['wk_start', 'wk_role', 'wk_big3']) {
    const node = el(`[name="${name}"]`);
    if (!node || !(node.value || '').trim()) {
      showToast('Complete week start, focus and Big 3', 4000);
      node?.focus();
      return false;
    }
  }
  showToast('Looks good — ready to print');
  return true;
}

function resetAll() {
  if (!confirm('Clear this weekly planner draft?')) return;
  localStorage.removeItem(STORAGE_KEY);
  el('#wk-form').reset();
  buildDays();
  el('#habits-table tbody').innerHTML = '';
  addHabitRow({ name: 'Exercise' });
  addHabitRow({ name: 'Outreach' });
  markPristine();
  showToast('Draft cleared');
}

document.addEventListener('DOMContentLoaded', () => {
  buildDays();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) apply(JSON.parse(raw));
    else {
      addHabitRow({ name: 'Exercise' });
      addHabitRow({ name: 'Outreach' });
    }
  } catch (_) {
    addHabitRow({});
  }
  wireInputs(el('#wk-form'));
  el('#btn-add-habit').addEventListener('click', () => { addHabitRow(); markDirty(); scheduleSave(); });
  el('#btn-save').addEventListener('click', () => saveNow(true));
  el('#btn-validate').addEventListener('click', validate);
  el('#btn-reset').addEventListener('click', resetAll);
  el('#btn-print').addEventListener('click', () => { if (validate()) window.print(); });
  window.addEventListener('beforeunload', (e) => {
    if (isDirty) { e.preventDefault(); e.returnValue = ''; }
  });
});
