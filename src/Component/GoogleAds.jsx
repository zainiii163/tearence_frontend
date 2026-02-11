import React, { useEffect, useState } from "react";

const GoogleAds = () => {

    const [adsByGoogle, setAdsBygGoogle] = useState();

  useEffect(() => {
    // setAdsBygGoogle9
    // const adsbygoogle = window.adsbygoogle || [];
    // adsbygoogle.push({
    //   google_ad_client: "ca-pub-6765404677676063",
    //   enable_page_level_ads: true, 
    // });
  }, []);

  return (
    <div className="w-full border-2 shadow-lg">
      {/* <div className="w-full p-8 text-slate-600">
        <ins
          className="adsbygoogle adslot_1"
          data-ad-client="ca-pub-6765404677676063"
          data-ad-slot="2816447677"
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-ad-size="300x250" 
        />
      </div> */}
    </div>
  );
};

export default GoogleAds;
