import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = window.checkConsent();
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    window.acceptConsent();
    setIsVisible(false);
  };

  const handleDecline = () => {
    window.declineConsent();
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div style={styles.banner}>
      <p style={styles.text}>We use cookies to ensure you get the best experience on our website. Do you accept cookies?</p>
      <button onClick={handleAccept} style={styles.button}>Accept</button>
      <button onClick={handleDecline} style={styles.button}>Decline</button>
    </div>
  );
};

const styles = {
  banner: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
  },
  text: {
    margin: 0,
    paddingRight: '10px',
  },
  button: {
    marginLeft: '10px',
    padding: '5px 10px',
    border: 'none',
    cursor: 'pointer',
  }
};

export default CookieConsent;
