import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Shield, Star, Phone, Mail, Globe, Facebook, Twitter, Linkedin, Instagram, User } from 'lucide-react';

const SponsoredSellerInfo = ({ sellerInfo, setSellerInfo }) => {
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setLogoUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSellerInfo({
          ...sellerInfo,
          logo: e.target.result
        });
        setLogoUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setSellerInfo({
      ...sellerInfo,
      logo: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addSocialLink = (platform) => {
    const currentLinks = sellerInfo.socialLinks || {};
    setSellerInfo({
      ...sellerInfo,
      socialLinks: {
        ...currentLinks,
        [platform]: ''
      }
    });
  };

  const updateSocialLink = (platform, value) => {
    const currentLinks = sellerInfo.socialLinks || {};
    setSellerInfo({
      ...sellerInfo,
      socialLinks: {
        ...currentLinks,
        [platform]: value
      }
    });
  };

  const removeSocialLink = (platform) => {
    const currentLinks = sellerInfo.socialLinks || {};
    const newLinks = { ...currentLinks };
    delete newLinks[platform];
    setSellerInfo({
      ...sellerInfo,
      socialLinks: newLinks
    });
  };

  const socialPlatforms = [
    { id: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/yourhandle' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourprofile' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourprofile' }
  ];

  const verificationBenefits = [
    '✓ Verified Seller Badge on all your adverts',
    '✓ Higher trust scores and buyer confidence',
    '✓ Priority customer support',
    '✓ Advanced analytics dashboard',
    '✓ Featured in verified sellers directory'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Seller / Poster Information</h2>
        <p className="text-gray-600">Build trust with potential buyers by providing your details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={sellerInfo.name || ''}
                  onChange={(e) => setSellerInfo({ ...sellerInfo, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name (optional)
                </label>
                <input
                  type="text"
                  value={sellerInfo.businessName || ''}
                  onChange={(e) => setSellerInfo({ ...sellerInfo, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your business or company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={sellerInfo.phone || ''}
                  onChange={(e) => setSellerInfo({ ...sellerInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={sellerInfo.email || ''}
                  onChange={(e) => setSellerInfo({ ...sellerInfo, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              Online Presence
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (optional)
                </label>
                <input
                  type="url"
                  value={sellerInfo.website || ''}
                  onChange={(e) => setSellerInfo({ ...sellerInfo, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Social Media Links (optional)
                </label>
                
                <div className="space-y-3">
                  {socialPlatforms.map((platform) => {
                    const Icon = platform.icon;
                    const hasLink = sellerInfo.socialLinks?.[platform.id];
                    
                    return (
                      <div key={platform.id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        
                        {hasLink !== undefined ? (
                          <div className="flex-1 flex items-center space-x-2">
                            <input
                              type="url"
                              value={sellerInfo.socialLinks[platform.id]}
                              onChange={(e) => updateSocialLink(platform.id, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={platform.placeholder}
                            />
                            <button
                              type="button"
                              onClick={() => removeSocialLink(platform.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addSocialLink(platform.id)}
                            className="flex-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-left text-gray-500"
                          >
                            Add {platform.label} link...
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Logo & Verification */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Logo</h3>
            
            {sellerInfo.logo ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={sellerInfo.logo}
                    alt="Business Logo"
                    className="w-full h-32 object-contain rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Logo uploaded successfully
                </p>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Upload Logo</p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Verification Upsell */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Verified Seller Badge
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Build instant trust and credibility with buyers
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              {verificationBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit.replace('✓ ', '')}</span>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => setSellerInfo({ ...sellerInfo, verifiedSeller: !sellerInfo.verifiedSeller })}
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
                ${sellerInfo.verifiedSeller
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50'
                }
              `}
            >
              {sellerInfo.verifiedSeller ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Verification Added - $19.99</span>
                </>
              ) : (
                <>
                  <Star className="w-5 h-5" />
                  <span>Add Verification - $19.99</span>
                </>
              )}
            </button>
            
            {sellerInfo.verifiedSeller && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 text-center">
                  ✓ Your verified badge will appear on all adverts
                </p>
              </div>
            )}
          </div>

          {/* Trust Score Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Score Preview</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base Score</span>
                <span className="text-sm font-medium">60/100</span>
              </div>
              
              {sellerInfo.name && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Name Provided</span>
                  <span className="text-sm font-medium text-green-600">+10</span>
                </div>
              )}
              
              {sellerInfo.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone Verified</span>
                  <span className="text-sm font-medium text-green-600">+15</span>
                </div>
              )}
              
              {sellerInfo.email && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Provided</span>
                  <span className="text-sm font-medium text-green-600">+10</span>
                </div>
              )}
              
              {sellerInfo.logo && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Business Logo</span>
                  <span className="text-sm font-medium text-green-600">+5</span>
                </div>
              )}
              
              {sellerInfo.verifiedSeller && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verified Badge</span>
                  <span className="text-sm font-medium text-green-600">+25</span>
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total Trust Score</span>
                  <span className="text-lg font-bold text-blue-600">
                    {60 + 
                     (sellerInfo.name ? 10 : 0) + 
                     (sellerInfo.phone ? 15 : 0) + 
                     (sellerInfo.email ? 10 : 0) + 
                     (sellerInfo.logo ? 5 : 0) + 
                     (sellerInfo.verifiedSeller ? 25 : 0)
                    }/100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsoredSellerInfo;
