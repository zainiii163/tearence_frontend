import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { purchaseBook, downloadBookPDF } from '../../slice/BookMarketplaceSlice';
import PaymentIntegration from './PaymentIntegration';
import {
  FaShoppingCart,
  FaDownload,
  FaPaypal,
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaLock,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const BookPurchaseFlow = ({ book, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { purchasing, downloading } = useSelector((state) => state.bookMarketplace);
  
  const [step, setStep] = useState(1); // 1: Select Payment, 2: Process Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [paymentError, setPaymentError] = useState('');
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentError('');
  };

  const handlePurchase = async (paymentData) => {
    try {
      setPaymentError('');
      setStep(2);
      
      // Process purchase with payment data
      await dispatch(purchaseBook({ 
        bookId: book.book_id, 
        paymentData 
      })).unwrap();
      
      setPurchaseComplete(true);
      setStep(3);
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast.success('Purchase successful! You can now download your book.');
    } catch (error) {
      setPaymentError(error.message || 'Purchase failed. Please try again.');
      setStep(1);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    handlePurchase(paymentData);
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
    setStep(1);
  };

  const handleDownload = async () => {
    try {
      await dispatch(downloadBookPDF(book.book_id)).unwrap();
      toast.success('Download started successfully!');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Download failed. Please try again.');
    }
  };

  const handleClose = () => {
    if (purchaseComplete) {
      onClose();
    } else {
      // Confirm before closing if purchase is in progress
      if (!purchasing) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={purchasing || downloading}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Book Summary */}
          <div className="flex gap-4 mb-6">
            <img
              src={book.cover_image || '/img/NoImage.png'}
              alt={book.title}
              className="w-16 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <p className="text-lg font-bold text-primary mt-1">${book.price}</p>
            </div>
          </div>

          {/* Step 1: Payment Integration */}
          {step === 1 && (
            <PaymentIntegration
              book={book}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onClose={onClose}
            />
          )}

          {/* Step 2: Processing Payment */}
          {step === 2 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
              <p className="text-gray-600">Please wait while we process your payment...</p>
            </div>
          )}

          {/* Step 3: Purchase Complete */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Purchase Successful!</h2>
                <p className="text-gray-600">
                  Thank you for your purchase. You can now download your book.
                </p>
              </div>

              {book.book_type === 'pdf' && (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 h-12 px-4 py-2 text-sm font-medium transition-colors mb-3"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FaDownload className="h-4 w-4" />
                      Download PDF Book
                    </>
                  )}
                </button>
              )}

              {book.book_type === 'audiobook' && (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 h-12 px-4 py-2 text-sm font-medium transition-colors mb-3"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FaDownload className="h-4 w-4" />
                      Download Audiobook
                    </>
                  )}
                </button>
              )}

              {book.book_type === 'external' && (
                <a
                  href={book.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 h-12 px-4 py-2 text-sm font-medium transition-colors mb-3"
                >
                  Visit Book Website
                </a>
              )}

              <button
                onClick={handleClose}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-4 py-2 text-sm font-medium transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookPurchaseFlow;
