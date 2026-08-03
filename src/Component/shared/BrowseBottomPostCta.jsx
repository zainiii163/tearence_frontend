import React from 'react';

/**
 * Bottom post CTA — only the button is clickable.
 * Prefer short page-specific labels; avoid long marketing copy.
 */
const BrowseBottomPostCta = ({
  title,
  description,
  buttonLabel,
  onPostClick,
  theme = 'purple',
  /** Button only — no gradient marketing box */
  buttonOnly = false,
  compact = false,
}) => {
  const themes = {
    purple: {
      gradient: 'from-purple-600 via-violet-600 to-indigo-600',
      button: 'text-purple-700 hover:bg-purple-50',
      solid: 'bg-purple-700 hover:bg-purple-800 text-white',
      text: 'text-purple-50/95',
    },
    green: {
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      button: 'text-green-700 hover:bg-green-50',
      solid: 'bg-green-700 hover:bg-green-800 text-white',
      text: 'text-green-50/95',
    },
    red: {
      gradient: 'from-red-600 via-rose-600 to-orange-600',
      button: 'text-red-700 hover:bg-red-50',
      solid: 'bg-red-700 hover:bg-red-800 text-white',
      text: 'text-red-50/95',
    },
    amber: {
      gradient: 'from-amber-500 via-yellow-500 to-orange-500',
      button: 'text-amber-700 hover:bg-amber-50',
      solid: 'bg-amber-600 hover:bg-amber-700 text-white',
      text: 'text-amber-50/95',
    },
    emerald: {
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      button: 'text-emerald-700 hover:bg-emerald-50',
      solid: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      text: 'text-emerald-50/95',
    },
    orange: {
      gradient: 'from-amber-500 via-orange-500 to-rose-500',
      button: 'text-amber-700 hover:bg-amber-50',
      solid: 'bg-orange-600 hover:bg-orange-700 text-white',
      text: 'text-amber-50/95',
    },
    blue: {
      gradient: 'from-blue-700 via-sky-600 to-cyan-600',
      button: 'text-blue-700 hover:bg-blue-50',
      solid: 'bg-blue-700 hover:bg-blue-800 text-white',
      text: 'text-sky-50/95',
    },
    slate: {
      gradient: 'from-[#0c1520] via-[#1a2838] to-[#2a3a2e]',
      button: 'text-[#0c1520] hover:bg-[#f3efe6]',
      solid: 'bg-[var(--prop-copper)] hover:bg-[var(--prop-copper-deep)] text-white',
      text: 'text-[#f3efe6]/90',
    },
  };

  const t = themes[theme] || themes.purple;
  const isSlate = theme === 'slate';
  const label = buttonLabel || title || 'Post';

  // Page-specific button only — no marketing box / copy
  if (buttonOnly || (!title && !description && !compact)) {
    return (
      <section className="mt-8 mb-2 flex justify-center">
        <button
          type="button"
          onClick={onPostClick}
          className={`inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-bold rounded-xl shadow-md transition-colors ${t.solid}`}
        >
          {label}
        </button>
      </section>
    );
  }

  if (compact) {
    return (
      <section className="mt-4 mb-1 flex justify-center">
        <button
          type="button"
          onClick={onPostClick}
          className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-lg shadow-sm transition-colors ${t.solid}`}
        >
          {label}
        </button>
      </section>
    );
  }

  if (isSlate) {
    return (
      <section className="mt-10 mb-2">
        <div className="property-cta-band">
          {title && (
            <h2 className="prop-display text-2xl sm:text-3xl text-[var(--prop-stone)] mb-4">{title}</h2>
          )}
          <button
            type="button"
            onClick={onPostClick}
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold tracking-wide uppercase bg-[var(--prop-copper)] hover:bg-[var(--prop-copper-deep)] text-white transition-colors"
          >
            {label}
          </button>
        </div>
      </section>
    );
  }

  // Optional short title only — description omitted to keep copy light
  return (
    <section className="mt-10 mb-2">
      <div
        className={`bg-gradient-to-r ${t.gradient} rounded-2xl px-6 py-6 sm:px-8 sm:py-7 text-center text-white shadow-lg`}
        role="presentation"
      >
        {title && <h2 className="text-lg sm:text-xl font-extrabold mb-4">{title}</h2>}
        <button
          type="button"
          onClick={onPostClick}
          className={`inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-bold bg-white rounded-xl transition-colors shadow-md ${t.button}`}
        >
          {label}
        </button>
      </div>
    </section>
  );
};

export default BrowseBottomPostCta;
