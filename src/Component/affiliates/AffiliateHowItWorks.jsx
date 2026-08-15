import React from 'react';
import { Link } from 'react-router-dom';
import { FaLink, FaTag, FaDollarSign, FaStore } from 'react-icons/fa';

/**
 * YouTube Shopping-style explainer: brands list → affiliates hop → post/share → earn.
 */
const AffiliateHowItWorks = ({ className = '', variant = 'marketplace' }) => {
  const isAds = variant === 'ads';
  const steps = isAds
    ? [
        {
          icon: FaStore,
          title: 'Get a hop first',
          body: 'Join a Marketplace offer. You receive a unique WWA hop (/go/aff/…). You can also post an external network hop (ClickBank, Amazon, etc.).',
        },
        {
          icon: FaTag,
          title: 'Post the hop here',
          body: 'Affiliate Ads is the public feed. Paste your hop, add a title and image — visitors open the link as posted.',
        },
        {
          icon: FaLink,
          title: 'Clicks are tracked',
          body: 'A WWA hop stores a cookie for the offer’s window (e.g. 30 days) and sends the visitor to the brand’s product page.',
        },
        {
          icon: FaDollarSign,
          title: 'You earn on sales',
          body: 'If they buy in that window, commission is attributed to you. Check Dashboard → Affiliates → Earnings.',
        },
      ]
    : [
        {
          icon: FaStore,
          title: 'Brands list products',
          body: 'Businesses add an offer with commission, cookie window, and optional deals — % off, price drop, code, or a scheduled drop.',
        },
        {
          icon: FaTag,
          title: 'Join and get a hop',
          body: 'Apply once. You are approved immediately and get a unique hop link. You can join before a drop goes live.',
        },
        {
          icon: FaLink,
          title: 'Post or share the hop',
          body: 'Use “Post as Affiliate Ad” (pre-fills the hop) or share on social, email, or your site.',
        },
        {
          icon: FaDollarSign,
          title: 'Earn when they buy',
          body: 'Purchase inside the cookie window is attributed to you. Request payout from $25 in Promoter earnings.',
        },
      ];

  return (
    <section
      className={`rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white px-4 py-5 sm:px-6 mb-5 ${className}`}
    >
      <h2 className="text-sm font-bold text-slate-900 mb-1">
        {isAds ? 'How to promote here' : 'How affiliate shopping works here'}
      </h2>
      <p className="text-xs text-slate-500 mb-4 max-w-2xl">
        {isAds ? (
          <>
            This page is the ads feed. Programs to join live on{' '}
            <Link to="/affiliates/marketplace" className="font-semibold text-primary hover:underline">
              Marketplace
            </Link>
            . Same model as shopping affiliates: hop link → cookie → commission.
          </>
        ) : (
          <>
            Brands list products and deals. You get a hop, tag/promote it, and earn if a viewer buys
            within the cookie window.
          </>
        )}
      </p>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
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
