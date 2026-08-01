import React, { useState } from 'react';
import { FiX, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import businessTemplatesAPI from '../../api/businessTemplatesAPI';

/**
 * Clive: users who can't fill templates themselves request a professional fill-in quote.
 * Message goes to business admins in the backend.
 */
const TemplateQuoteModal = ({ open, onClose, template = null, vertical = '' }) => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  if (!open) return null;

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const path = window.location.pathname + window.location.search;
    if (!isAuthenticated && !requireAuth(path, 'Sign in so admins can reply to your quote request.')) {
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Name, email and message are required.');
      return;
    }
    setSending(true);
    try {
      await businessTemplatesAPI.requestQuote({
        template_title: template?.title || 'General template fill-in',
        template_slug: template?.slug || null,
        template_id: template?.id || null,
        file_url: template?.file || null,
        vertical: vertical || null,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        company: form.company.trim() || null,
        message: form.message.trim(),
      });
      toast.success('Quote request sent to our business team. We’ll reply soon.');
      setForm({ name: '', email: '', phone: '', company: '', message: '' });
      onClose?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send quote request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
      >
        <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100">
          <div>
            <h2 id="quote-title" className="text-base font-bold text-gray-900">
              Get a quote — we fill it for you
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {template?.title
                ? `Professional fill-in for “${template.title}”.`
                : 'Tell us which template you need completed.'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100" aria-label="Close">
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Your name *</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Company</label>
              <input
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">What do you need? *</label>
            <textarea
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              rows={4}
              placeholder="E.g. Fill this sale agreement with our company details, jurisdiction UK, deadline Friday…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Your request is sent to Worldwide Adverts business admins. They prepare the contract / template and quote you.
          </p>
          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold py-2.5 disabled:opacity-60"
          >
            <FiSend className="h-4 w-4" />
            {sending ? 'Sending…' : 'Send quote request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TemplateQuoteModal;
