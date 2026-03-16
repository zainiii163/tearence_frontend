import React, { useState } from 'react';
import fundingService from '../../../services/FundingService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Shield,
  FileText,
  Globe,
  Link,
  CheckCircle,
  Star,
  Award,
  AlertCircle,
  Info,
  Plus
} from 'lucide-react';

const VerificationTrust = ({ formData, updateFormData, onNext, onPrev }) => {
  const [socialLinks, setSocialLinks] = useState(formData.socialLinks || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [verificationStatus, setVerificationStatus] = useState('pending');

  const addSocialLink = () => {
    const newLink = {
      id: Date.now(),
      platform: '',
      url: ''
    };
    const updatedLinks = [...socialLinks, newLink];
    setSocialLinks(updatedLinks);
    updateFormData({ socialLinks: updatedLinks });
  };

  const updateSocialLink = (id, field, value) => {
    const updatedLinks = socialLinks.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    );
    setSocialLinks(updatedLinks);
    updateFormData({ socialLinks: updatedLinks });
  };

  const removeSocialLink = (id) => {
    const updatedLinks = socialLinks.filter(link => link.id !== id);
    setSocialLinks(updatedLinks);
    updateFormData({ socialLinks: updatedLinks });
  };

  const handleIdentityUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateFormData({ identityDocument: file });
    }
  };

  const handleVerification = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call for identity verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStatus('verified');
      updateFormData({ verificationStatus: 'verified' });
    } catch (err) {
      setError('Verification failed. Please try again.');
      setVerificationStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    // Validation
    const newErrors = {};
    
    if (socialLinks.length === 0) {
      newErrors.socialLinks = 'Please add at least one social link';
    }
    
    socialLinks.forEach((link, index) => {
      if (!link.platform) {
        newErrors[`social_${index}_platform`] = 'Platform is required';
      }
      if (!link.url) {
        newErrors[`social_${index}_url`] = 'URL is required';
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare verification data
      const verificationData = {
        social_links: socialLinks.map(link => ({
          platform: link.platform,
          url: link.url,
          followers: link.followers
        })),
        verification_status: verificationStatus,
        identity_document: formData.identityDocument
      };
      
      // Save verification data
      if (formData.projectId) {
        // Update existing project
        await fundingService.updateProject(formData.projectId, {
          verification: verificationData
        });
      } else {
        // Save to form data for new project
        updateFormData({ verification: verificationData });
      }
      
      onNext();
    } catch (err) {
      console.error('Error saving verification data:', err);
      setError('Failed to save verification data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (onPrev) onPrev();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved progress will be lost.')) {
      window.history.back();
    }
  };

  const platforms = [
    'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 
    'TikTok', 'GitHub', 'Website', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Navigation */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              6
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Verification & Trust</h2>
              <p className="text-sm text-gray-600">Build credibility with backers</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrev}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              <X className="w-4 h-4 inline-block mr-2" />
              Cancel
            </button>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Build Trust with Backers</h3>
            <p className="text-gray-600">
              Verification and social proof help build trust with potential backers. Complete as much as possible to increase your project's credibility.
            </p>
          </div>

          {/* Identity Verification */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                <Shield className="w-5 h-5 inline mr-2" />
                Identity Verification
              </h4>
              {verificationStatus === 'verified' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload ID Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Upload ID Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.identityDocument ? formData.identityDocument.name : 'Click to upload ID document'}
                    </p>
                    <input
                      type="file"
                      onChange={handleIdentityUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="identity-upload"
                    />
                    <label
                      htmlFor="identity-upload"
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                </div>

                {/* Verification Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Current Status</span>
                      <span className={`text-sm font-medium ${
                        verificationStatus === 'verified' ? 'text-green-600' : 
                        verificationStatus === 'failed' ? 'text-red-600' : 
                        'text-yellow-600'
                      }`}>
                        {verificationStatus === 'verified' ? 'Verified' : 
                         verificationStatus === 'failed' ? 'Failed' : 
                         'Pending'}
                      </span>
                    </div>
                    
                    {verificationStatus === 'pending' && (
                      <button
                        onClick={handleVerification}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Verifying...' : 'Start Verification'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    ID verification helps build trust with backers. Your document will be securely processed and only used for verification purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                <Globe className="w-5 h-5 inline mr-2" />
                Social Media Links
              </h4>
              <button
                onClick={addSocialLink}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>

            {errors.socialLinks && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.socialLinks}</p>
              </div>
            )}

            <div className="space-y-4">
              {socialLinks.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                  <Link className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Social Links Yet</h4>
                  <p className="text-gray-600 mb-4">
                    Add social media profiles to build credibility
                  </p>
                  <button
                    onClick={addSocialLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add First Link
                  </button>
                </div>
              ) : (
                socialLinks.map((link, index) => (
                  <div key={link.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                        <select
                          value={link.platform}
                          onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`social_${index}_platform`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Platform</option>
                          {platforms.map(platform => (
                            <option key={platform} value={platform}>{platform}</option>
                          ))}
                        </select>
                        {errors[`social_${index}_platform`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`social_${index}_platform`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                          placeholder="https://..."
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`social_${index}_url`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`social_${index}_url`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`social_${index}_url`]}</p>
                        )}
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          onClick={() => removeSocialLink(link.id)}
                          className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Trust Building Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-gray-900">Complete Verification</h5>
                  <p className="text-sm text-gray-600">Verified projects receive 3x more funding</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-gray-900">Add Social Links</h5>
                  <p className="text-sm text-gray-600">Show your online presence and community</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-gray-900">Upload Documents</h5>
                  <p className="text-sm text-gray-600">Provide proof of identity and credentials</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-gray-900">Be Transparent</h5>
                  <p className="text-sm text-gray-600">Honest information builds lasting trust</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </span>
              ) : (
                <span>Next Step</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationTrust;
