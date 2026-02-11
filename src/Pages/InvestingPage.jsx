import React, { useState, useEffect } from 'react';
import Fiverr from '../Component/Fiverr';
import Navbar from '../Component/Navbar';
import Investing from '../Component/Investing';
import Footer from '../Component/Footer';
import FundingPage from '../Component/FundingPage';
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
          <Navbar />
          <FundingPage />
          <Fiverr />
          <Investing />
          <Footer />
        </>
      )}
    </div>
  );
}

export default InvestingPage;
