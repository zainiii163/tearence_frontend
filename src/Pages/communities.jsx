import React, { useState, useEffect, useCallback } from 'react';
import { FaUsers } from 'react-icons/fa';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import CommunitiesLeftRail from '../Component/communities/CommunitiesLeftRail';
import CommunitiesFeed from '../Component/communities/CommunitiesFeed';
import CommunitiesRightRail from '../Component/communities/CommunitiesRightRail';
import CreateDiscussionModal from '../Component/communities/CreateDiscussionModal';
import GlobalSearch from '../Component/communities/GlobalSearch';
import CreateMenuDropdown from '../Component/communities/CreateMenuDropdown';
import CreationModal from '../Component/communities/CreationModal';
import { communitiesAPI } from '../api/communities';

const CommunitiesHome = () => {
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [sortBy, setSortBy] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAdsOnly, setShowAdsOnly] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        sort: sortBy,
        category_id: selectedCategory,
        post_type: showAdsOnly ? 'ad_thread' : null
      };
      const response = await communitiesAPI.getPosts(params);
      setFeedData(response.data);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, selectedCategory, showAdsOnly]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    const handleOpenCreationModal = (event) => {
      const { type, data } = event.detail;
      setModalType(type);
      setModalData(data);
      setShowCreateModal(true);
    };

    window.addEventListener('open-creation-modal', handleOpenCreationModal);

    return () => {
      window.removeEventListener('open-creation-modal', handleOpenCreationModal);
    };
  }, []);

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setModalType(null);
    setModalData(null);
  };

  const handleCreationSuccess = (result) => {
    setShowCreateModal(false);
    setModalType(null);
    setModalData(null);
    loadFeed();
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavbar />
      <div className="pt-16">
      
      {/* Communities Header */}
      <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FaUsers className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">World Wide Adverts Communities</h1>
                <p className="text-sm text-muted-foreground">Turn every directory vertical into living communities</p>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Social Hub</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <GlobalSearch />
              <CreateMenuDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <CreationModal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          type={modalType}
          onSuccess={handleCreationSuccess}
          data={modalData}
        />
      )}

      {/* Main Content - 3 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_320px] gap-6">
          
          {/* Left Rail */}
          <div className="hidden lg:block">
            <CommunitiesLeftRail
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

          {/* Center Feed */}
          <div className="min-w-0">
            <CommunitiesFeed
              feedData={feedData}
              loading={loading}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showAdsOnly={showAdsOnly}
              onShowAdsOnlyChange={setShowAdsOnly}
              onRefresh={loadFeed}
            />
          </div>

          {/* Right Rail */}
          <div className="hidden lg:block">
            <CommunitiesRightRail />
          </div>

        </div>
      </div>

      </div>
    </div>
  );
};

export default CommunitiesHome;
