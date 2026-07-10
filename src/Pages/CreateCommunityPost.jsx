import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage, FaTags, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { communitiesAPI } from '../api/communities';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import { useAuth } from '../context/AuthContext';

const CreateCommunityPost = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    post_type: 'discussion_thread',
    discussion_type: 'general',
    tags: [],
    location: '',
    country: '',
    city: '',
    advert_type: '',
    advert_id: null
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const loadCommunity = async () => {
    try {
      const data = await communitiesAPI.getCommunity(communityId);
      setCommunity(data.data);
      
      // Pre-fill location from community
      setFormData(prev => ({
        ...prev,
        location: data.data.city || data.data.region || '',
        country: data.data.region === 'UK' ? 'United Kingdom' : data.data.region,
        city: data.data.city || ''
      }));
    } catch (error) {
      console.error('Error loading community:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }
    
    if (formData.post_type === 'ad_thread' && !formData.advert_type) {
      newErrors.advert_type = 'Advert type is required for ad threads';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const postData = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags.length > 0 ? formData.tags : null
      };
      
      const response = await communitiesAPI.createPost(postData);
      
      // Navigate to the created post
      navigate(`/communities/${communityId}/post/${response.data.post_id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({
        submit: 'Failed to create post. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/communities/${communityId}`);
  };

  React.useEffect(() => {
    loadCommunity();
  }, [communityId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Please log in to create a post</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavbar />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to {community.name}
            </button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Create Post</h1>
              <p className="text-sm text-muted-foreground">Share your thoughts with the community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Post Type Selection */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Post Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <input
                  type="radio"
                  name="post_type"
                  value="discussion_thread"
                  checked={formData.post_type === 'discussion_thread'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <div className="font-medium">Discussion Thread</div>
                  <div className="text-sm text-muted-foreground">Start a conversation, ask questions, share experiences</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <input
                  type="radio"
                  name="post_type"
                  value="ad_thread"
                  checked={formData.post_type === 'ad_thread'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <div className="font-medium">Ad Thread</div>
                  <div className="text-sm text-muted-foreground">Promote your products, services, or opportunities</div>
                </div>
              </label>
            </div>
            
            {errors.post_type && (
              <p className="text-red-600 text-sm mt-2">{errors.post_type}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title..."
                  className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={200}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {formData.title.length}/200 characters
                </div>
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Share your thoughts, ask questions, or describe what you're offering..."
                  className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={8}
                  maxLength={5000}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {formData.content.length}/5000 characters
                </div>
                {errors.content && (
                  <p className="text-red-600 text-sm mt-1">{errors.content}</p>
                )}
              </div>
            </div>
          </div>

          {/* Discussion Type (for discussion threads) */}
          {formData.post_type === 'discussion_thread' && (
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Discussion Type</h2>
              <select
                name="discussion_type"
                value={formData.discussion_type}
                onChange={handleInputChange}
                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="general">General Discussion</option>
                <option value="question">Question</option>
                <option value="review">Review</option>
                <option value="advice">Advice</option>
                <option value="report">Report Experience</option>
              </select>
            </div>
          )}

          {/* Advert Type (for ad threads) */}
          {formData.post_type === 'ad_thread' && (
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Advert Type</h2>
              <select
                name="advert_type"
                value={formData.advert_type}
                onChange={handleInputChange}
                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select advert type...</option>
                <option value="buy_sell">Buy & Sell</option>
                <option value="property">Property</option>
                <option value="vehicle">Vehicle</option>
                <option value="job">Job</option>
                <option value="service">Service</option>
                <option value="event">Event</option>
                <option value="funding">Funding</option>
                <option value="resorts_travel">Resorts & Travel</option>
                <option value="banner">Banner Ad</option>
                <option value="sponsored">Sponsored Post</option>
              </select>
              {errors.advert_type && (
                <p className="text-red-600 text-sm mt-1">{errors.advert_type}</p>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Tags</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(e);
                    }
                  }}
                  placeholder="Add tags (press Enter)..."
                  className="flex-1 p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              </div>
              
              {/* Tags Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-primary/60 hover:text-primary"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                {formData.tags.length}/10 tags maximum
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country..."
                  className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City..."
                  className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Specific location..."
                    className="w-full p-3 pl-10 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary border-t-transparent"></div>
                  <span>Creating Post...</span>
                </div>
              ) : (
                'Create Post'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 rounded-md border border-border bg-background font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityPost;
