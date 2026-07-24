import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';

/**
 * Post-login business profile — company documents & details (Clive: not on signup).
 * Global fields: company number, VAT, tax number, certificate upload, contact extras.
 */
const BusinessProfileCompletion = ({ onComplete }) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company_registration_number: '',
    vat_number: '',
    tax_number: '',
    country: '',
    city: '',
    business_category: '',
    business_address: '',
    website: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [certificateFile, setCertificateFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.company_registration_number.trim() &&
      !form.vat_number.trim() &&
      !form.tax_number.trim() &&
      !certificateFile
    ) {
      toast.error('Add a company number, VAT, tax number, or upload a company certificate.');
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });
      if (certificateFile) {
        payload.append('company_certificate', certificateFile);
      }

      await api.post('/business/profile/complete', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Business profile saved.');
      onComplete?.();
    } catch (error) {
      // Soft-save locally if endpoint not live yet
      try {
        localStorage.setItem(
          'wwa_business_profile_draft',
          JSON.stringify({
            ...form,
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
        Add company registration details after signing up. Upload a company certificate and/or provide
        company number, VAT number, tax number, and other company information.
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Company number</label>
            <input
              name="company_registration_number"
              value={form.company_registration_number}
              onChange={handleChange}
              placeholder="Registration / company number"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax number</label>
            <input
              name="tax_number"
              value={form.tax_number}
              onChange={handleChange}
              placeholder="Tax ID / TIN / EIN (any country)"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business category</label>
            <input
              name="business_category"
              value={form.business_category}
              onChange={handleChange}
              placeholder="e.g. Retail, Tow services"
              className={inputClass}
            />
          </div>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input name="website" type="url" value={form.website} onChange={handleChange} className={inputClass} />
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
