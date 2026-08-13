import React from 'react';
import { FaLink, FaCookieBite, FaDollarSign } from 'react-icons/fa';

/**
 * Ahrefs-model explainer: unique link → cookie window → commission.
 */
const AffiliateHowItWorks = ({ className = '' }) => {
  const steps = [
    {
      icon: FaLink,
      title: 'Join a program',
      body: 'Apply to promote a merchant offer. When approved, you get a unique WWA hop link.',
    },
    {
      icon: FaCookieBite,
      title: 'Share your hop link',
      body: 'Visitors click your link. A cookie is stored for the offer’s cookie window (e.g. 1–30 days).',
    },
    {
      icon: FaDollarSign,
      title: 'Earn commission',
      body: 'If they buy within that window, the sale is attributed to you and you earn the commission.',
    },
  ];

  return (
    <section
      className={`rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white px-4 py-5 sm:px-6 mb-5 ${className}`}
    >
      <h2 className="text-sm font-bold text-slate-900 mb-1">How affiliate marketing works here</h2>
      <p className="text-xs text-slate-500 mb-4 max-w-2xl">
        Same model as classic affiliate programs: unique link, cookie attribution, then commission on
        purchase.
      </p>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li
            key={title}
            className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-700 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <Icon className="h-3.5 w-3.5 text-violet-700" />
              <h3 className="text-xs font-semibold text-slate-900">{title}</h3>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default AffiliateHowItWorks;
