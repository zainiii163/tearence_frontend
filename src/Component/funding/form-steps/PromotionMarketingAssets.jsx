import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  X, 
  Plus,
  Video,
  FileText,
  Link,
  Play,
  File,
  Image as ImageIcon,
  Mic
} from 'lucide-react';

const PromotionMarketingAssets = ({ formData, updateFormData, onNext, onPrev }) => {
  const [documents, setDocuments] = useState(formData.documents || []);

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

  const handleDocumentFileUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      updateDocument(id, 'file', file);
      if (!document.name) {
        updateDocument(id, 'name', file.name);
      }
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

  const isFormValid = true; // This step is optional

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Promotion & Marketing Assets</h3>
        <p className="text-gray-600">
          Enhance your project with promotional materials. Videos and documents help funders understand your project better.
        </p>
      </div>

      {/* Pitch Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Video className="w-4 h-4 inline mr-1" />
          Pitch Video URL (Optional)
        </label>
        <div className="space-y-4">
          <input
            type="url"
            value={formData.pitchVideo || ''}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {formData.pitchVideo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Play className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Video linked successfully</p>
                  <p className="text-sm text-gray-600 truncate">{formData.pitchVideo}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Video Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Keep your pitch video under 3 minutes</li>
              <li>• Show your passion and enthusiasm</li>
              <li>• Demonstrate your product or concept if possible</li>
              <li>• Include a clear call-to-action</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Documents Upload */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 inline mr-1" />
            Supporting Documents
          </label>
          <button
            onClick={addDocument}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No documents added yet</p>
            <p className="text-sm text-gray-500">Upload pitch decks, financials, business plans, etc.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={doc.id} className="border border-gray-200 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Document Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={doc.type || 'other'}
                      onChange={(e) => updateDocument(doc.id, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      {documentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Document Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={doc.name || ''}
                      onChange={(e) => updateDocument(doc.id, 'name', e.target.value)}
                      placeholder="Document name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      File
                    </label>
                    {doc.file ? (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700 truncate flex-1">{doc.file.name}</span>
                        <button
                          onClick={() => updateDocument(doc.id, 'file', null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                          onChange={(e) => handleDocumentFileUpload(doc.id, e)}
                          className="hidden"
                          id={`doc-file-${doc.id}`}
                        />
                        <button
                          onClick={() => document.getElementById(`doc-file-${doc.id}`).click()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                        >
                          Choose File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeDocument(doc.id)}
                  className="mt-3 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supported Platforms */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-3">Supported Video Platforms</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-700">YouTube</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">Vimeo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">Direct Upload</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Link className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-gray-700">Other</span>
          </div>
        </div>
      </div>

      {/* File Guidelines */}
      <div className="bg-amber-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900 mb-2">File Guidelines</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• PDF files recommended for documents (max 25MB)</li>
              <li>• Images: JPG, PNG, GIF (max 10MB each)</li>
              <li>• Videos: MP4, MOV (max 100MB for direct upload)</li>
              <li>• Spreadsheets: XLS, XLSX (max 10MB)</li>
              <li>• Presentations: PPT, PPTX (max 25MB)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PromotionMarketingAssets;
