import React, { useEffect } from "react";

const EbayAd = () => {
  useEffect(() => {
    // Create a script element
    const script = document.createElement("script");
    script.src = "https://epnt.ebay.com/static/epn-smart-tools.js"; // eBay Partner script
    script.async = true;
    window._epn = {
      campaign: "5337911034", // Replace with your campaign ID
    };
    // Append the script to the document body
    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <ins
        className="epn-placement"
        data-config-id="001ff94a27bdfc4ee4c7390f"
      ></ins>
    </div>
  );
};

export default EbayAd;
