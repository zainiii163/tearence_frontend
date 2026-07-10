import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Download
} from 'lucide-react';
import { 
  uploadBannerImage,
  uploadBusinessLogo,
  uploadAnimatedBanner,
  uploadHTML5Banner,
  uploadVideoBanner,
  deleteUploadedFile
} from '../../api/banner';

const BannerUploadSystem = ({ onUploadComplete, onClose }) => {
  const [activeTab, setActiveTab] = useState('image');
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const uploadTabs = [
    { id: 'image', label: 'Banner Image', icon: ImageIcon, accept: 'image/*' },
    { id: 'logo', label: 'Business Logo', icon: ImageIcon, accept: 'image/*' },
    { id: 'animated', label: 'Animated Banner', icon: ImageIcon, accept: 'image/gif' },
    { id: 'html5', label: 'HTML5 Banner', icon: FileText, accept: '.html,.zip' },
    { id: 'video', label: 'Video Banner', icon: Video, accept: 'video/*' }
  ];

  const bannerSizes = [
    { name: 'Leaderboard', width: 728, height: 90 },
    { name: 'Medium Rectangle', width: 300, height: 250 },
    { name: 'Large Rectangle', width: 336, height: 280 },
    { name: 'Skyscraper', width: 120, height: 600 },
    { name: 'Wide Skyscraper', width: 160, height: 600 },
    { name: 'Square', width: 250, height: 250 },
    { name: 'Mobile Banner', width: 320, height: 50 }
  ];

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      let response;
      switch (activeTab) {
        case 'image':
          response = await uploadBannerImage(file);
          break;
        case 'logo':
          response = await uploadBusinessLogo(file);
          break;
        case 'animated':
          response = await uploadAnimatedBanner(file);
          break;
        case 'html5':
          response = await uploadHTML5Banner(file);
          break;
        case 'video':
          response = await uploadVideoBanner(file);
          break;
        default:
          throw new Error('Invalid upload type');
      }

      if (response.success) {
        const fileInfo = {
          id: response.data.id || Date.now(), // Use API file ID if available
          fileId: response.data.id, // Store the actual API file ID separately
          name: file.name,
          size: file.size,
          type: activeTab,
          url: response.data.url,
          uploadDate: new Date().toISOString()
        };

        setUploadedFiles(prev => [...prev, fileInfo]);
        setPreviewUrl(response.data.url);
        
        if (onUploadComplete) {
          onUploadComplete(fileInfo);
        }
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    try {
      // Use the actual API file ID if available, otherwise use the local ID
      const apiFileId = file.fileId || file.id;
      if (apiFileId) {
        await deleteUploadedFile(apiFileId);
      }
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      if (previewUrl === file.url) {
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err.message || 'Failed to delete file');
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get current tab config
  const currentTab = uploadTabs.find(tab => tab.id === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Banner Upload System</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {uploadTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Upload Area */}
          <div className="mb-6">
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept={currentTab.accept}
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {uploading ? 'Uploading...' : `Drop ${currentTab.label} here or click to browse`}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentTab.accept.replace('*', 'Supported files')}
                  </p>
                </div>

                {activeTab === 'image' && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {bannerSizes.map((size) => (
                      <span
                        key={size.name}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                      >
                        {size.name}: {size.width}×{size.height}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Preview</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                {activeTab === 'video' ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-w-full h-auto rounded"
                  />
                ) : activeTab === 'html5' ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-64 rounded border"
                    title="HTML5 Banner Preview"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto rounded"
                  />
                )}
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Uploaded Files</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {uploadedFiles.length > 0 && (
              <button
                onClick={() => {
                  if (onUploadComplete) {
                    onUploadComplete(uploadedFiles);
                  }
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use Files
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BannerUploadSystem;
