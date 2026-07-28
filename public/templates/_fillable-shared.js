/* Shared fillable template autosave — include as <script src="_fillable-shared.js"> */
(function () {
  var KEY = document.body.getAttribute('data-storage-key') || location.pathname;
  function save() {
    var data = {};
    document.querySelectorAll('[data-field]').forEach(function (el) {
      if (el.type === 'checkbox') data[el.getAttribute('data-field')] = el.checked;
      else data[el.getAttribute('data-field')] = el.value;
    });
    try { localStorage.setItem('wwa-tpl:' + KEY, JSON.stringify(data)); } catch (e) {}
  }
  function load() {
    try {
      var raw = localStorage.getItem('wwa-tpl:' + KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      document.querySelectorAll('[data-field]').forEach(function (el) {
        var k = el.getAttribute('data-field');
        if (!(k in data)) return;
        if (el.type === 'checkbox') el.checked = !!data[k];
        else el.value = data[k];
      });
    } catch (e) {}
  }
  document.addEventListener('DOMContentLoaded', function () {
    load();
    document.querySelectorAll('[data-field]').forEach(function (el) {
      el.addEventListener('input', save);
      el.addEventListener('change', save);
    });
    var btn = document.getElementById('btn-clear');
    if (btn) btn.addEventListener('click', function () {
      if (!confirm('Clear all filled fields on this template?')) return;
      localStorage.removeItem('wwa-tpl:' + KEY);
      location.reload();
    });
  });
})();
