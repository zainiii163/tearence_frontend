import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import businessTemplatesAPI from '../../api/businessTemplatesAPI';
import {
  CATEGORY_TEMPLATES,
  resolveCategoryTemplateKey,
} from '../../constants/categoryTemplates';

const TEMPLATE_TYPES = [
  { value: 'pitch_deck', label: 'Pitch deck' },
  { value: 'grant', label: 'Grant application' },
  { value: 'business_plan', label: 'Business plan' },
  { value: 'proposal', label: 'Proposal / SOW' },
  { value: 'business_doc', label: 'Other business document' },
];

const VERTICAL_LABELS = {
  business: 'Business',
  services: 'Services (IT)',
  'buy-sell': 'Buy & Sell',
  vehicles: 'Vehicles',
  books: 'Books',
  property: 'Property',
  'businesses-for-sale': 'Businesses for Sale',
};

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent';

const BusinessTemplatePostForm = ({
  onClose,
  onSuccess,
  defaultVertical = 'business',
  defaultCategoryKey = '',
  defaultCategoryName = '',
}) => {
  const resolvedDefault =
    resolveCategoryTemplateKey(defaultVertical, defaultCategoryKey, defaultCategoryName) ||
    'default';

  const [form, setForm] = useState({
    title: '',
    blurb: '',
    description: '',
    vertical: defaultVertical || 'business',
    category_slug: resolvedDefault,
    template_type: 'pitch_deck',
    price: '',
    price_label: '',
    currency: 'USD',
    file_url: '',
    preview_image: '',
    make_premium: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [premiumFee, setPremiumFee] = useState(5);
  const [premiumDays, setPremiumDays] = useState(30);

  useEffect(() => {
    businessTemplatesAPI
      .getSettings()
      .then((res) => {
        const data = res?.data || {};
        if (data.premium_monthly_fee != null) setPremiumFee(Number(data.premium_monthly_fee));
        if (data.premium_duration_days != null) setPremiumDays(Number(data.premium_duration_days));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      vertical: defaultVertical || prev.vertical,
      category_slug:
        resolveCategoryTemplateKey(defaultVertical, defaultCategoryKey, defaultCategoryName) ||
        'default',
    }));
  }, [defaultVertical, defaultCategoryKey, defaultCategoryName]);

  const categoryOptions = Object.keys(CATEGORY_TEMPLATES[form.vertical] || { default: true }).map(
    (slug) => ({
      value: slug,
      label:
        slug === 'default'
          ? 'General / all categories'
          : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    })
  );

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim() || form.title.trim().length < 3) next.title = 'Title is required (min 3 characters)';
    if (!form.blurb.trim()) next.blurb = 'Short description is required';
    if (!form.vertical) next.vertical = 'Select a section';
    if (!form.template_type) next.template_type = 'Select a template type';
    if (form.price === '' || Number(form.price) < 0) next.price = 'Enter a price (0 or more)';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const priceNum = Number(form.price);
      const payload = {
        title: form.title.trim(),
        blurb: form.blurb.trim(),
        description: form.description.trim() || form.blurb.trim(),
        vertical: form.vertical,
        category_slug: form.category_slug || 'default',
        template_type: form.template_type,
        price: priceNum,
        price_label: form.price_label.trim() || `From $${priceNum}`,
        currency: form.currency || 'USD',
        file_url: form.file_url.trim() || null,
        preview_image: form.preview_image.trim() || null,
        status: 'active',
        make_premium: Boolean(form.make_premium),
        headline: `${VERTICAL_LABELS[form.vertical] || 'Business'} templates for sale`,
        section_description:
          'Pitch decks, grant applications, business plans and proposals from sellers.',
      };

      await businessTemplatesAPI.create(payload);
      toast.success('Template listed successfully!');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const validation = err?.response?.data?.errors;
      const msg = validation
        ? Object.values(validation).flat().join(' ')
        : err?.response?.data?.message || err?.message || 'Failed to list template';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Post a business template</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Pitch decks, grant packs, business plans and proposals
              </p>
            </div>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                className={inputClass}
                placeholder="e.g. Investor pitch deck"
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                <select
                  value={form.vertical}
                  onChange={(e) => {
                    setField('vertical', e.target.value);
                    setField('category_slug', 'default');
                  }}
                  className={inputClass}
                >
                  {Object.entries(VERTICAL_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category_slug}
                  onChange={(e) => setField('category_slug', e.target.value)}
                  className={inputClass}
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template type *</label>
                <select
                  value={form.template_type}
                  onChange={(e) => setField('template_type', e.target.value)}
                  className={inputClass}
                >
                  {TEMPLATE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                  className={inputClass}
                  placeholder="29"
                />
                {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price label</label>
              <input
                type="text"
                value={form.price_label}
                onChange={(e) => setField('price_label', e.target.value)}
                className={inputClass}
                placeholder="From $29 (optional — auto if empty)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short description *</label>
              <textarea
                value={form.blurb}
                onChange={(e) => setField('blurb', e.target.value)}
                className={inputClass}
                rows={2}
                placeholder="What buyers get — e.g. 12-slide pitch with financials and ask"
              />
              {errors.blurb && <p className="text-xs text-red-600 mt-1">{errors.blurb}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full details</label>
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                className={inputClass}
                rows={4}
                placeholder="Formats included (PPTX, DOCX, PDF), what’s customisable, delivery notes…"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File / download URL</label>
              <input
                type="url"
                value={form.file_url}
                onChange={(e) => setField('file_url', e.target.value)}
                className={inputClass}
                placeholder="https://… (optional for now)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preview image URL</label>
              <input
                type="url"
                value={form.preview_image}
                onChange={(e) => setField('preview_image', e.target.value)}
                className={inputClass}
                placeholder="https://… (optional)"
              />
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-4 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.make_premium}
                  onChange={(e) => setField('make_premium', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Make this listing premium
                  </span>
                  <span className="block text-xs text-gray-600 mt-0.5">
                    Featured at the top of template searches for {premiumDays} days —{' '}
                    <strong>${Number(premiumFee).toFixed(2)} USD</strong> (set by admin, not hard-coded).
                  </span>
                </span>
              </label>
            </div>
          </form>

          <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-violet-700 text-white hover:bg-violet-800 disabled:opacity-50"
            >
              {submitting
                ? 'Posting…'
                : form.make_premium
                  ? `List as premium ($${Number(premiumFee).toFixed(2)})`
                  : 'List template'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BusinessTemplatePostForm;
