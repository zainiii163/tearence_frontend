import React, { useState, useEffect } from 'react';
import Fiverr from '../Component/Fiverr';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Investing from '../Component/Investing';
import Footer from '../Component/Footer';
import Loading from '../Component/Loading';

function InvestingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay, you can replace this with actual loading logic.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the delay as needed

    // Cleanup the timer if the component unmounts before loading is complete.
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <UnifiedNavbar />
          <Fiverr />
          <Investing />
          <Footer />
        </>
      )}
    </div>
  );
}

export default InvestingPage;
