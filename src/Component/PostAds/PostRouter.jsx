import React from 'react';
import PostEvents from './PostEvents';
import PostBanner from './PostBanner';
import PostAffiliate from './PostAffiliate';
import PostClassified from './PostClassified';
import PostVehicles from './PostVehicles';
import PostItems from './PostItems';
import PostProperty from './PostProperty';
import PostBooks from './PostBooks';
import PostJobs from './PostJobs';
import PostVacancies from './PostVacancies';
import PostServices from './PostServices';
import PostBusiness from './PostBusiness';
import PostCharities from './PostCharities';
import { useParams } from 'react-router-dom';

const PostRouter = () => {
  const { slug } = useParams();

  const renderPostComponent = () => {
    switch (slug) {
      case 'banner':
        return <PostBanner />;
      case 'events':
        return <PostEvents />;
      case 'affiliate':
        return <PostAffiliate />;
      case 'affiliate-programs':
        return <PostAffiliate />;
      case 'classified':
        return <PostClassified />;
      case 'vehicles':
        return <PostVehicles />;
      case 'items':
        return <PostItems />;
      case 'buy-and-sell':
        return <PostItems />;
      case 'property':
        return <PostProperty />;
      case 'books':
        return <PostBooks />;
      case 'jobs':
        return <PostJobs />;
      case 'vacancies':
        return <PostVacancies />;
      case 'services':
        return <PostServices />;
      case 'business-and-stores':
        return <PostBusiness />;
      case 'charities-and-donations':
        return <PostCharities />;
      case 'funding':
        return <PostEvents />; // Using PostEvents as placeholder for funding
      case 'electronics':
        return <PostItems />; // Using PostItems for electronics
      case 'hotel-resorts-travel':
        return <PostEvents />; // Using PostEvents as placeholder for travel
      case 'sponsored-ads':
        return <PostBanner />; // Using PostBanner for sponsored ads
      default:
        return <PostEvents />; // Default to events for unknown slugs
    }
  };

  return renderPostComponent();
};

export default PostRouter;
