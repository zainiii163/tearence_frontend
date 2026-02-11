import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { FaCreditCard, FaPaypal, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PaymentIntegration = ({ 
  book, 
  onPaymentSuccess, 
  onPaymentError, 
  onClose,
  amount = null 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const finalAmount = amount || book.price;

  // PayPal configuration
  const paypalOptions = {
    'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
  };

  const handleCardPayment = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      setPaymentError('Please fill in all card details');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Simulate card payment processing
      // In production, this would integrate with a payment gateway like Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      onPaymentSuccess({
        paymentMethod: 'card',
        amount: finalAmount,
        transactionId: 'card_' + Date.now(),
        status: 'completed'
      });
      
      toast.success('Payment successful!');
    } catch (error) {
      const errorMessage = error.message || 'Card payment failed';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSuccess = (data) => {
    setIsProcessing(false);
    onPaymentSuccess({
      paymentMethod: 'paypal',
      amount: finalAmount,
      transactionId: data.orderID,
      status: 'completed',
      paypalData: data
    });
    toast.success('PayPal payment successful!');
  };

  const handlePayPalError = (error) => {
    setIsProcessing(false);
    const errorMessage = 'PayPal payment failed. Please try again.';
    setPaymentError(errorMessage);
    onPaymentError(errorMessage);
    toast.error(errorMessage);
  };

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
    setPaymentError('');
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`p-4 border rounded-lg transition-all ${
              paymentMethod === 'paypal' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <FaPaypal className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium">PayPal</p>
            <p className="text-xs text-gray-600">Fast & secure</p>
          </button>

          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border rounded-lg transition-all ${
              paymentMethod === 'card' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <FaCreditCard className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="font-medium">Credit/Debit Card</p>
            <p className="text-xs text-gray-600">Visa, Mastercard, etc.</p>
          </button>
        </div>
      </div>

      {/* Payment Error */}
      {paymentError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <FaExclamationTriangle className="h-4 w-4 text-red-600" />
          <p className="text-sm text-red-700">{paymentError}</p>
        </div>
      )}

      {/* PayPal Payment */}
      {paymentMethod === 'paypal' && (
        <div>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FaLock className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Secure PayPal Payment</p>
            </div>
            <p className="text-xs text-blue-700">
              You will be redirected to PayPal to complete your payment securely.
            </p>
          </div>

          <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={(data, actions) => {
                setIsProcessing(true);
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: finalAmount.toString(),
                      currency_code: 'USD'
                    },
                    description: `Purchase of ${book.title} by ${book.author}`
                  }]
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  handlePayPalSuccess(data);
                });
              }}
              onError={(err) => {
                handlePayPalError(err);
              }}
              onCancel={() => {
                setIsProcessing(false);
                toast.info('Payment cancelled');
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}

      {/* Card Payment */}
      {paymentMethod === 'card' && (
        <div>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FaLock className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Secure Card Payment</p>
            </div>
            <p className="text-xs text-blue-700">
              Your card information is encrypted and secure. We never store your card details.
            </p>
          </div>

          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => handleCardInputChange('number', formatCardNumber(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={19}
              />
            </div>

            {/* Card Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => handleCardInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={3}
                />
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleCardPayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <FaCreditCard className="h-4 w-4" />
                  Pay ${finalAmount}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Security Badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FaLock className="h-3 w-3" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCheckCircle className="h-3 w-3" />
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentIntegration;
