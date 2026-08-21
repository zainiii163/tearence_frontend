import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaBuilding } from 'react-icons/fa';
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
import SocialHubNavDropdown from '../Component/communities/SocialHubNavDropdown';
import SocialHubMobileNav from '../Component/communities/SocialHubMobileNav';
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
  const [sortBy, setSortBy] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAdsOnly, setShowAdsOnly] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [communityMeta, setCommunityMeta] = useState(null);
  const feedScrollRef = useRef(null);

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
    const handleOpenCreationModal = (event) => {
      const { type, data } = event.detail || {};
      setModalType(type === 'post' ? 'discussion' : type);
      const fromEvent = data?.community_id || data?.communityId || null;
      const fromPage =
        communityMeta?.community_id || communityId || null;
      setModalData(
        data ||
          (fromEvent || fromPage
            ? { community_id: fromEvent || fromPage }
            : null)
      );
      setShowCreateModal(true);
    };
    window.addEventListener('open-creation-modal', handleOpenCreationModal);
    return () => window.removeEventListener('open-creation-modal', handleOpenCreationModal);
  }, [communityId, communityMeta]);

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
    if (!logIn) {
      window.dispatchEvent(
        new CustomEvent('wwa-auth-required', {
          detail: {
            message: 'You need an account to create posts, polls, or groups.',
            from: '/communities',
          },
        })
      );
      return;
    }
    const mapped =
      type === 'post' ? 'discussion' : type === 'poll' ? 'poll' : type;
    const resolvedCommunityId =
      communityMeta?.community_id ||
      communityId ||
      null;
    setModalData(
      resolvedCommunityId
        ? {
            community_id: resolvedCommunityId,
            name: communityMeta?.name || communityName || undefined,
          }
        : null
    );
    setModalType(mapped);
    setShowCreateModal(true);
  };

  return (
    <div
      className={`communities-hub communities-hub--app social-hub social-hub--blend wwa-titles-centered${
        viewMode === 'discover' || viewMode === 'my-communities' ? ' is-browse-view' : ''
      }`}
    >
      <UnifiedNavbar />

      <header className="social-hub-topbar">
        <div className="page-container social-hub-topbar-inner">
          <div className="social-hub-topbar-tools">
            {viewMode === 'community' && communityName ? (
              <h1 className="social-hub-heading social-hub-heading--community">{communityName}</h1>
            ) : null}
            <SocialHubNavDropdown
              onOpenCreate={openCreate}
              onTabChange={handleTabChange}
            />
          </div>

          <div className="social-hub-topbar-search">
            <GlobalSearch onSelectPostSearch={setSearchQuery} />
          </div>
        </div>
      </header>

      <div className="communities-hub-shell">
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
          <div className="social-hub-layout">
            <aside className="social-hub-rail social-hub-rail--left" aria-label="Social Hub navigation">
              <div className="social-hub-rail-inner">
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

            <main className="social-hub-main min-w-0">
              {viewMode === 'discover' || viewMode === 'my-communities' ? (
                <CommunitiesDiscoverPanel mode={viewMode} />
              ) : (
                <div className="social-hub-main-stack">
                  {viewMode !== 'saved' && (
                    <>
                      <SocialStoriesStrip onCreate={() => openCreate('discussion')} />
                      <SocialComposerCard onOpenCreate={openCreate} />
                    </>
                  )}
                  {viewMode === 'community' && communityName && (
                    <div className="communities-feed-toolbar mb-3">
                      {(communityMeta?.business || communityMeta?.business_id) && (
                        <div className="social-biz-banner">
                          <div>
                            <p className="social-biz-banner-kicker">Business page</p>
                            <p className="social-biz-banner-text">
                              {communityMeta?.business?.business_name
                                ? `Services & booking for ${communityMeta.business.business_name}`
                                : 'View this business profile, services and booking'}
                            </p>
                          </div>
                          <Link
                            to={
                              businessHrefFromCommunity(communityMeta) ||
                              `/business/${communityMeta?.business?.id || communityMeta?.business_id || communityMeta?.business?.slug}`
                            }
                            className="social-biz-banner-cta"
                          >
                            <FaBuilding className="h-3.5 w-3.5" />
                            View business
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
                </div>
              )}
            </main>

            <aside className="social-hub-rail social-hub-rail--right" aria-label="Trending">
              <div className="social-hub-rail-inner">
                <CommunitiesRightRail
                  topics={topicStats}
                  onSelectPostSearch={setSearchQuery}
                />
              </div>
            </aside>
          </div>

          <div className="communities-mobile-only social-hub-mobile-trending mt-4 pb-20">
            <CommunitiesRightRail
              topics={topicStats}
              onSelectPostSearch={setSearchQuery}
            />
          </div>
        </div>
      </div>

      <SocialHubMobileNav
        activeTab={viewMode === 'feed' ? activeTab : viewMode}
        onTabChange={handleTabChange}
        onCreate={openCreate}
        onExplore={(path) => navigate(path)}
      />

      <div className="communities-hub-footer">
        <Footer />
      </div>
    </div>
  );
};

export default CommunitiesHome;
