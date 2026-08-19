import React, { useCallback, useEffect, useState } from 'react';
import { FaBell, FaCar, FaMapMarkerAlt, FaPaperPlane, FaTrafficLight } from 'react-icons/fa';
import api from '../../api';

const detectGeo = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return {};
    const json = await res.json();
    return {
      city: json.city || '',
      country: json.country_name || json.country || '',
    };
  } catch {
    return {};
  }
};

/**
 * Area-scoped parking + traffic alerts (only the user's city/country).
 */
const LocalAreaAlertsPanel = () => {
  const [geo, setGeo] = useState({ city: '', country: '' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    type: 'parking',
    title: '',
    message: '',
    area: '',
  });

  const load = useCallback(async (city, country) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (city) params.set('city', city);
      if (country) params.set('country', country);
      const res = await api.get(`/local-alerts?${params.toString()}`);
      const payload = res?.data?.data || res?.data || {};
      setItems(payload.items || []);
      if (payload.geo) {
        setGeo((prev) => ({
          city: city || payload.geo.city || prev.city,
          country: country || payload.geo.country || prev.country,
        }));
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not load local alerts.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const found = await detectGeo();
      setGeo(found);
      await load(found.city, found.country);
    })();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await api.post('/local-alerts', {
        ...form,
        city: geo.city,
        country: geo.country,
      });
      setForm({ type: form.type, title: '', message: '', area: '' });
      await load(geo.city, geo.country);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not share this alert.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Local parking & traffic</h3>
        <p className="text-sm text-slate-500 mt-1">
          Share a parking space or traffic note. Only people in your area see it — not the whole world.
        </p>
        <p className="text-xs font-semibold text-cyan-800 mt-2">
          <FaMapMarkerAlt className="inline mr-1" />
          {geo.city || geo.country ? [geo.city, geo.country].filter(Boolean).join(', ') : 'Detecting your area…'}
        </p>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={form.type}
          onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="parking">Parking space</option>
          <option value="traffic">Traffic alert</option>
        </select>
        <input
          value={form.area}
          onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
          placeholder="Street / car park / junction"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder={form.type === 'parking' ? 'e.g. Spaces free on High Street' : 'e.g. Slow traffic on ring road'}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
          required
        />
        <textarea
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          placeholder="Optional extra detail"
          rows={2}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
        />
        <button
          type="submit"
          disabled={saving || (!geo.city && !geo.country)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-700 text-white px-4 py-2 text-sm font-semibold hover:bg-cyan-800 disabled:opacity-50 sm:col-span-2"
        >
          <FaPaperPlane />
          {saving ? 'Sharing…' : 'Share with people nearby'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Loading local alerts…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">No parking or traffic notes in your area yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
              <span className="mt-0.5 text-cyan-700">
                {item.type === 'traffic' ? <FaTrafficLight /> : <FaCar />}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {[item.area, item.city, item.country].filter(Boolean).join(' · ')}
                  {item.created_at ? ` · ${new Date(item.created_at).toLocaleString()}` : ''}
                </p>
                {item.message ? <p className="text-sm text-slate-700 mt-1">{item.message}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocalAreaAlertsPanel;
export { detectGeo };
