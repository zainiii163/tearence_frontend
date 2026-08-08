import React, { useState } from 'react';
import { Check, Clock, Eye, TrendingUp, Star } from 'lucide-react';

const COUNTRIES = [
  'USA',
  'UK',
  'UAE',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Japan',
  'China',
  'India',
];

const BANNER_SIZES = [
  { value: '728x90', label: '728×90 Leaderboard' },
  { value: '300x250', label: '300×250 Medium Rectangle' },
  { value: '160x600', label: '160×600 Skyscraper' },
  { value: '970x250', label: '970×250 Billboard' },
  { value: '468x60', label: '468×60 Classic Banner' },
  { value: '1080x1080', label: '1080×1080 Square' },
  { value: '150x150', label: '150×150 Small Square' },
  { value: '200x400', label: '200×400 Half Page' },
  { value: '100x600', label: '100×600 Narrow Skyscraper' },
  { value: '100x400', label: '100×400 Narrow Tall' },
  { value: '100x200', label: '100×200 Narrow Button' },
];

const BADGE_TYPES = [
  { value: 'promoted', label: 'Promoted' },
  { value: 'featured', label: 'Featured' },
  { value: 'sponsored', label: 'Sponsored' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent', icon: Clock },
  { value: 'views', label: 'Most Viewed', icon: Eye },
  { value: 'ctr', label: 'Trending', icon: TrendingUp },
  { value: 'rating', label: 'Highest Rated', icon: Star },
];

const Triangle = ({ open }) => (
  <span
    className="inline-block w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-gray-900 shrink-0 transition-transform duration-200"
    style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
    aria-hidden="true"
  />
);

const FilterSection = ({ id, title, open, onToggle, children }) => (
  <div className="border-b border-gray-200">
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="w-full flex items-center gap-2.5 py-3.5 text-left hover:bg-gray-50/80 px-0.5"
      aria-expanded={open}
    >
      <Triangle open={open} />
      <span className="text-[15px] font-medium text-gray-900">{title}</span>
    </button>
    {open && <div className="pb-3 pl-5 pr-0.5">{children}</div>}
  </div>
);

const optionClass = (active) =>
  `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
    active
      ? 'bg-[#1e3a5f] text-white border border-[#1e3a5f]'
      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
  }`;

/**
 * Banner-adverts–specific filter fields for BrowseFilterLayout.
 * Triangle accordion style matches other browse pages; options are banner-only.
 */
const BannerFilters = ({
  filters = {},
  onFilterChange,
  categories = [],
  categoriesLoading = false,
  showCategory = true,
}) => {
  const [openSections, setOpenSections] = useState({
    category: false,
    country: false,
    size: false,
    badge: false,
    more: false,
    sort: true,
  });

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const category = filters.category || 'all';
  const country = filters.country || 'all';
  const bannerSize = filters.bannerSize || 'all';
  const badge = filters.badge || 'all';
  const verified = Boolean(filters.verified);
  const sortBy = filters.sortBy || 'recent';

  return (
    <div className="space-y-0">
      {showCategory && (
        <FilterSection
          id="category"
          title="Category"
          open={openSections.category}
          onToggle={toggleSection}
        >
          <div className="space-y-1 max-h-56 overflow-y-auto">
            <button
              type="button"
              onClick={() => onFilterChange('category', 'all')}
              className={optionClass(category === 'all')}
            >
              <span>All categories</span>
              {category === 'all' && <Check className="w-4 h-4 shrink-0" />}
            </button>
            {categoriesLoading ? (
              <p className="text-xs text-gray-500 py-2">Loading categories…</p>
            ) : (
              categories.map((cat) => {
                const id = String(cat.slug || cat.id);
                const active = String(category) === id || String(category) === String(cat.id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onFilterChange('category', cat.slug || cat.id)}
                    className={optionClass(active)}
                  >
                    <span className="truncate pr-2">
                      {cat.name}
                      {cat.active_banners_count != null ? (
                        <span className={`ml-1 ${active ? 'text-white/70' : 'text-gray-400'}`}>
                          ({cat.active_banners_count})
                        </span>
                      ) : null}
                    </span>
                    {active && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </FilterSection>
      )}

      <FilterSection
        id="country"
        title="Country"
        open={openSections.country}
        onToggle={toggleSection}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto">
          <button
            type="button"
            onClick={() => onFilterChange('country', 'all')}
            className={optionClass(country === 'all')}
          >
            <span>All countries</span>
            {country === 'all' && <Check className="w-4 h-4 shrink-0" />}
          </button>
          {COUNTRIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onFilterChange('country', c)}
              className={optionClass(country === c)}
            >
              <span>{c}</span>
              {country === c && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        id="size"
        title="Banner Size"
        open={openSections.size}
        onToggle={toggleSection}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto">
          <button
            type="button"
            onClick={() => onFilterChange('bannerSize', 'all')}
            className={optionClass(bannerSize === 'all')}
          >
            <span>All sizes</span>
            {bannerSize === 'all' && <Check className="w-4 h-4 shrink-0" />}
          </button>
          {BANNER_SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onFilterChange('bannerSize', s.value)}
              className={optionClass(bannerSize === s.value)}
            >
              <span>{s.label}</span>
              {bannerSize === s.value && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        id="badge"
        title="Badge Type"
        open={openSections.badge}
        onToggle={toggleSection}
      >
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange('badge', 'all')}
            className={optionClass(badge === 'all')}
          >
            <span>All badges</span>
            {badge === 'all' && <Check className="w-4 h-4 shrink-0" />}
          </button>
          {BADGE_TYPES.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => onFilterChange('badge', b.value)}
              className={optionClass(badge === b.value)}
            >
              <span>{b.label}</span>
              {badge === b.value && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        id="more"
        title="More options"
        open={openSections.more}
        onToggle={toggleSection}
      >
        <label className="flex items-center gap-3 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={verified}
            onChange={(e) => onFilterChange('verified', e.target.checked)}
            className="w-4 h-4 text-[#1e3a5f] border-gray-300 rounded focus:ring-[#1e3a5f]"
          />
          <span className="text-sm text-gray-700">Verified businesses only</span>
        </label>
      </FilterSection>

      <FilterSection
        id="sort"
        title="Sort By"
        open={openSections.sort}
        onToggle={toggleSection}
      >
        <div className="space-y-1">
          {SORT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = sortBy === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFilterChange('sortBy', option.value)}
                className={optionClass(active)}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" />
                  {option.label}
                </span>
                {active && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
};

export default BannerFilters;
