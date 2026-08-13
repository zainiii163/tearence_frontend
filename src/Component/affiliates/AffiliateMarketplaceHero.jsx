import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaBullhorn, FaShieldAlt } from 'react-icons/fa';

/**
 * Compact ClickBank-style marketplace header — keep offers above the fold.
 */
const AffiliateMarketplaceHero = ({
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  onSellClick,
  onPromoteScroll,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#0b1c2c] text-white">
      <div
        className="absolute inset-0 opacity-25 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=60')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(2,28,48,0.96) 0%, rgba(3,106,161,0.78) 55%, rgba(11,28,44,0.96) 100%)',
        }}
      />

      <div className="relative page-container px-4 py-4 sm:py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-200/90 mb-1">
              Affiliate marketplace
            </p>
            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
              Businesses sell. Affiliates earn.
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-200/90 leading-snug max-w-xl">
              Browse by gravity &amp; commission, get a hop link, or list your product/service for
              promoters.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={onPromoteScroll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              <FaBullhorn className="h-3 w-3 text-sky-200" />
              Browse offers
            </button>
            <button
              type="button"
              onClick={onSellClick}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
            >
              <FaStore className="h-3 w-3" />
              List product / service
            </button>
          </div>
        </div>

        <form
          className="mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit?.();
          }}
        >
          <div className="flex max-w-2xl rounded-lg overflow-hidden border border-white/20 bg-white shadow-sm">
            <input
              type="search"
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search products, services, niches…"
              className="flex-1 min-w-0 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
          <span className="inline-flex items-center gap-1">
            <FaShieldAlt className="h-2.5 w-2.5 text-emerald-400" />
            Hop link · cookie · commission
          </span>
          <Link to="/affiliates/links" className="font-semibold text-sky-200 hover:text-white">
            Link ads
          </Link>
          <Link
            to="/dashboard?tab=affiliates"
            className="font-semibold text-sky-200 hover:text-white"
          >
            My dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AffiliateMarketplaceHero;
