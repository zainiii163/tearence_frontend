import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiTool,
  FiMegaphone,
  FiBarChart2,
  FiMail,
  FiShare2,
  FiTarget,
  FiArrowRight,
} from 'react-icons/fi';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';

const TOOLS = [
  {
    id: 'ad-campaign-kit',
    title: 'Ad campaign kit',
    blurb: 'Brief, creative checklist, budget sheet and KPI tracker for sponsored / featured / promoted ads.',
    price: 'From $29',
    icon: FiMegaphone,
    href: '/business/templates',
    tag: 'Advertising',
  },
  {
    id: 'social-content-calendar',
    title: 'Social content calendar',
    blurb: '30-day planner for posts, Reels and affiliate hops — fillable month grid.',
    price: 'From $19',
    icon: FiShare2,
    href: '/templates/monthly-calendar-planner.html',
    tag: 'Marketing',
  },
  {
    id: 'email-promo-pack',
    title: 'Email promo pack',
    blurb: 'Launch, nurture and win-back email outlines for WWA listings and offers.',
    price: 'From $22',
    icon: FiMail,
    href: '/business/templates',
    tag: 'Marketing',
  },
  {
    id: 'affiliate-creative-pack',
    title: 'Affiliate creative pack',
    blurb: 'Hooks, CTAs and creative prompts influencers can use when promoting your offer.',
    price: 'From $24',
    icon: FiTarget,
    href: '/affiliates?postForm=true&mode=business',
    tag: 'Affiliates',
  },
  {
    id: 'seo-listing-booster',
    title: 'SEO listing booster',
    blurb: 'Title formulas, keyword checklist and schema tips for marketplace listings.',
    price: 'From $18',
    icon: FiBarChart2,
    href: '/business/templates',
    tag: 'Growth',
  },
  {
    id: 'commercial-agreement',
    title: 'Commercial agreement (dispute-ready)',
    blurb: 'B2B contract with dispute / ADR clauses — fillable HTML.',
    price: 'From $24',
    icon: FiTool,
    href: '/templates/commercial-agreement.html',
    tag: 'Legal',
  },
];

/**
 * Business tools for sale — marketing & advertising beyond templates.
 */
const BusinessToolsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <UnifiedNavbar />
      <main className="flex-1">
        <section className="border-b border-slate-200 bg-gradient-to-r from-emerald-800 to-teal-700 text-white">
          <div className="page-container py-12 sm:py-14 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 mb-2">
              World Wide Adverts
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Business tools</h1>
            <p className="mt-3 text-emerald-50/95 text-base max-w-xl">
              Marketing and advertising tools for businesses — alongside fillable templates.
              Use them from your category dashboard or buy packs here.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/my-business/dashboard?all=1"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
              >
                Open business dashboards
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/business/templates"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Templates shop
              </Link>
            </div>
          </div>
        </section>

        <section className="page-container py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <article
                  key={tool.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                    {tool.tag}
                  </span>
                  <div className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-3 text-base font-bold text-slate-900">{tool.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 flex-1">{tool.blurb}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">{tool.price}</span>
                    <Link
                      to={tool.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-800 hover:underline"
                    >
                      Open
                      <FiArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-violet-200 bg-violet-50 p-6">
            <h2 className="text-lg font-bold text-violet-950">Promote with Affiliates</h2>
            <p className="mt-1 text-sm text-violet-900/80 max-w-2xl">
              Post products and services you want promoted. Influencers apply with socials; you approve
              them from your dashboard and they get a hop link.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/affiliates?postForm=true&mode=business"
                className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
              >
                Post an affiliate offer
              </Link>
              <Link
                to="/software"
                className="rounded-lg border border-violet-300 bg-white px-4 py-2 text-sm font-semibold text-violet-900 hover:bg-violet-50"
              >
                Software &amp; calculators
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessToolsPage;
