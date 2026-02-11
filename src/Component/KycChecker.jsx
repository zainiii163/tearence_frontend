import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkKycRequirement } from '../slice/KycSlice';
import KycVerificationModal from './KycVerificationModal';

const KycChecker = ({ children }) => {
  const dispatch = useDispatch();
  const { kycRequired, postCount, kycStatus, loading } = useSelector(state => state.kyc);
  const [showKycModal, setShowKycModal] = React.useState(false);

  useEffect(() => {
    dispatch(checkKycRequirement());
  }, [dispatch]);

  useEffect(() => {
    if (kycRequired && kycStatus === 'not_verified' && !loading) {
      setShowKycModal(true);
    }
  }, [kycRequired, kycStatus, loading]);

  const handleCloseModal = () => {
    setShowKycModal(false);
  };

  return (
    <>
      {children}
      <KycVerificationModal
        isOpen={showKycModal}
        toggle={handleCloseModal}
        kycRequired={kycRequired}
        postCount={postCount}
      />
    </>
  );
};

export default KycChecker;
