import React from 'react';
import { useParams } from 'react-router-dom';
import EventsVenuesPage from './events-venues';

/** Events category path page — same pattern as Buy & Sell categories. */
const EventsCategoryPage = () => {
  const { categoryId } = useParams();
  return <EventsVenuesPage mode="events" initialCategoryId={categoryId} key={categoryId} />;
};

export default EventsCategoryPage;
