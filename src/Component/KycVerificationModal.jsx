import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert, Spinner } from 'reactstrap';
import { submitKycVerification, clearKycErrorAndMessage, VERIFICATION_TYPES, KYC_STATUS } from '../slice/KycSlice';

const KycVerificationModal = ({ isOpen, toggle, kycRequired, postCount }) => {
  const dispatch = useDispatch();
  const { loading, error, message, kycStatus } = useSelector(state => state.kyc);
  
  const [verificationType, setVerificationType] = useState(VERIFICATION_TYPES.ID_CARD);
  const [documents, setDocuments] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearKycErrorAndMessage());
        if (kycStatus === KYC_STATUS.PENDING) {
          toggle();
        }
      }, 3000);
    }
  }, [message, kycStatus, dispatch, toggle]);

  const handleDocumentChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setDocuments(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const verificationData = {
      verificationType,
      documents,
      ...formData
    };

    // Filter out empty values
    Object.keys(verificationData).forEach(key => {
      if (verificationData[key] === '' || verificationData[key] === null) {
        delete verificationData[key];
      }
    });

    dispatch(submitKycVerification(verificationData));
  };

  const renderVerificationForm = () => {
    switch (verificationType) {
      case VERIFICATION_TYPES.ID_CARD:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ID Card (Front)</label>
              <input
                type="file"
                name="id_card_front"
                onChange={handleDocumentChange}
                accept="image/*"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ID Card (Back)</label>
              <input
                type="file"
                name="id_card_back"
                onChange={handleDocumentChange}
                accept="image/*"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        );

      case VERIFICATION_TYPES.DRIVERS_LICENSE:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Driver's License (Front)</label>
              <input
                type="file"
                name="drivers_license_front"
                onChange={handleDocumentChange}
                accept="image/*"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Driver's License (Back)</label>
              <input
                type="file"
                name="drivers_license_back"
                onChange={handleDocumentChange}
                accept="image/*"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        );

      case VERIFICATION_TYPES.PASSPORT:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Passport</label>
              <input
                type="file"
                name="passport"
                onChange={handleDocumentChange}
                accept="image/*"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        );

      case VERIFICATION_TYPES.EMAIL_MOBILE:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        );

      case VERIFICATION_TYPES.ADDRESS:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        KYC Verification Required
      </ModalHeader>
      <ModalBody>
        {kycRequired && (
          <Alert color="warning">
            You have made {postCount} posts. KYC verification is required after 5 posts to continue using the platform.
          </Alert>
        )}

        {error && <Alert color="danger">{error}</Alert>}
        {message && <Alert color="success">{message}</Alert>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Verification Method</label>
          <select
            value={verificationType}
            onChange={(e) => setVerificationType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value={VERIFICATION_TYPES.ID_CARD}>ID Card</option>
            <option value={VERIFICATION_TYPES.DRIVERS_LICENSE}>Driver's License</option>
            <option value={VERIFICATION_TYPES.PASSPORT}>Passport</option>
            <option value={VERIFICATION_TYPES.EMAIL_MOBILE}>Email & Mobile</option>
            <option value={VERIFICATION_TYPES.ADDRESS}>Address Verification</option>
          </select>
        </div>

        {renderVerificationForm()}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button 
          color="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : 'Submit Verification'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default KycVerificationModal;
