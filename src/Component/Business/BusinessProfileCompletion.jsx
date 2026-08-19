import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';
import businessService from '../../services/BusinessService';
import { BUSINESS_DASHBOARD_CATEGORIES } from './businessCategoryDashboardConfig';

/**
 * Post-login company documents — category is chosen at signup (not here).
 */
const BusinessProfileCompletion = ({ onComplete, initialCategoryId = null }) => {
  const draftCategory = (() => {
    try {
      const draft = JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
      return draft?.dashboard_category || draft?.business_category_slug || null;
    } catch {
      return null;
    }
  })();

  const lockedCategory = initialCategoryId || draftCategory;

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => {
    const catId = lockedCategory || '';
    const cat = BUSINESS_DASHBOARD_CATEGORIES.find((c) => c.id === catId);
    return {
      company_registration_number: '',
      vat_number: '',
      duns_number: '',
      incorporation_date: '',
      tax_number: '',
      country: '',
      city: '',
      postal_code: '',
      business_company_name: '',
      business_category: cat?.name || '',
      dashboard_category: catId,
      business_category_slug: catId,
      business_address: '',
      business_email: '',
      website: '',
      booking_url: '',
      hours_weekday: '09:00 – 18:00',
      hours_saturday: '10:00 – 16:00',
      hours_sunday: 'Closed',
      booking_slots: '',
      first_name: '',
      last_name: '',
      phone: '',
    };
  });
  const [certificateFile, setCertificateFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'dashboard_category') {
        const cat = BUSINESS_DASHBOARD_CATEGORIES.find((c) => c.id === value);
        if (cat) {
          next.business_category = cat.name;
          next.business_category_slug = cat.id;
        }
      }
      return next;
    });
  };

  const buildCategoryProfile = () => {
    const opening_hours = {
      monday: form.hours_weekday,
      tuesday: form.hours_weekday,
      wednesday: form.hours_weekday,
      thursday: form.hours_weekday,
      friday: form.hours_weekday,
      saturday: form.hours_saturday,
      sunday: form.hours_sunday,
    };
    const booking_slots = String(form.booking_slots || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      opening_hours,
      booking_slots,
      booking_url: form.booking_url || form.website || null,
      booking_phone: form.phone || null,
    };
  };

  const syncDirectoryProfile = async () => {
    try {
      const mine = await businessService.getMyBusiness();
      const biz = mine?.data;
      if (!biz?.id) return;

      const payload = new FormData();
      if (form.city) payload.append('city', form.city);
      if (form.country) payload.append('country', form.country);
      if (form.business_address) payload.append('business_address', form.business_address);
      if (form.website) payload.append('business_website', form.website);
      if (form.booking_url) payload.append('booking_url', form.booking_url);
      if (form.business_company_name) payload.append('business_company_name', form.business_company_name);
      if (form.company_registration_number) {
        payload.append('business_company_no', form.company_registration_number);
        payload.append('business_company_registration', form.company_registration_number);
      }
      if (form.vat_number) payload.append('vat_number', form.vat_number);
      if (form.duns_number) payload.append('duns_number', form.duns_number);
      if (form.incorporation_date) payload.append('incorporation_date', form.incorporation_date);
      if (form.postal_code) payload.append('postal_code', form.postal_code);
      if (form.phone) payload.append('business_phone_number', form.phone);
      if (form.business_email) payload.append('business_email', form.business_email);
      payload.append('category_profile', JSON.stringify(buildCategoryProfile()));
      await businessService.updateBusiness(biz.id, payload);
    } catch {
      // Profile complete can still succeed without an existing listing
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.company_registration_number.trim() &&
      !form.vat_number.trim() &&
      !form.tax_number.trim() &&
      !certificateFile &&
      !form.hours_weekday.trim() &&
      !form.booking_url.trim()
    ) {
      toast.error('Add company details, opening hours, or a booking link.');
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });
      payload.append('category_profile', JSON.stringify(buildCategoryProfile()));
      if (certificateFile) {
        payload.append('company_certificate', certificateFile);
      }

      await api.post('/business/profile/complete', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await syncDirectoryProfile();
      toast.success('Business profile saved.');
      onComplete?.();
    } catch (error) {
      try {
        await syncDirectoryProfile();
        localStorage.setItem(
          'wwa_business_profile_draft',
          JSON.stringify({
            ...form,
            category_profile: buildCategoryProfile(),
            certificate_name: certificateFile?.name || null,
            saved_at: new Date().toISOString(),
          })
        );
        toast.success('Business details saved. You can update them anytime from your dashboard.');
        onComplete?.();
      } catch {
        toast.error(error?.response?.data?.message || 'Could not save business profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';

  return (
    <div className="bg-white border border-indigo-200 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Complete your business profile</h2>
      <p className="text-sm text-gray-600 mb-5">
        Add company registration details, opening times, and booking info. These appear on your
        public category profile (restaurants, automotive, clinics, etc.).
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input name="first_name" value={form.first_name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input name="last_name" value={form.last_name} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
            <input
              name="business_company_name"
              value={form.business_company_name}
              onChange={handleChange}
              placeholder="Legal company name"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company number</label>
            <input
              name="company_registration_number"
              value={form.company_registration_number}
              onChange={handleChange}
              placeholder="Registration / company number"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Incorporation date</label>
            <input
              type="date"
              name="incorporation_date"
              value={form.incorporation_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VAT number</label>
            <input name="vat_number" value={form.vat_number} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DUNS</label>
            <input
              name="duns_number"
              value={form.duns_number}
              onChange={handleChange}
              placeholder="D-U-N-S number"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax number</label>
            <input
              name="tax_number"
              value={form.tax_number}
              onChange={handleChange}
              placeholder="Tax ID / TIN / EIN (any country)"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category dashboard {lockedCategory ? '(chosen at signup)' : '*'}
          </label>
          {lockedCategory ? (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-950">
              {BUSINESS_DASHBOARD_CATEGORIES.find((c) => c.id === form.dashboard_category)?.emoji}{' '}
              {form.business_category || form.dashboard_category}
              <p className="mt-0.5 text-xs font-normal text-indigo-800">
                Set when you registered. Your My category workspace stays locked to this.
              </p>
              <input type="hidden" name="dashboard_category" value={form.dashboard_category} />
            </div>
          ) : (
            <>
              <select
                name="dashboard_category"
                value={form.dashboard_category}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select your primary category…</option>
                {BUSINESS_DASHBOARD_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Opens the matching business dashboard (Vehicles, Property, Jobs, Affiliates…).
              </p>
            </>
          )}
        </div>
        {!lockedCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business category label</label>
            <input
              name="business_category"
              value={form.business_category}
              onChange={handleChange}
              placeholder="Auto-filled from dashboard category"
              className={inputClass}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City / Town</label>
            <input name="city" value={form.city} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business address</label>
          <input name="business_address" value={form.business_address} onChange={handleChange} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="business_email"
              type="email"
              value={form.business_email}
              onChange={handleChange}
              placeholder="info@yourcompany.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
          <input name="postal_code" value={form.postal_code} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input name="website" type="url" value={form.website} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking URL</label>
            <input
              name="booking_url"
              type="url"
              value={form.booking_url}
              onChange={handleChange}
              placeholder="Reservations / MOT / appointments"
              className={inputClass}
            />
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/80 space-y-3">
          <p className="text-sm font-semibold text-gray-900">Opening times & booking slots</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mon–Fri</label>
              <input
                name="hours_weekday"
                value={form.hours_weekday}
                onChange={handleChange}
                placeholder="09:00 – 18:00"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Saturday</label>
              <input
                name="hours_saturday"
                value={form.hours_saturday}
                onChange={handleChange}
                placeholder="10:00 – 16:00"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sunday</label>
              <input
                name="hours_sunday"
                value={form.hours_sunday}
                onChange={handleChange}
                placeholder="Closed"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Booking slots (comma-separated)
            </label>
            <input
              name="booking_slots"
              value={form.booking_slots}
              onChange={handleChange}
              placeholder="Lunch, Dinner, Morning MOT"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company certificate</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700"
          />
          <p className="text-xs text-gray-500 mt-1">PDF or image — company registration certificate or equivalent.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save business details'}
        </button>
      </form>
    </div>
  );
};

export default BusinessProfileCompletion;
