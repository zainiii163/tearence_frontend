import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import donationAPI from '../api/donationAPI';
import DonationPostFormModal from '../Component/donation/DonationPostFormModal';
import BrowseMarketplaceHero from '../Component/shared/BrowseMarketplaceHero';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import MarketplaceCategoryCards from '../Component/shared/MarketplaceCategoryCards';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { getCategoryTheme } from '../constants/categoryThemes';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';

const HERO_BG =
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1920&q=80';

const FALLBACK_CATEGORIES = [
  { id: 'medical', name: 'Medical', slug: 'medical' },
  { id: 'education', name: 'Education', slug: 'education' },
  { id: 'disaster', name: 'Disaster Relief', slug: 'disaster' },
  { id: 'community', name: 'Community', slug: 'community' },
  { id: 'animals', name: 'Animals', slug: 'animals' },
  { id: 'environment', name: 'Environment', slug: 'environment' },
  { id: 'other', name: 'Other', slug: 'other' },
];

/** Map legacy frontend slugs → Filament/API category keys */
const CATEGORY_ALIASES = {
  'disaster-relief': 'disaster',
  healthcare: 'medical',
  'animal-welfare': 'animals',
  humanitarian: 'community',
  children: 'community',
  'food-security': 'community',
  'water-sanitation': 'community',
  'community-development': 'community',
  'international-aid': 'community',
  religious: 'other',
};

const DonationsPage = () => {
  const { requireAuth } = useAuthRedirect();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = getCategoryTheme('donations');

  useEffect(() => {
    if (searchParams.get('postForm') === 'true') {
      if (requireAuth(null, 'You must be logged in to create a donation campaign.')) {
        setShowPostForm(true);
      }
    }
  }, [searchParams, requireAuth]);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await donationAPI.getDonations({
        per_page: 48,
        category:
          selectedCategory !== 'all'
            ? CATEGORY_ALIASES[selectedCategory] || selectedCategory
            : undefined,
        search: searchQuery || undefined,
      });
      const rows = res?.data?.data || res?.data || res || [];
      setCampaigns(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Failed to load donation campaigns');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const categories = useMemo(() => {
    const map = new Map();
    for (const c of FALLBACK_CATEGORIES) {
      map.set(c.slug, { ...c, count: 0 });
    }
    for (const row of campaigns) {
      const raw = String(row.category || row.category_slug || '').toLowerCase();
      const slug = CATEGORY_ALIASES[raw] || raw;
      if (!slug) continue;
      const existing = map.get(slug) || {
        id: slug,
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
        slug,
        count: 0,
      };
      existing.count += 1;
      map.set(slug, existing);
    }
    return Array.from(map.values());
  }, [campaigns]);

  const handlePostDonation = () => {
    if (requireAuth('/donations?postForm=true', 'You must be logged in to create a donation campaign.')) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  const handleDonationSuccess = () => {
    setShowPostForm(false);
    setSearchParams({});
    loadCampaigns();
  };

  return (
    <CategoryPageShell
      categoryId="donations"
      backHref="/"
      hero={
        <BrowseMarketplaceHero
          title="Charities & Donations"
          eyebrow=""
          subtitle="Support real campaigns — post your cause and accept donations."
          imageUrl={HERO_BG}
          theme={theme.heroTheme}
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onSearchSubmit={() => loadCampaigns()}
          searchPlaceholder="Search campaigns…"
        />
      }
      categoryGrid={
        <MarketplaceCategoryCards
          categories={categories}
          selectedId={selectedCategory}
          title="Causes"
          subtitle="Browse live donation campaigns by cause."
          countLabel="campaigns"
          getId={(c) => c.slug || c.id}
          getLabel={(c) => c.name}
          getSlug={(c) => c.slug || c.id}
          getCount={(c) => c.count ?? null}
          onSelect={(cat, id) => {
            const next = String(id || cat.slug || cat.id);
            setSelectedCategory(next === String(selectedCategory) ? 'all' : next);
          }}
          accentRing="ring-pink-500"
          accentBorder="border-pink-300"
          hoverBorder="hover:border-pink-200"
          hoverTitle="group-hover:text-pink-700"
          hoverArrow="group-hover:bg-pink-100 group-hover:text-pink-700"
          initialVisible={12}
        />
      }
      bottomCta={{
        buttonLabel: 'Start your campaign',
        onPostClick: handlePostDonation,
        theme: theme.ctaTheme,
      }}
      afterContent={
        showPostForm ? (
          <DonationPostFormModal
            onClose={() => {
              setShowPostForm(false);
              setSearchParams({});
            }}
            onSuccess={handleDonationSuccess}
          />
        ) : null
      }
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-r-transparent" />
          <p className="mt-3 text-sm text-gray-600">Loading campaigns…</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
          <FaHeart className="mx-auto mb-3 h-10 w-10 text-pink-300" />
          <h3 className="text-lg font-semibold text-gray-900">No campaigns found</h3>
          <p className="mt-1 text-sm text-gray-600">Be the first to post a donation campaign.</p>
          <button
            type="button"
            onClick={handlePostDonation}
            className="mt-4 rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Start your campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((c) => {
            const img =
              resolveStorageUrl(c.cover_image || c.image || c.thumbnail) ||
              c.cover_image ||
              null;
            const raised = Number(c.raised_amount || c.current_amount || 0);
            const goal = Number(c.goal_amount || c.target_amount || 0);
            const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

            return (
              <button
                key={c.id || c.slug}
                type="button"
                onClick={() => navigate(`/donations/${c.id || c.slug}`)}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-40 bg-pink-50">
                  {img ? (
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-pink-300">
                      <FaHeart className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-pink-600">
                    {c.category || 'Campaign'}
                  </p>
                  <h3 className="line-clamp-2 font-semibold text-gray-900">{c.title}</h3>
                  <p className="line-clamp-2 text-sm text-gray-600">{c.description}</p>
                  {(c.city || c.country) && (
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <FaMapMarkerAlt />
                      {[c.city, c.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  <div className="pt-1">
                    <div className="mb-1 flex justify-between text-xs text-gray-600">
                      <span>${raised.toLocaleString()} raised</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-pink-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        Prefer the legacy form?{' '}
        <Link to="/create-donation" className="font-semibold text-pink-700 hover:underline">
          Open create donation
        </Link>
      </p>
    </CategoryPageShell>
  );
};

export default DonationsPage;
