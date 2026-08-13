import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
  REPOST_FORMAT_PATHS,
  REPOST_PREFILL_KEY,
  writeRepostPrefill,
} from '../../utils/repostPrefill';

const FORMATS = [
  {
    id: 'free',
    label: 'Free listing',
    hint: 'Standard listing / refresh as free',
    path: REPOST_FORMAT_PATHS.free,
  },
  {
    id: 'paid',
    label: 'Paid listing',
    hint: 'Paid plan / duration for stronger placement',
    path: REPOST_FORMAT_PATHS.paid,
  },
  {
    id: 'featured',
    label: 'Featured',
    hint: 'Featured adverts channel',
    path: REPOST_FORMAT_PATHS.featured,
  },
  {
    id: 'sponsored',
    label: 'Sponsored',
    hint: 'Sponsored adverts placement',
    path: REPOST_FORMAT_PATHS.sponsored,
  },
  {
    id: 'promoted',
    label: 'Promoted',
    hint: 'Promoted adverts placement',
    path: REPOST_FORMAT_PATHS.promoted,
  },
  {
    id: 'banner',
    label: 'Banner',
    hint: 'Site banner advertising',
    path: REPOST_FORMAT_PATHS.banner,
  },
  {
    id: 'affiliate',
    label: 'Affiliate offer',
    hint: 'Promoters earn the % you offer per sale',
    path: REPOST_FORMAT_PATHS.affiliate,
  },
];

/**
 * One advert → many formats (free/paid/sponsored/featured/promoted/banner/affiliate).
 */
export default function MultiFormatRepostWizard({ source, onClose }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(() => {
    const skip = source?.format;
    return FORMATS.filter((f) => f.id !== skip).slice(0, 2).map((f) => f.id);
  });

  const title = source?.title || '';
  const description = source?.description || '';

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const canContinue = selected.length > 0;

  const prefill = useMemo(
    () => ({
      source_format: source?.format || null,
      source_id: source?.id || null,
      title: title || undefined,
      description: description || undefined,
      product_service_title: title || undefined,
      overview: description || undefined,
      selected_formats: selected,
      created_at: new Date().toISOString(),
    }),
    [source, title, description, selected]
  );

  const handleContinue = () => {
    if (!canContinue) {
      toast.error('Select at least one format');
      return;
    }
    writeRepostPrefill(prefill, selected);
    toast.success(
      `Opening ${selected.length} format${selected.length > 1 ? 's' : ''} — complete each form (and payment where required).`
    );
    const first = FORMATS.find((f) => f.id === selected[0]);
    onClose?.();
    if (first?.path) {
      navigate(first.path, {
        state: { repostPrefill: prefill, formatsQueue: selected },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal,300)] flex items-center justify-center bg-black/45 p-4">
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-labelledby="repost-title"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="repost-title" className="text-lg font-semibold text-slate-900">
              Repost in more formats
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Use the same advert as free, paid, sponsored, featured, promoted, banner, or
              affiliate to increase reach. You can select multiple formats.
            </p>
            {title ? (
              <p className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">“{title}”</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-5 py-4 space-y-2 max-h-[55vh] overflow-y-auto">
          {FORMATS.map((fmt) => {
            const on = selected.includes(fmt.id);
            const isCurrent = source?.format === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                disabled={isCurrent}
                onClick={() => toggle(fmt.id)}
                className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  isCurrent
                    ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                    : on
                      ? 'border-primary/40 bg-[hsl(199_40%_97%)]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span
                  className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    on ? 'border-primary bg-primary text-white' : 'border-slate-300'
                  }`}
                >
                  {on ? <FaCheck className="h-3 w-3" /> : null}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {fmt.label}
                    {isCurrent ? ' (current)' : ''}
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">{fmt.hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Continue ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export { REPOST_PREFILL_KEY as PREFILL_KEY };
