(function () {
  var STORAGE_KEY = 'wwa-tpl:professional-invoice-v1';
  var tbody = document.getElementById('lines-body');
  var saveTimer = null;

  var CURRENCY_SYMBOL = { USD: '$', GBP: '£', EUR: '€', AED: 'AED ', AUD: 'A$', CAD: 'C$' };

  function money(n) {
    var v = Number(n) || 0;
    return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function currencyPrefix() {
    var cur = (document.querySelector('[data-field="currency"]') || {}).value || 'USD';
    return CURRENCY_SYMBOL[cur] || (cur + ' ');
  }

  function num(el) {
    if (!el) return 0;
    var v = parseFloat(String(el.value).replace(/,/g, ''));
    return isNaN(v) ? 0 : v;
  }

  function rowTemplate() {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><input class="fill" data-line="item" type="text" placeholder="Display Ad — Leaderboard" /></td>' +
      '<td><textarea class="fill" data-line="desc" rows="2" placeholder="Homepage leaderboard, 728×90, dates & impressions…"></textarea></td>' +
      '<td><input class="fill" data-line="sku" type="text" placeholder="SKU" /></td>' +
      '<td class="col-num"><input class="fill num" data-line="qty" type="number" min="0" step="0.01" value="1" /></td>' +
      '<td class="col-num"><input class="fill num" data-line="unit" type="number" min="0" step="0.01" value="0" /></td>' +
      '<td class="col-num"><input class="fill num" data-line="tax" type="number" min="0" max="100" step="0.01" value="0" /></td>' +
      '<td class="col-num"><input class="fill num" data-line="discount" type="number" min="0" step="0.01" value="0" /></td>' +
      '<td class="col-num"><span class="line-total" data-line-total>0.00</span></td>' +
      '<td class="col-act no-print"><button type="button" class="btn-remove" title="Remove row" aria-label="Remove row">×</button></td>';
    return tr;
  }

  function addRow(data) {
    var tr = rowTemplate();
    if (data) {
      tr.querySelector('[data-line="item"]').value = data.item || '';
      tr.querySelector('[data-line="desc"]').value = data.desc || '';
      tr.querySelector('[data-line="sku"]').value = data.sku || '';
      tr.querySelector('[data-line="qty"]').value = data.qty != null ? data.qty : 1;
      tr.querySelector('[data-line="unit"]').value = data.unit != null ? data.unit : 0;
      tr.querySelector('[data-line="tax"]').value = data.tax != null ? data.tax : 0;
      tr.querySelector('[data-line="discount"]').value = data.discount != null ? data.discount : 0;
    }
    tbody.appendChild(tr);
    bindRow(tr);
    recalc();
    return tr;
  }

  function bindRow(tr) {
    tr.querySelectorAll('[data-line]').forEach(function (el) {
      el.addEventListener('input', function () {
        recalc();
        scheduleSave();
      });
      el.addEventListener('change', function () {
        recalc();
        scheduleSave();
      });
    });
    var rm = tr.querySelector('.btn-remove');
    if (rm) {
      rm.addEventListener('click', function () {
        if (tbody.querySelectorAll('tr').length <= 1) {
          alert('Keep at least one line item.');
          return;
        }
        if (tr.querySelector('[data-line="item"]').value && !confirm('Remove this line?')) return;
        tr.remove();
        recalc();
        scheduleSave();
      });
    }
  }

  function lineNet(tr) {
    var qty = num(tr.querySelector('[data-line="qty"]'));
    var unit = num(tr.querySelector('[data-line="unit"]'));
    var discount = num(tr.querySelector('[data-line="discount"]'));
    var taxPct = num(tr.querySelector('[data-line="tax"]'));
    var base = Math.max(0, qty * unit - discount);
    var taxAmt = base * (taxPct / 100);
    return { base: base, taxPct: taxPct, taxAmt: taxAmt, total: base + taxAmt };
  }

  function recalc() {
    var prefix = currencyPrefix();
    var subtotal = 0;
    var taxByRate = {};
    var taxTotal = 0;

    tbody.querySelectorAll('tr').forEach(function (tr) {
      var r = lineNet(tr);
      subtotal += r.base;
      taxTotal += r.taxAmt;
      if (r.taxPct > 0 && r.taxAmt > 0) {
        var key = String(r.taxPct);
        taxByRate[key] = (taxByRate[key] || 0) + r.taxAmt;
      }
      var out = tr.querySelector('[data-line-total]');
      if (out) out.textContent = prefix + money(r.total);
    });

    var invDiscount = num(document.querySelector('[data-field="invoice_discount"]'));
    var shipping = num(document.querySelector('[data-field="shipping"]'));
    var paid = num(document.querySelector('[data-field="amount_paid"]'));
    var afterDiscount = Math.max(0, subtotal - invDiscount);
    // Tax already computed per line on (qty*unit - line discount). Invoice discount reduces balance but
    // brief: subtotal → invoice discount → tax totals → shipping → grand.
    // We keep per-line tax as computed, then apply invoice discount to grand.
    var grand = Math.max(0, afterDiscount + taxTotal + shipping);
    var balance = Math.max(0, grand - paid);

    document.getElementById('out-subtotal').textContent = prefix + money(subtotal);
    document.getElementById('out-tax').textContent = prefix + money(taxTotal);
    document.getElementById('out-grand').textContent = prefix + money(grand);
    document.getElementById('out-balance').textContent = prefix + money(balance);

    var br = document.getElementById('tax-breakdown');
    var keys = Object.keys(taxByRate).sort(function (a, b) { return parseFloat(a) - parseFloat(b); });
    if (!keys.length) {
      br.innerHTML = '';
    } else {
      br.innerHTML = keys
        .map(function (k) {
          return '<div><span>Tax ' + k + '%</span><span>' + prefix + money(taxByRate[k]) + '</span></div>';
        })
        .join('');
    }

    var invNum = document.querySelector('[data-field="invoice_number"]');
    document.getElementById('footer-inv-num').textContent = (invNum && invNum.value) || '—';
    syncStatusBadge();
  }

  function syncStatusBadge() {
    var sel = document.querySelector('[data-field="status"]');
    if (!sel) return;
    sel.classList.remove('is-sent', 'is-paid', 'is-overdue');
    var v = sel.value;
    if (v === 'Sent') sel.classList.add('is-sent');
    if (v === 'Paid') sel.classList.add('is-paid');
    if (v === 'Overdue') sel.classList.add('is-overdue');
  }

  function collectFields() {
    var data = { lines: [] };
    document.querySelectorAll('[data-field]').forEach(function (el) {
      data[el.getAttribute('data-field')] = el.value;
    });
    tbody.querySelectorAll('tr').forEach(function (tr) {
      data.lines.push({
        item: tr.querySelector('[data-line="item"]').value,
        desc: tr.querySelector('[data-line="desc"]').value,
        sku: tr.querySelector('[data-line="sku"]').value,
        qty: tr.querySelector('[data-line="qty"]').value,
        unit: tr.querySelector('[data-line="unit"]').value,
        tax: tr.querySelector('[data-line="tax"]').value,
        discount: tr.querySelector('[data-line="discount"]').value,
      });
    });
    return data;
  }

  function applyFields(data) {
    if (!data) return;
    document.querySelectorAll('[data-field]').forEach(function (el) {
      var k = el.getAttribute('data-field');
      if (k in data && data[k] != null) el.value = data[k];
    });
    tbody.innerHTML = '';
    var lines = Array.isArray(data.lines) && data.lines.length ? data.lines : [{}];
    lines.forEach(function (line) { addRow(line); });
    updateLogo();
    recalc();
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 350);
  }

  function saveNow() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collectFields()));
      var el = document.getElementById('save-status');
      if (el) {
        el.textContent = 'Saved locally · ' + new Date().toLocaleTimeString();
      }
    } catch (e) {}
  }

  function loadSaved() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      applyFields(JSON.parse(raw));
      return true;
    } catch (e) {
      return false;
    }
  }

  function updateLogo() {
    var url = (document.querySelector('[data-field="logo_url"]') || {}).value || '';
    var img = document.getElementById('logo-img');
    var fallback = document.getElementById('logo-fallback');
    if (url.trim()) {
      img.src = url.trim();
      img.hidden = false;
      fallback.hidden = true;
      img.onerror = function () {
        img.hidden = true;
        fallback.hidden = false;
      };
    } else {
      img.hidden = true;
      fallback.hidden = false;
    }
  }

  function sampleData() {
    return {
      logo_url: '',
      company_name: 'WorldwideAdverts.info',
      company_address: '123 Market Street, Suite 400\nLondon, EC1A 1AA, UK',
      company_email: 'billing@worldwideadverts.info',
      company_phone: '+44 20 7946 0123',
      company_website: 'https://worldwideadverts.info',
      company_tax_id: 'VAT: GB123456789',
      doc_type: 'INVOICE',
      status: 'Sent',
      invoice_number: 'INV-2026-0042',
      invoice_date: '2026-07-01',
      due_date: '2026-07-31',
      payment_terms: 'Net 30',
      po_number: 'PO-55321',
      currency: 'USD',
      client_name: 'Aurora Marketing Ltd.',
      client_address: '45 Brand Lane\nNew York, NY 10001, USA',
      client_email: 'accounts@auroramktg.com',
      client_contact: 'Accounts Payable',
      client_phone: '+1 (212) 555-0132',
      client_account_id: 'AUR-7891',
      payment_methods: 'Bank transfer, card',
      bank_details: 'ABC Bank\nIBAN: GB12ABCD34567890123456\nSWIFT: ABCDGB2L',
      notes:
        'Deliverables completed as of 2026-07-31.\nIP transfers upon full payment.\nDisputes within 14 days to billing@worldwideadverts.info.',
      invoice_discount: '100',
      shipping: '0',
      amount_paid: '0',
      lines: [
        {
          item: 'Display Ad — Leaderboard',
          desc: 'Homepage leaderboard for July 1–31 (728×90px), guaranteed 1,000,000 impressions.',
          sku: 'BAN-728',
          qty: '1',
          unit: '1200',
          tax: '0',
          discount: '0',
        },
        {
          item: 'Sponsored Article — Production & Placement',
          desc: 'Sponsored editorial with newsletter and social distribution. Includes copywriting and one revision.',
          sku: 'SPO-ART',
          qty: '1',
          unit: '950',
          tax: '20',
          discount: '50',
        },
        {
          item: 'Campaign Management Fee (July)',
          desc: 'Monthly campaign management & reporting service.',
          sku: 'MGT-JUL',
          qty: '1',
          unit: '350',
          tax: '20',
          discount: '0',
        },
      ],
    };
  }

  function validate() {
    var errors = [];
    var required = [
      ['company_name', 'Company name'],
      ['company_email', 'Company email'],
      ['client_name', 'Client name'],
      ['client_email', 'Client email'],
      ['invoice_number', 'Invoice number'],
      ['invoice_date', 'Invoice date'],
      ['due_date', 'Due date'],
      ['payment_terms', 'Payment terms'],
    ];
    required.forEach(function (pair) {
      var el = document.querySelector('[data-field="' + pair[0] + '"]');
      if (!el || !String(el.value || '').trim()) errors.push(pair[1] + ' is required');
    });

    var invDate = document.querySelector('[data-field="invoice_date"]');
    var dueDate = document.querySelector('[data-field="due_date"]');
    if (invDate && dueDate && invDate.value && dueDate.value && dueDate.value < invDate.value) {
      errors.push('Due date must be on or after invoice date');
    }

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    ['company_email', 'client_email'].forEach(function (k) {
      var el = document.querySelector('[data-field="' + k + '"]');
      if (el && el.value && !emailRe.test(el.value.trim())) errors.push(k.replace('_', ' ') + ' looks invalid');
    });

    var hasItem = false;
    tbody.querySelectorAll('tr').forEach(function (tr) {
      var item = tr.querySelector('[data-line="item"]').value.trim();
      var qty = num(tr.querySelector('[data-line="qty"]'));
      var unit = num(tr.querySelector('[data-line="unit"]'));
      if (item) hasItem = true;
      if (item && qty <= 0) errors.push('Quantity must be greater than 0 for “' + item + '”');
      if (item && unit < 0) errors.push('Unit price cannot be negative for “' + item + '”');
    });
    if (!hasItem) errors.push('Add at least one line item name');

    var box = document.getElementById('validate-msg');
    box.hidden = false;
    if (errors.length) {
      box.className = 'validate-msg';
      box.innerHTML = '<strong>Please fix:</strong><ul style="margin:6px 0 0;padding-left:18px">' +
        errors.map(function (e) { return '<li>' + e + '</li>'; }).join('') +
        '</ul>';
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return false;
    }
    box.className = 'validate-msg ok';
    box.textContent = 'Looks good — ready to Print / Save PDF.';
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!loadSaved()) {
      addRow();
      addRow();
      addRow();
    }

    document.querySelectorAll('[data-field]').forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.getAttribute('data-field') === 'logo_url') updateLogo();
        if (el.getAttribute('data-field') === 'status') syncStatusBadge();
        recalc();
        scheduleSave();
      });
      el.addEventListener('change', function () {
        if (el.getAttribute('data-field') === 'logo_url') updateLogo();
        if (el.getAttribute('data-field') === 'status') syncStatusBadge();
        recalc();
        scheduleSave();
      });
    });

    document.getElementById('btn-add-row').addEventListener('click', function () {
      addRow();
      scheduleSave();
    });
    document.getElementById('btn-save').addEventListener('click', saveNow);
    document.getElementById('btn-validate').addEventListener('click', validate);
    document.getElementById('btn-print').addEventListener('click', function () {
      if (validate()) window.print();
    });
    document.getElementById('btn-reset').addEventListener('click', function () {
      if (!confirm('Clear this invoice and start blank?')) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
    document.getElementById('btn-sample').addEventListener('click', function () {
      if (!confirm('Load the sample Aurora Marketing invoice from the brief? This replaces current fields.')) return;
      applyFields(sampleData());
      saveNow();
    });

    updateLogo();
    recalc();
  });
})();
