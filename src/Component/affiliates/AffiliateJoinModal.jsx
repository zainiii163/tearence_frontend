import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Globe, Send } from 'lucide-react';

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourhandle' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
  { key: 'x', label: 'X / Twitter', placeholder: 'https://x.com/yourhandle' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/you' },
];

/**
 * Join / apply to promote a business program — promoter shares reach + social links.
 */
const AffiliateJoinModal = ({ offerTitle, onClose, onSubmit, submitting = false }) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [message, setMessage] = useState('');
  const [estimatedVisitors, setEstimatedVisitors] = useState('');
  const [socials, setSocials] = useState({});
  const [methods, setMethods] = useState([]);
  const [error, setError] = useState('');

  const toggleMethod = (m) => {
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const social_media_links = SOCIAL_FIELDS.map(({ key }) => {
      const url = (socials[key] || '').trim();
      return url ? { platform: key, url } : null;
    }).filter(Boolean);

    const website = websiteUrl.trim();
    if (!website && social_media_links.length === 0) {
      setError('Add a website or at least one social media link so merchants can consider you.');
      return;
    }

    onSubmit({
      message:
        message.trim() ||
        'I would like to promote this offer. Please see my social links and channels.',
      website_url: website || null,
      social_media_links,
      promotion_methods: methods.length ? methods : ['social_media'],
      estimated_monthly_visitors: estimatedVisitors
        ? parseInt(estimatedVisitors, 10)
        : null,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-label="Close"
          onClick={onClose}
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4 z-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Join as promoter</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Share your channels so this program can consider you
                {offerTitle ? (
                  <>
                    {' '}
                    for <span className="font-medium text-violet-700">{offerTitle}</span>
                  </>
                ) : null}
                .
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website / blog
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Social media links <span className="text-red-500">*</span>
              </p>
              <p className="text-xs text-gray-500 mb-2">
                At least one social link or a website is required.
              </p>
              <div className="space-y-2">
                {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
                    <input
                      type="url"
                      value={socials[key] || ''}
                      onChange={(e) =>
                        setSocials((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">How will you promote?</p>
              <div className="flex flex-wrap gap-2">
                {['social_media', 'email', 'blogging', 'youtube', 'ppc', 'influencer'].map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMethod(m)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        methods.includes(m)
                          ? 'border-violet-600 bg-violet-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      {m.replace(/_/g, ' ')}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated monthly visitors (optional)
              </label>
              <input
                type="number"
                min="0"
                value={estimatedVisitors}
                onChange={(e) => setEstimatedVisitors(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message to the business (optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell them about your audience…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? 'Submitting…' : 'Submit join application'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AffiliateJoinModal;
