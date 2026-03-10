import React, { useState } from 'react';
import { FiX, FiFlag, FiAlertTriangle, FiMail, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdvertReportingSystem = ({ advertId, advertTitle, onClose }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportReasons = [
    {
      id: 'fraud',
      label: 'Fraud or Scam',
      description: 'This advert appears to be fraudulent or attempting to scam users',
      icon: <FiAlertTriangle className="h-5 w-5 text-red-500" />
    },
    {
      id: 'spam',
      label: 'Spam',
      description: 'This advert is spam, repetitive, or irrelevant',
      icon: <FiMail className="h-5 w-5 text-orange-500" />
    },
    {
      id: 'illegal',
      label: 'Illegal Content',
      description: 'This advert contains illegal or prohibited content',
      icon: <FiAlertTriangle className="h-5 w-5 text-red-600" />
    },
    {
      id: 'duplicate',
      label: 'Duplicate Advert',
      description: 'This is a duplicate of another existing advert',
      icon: <FiFlag className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'inappropriate',
      label: 'Inappropriate Content',
      description: 'This advert contains inappropriate or offensive content',
      icon: <FiAlertTriangle className="h-5 w-5 text-yellow-500" />
    },
    {
      id: 'misleading',
      label: 'Misleading Information',
      description: 'This advert contains false or misleading information',
      icon: <FiFlag className="h-5 w-5 text-purple-500" />
    },
    {
      id: 'other',
      label: 'Other',
      description: 'Other reason not listed above',
      icon: <FiFlag className="h-5 w-5 text-gray-500" />
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a description of the issue');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - in production, this would send to backend
      const reportData = {
        advert_id: advertId,
        advert_title: advertTitle,
        reason: selectedReason,
        description: description.trim(),
        timestamp: new Date().toISOString(),
        user_id: localStorage.getItem('customer_id') || 'anonymous'
      };

      console.log('Submitting report:', reportData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      toast.success('Report submitted successfully. We will review it shortly.');
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Report Submitted</h3>
          <p className="text-gray-600 mb-4">
            Thank you for your report. Our team will review this advert and take appropriate action.
          </p>
          <p className="text-sm text-gray-500">
            Report ID: RPT-{Date.now().toString().slice(-8)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiFlag className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Report Advert</h3>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Advert Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Reporting advert:</p>
            <p className="font-medium text-gray-900">{advertTitle}</p>
            <p className="text-sm text-gray-500">ID: {advertId}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Report Reasons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Reason for reporting <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {reportReasons.map((reason) => (
                  <label
                    key={reason.id}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedReason === reason.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {reason.icon}
                        <span className="font-medium text-gray-900 ml-2">{reason.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{reason.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Please provide more details about why you are reporting this advert..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Please be as specific as possible. This helps us take appropriate action.
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Privacy Notice</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your report will be reviewed by our moderation team</li>
                <li>• The advertiser will not see who reported them</li>
                <li>• False or malicious reports may result in account suspension</li>
                <li>• We may contact you for additional information if needed</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedReason || !description.trim()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiFlag className="h-4 w-4 mr-2" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdvertReportingSystem;
