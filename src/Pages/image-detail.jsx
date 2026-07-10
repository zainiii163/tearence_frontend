import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Heart, Star, Check, Share2, ShoppingCart, Shield, Eye } from 'lucide-react';
import imagesApi from '../services/imagesAPI';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';

const ImageDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadImage();
  }, [slug]);

  const loadImage = async () => {
    try {
      setLoading(true);
      const response = await imagesApi.getImageBySlug(slug);
      setImage(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await imagesApi.unsaveImage(image.id);
      } else {
        await imagesApi.saveImage(image.id);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error saving image:', err);
    }
  };

  const handleDownload = async () => {
    try {
      await imagesApi.downloadImage(image.id);
      alert('Download started!');
    } catch (err) {
      console.error('Error downloading image:', err);
      alert('Error downloading image');
    }
  };

  const handlePurchase = async () => {
    try {
      const response = await imagesApi.processPayment(image.id, {
        payment_method: 'card',
        license_type: image.license_type || 'royalty_free',
      });
      alert('Purchase successful!');
      loadImage();
    } catch (err) {
      console.error('Error purchasing image:', err);
      alert('Error purchasing image');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading image...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Image not found'}</p>
            <button
              onClick={() => navigate('/images')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Images
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = image.main_image_url || (image.main_image?.startsWith('http') ? image.main_image : (image.main_image?.startsWith('/storage/') ? `${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'https://api.worldwideadverts.info'}${image.main_image}` : `${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'https://api.worldwideadverts.info'}/storage/${image.main_image}`)) || '/placeholder.png';

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/images')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Images</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative aspect-[4/3] bg-gray-100">
              <img
                src={imageUrl}
                alt={image.title}
                className="w-full h-full object-contain"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {image.verification_status === 'verified' && (
                  <div className="bg-green-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
                {image.promotion_tier && image.promotion_tier !== 'standard' && (
                  <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                    {image.promotion_badge || image.promotion_tier}
                  </div>
                )}
              </div>
            </div>

            {/* Image Info */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{image.resolution_width || image.width} × {image.resolution_height || image.height} px</span>
                <span className="capitalize">{image.orientation}</span>
                <span className="capitalize">{image.color_type?.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{image.title}</h1>
              <p className="text-gray-600 mb-4">{image.description}</p>
              
              {/* Price */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {image.currency || '£'}{image.display_price?.amount || image.standard_price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">License</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {image.license_label || image.license_type?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-lg font-semibold text-gray-900">{image.views_count || 0}</p>
                  <p className="text-xs text-gray-600">Views</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Download className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-lg font-semibold text-gray-900">{image.downloads_count || 0}</p>
                  <p className="text-xs text-gray-600">Downloads</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-lg font-semibold text-gray-900">{image.saves_count || 0}</p>
                  <p className="text-xs text-gray-600">Saves</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 mx-auto mb-1 text-yellow-400 fill-yellow-400" />
                  <p className="text-lg font-semibold text-gray-900">{typeof image.rating === 'number' ? image.rating.toFixed(1) : '0.0'}</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePurchase}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  className={`px-6 py-3 rounded-lg transition flex items-center gap-2 ${isSaved ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Seller Info */}
            {image.user && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-600">
                    {image.user.first_name?.[0] || image.contact_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {image.user.first_name || image.contact_name || 'Unknown'}
                      </p>
                      {image.is_verified_creator && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{image.contact_email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* License Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                License Details
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>License Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{image.license_label || image.license_type?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Commercial Use:</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span>Modification:</span>
                  <span className="font-medium text-green-600">Allowed</span>
                </div>
                <div className="flex justify-between">
                  <span>Resale:</span>
                  <span className="font-medium text-green-600">Allowed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ImageDetailPage;
