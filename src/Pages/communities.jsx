import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaUsers, FaHome, FaHeart, FaCompass, FaBookmark, FaBuilding } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import CommunitiesLeftRail from '../Component/communities/CommunitiesLeftRail';
import CommunitiesFeed from '../Component/communities/CommunitiesFeed';
import CommunitiesRightRail from '../Component/communities/CommunitiesRightRail';
import CommunitiesDiscoverPanel from '../Component/communities/CommunitiesDiscoverPanel';
import GlobalSearch from '../Component/communities/GlobalSearch';
import CreationModal from '../Component/communities/CreationModal';
import SocialStoriesStrip from '../Component/communities/SocialStoriesStrip';
import SocialComposerCard from '../Component/communities/SocialComposerCard';
import SocialHubShortcuts from '../Component/communities/SocialHubShortcuts';
import { communitiesAPI } from '../api/communities';
import { businessHrefFromCommunity } from '../utils/businessSocial';
import '../styles/communities.css';

const extractPosts = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const MOBILE_NAV = [
  { id: 'feed', label: 'Home', icon: FaHome },
  { id: 'foryou', label: 'For You', icon: FaHeart },
  { id: 'following', label: 'Following', icon: FaUsers },
  { id: 'local', label: 'Local', icon: FaCompass },
];

const resolveViewMode = (pathname, communityId) => {
  if (pathname.includes('/communities/saved')) return 'saved';
  if (pathname.includes('/communities/discover')) return 'discover';
  if (pathname.includes('/communities/my-communities')) return 'my-communities';
  if (communityId) return 'community';
  return 'feed';
};

const CommunitiesHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: communityId } = useParams();
  const viewMode = resolveViewMode(location.pathname, communityId);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAdsOnly, setShowAdsOnly] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [communityMeta, setCommunityMeta] = useState(null);
  const feedScrollRef = useRef(null);
  const shellRef = useRef(null);
  const hubRef = useRef(null);
  const [isAppShell, setIsAppShell] = useState(false);

  // Sync tab when landing on /communities
  useEffect(() => {
    if (viewMode === 'feed') {
      // keep activeTab as-is for home feed variants
    } else if (viewMode === 'saved') {
      setActiveTab('saved');
    }
  }, [viewMode]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (location.pathname !== '/communities') {
      navigate('/communities');
    }
  };

  const loadFeed = useCallback(async () => {
    if (viewMode === 'discover' || viewMode === 'my-communities') {
      setLoading(false);
      setPosts([]);
      return;
    }

    setLoading(true);
    try {
      const params = {
        sort: sortBy,
        post_type: showAdsOnly ? 'ad_thread' : undefined,
        search: searchQuery || undefined,
        per_page: 24,
      };

      let response;

      if (viewMode === 'saved') {
        response = await communitiesAPI.getSavedPosts(params);
      } else if (viewMode === 'community' && communityId) {
        response = await communitiesAPI.getPosts({
          ...params,
          community_id: communityId,
          community_slug: communityId,
        });
        try {
          const meta = await communitiesAPI.getCommunity(communityId);
          setCommunityMeta(meta?.data || meta);
        } catch {
          setCommunityMeta(null);
        }
      } else {
        try {
          if (activeTab === 'foryou') {
            response = await communitiesAPI.getForYouFeed(params);
          } else if (activeTab === 'following') {
            response = await communitiesAPI.getFollowingFeed(params);
          } else if (activeTab === 'local') {
            response = await communitiesAPI.getLocalFeed(params);
          } else {
            response = await communitiesAPI.getPosts(params);
          }
        } catch (tabErr) {
          if (activeTab !== 'feed') {
            console.warn('Personalized feed failed, falling back to main feed', tabErr);
            response = await communitiesAPI.getPosts(params);
          } else {
            throw tabErr;
          }
        }
      }

      const root = response?.data ?? response;
      let list = extractPosts(root?.data ? root : { data: root });

      // Client-side category filter by slug/name (API category_id is numeric)
      if (selectedCategory) {
        const key = String(selectedCategory).toLowerCase();
        list = list.filter((p) => {
          const slug = String(p.category?.slug || '').toLowerCase();
          const name = String(p.category?.name || p.category || '').toLowerCase();
          const tags = (p.tags || []).map((t) => String(t).toLowerCase());
          return (
            slug.includes(key) ||
            name.includes(key.replace(/-/g, ' ')) ||
            tags.some((t) => t.includes(key))
          );
        });
      }

      setPosts(list);
    } catch (error) {
      console.error('Error loading feed:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [
    sortBy,
    selectedCategory,
    showAdsOnly,
    activeTab,
    searchQuery,
    viewMode,
    communityId,
  ]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px) and (min-height: 720px)');
    const apply = () => setIsAppShell(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    window.addEventListener('resize', apply);
    return () => {
      mq.removeEventListener?.('change', apply);
      window.removeEventListener('resize', apply);
    };
  }, []);

  useEffect(() => {
    const handleOpenCreationModal = (event) => {
      const { type, data } = event.detail;
      setModalType(type === 'post' ? 'discussion' : type);
      setModalData(data);
      setShowCreateModal(true);
    };
    window.addEventListener('open-creation-modal', handleOpenCreationModal);
    return () => window.removeEventListener('open-creation-modal', handleOpenCreationModal);
  }, []);

  useEffect(() => {
    if (!isAppShell) return undefined;

    const onWheel = (e) => {
      const feed = feedScrollRef.current;
      if (!feed) return;

      const pageY = window.scrollY || document.documentElement.scrollTop || 0;
      const atPageTop = pageY <= 2;
      const { scrollTop, scrollHeight, clientHeight } = feed;
      const atFeedBottom = scrollTop + clientHeight >= scrollHeight - 3;
      const atFeedTop = scrollTop <= 2;
      const overFeed = feed.contains(e.target);

      if (!atPageTop) {
        if (overFeed) {
          e.preventDefault();
          window.scrollBy(0, e.deltaY);
        }
        return;
      }

      if (!overFeed && !shellRef.current?.contains(e.target)) return;

      if (e.deltaY > 0 && atFeedBottom) {
        e.preventDefault();
        window.scrollBy(0, e.deltaY);
        return;
      }

      if (e.deltaY < 0 && atFeedTop) {
        return;
      }

      if (overFeed) return;

      if (shellRef.current?.contains(e.target)) {
        e.preventDefault();
        if (e.deltaY > 0 && atFeedBottom) {
          window.scrollBy(0, e.deltaY);
        } else {
          feed.scrollTop += e.deltaY;
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [isAppShell]);

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setModalType(null);
    setModalData(null);
  };

  const handleCreationSuccess = () => {
    handleCloseModal();
    loadFeed();
  };

  const topicStats = useMemo(() => {
    const counts = {};
    posts.forEach((p) => {
      (p.tags || []).forEach((tag) => {
        const key = String(tag).replace(/^#/, '');
        if (!key) return;
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ id: name, name: `#${name}`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [posts]);

  const showFeed =
    viewMode === 'feed' ||
    viewMode === 'saved' ||
    viewMode === 'community' ||
    activeTab;

  const communityName =
    communityMeta?.name ||
    posts[0]?.communities?.[0]?.name ||
    posts[0]?.primary_community?.[0]?.name ||
    null;

  const { logIn } = useSelector((store) => store.auth || {});

  const openCreate = (type = 'discussion') => {
    const mapped =
      type === 'post' ? 'discussion' : type === 'poll' ? 'poll' : type;
    setModalType(mapped);
    setShowCreateModal(true);
  };

  return (
    <div
      ref={hubRef}
      className={`communities-hub communities-hub--app social-hub${isAppShell ? ' is-app-shell' : ''}`}
    >
      <UnifiedNavbar showBackButton backHref="/" />

      <header className="social-hub-topbar">
        <div className="page-container social-hub-topbar-inner">
          <div className="min-w-0">
            <p className="social-hub-kicker">Community member</p>
            <h1 className="social-hub-heading">Social Hub</h1>
            <p className="social-hub-login-line">
              {logIn
                ? 'Share photos, videos, and conversations with the Worldwide Adverts community.'
                : 'Log in to join the community'}
            </p>
          </div>
          <div className="social-hub-topbar-actions">
            <div className="w-40 sm:w-52 hidden sm:block">
              <GlobalSearch onSelectPostSearch={setSearchQuery} compact />
            </div>
            {!logIn && (
              <Link to="/Login" className="social-hub-login-btn">
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="communities-hub-shell" ref={shellRef}>
        <div className="page-container pt-2 pb-1 flex sm:hidden">
          <div className="w-full">
            <GlobalSearch onSelectPostSearch={setSearchQuery} compact />
          </div>
        </div>

        {showCreateModal && (
          <CreationModal
            isOpen={showCreateModal}
            onClose={handleCloseModal}
            type={modalType}
            onSuccess={handleCreationSuccess}
            data={modalData}
          />
        )}

        <div className="communities-hub-body page-container">
          <div className="communities-mobile-only space-y-2 mb-3 shrink-0">
            <div className="communities-mobile-nav" role="tablist" aria-label="Feed views">
              {MOBILE_NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === item.id && viewMode === 'feed'}
                  onClick={() => handleTabChange(item.id)}
                  className={`communities-mobile-nav-item ${
                    activeTab === item.id && viewMode === 'feed' ? 'is-active' : ''
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="communities-mobile-links">
              <Link to="/communities/my-communities">Groups</Link>
              <Link to="/communities/discover">Discover</Link>
              <Link to="/communities/saved">
                <span className="inline-flex items-center gap-1">
                  <FaBookmark className="h-2.5 w-2.5" /> Saved
                </span>
              </Link>
            </div>
          </div>

          <div className="communities-hub-grid">
            <aside className="communities-hub-aside communities-hub-aside--desktop">
              <div className="communities-hub-aside-inner">
                <CommunitiesLeftRail
                  activeTab={viewMode === 'feed' ? activeTab : viewMode}
                  onTabChange={handleTabChange}
                  selectedCategory={selectedCategory}
                  onCategorySelect={(cat) => {
                    setSelectedCategory(cat);
                    if (location.pathname !== '/communities') navigate('/communities');
                  }}
                />
              </div>
            </aside>

            <main className="communities-hub-center min-w-0">
              {viewMode === 'discover' || viewMode === 'my-communities' ? (
                <CommunitiesDiscoverPanel mode={viewMode} />
              ) : (
                <>
                  {viewMode !== 'saved' && (
                    <>
                      <SocialComposerCard onOpenCreate={openCreate} />
                      <SocialStoriesStrip onCreate={() => openCreate('discussion')} />
                    </>
                  )}
                  {viewMode === 'community' && communityName && (
                    <div className="communities-feed-toolbar mb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">
                        {communityMeta?.business || communityMeta?.business_id
                          ? 'Business Social Hub'
                          : 'Community'}
                      </p>
                      <h2 className="com-display text-xl text-slate-900">{communityName}</h2>
                      {communityMeta?.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {communityMeta.description}
                        </p>
                      )}
                      {(communityMeta?.business || communityMeta?.business_id) && (
                        <div className="mt-3 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                              Business page
                            </p>
                            <p className="text-sm text-slate-700 mt-0.5">
                              {communityMeta?.business?.business_name
                                ? `Services, booking and details for ${communityMeta.business.business_name}`
                                : 'View this business profile, services and booking'}
                            </p>
                          </div>
                          <Link
                            to={
                              businessHrefFromCommunity(communityMeta) ||
                              `/business/${communityMeta?.business?.slug || communityMeta?.business?.id || communityMeta?.business_id}`
                            }
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-700 text-white text-sm font-bold hover:bg-violet-800 shrink-0"
                          >
                            <FaBuilding className="h-3.5 w-3.5" />
                            View services &amp; booking
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                  {showFeed && (
                    <CommunitiesFeed
                      ref={feedScrollRef}
                      posts={posts}
                      loading={loading}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      showAdsOnly={showAdsOnly}
                      onShowAdsOnlyChange={setShowAdsOnly}
                      onRefresh={loadFeed}
                      viewMode={viewMode === 'feed' ? activeTab : viewMode}
                      communityName={communityName}
                      hideComposer
                    />
                  )}
                  {viewMode !== 'saved' && <SocialHubShortcuts />}
                </>
              )}
            </main>

            <aside className="communities-hub-aside communities-hub-aside--desktop">
              <div className="communities-hub-aside-inner">
                <CommunitiesRightRail topics={topicStats} />
              </div>
            </aside>
          </div>

          <div className="communities-mobile-only mt-4">
            <CommunitiesRightRail topics={topicStats} />
          </div>
        </div>
      </div>

      <div className="communities-hub-footer">
        <Footer />
      </div>
    </div>
  );
};

export default CommunitiesHome;
