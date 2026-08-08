import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { upsellTier } = location.state || {};
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const upsellTiers = {
    promoted: { title: 'Promoted Project', price: '£29' },
    featured: { title: 'Featured Project', price: '£79' },
    sponsored: { title: 'Sponsored Project', price: '£199' }
  };

  const selectedTier = upsellTiers[upsellTier];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment successful! Your project has been upgraded.');
      navigate('/quick-funding');
    }, 2000);
  };

  if (!upsellTier || !selectedTier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Payment Request</h1>
          <button
            onClick={() => navigate('/create-funding')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Upgrade</h1>
          <p className="text-gray-600 mb-8">Secure payment for your project promotion</p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedTier.title}</h2>
            <div className="text-3xl font-bold text-blue-600">{selectedTier.price}</div>
            <div className="text-sm text-gray-600 mt-1">One-time payment</div>
          </div>

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

          <div className="mt-8 space-y-4">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : `Pay ${selectedTier.price}`}
            </button>
            
            <button
              onClick={() => navigate('/quick-funding')}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔒 Secure payment powered by WorldwideAdverts</p>
            <p className="mt-1">Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
