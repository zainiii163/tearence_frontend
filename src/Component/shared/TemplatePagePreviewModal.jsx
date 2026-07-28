import React, { useMemo, useState } from 'react';
import { FiX, FiDownload, FiLock } from 'react-icons/fi';
import { getTemplatePack } from '../../data/templatePackRegistry';

/**
 * Clive: preview = page titles + tiny teaser of a page (not the whole document).
 * Full template unlocks after purchase/download.
 */
const TemplatePagePreviewModal = ({ item, onClose, onBuy, buying = false }) => {
  const pack = useMemo(
    () => getTemplatePack(item?.file || item?.title),
    [item]
  );
  const [activeIdx, setActiveIdx] = useState(() => {
    const firstReady = pack.pages.findIndex((p) => p.ready);
    return firstReady >= 0 ? firstReady : 0;
  });

  const active = pack.pages[activeIdx] || null;
  const buyKey = item?.id || item?.slug || item?.title;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-preview-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Fillable template · page titles preview
            </p>
            <h4 id="template-preview-title" className="text-sm font-bold text-gray-900 truncate">
              {item?.title || pack.title}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
            aria-label="Close preview"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row min-h-0 flex-1 overflow-hidden">
          {/* Page titles */}
          <ol className="sm:w-44 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100 max-h-40 sm:max-h-none overflow-y-auto py-2">
            {pack.pages.map((page, i) => {
              const selected = i === activeIdx;
              return (
                <li key={`${page.title}-${i}`}>
                  <button
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={`w-full text-left px-3 py-1.5 text-[12px] flex items-start gap-2 ${
                      selected
                        ? 'bg-blue-50 text-blue-900 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-gray-400 w-5 shrink-0 pt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-snug">
                      {page.title}
                      {!page.ready && (
                        <span className="block text-[10px] font-normal text-gray-400">
                          Title only
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Tiny teaser — clipped + faded, never full page */}
          <div className="flex-1 min-w-0 p-3 flex flex-col">
            <p className="text-[11px] font-semibold text-gray-600 mb-2 shrink-0">
              {active?.title || 'Select a page'}
            </p>

            {active?.ready && active.previewUrl ? (
              <div className="relative rounded-lg border border-gray-200 bg-gray-50 overflow-hidden h-44 sm:h-52">
                <iframe
                  title={`Preview: ${active.title}`}
                  src={active.previewUrl}
                  className="w-full h-[420px] border-0 pointer-events-none origin-top-left scale-[0.92]"
                  loading="lazy"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, #f9fafb 15%, rgba(249,250,251,0.85) 55%, transparent)',
                  }}
                />
                <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-semibold text-gray-500 flex items-center justify-center gap-1">
                  <FiLock className="h-3 w-3" />
                  Preview only · buy to download the full template
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 h-44 sm:h-52 flex flex-col items-center justify-center px-4 text-center">
                <p className="text-sm font-semibold text-gray-800">{active?.title}</p>
                <p className="text-xs text-gray-500 mt-1.5 max-w-[220px]">
                  Page content is being prepared. Buy unlocks the full downloadable template.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            type="button"
            disabled={buying}
            onClick={() => onBuy?.(item)}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 disabled:opacity-60"
          >
            <FiDownload className="h-3.5 w-3.5" />
            {buying && buyKey
              ? 'Buying…'
              : 'Buy & download full template'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePagePreviewModal;
