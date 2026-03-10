import React, { useState } from 'react';
import { FaFlag, FaExclamationTriangle, FaTimes, FaCheck, FaShieldAlt, FaUserSecret, FaCopy } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

const AdvertReportingSystem = ({ advertId, advertSlug, onReportSubmitted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { id: 'spam', label: 'Spam or Misleading Content', severity: 'medium' },
    { id: 'inappropriate', label: 'Inappropriate Content', severity: 'high' },
    { id: 'fraud', label: 'Fraud or Scam', severity: 'critical' },
    { id: 'duplicate', label: 'Duplicate Listing', severity: 'low' },
    { id: 'expired', label: 'Expired or No Longer Available', severity: 'low' },
    { id: 'wrong_category', label: 'Wrong Category', severity: 'low' },
    { id: 'prohibited', label: 'Prohibited Items', severity: 'high' },
    { id: 'copyright', label: 'Copyright Infringement', severity: 'medium' },
    { id: 'other', label: 'Other Reason', severity: 'medium' }
  ];

  const generateAdvertCode = () => {
    // Generate a unique advert code based on ID and timestamp
    const timestamp = Date.now().toString(36);
    const advertHash = (advertId || 'UNKNOWN').toString(36).toUpperCase();
    return `ADV-${advertHash}-${timestamp}`;
  };

  const advertCode = generateAdvertCode();

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    if (!selectedReason || !description.trim()) {
      toast.error('Please select a reason and provide a description');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportData = {
        advert_id: advertId,
        advert_slug: advertSlug,
        reason: selectedReason,
        description: description.trim(),
        reporter_email: reporterEmail.trim(),
        advert_code: advertCode,
        severity: reportReasons.find(r => r.id === selectedReason)?.severity || 'medium'
      };

      const response = await api.post('/reports/submit', reportData);
      
      if (response.data.success) {
        toast.success('Report submitted successfully. We will review it shortly.');
        setIsModalOpen(false);
        setSelectedReason('');
        setDescription('');
        setReporterEmail('');
        
        if (onReportSubmitted) {
          onReportSubmitted(response.data);
        }
      } else {
        toast.error(response.data.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Report submission error:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAdvertCode = () => {
    navigator.clipboard.writeText(advertCode);
    toast.success('Advert code copied to clipboard');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      {/* Report Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
      >
        <FaFlag className="h-4 w-4" />
        Report Ad
      </button>

      {/* Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FaFlag className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Report Advert</h3>
                    <p className="text-sm text-gray-600">Help us keep the marketplace safe</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Advert Code Display */}
            <div className="p-6 border-b border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Advert Identification Code</span>
                  <button
                    onClick={copyAdvertCode}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                  >
                    <FaCopy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono text-gray-900 bg-white px-3 py-1 rounded border">
                    {advertCode}
                  </code>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FaShieldAlt className="h-3 w-3" />
                    <span>Unique ID</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Use this code when referencing this advert in communications
                </p>
              </div>
            </div>

            {/* Report Form */}
            <form onSubmit={handleSubmitReport} className="p-6">
              {/* Report Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for Report <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {reportReasons.map((reason) => (
                    <label
                      key={reason.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedReason === reason.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="reason"
                          value={reason.id}
                          checked={selectedReason === reason.id}
                          onChange={(e) => setSelectedReason(e.target.value)}
                          className="text-purple-600 border-purple-300 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {reason.label}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(reason.severity)}`}>
                        {reason.severity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details about why you are reporting this advert..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be as specific as possible to help us review your report
                </p>
              </div>

              {/* Email (Optional) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email (Optional)
                </label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide your email if you'd like updates on your report
                </p>
              </div>

              {/* Privacy Notice */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <FaUserSecret className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Privacy & Safety</p>
                    <p>
                      Your report will be reviewed by our moderation team. 
                      We take all reports seriously and will take appropriate action. 
                      Your identity will be kept confidential unless required by law.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaFlag className="h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdvertReportingSystem;
