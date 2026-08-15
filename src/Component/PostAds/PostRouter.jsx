import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PostClassified from './PostClassified';
import PostItems from './PostItems';
import PostJobs from './PostJobs';
import PostVacancies from './PostVacancies';
import PostBusiness from './PostBusiness';
import FeaturedAdvertPostingForm from '../featured/FeaturedPostForm';

/**
 * Legacy /post/:slug router — redirects marketplace hubs to their real post flows.
 */
const PostRouter = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { logIn } = useSelector((store) => store.auth);

  React.useEffect(() => {
    if (!logIn) {
      navigate('/login', { replace: true });
      return;
    }

    const redirects = {
      services: '/services?postForm=true',
      property: '/property?postForm=true',
      vehicles: '/vehicles?postForm=true',
      books: '/books?postForm=true',
      book: '/books?postForm=true',
      'hotel-resorts-travel': '/resorts-travel?postForm=true',
      resorts: '/resorts-travel?postForm=true',
      travel: '/resorts-travel?postForm=true',
      affiliate: '/affiliates/marketplace?postForm=true&mode=business',
      'affiliate-programs': '/affiliates/marketplace?postForm=true&mode=business',
      affiliates: '/affiliates?postForm=true&mode=user',
      'affiliate-ads': '/affiliates?postForm=true&mode=user',
      'affiliate-marketplace': '/affiliates/marketplace?postForm=true&mode=business',
      'affiliate-courses': '/affiliates/courses',
      investment: '/businesses-for-sale?postForm=true',
      'sponsored-ads': '/sponsored-adverts?postForm=true',
      sponsored: '/sponsored-adverts?postForm=true',
      'sponsored-adverts': '/sponsored-adverts?postForm=true',
      'promoted-ads': '/paid-adverts?tab=promoted&postForm=true',
      promoted: '/paid-adverts?tab=promoted&postForm=true',
      'promoted-adverts': '/paid-adverts?tab=promoted&postForm=true',
      'paid-adverts': '/paid-adverts',
      paid: '/paid-adverts',
      events: '/events-venues/post?type=event',
      'events-venues': '/events-venues/post?type=event',
      venues: '/events-venues/post?type=venue',
      banner: '/paid-adverts?tab=banners',
      'banner-ads': '/paid-adverts?tab=banners',
      'banner-adverts': '/paid-adverts?tab=banners',
      banners: '/paid-adverts?tab=banners',
      software: '/software',
      'software-code': '/software',
      code: '/software',
      funding: '/funding?postForm=true',
      crowdfunding: '/funding?postForm=true',
      donations: '/donations?postForm=true',
      'charities-and-donations': '/donations?postForm=true',
      charities: '/donations?postForm=true',
      images: '/post-images',
      'stock-images': '/post-images',
      'images-adverts': '/post-images',
      stores: '/dashboard?tab=store',
      'online-stores': '/dashboard?tab=store',
      'business-and-stores': '/dashboard?tab=store',
      featured: '/featured-adverts?postForm=true',
      'featured-ads': '/featured-adverts?postForm=true',
      'featured-adverts': '/featured-adverts?postForm=true',
      classified: '/postclassified',
      classifieds: '/postclassified',
      'classified-ads': '/postclassified',
    };

    const target = redirects[slug];
    if (target) navigate(target, { replace: true });
  }, [slug, navigate, logIn]);

  const redirectSlugs = new Set([
    'services', 'property', 'vehicles', 'books', 'book',
    'hotel-resorts-travel', 'resorts', 'travel',
    'affiliate', 'affiliate-programs', 'affiliates', 'investment',
    'sponsored-ads', 'sponsored', 'sponsored-adverts',
    'promoted-ads', 'promoted', 'promoted-adverts',
    'events', 'events-venues', 'venues',
    'banner', 'banner-ads', 'banner-adverts',
    'software', 'software-code', 'code',
    'funding', 'crowdfunding',
    'donations', 'charities-and-donations', 'charities',
    'images', 'stock-images', 'images-adverts',
    'stores', 'online-stores', 'business-and-stores',
    'featured', 'featured-ads', 'featured-adverts',
    'classified', 'classifieds', 'classified-ads',
  ]);

  if (redirectSlugs.has(slug)) return null;

  switch (slug) {
    case 'items':
    case 'buy-and-sell':
    case 'electronics':
      return <PostItems />;
    case 'jobs':
      return <PostJobs />;
    case 'vacancies':
      return <PostVacancies />;
    case 'featured-advert':
      return <FeaturedAdvertPostingForm />;
    case 'business':
      return <PostBusiness />;
    default:
      return <PostClassified />;
  }
};

export default PostRouter;
