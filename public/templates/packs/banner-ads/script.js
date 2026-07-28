/* Banner Ads multi-size pack — autosave, size switch, theme, validate, print */
const STORAGE_KEY = 'wwa_bannerAdsPack_v1';
const AUTO_SAVE_DELAY = 700;

const SIZES = [
  { id: '728x90', label: '728 × 90', name: 'Leaderboard', scale: 1 },
  { id: '300x250', label: '300 × 250', name: 'Medium Rectangle', scale: 1 },
  { id: '160x600', label: '160 × 600', name: 'Skyscraper', scale: 1 },
  { id: '970x250', label: '970 × 250', name: 'Billboard', scale: 0.85 },
  { id: '468x60', label: '468 × 60', name: 'Classic Banner', scale: 1 },
  { id: '1080x1080', label: '1080 × 1080', name: 'Square Banner', scale: 0.5 },
  { id: '1200x628', label: '1200 × 628', name: 'Facebook Cover / Link', scale: 0.55 },
  { id: '1584x396', label: '1584 × 396', name: 'LinkedIn Banner', scale: 0.5 },
  { id: '600x200', label: '600 × 200', name: 'Email Header', scale: 1 },
];

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
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

let isDirty = false;
const markDirty = () => { isDirty = true; };
const markPristine = () => { isDirty = false; };

function applyTheme() {
  const canvas = el('#banner-canvas');
  const bg = el('#bgColor').value;
  const accent = el('#accentColor').value;
  const text = el('#textColor').value;
  canvas.style.background = bg;
  canvas.style.color = text;
  el('#live-cta').style.background = accent;
  el('#live-cta').style.color = '#0f172a';
}

function applyLogo() {
  const url = (el('#logoUrl').value || '').trim();
  const img = el('#banner-logo');
  if (url) {
    img.src = url;
    img.hidden = false;
    img.onerror = () => { img.hidden = true; };
  } else {
    img.removeAttribute('src');
    img.hidden = true;
  }
}

function setSize(sizeId) {
  const meta = SIZES.find((s) => s.id === sizeId) || SIZES[0];
  const canvas = el('#banner-canvas');
  canvas.dataset.size = meta.id;
  canvas.style.width = '';
  canvas.style.height = '';
  const scale = window.matchMedia('(max-width: 900px)').matches
    ? Math.min(meta.scale, 0.55)
    : meta.scale;
  canvas.style.transform = scale < 1 ? `scale(${scale})` : '';
  canvas.style.transformOrigin = 'top center';
  el('#size-label').textContent = `${meta.label} — ${meta.name}`;
  el('#scale-hint').textContent =
    scale < 1 ? `Preview scaled to ${Math.round(scale * 100)}% (print exports full size)` : 'Preview at 100%';
  els('.size-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.size === meta.id);
  });
  markDirty();
  scheduleSave();
}

function collectState() {
  return {
    size: el('#banner-canvas').dataset.size,
    bgColor: el('#bgColor').value,
    accentColor: el('#accentColor').value,
    textColor: el('#textColor').value,
    logoUrl: el('#logoUrl').value,
    brandName: el('#brandName').value,
    destUrl: el('#destUrl').value,
    campaignName: el('#campaignName').value,
    placement: el('#placement').value,
    notes: el('#notes').value,
    headline: el('#live-headline').innerText,
    sub: el('#live-sub').innerText,
    cta: el('#live-cta').innerText,
    brandLive: el('#live-brand').innerText,
    legal: el('#live-legal').innerText,
    chkSize: el('#chk-size').checked,
    chkCta: el('#chk-cta').checked,
    chkLegal: el('#chk-legal').checked,
  };
}

function applyState(data = {}) {
  if (data.bgColor) el('#bgColor').value = data.bgColor;
  if (data.accentColor) el('#accentColor').value = data.accentColor;
  if (data.textColor) el('#textColor').value = data.textColor;
  if (data.logoUrl != null) el('#logoUrl').value = data.logoUrl;
  if (data.brandName != null) el('#brandName').value = data.brandName;
  if (data.destUrl != null) el('#destUrl').value = data.destUrl;
  if (data.campaignName != null) el('#campaignName').value = data.campaignName;
  if (data.placement != null) el('#placement').value = data.placement;
  if (data.notes != null) el('#notes').value = data.notes;
  if (data.headline != null) el('#live-headline').innerText = data.headline;
  if (data.sub != null) el('#live-sub').innerText = data.sub;
  if (data.cta != null) el('#live-cta').innerText = data.cta;
  if (data.brandLive != null) el('#live-brand').innerText = data.brandLive;
  else if (data.brandName) el('#live-brand').innerText = data.brandName;
  if (data.legal != null) el('#live-legal').innerText = data.legal;
  el('#chk-size').checked = !!data.chkSize;
  el('#chk-cta').checked = !!data.chkCta;
  el('#chk-legal').checked = !!data.chkLegal;
  applyTheme();
  applyLogo();
  setSize(data.size || '728x90');
  markPristine();
}

function saveNow() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState()));
    markPristine();
    showToast('Draft saved');
  } catch (e) {
    showToast('Could not save (storage full?)');
  }
}

const scheduleSave = debounce(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState()));
    markPristine();
  } catch (_) { /* ignore */ }
}, AUTO_SAVE_DELAY);

function restore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) applyState(JSON.parse(raw));
    else setSize('728x90');
  } catch (_) {
    setSize('728x90');
  }
}

function validate() {
  const headline = (el('#live-headline').innerText || '').trim();
  const cta = (el('#live-cta').innerText || '').trim();
  const errors = [];
  if (headline.length < 3) errors.push('Add a headline (3+ characters).');
  if (cta.length < 2) errors.push('Add a CTA button label.');
  if (errors.length) {
    showToast(errors[0], 4000);
    return false;
  }
  showToast('Looks good — ready to print or upload');
  return true;
}

function resetAll() {
  if (!confirm('Clear this banner draft?')) return;
  localStorage.removeItem(STORAGE_KEY);
  el('#bgColor').value = '#0f766e';
  el('#accentColor').value = '#fbbf24';
  el('#textColor').value = '#ffffff';
  el('#logoUrl').value = '';
  el('#brandName').value = '';
  el('#destUrl').value = '';
  el('#campaignName').value = '';
  el('#placement').value = '';
  el('#notes').value = '';
  el('#live-brand').innerText = 'Your Brand';
  el('#live-headline').innerText = 'Your headline goes here';
  el('#live-sub').innerText = 'Short supporting offer or benefit';
  el('#live-cta').innerText = 'Shop now';
  el('#live-legal').innerText = '*Terms apply. Offer ends Sunday.';
  el('#chk-size').checked = false;
  el('#chk-cta').checked = false;
  el('#chk-legal').checked = false;
  applyTheme();
  applyLogo();
  setSize('728x90');
  markPristine();
  showToast('Draft cleared');
}

function buildSizeGrid() {
  const grid = el('#size-grid');
  grid.innerHTML = '';
  SIZES.forEach((s) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'size-chip';
    btn.dataset.size = s.id;
    btn.setAttribute('role', 'option');
    btn.innerHTML = `<strong>${s.label}</strong><span>${s.name}</span>`;
    btn.addEventListener('click', () => setSize(s.id));
    grid.appendChild(btn);
  });
}

function wire() {
  buildSizeGrid();
  restore();
  applyTheme();

  ['#bgColor', '#accentColor', '#textColor'].forEach((sel) => {
    el(sel).addEventListener('input', () => {
      applyTheme();
      markDirty();
      scheduleSave();
    });
  });
  el('#logoUrl').addEventListener('input', () => {
    applyLogo();
    markDirty();
    scheduleSave();
  });
  el('#brandName').addEventListener('input', () => {
    if (!(el('#live-brand').dataset.userEdited === '1')) {
      el('#live-brand').innerText = el('#brandName').value || 'Your Brand';
    }
    markDirty();
    scheduleSave();
  });
  el('#live-brand').addEventListener('input', () => {
    el('#live-brand').dataset.userEdited = '1';
    markDirty();
    scheduleSave();
  });

  ['#destUrl', '#campaignName', '#placement', '#notes', '#chk-size', '#chk-cta', '#chk-legal'].forEach((sel) => {
    el(sel).addEventListener('input', () => { markDirty(); scheduleSave(); });
    el(sel).addEventListener('change', () => { markDirty(); scheduleSave(); });
  });

  els('[contenteditable]').forEach((node) => {
    node.addEventListener('input', () => { markDirty(); scheduleSave(); });
  });

  el('#btn-save').addEventListener('click', saveNow);
  el('#btn-validate').addEventListener('click', validate);
  el('#btn-reset').addEventListener('click', resetAll);
  el('#btn-print').addEventListener('click', () => {
    if (validate()) window.print();
  });

  window.addEventListener('beforeunload', (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  window.addEventListener('resize', () => {
    setSize(el('#banner-canvas').dataset.size || '728x90');
  });
}

document.addEventListener('DOMContentLoaded', wire);
