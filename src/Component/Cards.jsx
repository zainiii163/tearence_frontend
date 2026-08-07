import React from "react";
import { Link } from "react-router-dom";

function Cards() {
  const data = [
    {
      title: "Sponsored Ads",
      description:
        "Sponsored ads content can be an effective way for businesses to reach their target audience in a less intrusive manner.",
      link: "/sponsored-ads",
      image: "/img/ads-banner-1.png",
    },
    {
      title: "Classifieds Ads",
      description:
        "Classifieds ads content can be an effective way for businesses to reach their target audience in a less intrusive manner.",
      link: "/classifieds-ads",
      image: "/img/ads-banner-2.png",
    },
    {
      title: "Affiliate Ads",
      description:
        "Affiliate ads content can be an effective way for businesses to reach their target audience in a less intrusive manner.",
      link: "/affiliate-ads",
      image: "/img/ads-banner-3.png",
    },
    {
      title: "Featured Ads",
      description:
        "Featured ads content can be an effective way for businesses to reach their target audience in a less intrusive manner.",
      link: "/featured-ads",
      image: "/img/ads-banner-5.png",
    },
    {
      title: "Promoted Ads",
      description:
        "Promoted ads content can be an effective way for businesses to reach their target audience in a less intrusive manner.",
      link: "/promoted-ads",
      image: "/img/ads-banner-4.jpg",
    },
    {
      title: "Banner Adverts",
      description:
        "Banner adverts content can be an effective way for businesses to reach their target audience in a less intrusive manner.",
      link: "/banner-adverts",
      image: "/img/ads-banner-6.jpg",
    },
  ];
  return (
    <div className="w-full flex justify-center pt-12 mb-10">
      <div className="container">
        <div className="grid grid-cols-1 justify-center gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                  alt={item.title}
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <div className="flex-1 py-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-2">
                  <Link to={item.link}>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 w-full">
                      See All
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cards;
