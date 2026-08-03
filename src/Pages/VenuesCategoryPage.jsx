import React from 'react';
import { useParams } from 'react-router-dom';
import EventsVenuesPage from './events-venues';

/** Venues category path page — same pattern as Buy & Sell categories. */
const VenuesCategoryPage = () => {
  const { categoryId } = useParams();
  return <EventsVenuesPage mode="venues" initialCategoryId={categoryId} key={categoryId} />;
};

export default VenuesCategoryPage;
