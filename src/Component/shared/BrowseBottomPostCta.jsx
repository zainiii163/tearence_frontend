import React from 'react';

/**
 * Bottom post CTA for category browse pages (Clive spec: post option at bottom).
 */
const BrowseBottomPostCta = ({
  title,
  description,
  buttonLabel,
  onPostClick,
  theme = 'purple',
}) => {
  const themes = {
    purple: {
      gradient: 'from-purple-600 via-violet-600 to-indigo-600',
      button: 'text-purple-700 hover:bg-purple-50',
      text: 'text-purple-50/95',
    },
    green: {
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      button: 'text-green-700 hover:bg-green-50',
      text: 'text-green-50/95',
    },
    red: {
      gradient: 'from-red-600 via-rose-600 to-orange-600',
      button: 'text-red-700 hover:bg-red-50',
      text: 'text-red-50/95',
    },
    amber: {
      gradient: 'from-amber-500 via-yellow-500 to-orange-500',
      button: 'text-amber-700 hover:bg-amber-50',
      text: 'text-amber-50/95',
    },
    emerald: {
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      button: 'text-emerald-700 hover:bg-emerald-50',
      text: 'text-emerald-50/95',
    },
    orange: {
      gradient: 'from-amber-500 via-orange-500 to-rose-500',
      button: 'text-amber-700 hover:bg-amber-50',
      text: 'text-amber-50/95',
    },
    blue: {
      gradient: 'from-blue-700 via-sky-600 to-cyan-600',
      button: 'text-blue-700 hover:bg-blue-50',
      text: 'text-sky-50/95',
    },
    slate: {
      gradient: 'from-[#0c1520] via-[#1a2838] to-[#2a3a2e]',
      button: 'text-[#0c1520] hover:bg-[#f3efe6]',
      text: 'text-[#f3efe6]/90',
    },
  };

  const t = themes[theme] || themes.purple;
  const isSlate = theme === 'slate';

  if (isSlate) {
    return (
      <section className="mt-10 mb-2">
        <div className="property-cta-band">
          <p className="prop-label text-[var(--prop-copper)] mb-2">List with us</p>
          <h2 className="prop-display text-3xl sm:text-4xl text-[var(--prop-stone)] mb-3">{title}</h2>
          <p className="text-sm sm:text-base text-[var(--prop-stone)]/80 max-w-lg mx-auto mb-6 font-light">
            {description}
          </p>
          <button
            type="button"
            onClick={onPostClick}
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold tracking-wide uppercase bg-[var(--prop-copper)] hover:bg-[var(--prop-copper-deep)] text-white transition-colors"
          >
            {buttonLabel}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 mb-2">
      <div className={`bg-gradient-to-r ${t.gradient} rounded-2xl p-6 sm:p-8 text-center text-white shadow-lg`}>
        <h2 className="text-xl sm:text-2xl font-extrabold mb-2">{title}</h2>
        <p className={`text-sm sm:text-base ${t.text} max-w-lg mx-auto mb-5`}>{description}</p>
        <button
          type="button"
          onClick={onPostClick}
          className={`inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-bold bg-white rounded-xl transition-colors shadow-md ${t.button}`}
        >
          {buttonLabel}
        </button>
      </div>
    </section>
  );
};

export default BrowseBottomPostCta;
