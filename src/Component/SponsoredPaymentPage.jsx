import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSponsoredAdvert } from '../api/sponsored';

function SponsoredPaymentPage() {
  const { advertId } = useParams();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [advert, setAdvert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sponsored advert pricing tiers
  const pricingTiers = {
    basic: { title: 'Basic Sponsored Advert', price: '£29', duration: '7 days' },
    standard: { title: 'Standard Sponsored Advert', price: '£79', duration: '30 days' },
    premium: { title: 'Premium Sponsored Advert', price: '£199', duration: '90 days' }
  };

  useEffect(() => {
    const fetchAdvertDetails = async () => {
      try {
        setLoading(true);
        const response = await getSponsoredAdvert(advertId);
        
        if (response.success) {
          setAdvert(response.data);
        } else {
          setError('Failed to load advert details');
        }
      } catch (err) {
        console.error('Error fetching advert:', err);
        setError('Failed to load advert details');
      } finally {
        setLoading(false);
      }
    };

    if (advertId) {
      fetchAdvertDetails();
    }
  }, [advertId]);

  const handlePayment = async (tier) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing - in production, this would integrate with a payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Payment successful! Your ${tier.title} is now active.`);
      
      // Redirect to sponsored adverts page or user's sponsored ads
      navigate('/sponsored-adverts');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advert details...</p>
        </div>
      </div>
    );
  }

  if (error || !advert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Advert not found'}</p>
          <button
            onClick={() => navigate('/sponsored-adverts')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Sponsored Adverts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Sponsored Advert Payment</h1>
          <p className="text-gray-600 mb-8">Choose a promotion tier to boost your advert's visibility</p>
          
          {/* Advert Preview */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Advert Preview</h2>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{advert.title || 'Untitled Advert'}</h3>
              <p className="text-gray-600 mb-3">{advert.description?.substring(0, 150) || 'No description available'}...</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Category: {advert.category || 'General'}</span>
                <span className="text-sm text-gray-500">ID: {advertId}</span>
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Promotion Tier</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(pricingTiers).map(([key, tier]) => (
                <div
                  key={key}
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tier.title}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{tier.price}</div>
                  <div className="text-sm text-gray-600 mb-4">{tier.duration}</div>
                  
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">·</span>
                      Featured placement
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">·</span>
                      Increased visibility
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">·</span>
                      Priority support
                    </li>
                  </ul>
                  
                  <button
                    onClick={() => handlePayment(tier)}
                    disabled={isProcessing}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? 'Processing...' : `Pay ${tier.price}`}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate('/sponsored-adverts')}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel and Return to Sponsored Adverts
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>· Secure payment powered by WorldwideAdverts</p>
            <p className="mt-1">Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SponsoredPaymentPage;
