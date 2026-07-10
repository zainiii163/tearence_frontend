import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Tag, 
  Users, 
  DollarSign, 
  Home, 
  Car, 
  Briefcase, 
  Heart, 
  Calendar,
  Store,
  Building,
  ChevronRight,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatePostFlow = ({ isOpen, onClose, communityId = null, communityName = null }) => {
  const [step, setStep] = useState('type-selection');
  const [postType, setPostType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    communityId: communityId,
    tags: [],
    images: [],
    price: '',
    location: '',
    contactEmail: '',
    contactPhone: ''
  });
  const navigate = useNavigate();

  const categories = [
    { id: 'property', name: 'Property & Real Estate', icon: Home, color: 'blue' },
    { id: 'business', name: 'Business & Companies', icon: Building, color: 'indigo' },
    { id: 'services', name: 'Services & Solutions', icon: Store, color: 'gray' },
    { id: 'jobs', name: 'Jobs & Vacancies', icon: Briefcase, color: 'purple' },
    { id: 'vehicles', name: 'Vehicles & Transport', icon: Car, color: 'orange' },
    { id: 'funding', name: 'Funding & Investment', icon: DollarSign, color: 'green' },
    { id: 'charities', name: 'Charities & Donations', icon: Heart, color: 'red' },
    { id: 'events', name: 'Events & Entertainment', icon: Calendar, color: 'pink' }
  ];

  const handleTypeSelection = (type) => {
    setPostType(type);
    setStep('category-selection');
  };

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, category: category.id }));
    
    if (postType === 'ad') {
      // Navigate to existing ad posting form with community context
      const postRoute = `/post/${category.id}`;
      const params = new URLSearchParams();
      if (communityId) params.append('community', communityId);
      if (communityName) params.append('communityName', communityName);
      navigate(`${postRoute}?${params.toString()}`);
      onClose();
    } else {
      // Continue to discussion form
      setStep('discussion-form');
    }
  };

  const handleBack = () => {
    if (step === 'category-selection') {
      setStep('type-selection');
      setPostType(null);
    } else if (step === 'discussion-form') {
      setStep('category-selection');
      setSelectedCategory(null);
    }
  };

  const handleSubmitDiscussion = async () => {
    try {
      // API call to create discussion
      const discussionData = {
        ...formData,
        type: 'discussion',
        communityId: communityId,
        category: selectedCategory?.id
      };
      
      console.log('Creating discussion:', discussionData);
      // await communitiesAPI.createDiscussion(discussionData);
      
      // Show success and close
      setStep('success');
      setTimeout(() => {
        onClose();
        // Reset form
        setStep('type-selection');
        setPostType(null);
        setSelectedCategory(null);
        setFormData({
          title: '',
          content: '',
          category: '',
          communityId: communityId,
          tags: [],
          images: [],
          price: '',
          location: '',
          contactEmail: '',
          contactPhone: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onClose();
    } else {
      // Show confirmation dialog
      if (window.confirm('Are you sure you want to discard this post?')) {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {step !== 'type-selection' && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {step === 'type-selection' && 'Create New Post'}
                  {step === 'category-selection' && `Select Category for ${postType === 'ad' ? 'Advertisement' : 'Discussion'}`}
                  {step === 'discussion-form' && 'Start New Discussion'}
                  {step === 'success' && 'Post Created Successfully!'}
                </h2>
                {communityName && (
                  <p className="text-sm text-gray-600 mt-1">
                    Posting in: <span className="font-medium text-primary">{communityName}</span>
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {step === 'type-selection' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">What would you like to create?</h3>
                  <p className="text-gray-600">Choose the type of post you want to create</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTypeSelection('ad')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                        <Tag className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Post Advertisement</h4>
                        <p className="text-sm text-gray-600">
                          Create a listing to promote your product, service, or opportunity
                        </p>
                        <div className="mt-3 text-xs text-gray-500">
                          ✓ Include images and details<br/>
                          ✓ Set pricing and availability<br/>
                          ✓ Reach targeted audience
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleTypeSelection('discussion')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Discussion</h4>
                        <p className="text-sm text-gray-600">
                          Share thoughts, ask questions, or start a conversation
                        </p>
                        <div className="mt-3 text-xs text-gray-500">
                          ✓ Engage with community<br/>
                          ✓ Get advice and opinions<br/>
                          ✓ Build connections
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'category-selection' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center py-4">
                  <p className="text-gray-600">
                    Select the category that best fits your {postType === 'ad' ? 'advertisement' : 'discussion'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelection(category)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="text-center space-y-2">
                        <div className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-${category.color}-200 transition-colors`}>
                          <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">{category.name}</h5>
                          <ChevronRight className="w-4 h-4 text-gray-400 mx-auto mt-1" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'discussion-form' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discussion Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a clear, descriptive title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discussion Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your thoughts, questions, or start a conversation..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      }))}
                      placeholder="Add tags separated by commas..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country or Global"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitDiscussion}
                    disabled={!formData.title.trim() || !formData.content.trim()}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Post Discussion
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {postType === 'ad' ? 'Advertisement Posted!' : 'Discussion Started!'}
                  </h3>
                  <p className="text-gray-600">
                    {postType === 'ad' 
                      ? 'Your advertisement has been successfully posted and is now live.' 
                      : 'Your discussion has been created and community members can now participate.'
                    }
                  </p>
                  {communityName && (
                    <p className="text-sm text-primary mt-2">
                      Posted in: {communityName}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      onClose();
                      // Navigate to the post/community
                      if (communityId) {
                        navigate(`/community/${communityId}`);
                      } else {
                        navigate('/communities');
                      }
                    }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    View Post
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      setStep('type-selection');
                      setPostType(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Create Another
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePostFlow;
