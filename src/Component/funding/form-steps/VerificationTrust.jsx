import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  X, 
  Shield,
  FileText,
  Globe,
  Link,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const VerificationTrust = ({ formData, updateFormData, onNext, onPrev }) => {
  const [socialLinks, setSocialLinks] = useState(formData.socialLinks || []);

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

  const platforms = [
    'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 
    'TikTok', 'GitHub', 'Website', 'Other'
  ];

  const isFormValid = formData.website; // Only website is required

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Verification & Trust</h3>
        <p className="text-gray-600">
          Build trust with funders by providing verification information and connecting your online presence.
        </p>
      </div>

      {/* Identity Verification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Shield className="w-4 h-4 inline mr-1" />
          Identity Verification (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
          {formData.identityDocument ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Document uploaded</p>
                  <p className="text-sm text-gray-600">{formData.identityDocument.name}</p>
                </div>
              </div>
              <button
                onClick={() => updateFormData({ identityDocument: null })}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove document
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Shield className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600 mb-2">Upload identity verification document</p>
                <p className="text-sm text-gray-500">This helps build trust with funders (ID, passport, business license, etc.)</p>
              </div>
              <button
                onClick={() => document.getElementById('identity-upload').click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Document
              </button>
            </div>
          )}
          <input
            id="identity-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleIdentityUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Business Registration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Business Registration Number (Optional)
        </label>
        <input
          type="text"
          value={formData.businessRegistration || ''}
          onChange={(e) => updateFormData({ businessRegistration: e.target.value })}
          placeholder="Enter your business registration number if applicable"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          For registered businesses to enhance credibility
        </p>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="w-4 h-4 inline mr-1" />
          Website <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          value={formData.website || ''}
          onChange={(e) => updateFormData({ website: e.target.value })}
          placeholder="https://yourwebsite.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Your project or business website
        </p>
      </div>

      {/* Social Media Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <Link className="w-4 h-4 inline mr-1" />
            Social Media Links
          </label>
          <button
            onClick={addSocialLink}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Link
          </button>
        </div>

        {socialLinks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <Link className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No social links added yet</p>
            <p className="text-sm text-gray-500">Connect your social media to build trust</p>
          </div>
        ) : (
          <div className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={link.id} className="border border-gray-200 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <select
                      value={link.platform || ''}
                      onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select platform</option>
                      {platforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="url"
                      value={link.url || ''}
                      onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeSocialLink(link.id)}
                  className="mt-3 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="bg-green-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 mb-2">Building Trust</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Verified projects receive 3x more funding on average</li>
              <li>• Complete verification information increases backer confidence</li>
              <li>• Social media presence shows project legitimacy</li>
              <li>• Business registration adds professional credibility</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-amber-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900 mb-2">Privacy & Security</h4>
            <p className="text-sm text-amber-700">
              Your verification documents and personal information are encrypted and stored securely. 
              We only share necessary verification status with funders, not the actual documents.
            </p>
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
          disabled={!isFormValid}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VerificationTrust;
