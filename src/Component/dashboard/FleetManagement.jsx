import React, { useEffect, useMemo, useState } from 'react';
import { FaCar, FaPlus, FaWrench, FaCheckCircle, FaClock } from 'react-icons/fa';
import { getMyVehicles } from '../../services/vehiclesAPI';
import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';
import VehiclePostForm from '../vehicles/VehiclePostForm';

const STATUSES = [
  { id: 'available', label: 'Available', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'in_service', label: 'In service / on hire', color: 'bg-blue-100 text-blue-800' },
  { id: 'maintenance', label: 'Maintenance', color: 'bg-amber-100 text-amber-800' },
  { id: 'sold', label: 'Sold', color: 'bg-slate-100 text-slate-700' },
];

const statusStorageKey = (customerHint) => `wwa_fleet_status_${customerHint || 'me'}`;

/**
 * Fleet board for vehicle businesses — operational status on top of listings.
 */
const FleetManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(statusStorageKey());
      if (raw) setStatusMap(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persistStatus = (next) => {
    setStatusMap(next);
    try {
      localStorage.setItem(statusStorageKey(), JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyVehicles();
      setVehicles(extractListItems(response));
    } catch {
      setError('Could not load fleet vehicles.');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const acc = { available: 0, in_service: 0, maintenance: 0, sold: 0, total: vehicles.length };
    vehicles.forEach((v) => {
      const st = statusMap[v.id] || 'available';
      if (acc[st] != null) acc[st] += 1;
    });
    return acc;
  }, [vehicles, statusMap]);

  if (showForm) {
    return (
      <VehiclePostForm
        onClose={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fleet management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track stock, hire and workshop status for every vehicle on your business dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <FaPlus className="mr-2" />
          Add vehicle to fleet
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Fleet size</p>
          <p className="text-2xl font-bold text-slate-900">{counts.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Available</p>
          <p className="text-2xl font-bold text-emerald-700">{counts.available}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">In service</p>
          <p className="text-2xl font-bold text-blue-700">{counts.in_service}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Maintenance</p>
          <p className="text-2xl font-bold text-amber-700">{counts.maintenance}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <FaCar className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <p className="font-semibold text-slate-800">No vehicles in the fleet yet</p>
          <p className="text-sm text-slate-500 mt-1">Add a listing to start tracking availability.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const id = v.id;
                const st = statusMap[id] || 'available';
                const thumb = getStorageAssetUrl(v.main_image || v.image || v.images?.[0]);
                return (
                  <tr key={id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                          {thumb ? (
                            <img src={thumb} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FaCar className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {v.title || [v.make, v.model, v.year].filter(Boolean).join(' ')}
                          </p>
                          <p className="text-xs text-slate-500">
                            {v.registration || v.reg || v.vin || `ID ${id}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatCityCountry(v.city, v.country) || v.location || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={st}
                        onChange={(e) => persistStatus({ ...statusMap, [id]: e.target.value })}
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <span className={`ml-2 hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUSES.find((s) => s.id === st)?.color}`}>
                        {st === 'maintenance' ? <FaWrench className="inline mr-1" /> : null}
                        {st === 'available' ? <FaCheckCircle className="inline mr-1" /> : null}
                        {st === 'in_service' ? <FaClock className="inline mr-1" /> : null}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;
