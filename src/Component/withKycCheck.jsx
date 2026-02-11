import React from 'react';
import { useSelector } from 'react-redux';
import KycChecker from './KycChecker';

/**
 * HOC to wrap components with KYC checking
 * This will automatically check KYC requirements and show verification modal if needed
 */
const withKycCheck = (WrappedComponent) => {
  const WithKycCheckComponent = (props) => {
    return (
      <KycChecker>
        <WrappedComponent {...props} />
      </KycChecker>
    );
  };

  WithKycCheckComponent.displayName = `withKycCheck(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithKycCheckComponent;
};

export default withKycCheck;
