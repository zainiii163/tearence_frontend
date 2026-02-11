import React, { useState, useRef } from 'react';
import { FaQrcode, FaDownload, FaCopy, FaMobile, FaShare, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReferralQRCode = ({ referralCode, referralLink, userName }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const canvasRef = useRef(null);

  // Generate QR code URL using a free QR code API
  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralLink)}&format=png&margin=10`;
    setQrCodeUrl(qrUrl);
    setShowModal(true);
  };

  // Download QR code
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `referral-${referralCode}.png`;
    link.click();
    toast.success('QR code downloaded!');
  };

  // Copy QR code image
  const copyQRCode = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      toast.success('QR code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy QR code');
    }
  };

  // Share QR code
  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], 'referral-qr.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Join me on WWA Platform!',
          text: `Use my referral code: ${referralCode} to get 20% discount on your first advert!`,
          files: [file]
        });
      } catch (error) {
        toast.error('Failed to share QR code');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyQRCode();
    }
  };

  // Mobile sharing widget
  const MobileShareWidget = () => (
    <div className="md:hidden fixed bottom-4 right-4 z-50">
      <button
        onClick={generateQRCode}
        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
      >
        <FaQrcode className="text-xl" />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop QR Code Button */}
      <div className="hidden md:block">
        <button
          onClick={generateQRCode}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaQrcode className="text-lg" />
          Generate QR Code
        </button>
      </div>

      {/* Mobile Share Widget */}
      <MobileShareWidget />

      {/* QR Code Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Referral QR Code</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* QR Code Image */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <img 
                  src={qrCodeUrl} 
                  alt="Referral QR Code" 
                  className="w-64 h-64"
                />
              </div>
            </div>

            {/* Referral Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Scan to join with {userName}'s referral
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {referralCode}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Get 20% discount on your first advert!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={downloadQRCode}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaDownload />
                Download
              </button>
              <button
                onClick={copyQRCode}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <FaCopy />
                Copy
              </button>
              <button
                onClick={shareQRCode}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaShare />
                Share
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FaTimes />
                Close
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Share this QR code anywhere - business cards, flyers, social media</p>
              <p>Friends can scan to get 20% off their first advert!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferralQRCode;
