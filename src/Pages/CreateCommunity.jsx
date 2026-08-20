import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage, FaPlus, FaTimes } from 'react-icons/fa';
import { communitiesAPI } from '../api/communities';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import { useAuth } from '../context/AuthContext';

const CreateCommunity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    scope: 'global',
    region: '',
    city: '',
    rules: [''],
    strict_moderation: false,
    beginner_friendly: true
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cover_image: file
      }));
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      cover_image: null
    }));
    setPreviewImage(null);
  };

  const handleAddRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const handleRemoveRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleRuleChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Community name must be less than 100 characters';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Community slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    
    if (formData.scope === 'region' && !formData.region.trim()) {
      newErrors.region = 'Region is required for regional communities';
    }
    
    if (formData.scope === 'city' && (!formData.city.trim() || !formData.region.trim())) {
      newErrors.city = 'City and region are required for city-based communities';
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
      const communityData = {
        ...formData,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        rules: formData.rules.filter(rule => rule.trim()).length > 0 ? formData.rules.filter(rule => rule.trim()) : null
      };
      
      const response = await communitiesAPI.createCommunity(communityData);
      
      // Navigate to the created community
      navigate(`/communities/${response.data.community_id}`);
    } catch (error) {
      console.error('Error creating community:', error);
      setErrors({
        submit: 'Failed to create community. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/communities');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Please log in to create a community</p>
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
              Back to Communities
            </button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Create Community</h1>
              <p className="text-sm text-muted-foreground">Build a space for your community to connect and share</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Information */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Community Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter community name..."
                  className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">Community URL Slug *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    /communities/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="community-name"
                    className="w-full p-3 pl-24 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.slug && (
                  <p className="text-red-600 text-sm mt-1">{errors.slug}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your community's purpose, guidelines, and what members can expect..."
                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={6}
                maxLength={1000}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/1000 characters
              </div>
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Category and Scope */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Category and Scope</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a category...</option>
                  <option value="1">Property & Real Estate</option>
                  <option value="2">Funding & Investment</option>
                  <option value="3">Charities & Donations</option>
                  <option value="4">Jobs & Vacancies</option>
                  <option value="5">Vehicles & Transport</option>
                  <option value="6">Services</option>
                  <option value="7">Entertainment</option>
                  <option value="8">Books & Media</option>
                  <option value="9">Resorts & Travel</option>
                </select>
                {errors.category_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                )}
              </div>

              {/* Scope */}
              <div>
                <label className="block text-sm font-medium mb-2">Community Scope *</label>
                <select
                  name="scope"
                  value={formData.scope}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="global">Global</option>
                  <option value="region">Regional</option>
                  <option value="city">City-Based</option>
                </select>
              </div>
            </div>

            {/* Location (conditional) */}
            {(formData.scope === 'region' || formData.scope === 'city') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {formData.scope === 'region' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Region *</label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder="e.g., UK, EU, US"
                      className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.region && (
                      <p className="text-red-600 text-sm mt-1">{errors.region}</p>
                    )}
                  </div>
                )}
                
                {formData.scope === 'city' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g., London, New York"
                        className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Region *</label>
                      <input
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        placeholder="e.g., UK, EU, US"
                        className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Cover Image</h2>
            
            <div className="space-y-4">
              {previewImage ? (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <FaImage className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload cover image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Community Rules */}
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Community Rules</h2>
              <button
                type="button"
                onClick={handleAddRule}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <FaPlus className="h-4 w-4" />
                Add Rule
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                    className="flex-1 p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="px-3 py-2 rounded-md border border-border bg-background hover:bg-accent transition-colors text-red-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {formData.rules.length === 0 && (
              <p className="text-sm text-muted-foreground">No rules added. Communities without rules may have less moderation.</p>
            )}
          </div>

          {/* Settings */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Community Settings</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="strict_moderation"
                  checked={formData.strict_moderation}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <div className="font-medium">Strict Moderation</div>
                  <div className="text-sm text-muted-foreground">All posts require moderator approval</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="beginner_friendly"
                  checked={formData.beginner_friendly}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <div className="font-medium">Beginner Friendly</div>
                  <div className="text-sm text-muted-foreground">Welcome to newcomers and provide guidance</div>
                </div>
              </label>
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
                  <span>Creating Community...</span>
                </div>
              ) : (
                'Create Community'
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

export default CreateCommunity;
