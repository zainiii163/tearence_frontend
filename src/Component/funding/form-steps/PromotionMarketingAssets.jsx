import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Plus,
  Video,
  FileText,
  Play,
  File,
  AlertCircle,
  Star,
  Shield
} from 'lucide-react';
import fundingService from '../../../services/FundingService';

const PromotionMarketingAssets = ({ formData, updateFormData, onNext, onPrev }) => {
  const [documents, setDocuments] = useState(formData.documents || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  // Load existing marketing assets if editing
  useEffect(() => {
    if (formData.projectId) {
      loadMarketingAssets();
    }
  }, [formData.projectId, loadMarketingAssets]);

  const loadMarketingAssets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fundingService.getProject(formData.projectId);
      if (response.data && response.data.marketing_assets) {
        setDocuments(response.data.marketing_assets.documents || []);
        updateFormData({ 
          pitchVideo: response.data.marketing_assets.pitch_video_url || '',
          documents: response.data.marketing_assets.documents || []
        });
      }
    } catch (err) {
      console.error('Error loading marketing assets:', err);
      setError('Failed to load marketing assets');
    } finally {
      setLoading(false);
    }
  }, [formData.projectId, updateFormData]);

  const handleVideoUrlChange = (value) => {
    updateFormData({ pitchVideo: value });
  };

  const addDocument = () => {
    const newDocument = {
      id: Date.now(),
      name: '',
      file: null,
      type: 'other'
    };
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    updateFormData({ documents: updatedDocuments });
  };

  const updateDocument = (id, field, value) => {
    const updatedDocuments = documents.map(doc =>
      doc.id === id ? { ...doc, [field]: value } : doc
    );
    setDocuments(updatedDocuments);
    updateFormData({ documents: updatedDocuments });
  };

  const removeDocument = (id) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    updateFormData({ documents: updatedDocuments });
  };

  const handleDocumentFileUpload = async (id, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show upload progress
        setUploadProgress(prev => ({ ...prev, [id]: 0 }));
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_name', file.name);
        formData.append('document_type', 'marketing_asset');
        
        // Upload to API
        const response = await fundingService.uploadDocument(formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, [id]: progress }));
          }
        });
        
        // Update document with API response
        updateDocument(id, 'file', file);
        updateDocument(id, 'name', file.name);
        updateDocument(id, 'url', response.data.url);
        updateDocument(id, 'documentId', response.data.id);
        
        // Clear upload progress
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[id];
          return newProgress;
        });
        
      } catch (err) {
        console.error('Error uploading document:', err);
        setErrors(prev => ({ 
          ...prev, 
          [`document_${id}_file`]: 'Failed to upload document. Please try again.' 
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.pitchVideo && !isValidUrl(formData.pitchVideo)) {
      newErrors.pitchVideo = 'Please enter a valid video URL';
    }
    
    documents.forEach((doc, index) => {
      if (!doc.name) {
        newErrors[`document_${index}_name`] = 'Document name is required';
      }
      if (!doc.file && !doc.url) {
        newErrors[`document_${index}_file`] = 'Please upload a file or provide a URL';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare marketing assets data
      const marketingAssetsData = {
        pitch_video_url: formData.pitchVideo,
        documents: documents.map(doc => ({
          id: doc.documentId,
          name: doc.name,
          url: doc.url,
          type: doc.type
        }))
      };
      
      // Save marketing assets
      if (formData.projectId) {
        // Update existing project
        await fundingService.updateProject(formData.projectId, {
          marketing_assets: marketingAssetsData
        });
      } else {
        // Save to form data for new project
        updateFormData({ marketingAssets: marketingAssetsData });
      }
      
      onNext();
    } catch (err) {
      console.error('Error saving marketing assets:', err);
      setError('Failed to save marketing assets. Please try again.');
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

  const documentTypes = [
    { value: 'pitchdeck', label: 'Pitch Deck', icon: <FileText className="w-4 h-4" /> },
    { value: 'financials', label: 'Financials', icon: <FileText className="w-4 h-4" /> },
    { value: 'businessplan', label: 'Business Plan', icon: <FileText className="w-4 h-4" /> },
    { value: 'prototype', label: 'Prototype Demo', icon: <Video className="w-4 h-4" /> },
    { value: 'marketresearch', label: 'Market Research', icon: <FileText className="w-4 h-4" /> },
    { value: 'other', label: 'Other', icon: <File className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Navigation */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              7
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Marketing Assets</h2>
              <p className="text-sm text-gray-600">Enhance your project with promotional materials</p>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Promotional Materials</h3>
            <p className="text-gray-600">
              Enhance your project with videos and supporting documents. These materials help funders understand your project better and build confidence in your vision.
            </p>
          </div>

          {/* Pitch Video Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                <Video className="w-5 h-5 inline mr-2" />
                Pitch Video
              </h4>
              <span className="text-sm text-gray-500">Optional but recommended</span>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                  <input
                    type="url"
                    value={formData.pitchVideo || ''}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.pitchVideo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.pitchVideo && (
                    <p className="text-red-500 text-xs mt-1">{errors.pitchVideo}</p>
                  )}
                </div>
                
                {formData.pitchVideo && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Play className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Video Preview Available</p>
                        <p className="text-sm text-blue-700">Your pitch video will be displayed prominently on your project page</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Supporting Documents Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                <FileText className="w-5 h-5 inline mr-2" />
                Supporting Documents
              </h4>
              <button
                onClick={addDocument}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Document
              </button>
            </div>

            <div className="space-y-4">
              {documents.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Documents Yet</h4>
                  <p className="text-gray-600 mb-4">
                    Add supporting documents to build credibility
                  </p>
                  <button
                    onClick={addDocument}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add First Document
                  </button>
                </div>
              ) : (
                documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Document Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                        <input
                          type="text"
                          value={doc.name}
                          onChange={(e) => updateDocument(doc.id, 'name', e.target.value)}
                          placeholder="Enter document name"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`document_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`document_${index}_name`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`document_${index}_name`]}</p>
                        )}
                      </div>

                      {/* Document Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                        <select
                          value={doc.type}
                          onChange={(e) => updateDocument(doc.id, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {documentTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                        <div className="space-y-2">
                          {doc.file ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-800">{doc.file.name}</span>
                              </div>
                              <button
                                onClick={() => updateDocument(doc.id, 'file', null)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div>
                              <input
                                type="file"
                                onChange={(e) => handleDocumentFileUpload(doc.id, e)}
                                className="hidden"
                                id={`doc-upload-${doc.id}`}
                              />
                              <label
                                htmlFor={`doc-upload-${doc.id}`}
                                className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose File
                              </label>
                            </div>
                          )}
                          {errors[`document_${index}_file`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`document_${index}_file`]}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove Document Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Remove Document
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Marketing Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-gray-900">Video Quality Matters</h5>
                  <p className="text-sm text-gray-600">A professional pitch video can increase funding by 50%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-gray-900">Document Organization</h5>
                  <p className="text-sm text-gray-600">Well-organized documents build trust and credibility</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-gray-900">Show Your Progress</h5>
                  <p className="text-sm text-gray-600">Include prototypes, demos, or proof of concept</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-gray-900">Build Trust</h5>
                  <p className="text-sm text-gray-600">Transparency through documentation increases backer confidence</p>
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

export default PromotionMarketingAssets;
