/* Business Plan — Executive Summary (Shihab / WWA)
   Autosave, restore, dynamic tables, validation, counters, print, beforeunload
*/
const STORAGE_KEY = 'wwa_businessPlanExecSummary_v1';
const AUTO_SAVE_DELAY = 700;

const el = (selector, root = document) => root.querySelector(selector);
const els = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const showToast = (msg, time = 3000) => {
  const toast = el('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, time);
};

const debounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

const form = () => el('#business-plan-form');
let isDirty = false;
const markDirty = () => {
  isDirty = true;
};
const markPristine = () => {
  isDirty = false;
};

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function createProductRow(data = {}) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="small-input" name="productName" value="${escapeHtml(data.name || '')}" placeholder="Product / Service name"></td>
    <td><input class="small-input" name="productDesc" value="${escapeHtml(data.description || '')}" placeholder="Short description"></td>
    <td><input class="small-input" name="productPrice" value="${escapeHtml(data.price || '')}" placeholder="e.g., $49 or subscription"></td>
    <td><input class="small-input" name="productBenefit" value="${escapeHtml(data.benefit || '')}" placeholder="Key benefit"></td>
    <td class="no-print"><button type="button" class="icon-btn remove-row">Remove</button></td>
  `;
  tr.querySelector('.remove-row').addEventListener('click', () => {
    tr.remove();
    markDirty();
    scheduleSave();
  });
  els('input', tr).forEach((inp) =>
    inp.addEventListener('input', () => {
      markDirty();
      scheduleSave();
    })
  );
  return tr;
}

function createGoalRow(data = {}) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="small-input" name="goal" value="${escapeHtml(data.goal || '')}" placeholder="Describe goal"></td>
    <td><input class="small-input" name="goalDate" type="date" value="${escapeHtml(data.date || '')}"></td>
    <td><input class="small-input" name="goalMetric" value="${escapeHtml(data.metric || '')}" placeholder="Metric e.g., revenue, users"></td>
    <td class="no-print"><button type="button" class="icon-btn remove-row">Remove</button></td>
  `;
  tr.querySelector('.remove-row').addEventListener('click', () => {
    tr.remove();
    markDirty();
    scheduleSave();
  });
  els('input', tr).forEach((inp) =>
    inp.addEventListener('input', () => {
      markDirty();
      scheduleSave();
    })
  );
  return tr;
}

function collectFormData() {
  const f = form();
  const data = {};
  const fd = new FormData(f);
  for (const [k, v] of fd.entries()) {
    if (!data[k]) data[k] = v;
    else {
      if (!Array.isArray(data[k])) data[k] = [data[k]];
      data[k].push(v);
    }
  }

  data.products = [];
  el('#products-table tbody')
    .querySelectorAll('tr')
    .forEach((tr) => {
      const name = tr.querySelector('[name=productName]').value;
      const description = tr.querySelector('[name=productDesc]').value;
      const price = tr.querySelector('[name=productPrice]').value;
      const benefit = tr.querySelector('[name=productBenefit]').value;
      if (name || description || price || benefit) {
        data.products.push({ name, description, price, benefit });
      }
    });

  data.goals = [];
  el('#goals-table tbody')
    .querySelectorAll('tr')
    .forEach((tr) => {
      const goal = tr.querySelector('[name=goal]').value;
      const date = tr.querySelector('[name=goalDate]').value;
      const metric = tr.querySelector('[name=goalMetric]').value;
      if (goal || date || metric) data.goals.push({ goal, date, metric });
    });

  data.checklist = {
    proofread: !!el('#chk-proofread')?.checked,
    financials: !!el('#chk-financials')?.checked,
    contacts: !!el('#chk-contacts')?.checked,
  };

  return data;
}

function restoreFormData(data) {
  if (!data) return;
  Object.keys(data).forEach((k) => {
    if (['products', 'goals', 'checklist', '_savedAt'].includes(k)) return;
    const nodes = els(`[name="${k}"]`);
    if (!nodes.length) return;
    if (Array.isArray(data[k])) {
      nodes.forEach((input) => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = data[k].includes(input.value);
        } else {
          input.value = data[k][0] || '';
        }
      });
    } else {
      nodes.forEach((input) => {
        if (input.type === 'checkbox') {
          input.checked =
            data[k] === input.value || data[k] === 'on' || data[k] === true;
        } else if (input.type === 'radio') {
          if (input.value === data[k]) input.checked = true;
        } else input.value = data[k];
      });
    }
  });

  const pbody = el('#products-table tbody');
  pbody.innerHTML = '';
  if (Array.isArray(data.products) && data.products.length) {
    data.products.forEach((p) => pbody.appendChild(createProductRow(p)));
  } else {
    pbody.appendChild(createProductRow());
  }

  const gbody = el('#goals-table tbody');
  gbody.innerHTML = '';
  if (Array.isArray(data.goals) && data.goals.length) {
    data.goals.forEach((g) => gbody.appendChild(createGoalRow(g)));
  } else {
    gbody.appendChild(createGoalRow());
  }

  if (data.checklist) {
    if (el('#chk-proofread')) el('#chk-proofread').checked = !!data.checklist.proofread;
    if (el('#chk-financials')) el('#chk-financials').checked = !!data.checklist.financials;
    if (el('#chk-contacts')) el('#chk-contacts').checked = !!data.checklist.contacts;
  }

  updateAllCounters();
}

function saveToStorage() {
  try {
    const payload = collectFormData();
    payload._savedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    markPristine();
    showToast('Draft saved locally');
    return true;
  } catch (err) {
    console.error('Save failed', err);
    showToast('Could not save draft', 4000);
    return false;
  }
}

const scheduleSave = debounce(() => {
  saveToStorage();
}, AUTO_SAVE_DELAY);

function autoRestore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    restoreFormData(JSON.parse(raw));
    showToast('Auto-restored saved draft');
  } catch (err) {
    console.error('Restore error', err);
  }
}

function clearValidation() {
  els('.error').forEach((e) => {
    e.textContent = '';
  });
  els('.is-invalid').forEach((i) => i.classList.remove('is-invalid'));
}

function validateForm() {
  clearValidation();
  let ok = true;
  const required = [
    { name: 'businessName', label: 'Business Name' },
    { name: 'ownerName', label: 'Owner Name' },
    { name: 'businessType', label: 'Business Type' },
    { name: 'companyDescription', label: 'Company Description' },
    { name: 'executiveSummary', label: 'Executive Summary' },
  ];
  let firstInvalid = null;
  required.forEach((r) => {
    const input = el(`[name="${r.name}"]`);
    if (!input) return;
    if (!input.value || String(input.value).trim() === '') {
      ok = false;
      input.classList.add('is-invalid');
      const err = el(`#error-${r.name}`);
      if (err) err.textContent = `${r.label} is required.`;
      input.setAttribute('aria-invalid', 'true');
      if (!firstInvalid) firstInvalid = input;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      input.setAttribute('aria-invalid', 'false');
    }
  });
  if (!ok) {
    showToast('Please fix validation errors', 4000);
    firstInvalid?.focus();
  } else {
    showToast('Validation successful', 2500);
  }
  return ok;
}

function updateAllCounters() {
  const cd = el('#companyDescription');
  const es = el('#executiveSummary');
  if (cd && el('#companyDescription-chars')) {
    el('#companyDescription-chars').textContent = cd.value.length;
  }
  if (es) {
    const words = es.value.trim().split(/\s+/).filter(Boolean).length;
    if (el('#executiveSummary-words')) el('#executiveSummary-words').textContent = words;
    if (el('#executiveSummary-chars')) el('#executiveSummary-chars').textContent = es.value.length;
  }
}

function resetForm(confirmReset = true) {
  if (confirmReset && !confirm('Reset the form and clear the saved draft? This cannot be undone.')) {
    return;
  }
  form().reset();
  el('#products-table tbody').innerHTML = '';
  el('#products-table tbody').appendChild(createProductRow());
  el('#goals-table tbody').innerHTML = '';
  el('#goals-table tbody').appendChild(createGoalRow());
  localStorage.removeItem(STORAGE_KEY);
  clearValidation();
  updateAllCounters();
  markPristine();
  showToast('Form reset and local draft cleared');
}

window.addEventListener('beforeunload', (e) => {
  if (isDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});

function bindUI() {
  const year = el('#currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  if (!el('#products-table tbody').hasChildNodes()) {
    el('#products-table tbody').appendChild(createProductRow());
  }
  if (!el('#goals-table tbody').hasChildNodes()) {
    el('#goals-table tbody').appendChild(createGoalRow());
  }

  el('#add-product')?.addEventListener('click', () => {
    el('#products-table tbody').appendChild(createProductRow());
    markDirty();
    scheduleSave();
  });
  el('#add-goal')?.addEventListener('click', () => {
    el('#goals-table tbody').appendChild(createGoalRow());
    markDirty();
    scheduleSave();
  });
  el('#btn-save')?.addEventListener('click', () => saveToStorage());
  el('#form-submit')?.addEventListener('click', () => {
    if (validateForm()) saveToStorage();
  });
  el('#btn-validate')?.addEventListener('click', () => validateForm());
  el('#btn-reset')?.addEventListener('click', () => resetForm(true));
  el('#form-reset')?.addEventListener('click', () => resetForm(true));
  el('#btn-print')?.addEventListener('click', () => {
    saveToStorage();
    window.print();
  });

  ['input', 'change'].forEach((evt) => {
    form().addEventListener(
      evt,
      (e) => {
        if (e.target && e.target.matches('input,textarea,select')) {
          markDirty();
          updateAllCounters();
          scheduleSave();
        }
      },
      { capture: true }
    );
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveToStorage();
    }
  });
}

function init() {
  autoRestore();
  bindUI();
  updateAllCounters();
  markPristine();
}

document.addEventListener('DOMContentLoaded', init);
