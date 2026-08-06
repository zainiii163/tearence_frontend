import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaHome, FaHeart, FaCompass, FaBookmark } from 'react-icons/fa';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import BrowseMarketplaceHero from '../Component/shared/BrowseMarketplaceHero';
import BrowsePageBackBar from '../Component/shared/BrowsePageBackBar';
import CommunitiesLeftRail from '../Component/communities/CommunitiesLeftRail';
import CommunitiesFeed from '../Component/communities/CommunitiesFeed';
import CommunitiesRightRail from '../Component/communities/CommunitiesRightRail';
import GlobalSearch from '../Component/communities/GlobalSearch';
import CreateMenuDropdown from '../Component/communities/CreateMenuDropdown';
import CreationModal from '../Component/communities/CreationModal';
import SocialStoriesStrip from '../Component/communities/SocialStoriesStrip';
import { communitiesAPI } from '../api/communities';
import '../styles/communities.css';

const extractPosts = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const MOBILE_NAV = [
  { id: 'feed', label: 'Feed', icon: FaHome },
  { id: 'foryou', label: 'For You', icon: FaHeart },
  { id: 'following', label: 'Following', icon: FaUsers },
  { id: 'local', label: 'Local', icon: FaCompass },
];

const CommunitiesHome = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [sortBy, setSortBy] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAdsOnly, setShowAdsOnly] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const feedScrollRef = useRef(null);
  const shellRef = useRef(null);
  const hubRef = useRef(null);
  const [isAppShell, setIsAppShell] = useState(false);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        sort: sortBy,
        category_id: selectedCategory || undefined,
        post_type: showAdsOnly ? 'ad_thread' : undefined,
        search: searchQuery || undefined,
        per_page: 20,
      };

      let response;
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
        // Personalized tabs can 500 — fall back to main feed
        if (activeTab !== 'feed') {
          console.warn('Personalized feed failed, falling back to main feed', tabErr);
          response = await communitiesAPI.getPosts(params);
        } else {
          throw tabErr;
        }
      }

      const root = response?.data ?? response;
      setPosts(extractPosts(root?.data ? root : { data: root }));
    } catch (error) {
      console.error('Error loading feed:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, selectedCategory, showAdsOnly, activeTab, searchQuery]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // App shell only on large, tall screens (avoids clipped UI when resized / zoomed)
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
      setModalType(type);
      setModalData(data);
      setShowCreateModal(true);
    };
    window.addEventListener('open-creation-modal', handleOpenCreationModal);
    return () => window.removeEventListener('open-creation-modal', handleOpenCreationModal);
  }, []);

  /**
   * Desktop scroll logic (app-shell mode only):
   * 1) Page at top → wheel scrolls CENTER feed (sides fixed).
   * 2) Bottom of feed → keep scrolling → FOOTER.
   * 3) Scroll up from footer → hub, then feed again.
   */
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

  return (
    <div
      ref={hubRef}
      className={`communities-hub communities-hub--app social-hub${isAppShell ? ' is-app-shell' : ''}`}
    >
      <UnifiedNavbar showBackButton backHref="/" />

      <BrowseMarketplaceHero
        title="Social Hub"
        eyebrow=""
        subtitle="Connect, share and discover ads — stories, feed and marketplace in one place."
        theme="social"
        imageUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1280&q=80"
        compact={false}
      />

      <div className="communities-hub-shell" ref={shellRef}>
        <div className="page-container pt-3 pb-2 flex flex-wrap items-center justify-between gap-2">
          <BrowsePageBackBar to="/" label="Back to Home" className="mb-0" />
          <div className="flex items-center gap-2">
            <div className="w-44 sm:w-56">
              <GlobalSearch onSelectPostSearch={setSearchQuery} compact />
            </div>
            <CreateMenuDropdown />
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
                  aria-selected={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`communities-mobile-nav-item ${
                    activeTab === item.id ? 'is-active' : ''
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="communities-mobile-links">
              <Link to="/communities/my-communities">Groups</Link>
              <Link to="/communities/discover">Marketplace</Link>
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
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
              </div>
            </aside>

            <main className="communities-hub-center min-w-0">
              <SocialStoriesStrip
                onCreate={() => {
                  setModalType('post');
                  setShowCreateModal(true);
                }}
              />
              <CommunitiesFeed
                ref={feedScrollRef}
                posts={posts}
                loading={loading}
                sortBy={sortBy}
                onSortChange={setSortBy}
                showAdsOnly={showAdsOnly}
                onShowAdsOnlyChange={setShowAdsOnly}
                onRefresh={loadFeed}
              />
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
