import React, { useState, useEffect } from 'react';
import { FaUsers, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';

const CommunitySelector = ({ selectedCommunities, onCommunitiesChange, category, location }) => {
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = communities.filter(community =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCommunities(filtered);
    } else {
      setFilteredCommunities(communities);
    }
  }, [searchTerm, communities]);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const response = await communitiesAPI.getCommunities();
      setCommunities(response.data?.data || []);
      setFilteredCommunities(response.data?.data || []);
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommunity = (community) => {
    if (!selectedCommunities.find(c => c.id === community.id)) {
      onCommunitiesChange([...selectedCommunities, community]);
    }
    setShowDropdown(false);
    setSearchTerm('');
  };

  const handleRemoveCommunity = (communityId) => {
    onCommunitiesChange(selectedCommunities.filter(c => c.id !== communityId));
  };

  const getSuggestedCommunities = () => {
    let suggested = communities;
    
    if (category) {
      suggested = suggested.filter(c => 
        c.category.toLowerCase().includes(category.toLowerCase()) ||
        c.name.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (location) {
      suggested = suggested.filter(c => 
        c.region?.toLowerCase().includes(location.toLowerCase()) ||
        c.scope === 'Global'
      );
    }
    
    // Remove already selected communities
    suggested = suggested.filter(c => 
      !selectedCommunities.find(sc => sc.id === c.id)
    );
    
    return suggested.slice(0, 5);
  };

  const suggested = getSuggestedCommunities();

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Communities (Optional)
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Select communities to share your ad with for better visibility
        </p>
      </div>

      {/* Selected Communities */}
      {selectedCommunities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCommunities.map((community) => (
            <div
              key={community.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
            >
              <span>{community.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveCommunity(community.id)}
                className="hover:text-destructive"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Community Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors text-sm"
        >
          <FaUsers className="h-4 w-4" />
          <span>Add to Communities</span>
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-2 rounded-md border bg-popover p-1 text-popover-foreground shadow-md max-h-80 overflow-y-auto">
            
            {/* Search */}
            <div className="sticky top-0 bg-popover p-2 border-b">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search communities..."
                  className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {/* Suggested */}
            {!searchTerm && suggested.length > 0 && (
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Suggested for you
                </p>
                {suggested.map((community) => (
                  <button
                    key={community.id}
                    type="button"
                    onClick={() => handleAddCommunity(community)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FaUsers className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{community.name}</p>
                      <p className="text-xs text-muted-foreground">{community.category?.name || community.category}</p>
                    </div>
                    <FaPlus className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}

            {/* All Communities */}
            <div className="p-2">
              {searchTerm && (
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Search Results
                </p>
              )}
              {loading ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  Loading communities...
                </div>
              ) : filteredCommunities.length > 0 ? (
                filteredCommunities
                  .filter(c => !selectedCommunities.find(sc => sc.id === c.id))
                  .map((community) => (
                    <button
                      key={community.id}
                      type="button"
                      onClick={() => handleAddCommunity(community)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaUsers className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{community.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {community.category?.name || community.category} • {community.members_count?.toLocaleString()} members
                        </p>
                      </div>
                      <FaPlus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No communities found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        Your ad will be visible in the selected communities and can be discussed by members.
      </p>
    </div>
  );
};

export default CommunitySelector;
