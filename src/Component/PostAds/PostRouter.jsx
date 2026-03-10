import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EventPostForm from '../EventsVenues/EventPostForm';
import PostBanner from './PostBanner';
import PostAffiliate from '../affiliates/forms/PromoterAffiliateForm';
import PostClassified from './PostClassified';
import VehiclePostForm from '../vehicles/VehiclePostForm';
import PostItems from './PostItems';
import PostJobs from './PostJobs';
import PostVacancies from './PostVacancies';
import PostBusiness from './PostBusiness';
import PostCharities from './PostCharities';
import FeaturedAdvertPostingForm from '../featured/FeaturedPostForm';
import { useParams } from 'react-router-dom';

const PostRouter = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { logIn } = useSelector((store) => store.auth);

  // Check authentication
  React.useEffect(() => {
    if (!logIn) {
      navigate('/login', { replace: true });
      return;
    }

    // Redirect services posting to new comprehensive form in ServicesMarketplacePage
    if (slug === 'services') {
      navigate('/services?postForm=true', { replace: true });
    }
    // Redirect property posting to new property marketplace
    if (slug === 'property') {
      navigate('/property/post', { replace: true });
    }
    // Redirect vehicles posting to new vehicles marketplace
    if (slug === 'vehicles') {
      navigate('/vehicles?postForm=true', { replace: true });
    }
    // Redirect books posting to new books marketplace
    if (slug === 'books' || slug === 'book') {
      navigate('/books?postForm=true', { replace: true });
    }
    // Redirect travel posting to new resorts & travel marketplace
    if (slug === 'hotel-resorts-travel') {
      navigate('/resorts-travel?postForm=true', { replace: true });
    }
    // Redirect affiliate posting to new affiliates hub
    if (slug === 'affiliate' || slug === 'affiliate-programs') {
      navigate('/affiliates?postForm=true', { replace: true });
    }
  }, [slug, navigate, logIn]);

  const renderPostComponent = () => {
    switch (slug) {
      case 'banner':
        return <PostBanner />;
      case 'events':
        return <EventPostForm />;
      case 'affiliate':
        return null; // Redirect handled by useEffect
      case 'affiliate-programs':
        return null; // Redirect handled by useEffect
      case 'classified':
        return <PostClassified />;
      case 'vehicles':
        return null; // Redirect handled by useEffect
      case 'items':
        return <PostItems />;
      case 'buy-and-sell':
        return <PostItems />;
      // Property now uses dedicated route - this is kept for backward compatibility
      case 'property':
        return null; // Redirect handled by useEffect
      case 'books':
      case 'book':
        return null; // Redirect handled by useEffect
      case 'jobs':
        return <PostJobs />;
      case 'vacancies':
        return <PostVacancies />;
      case 'business-and-stores':
        return <PostBusiness />;
      case 'charities-and-donations':
        return <PostCharities />;
      case 'funding':
        return <EventPostForm />; // Using EventPostForm as placeholder for funding
      case 'electronics':
        return <PostItems />; // Using PostItems for electronics
      case 'hotel-resorts-travel':
        return null; // Redirected to /resorts-travel?postForm=true
      case 'sponsored-ads':
        return <PostBanner />; // Using PostBanner for sponsored ads
      case 'featured-advert':
        return <FeaturedAdvertPostingForm />;
      case 'featured-ads':
        return <FeaturedAdvertPostingForm />;
      default:
        return <EventPostForm />; // Default to events for unknown slugs
    }
  };

  const component = renderPostComponent();
  
  // Return null for redirected cases
  if (component === null) {
    return null;
  }

  return component;
};

export default PostRouter;
