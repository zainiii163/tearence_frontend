import React from "react";
import EbayAdsData from "../data/ebay.json";
import moment from "moment";

const EbayAds = () => {
  // useEffect(() => {
  //   dispatch(getEbayAds());
  // }, []);

  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Ebay Ads</h2>
          <p className="text-muted-foreground">Special offers and deals from our partners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {EbayAdsData.data?.items?.map((item, index) => ( */}
        {EbayAdsData.map((item, index) => (
          <div
            key={item.id}
            className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="flex h-28 sm:h-32">
              {/* Square Image on Left */}
              {item.imageUrl && (
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-l-lg m-2 sm:m-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              
              {/* Text Content on Right */}
              <div className="flex-1 p-2 sm:p-4 flex flex-col justify-between min-h-0">
                <div className="space-y-1">
                  <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary">
                    {item.groupName}
                  </div>
                  
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
                    {item.description}
                  </p>
                </div>
                
                <div className="space-y-1 mt-1 sm:mt-2">
                  <div className="flex items-center justify-between gap-2">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-6 sm:h-7 px-2 sm:px-3 flex-shrink-0"
                    >
                      Open Link
                    </a>
                    
                    <p className="text-xs text-muted-foreground text-right">
                      Expires {moment(item.endDate).format("MM/DD")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default EbayAds;
