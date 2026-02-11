import React, { useState } from 'react';
import Subscription from './Subscription'; // Import the Subscription component

function SubscriptionData() {
    // console.log('hii')
    const cardsData = [
  {
    title: "FREE",
    autoRenewals: 0,
    featuredDays: 0,
    amountOfPictures: 3,
    price: 0.00,
    expires: "EXPIRES IN 3 DAYS",
    description: "",
  },
  {
    head:"RECOMMENDED",
    title: "PAID ADVERT",
    autoRenewals: 2,
    featuredDays: 7,
    amountOfPictures: 4,
    price: 5.00,
    expires: "EXPIRES IN 7 DAYS",
  },
  {
    title: "FEATURED ADVERT",
    autoRenewals: 3,
    featuredDays: 7,
    amountOfPictures: 6,
    price: 10.00,
    expires: "EXPIRES IN 7 DAYS",
  },
  {
    head:"RECOMMENDED",
    title: "PROMOTED",
    autoRenewals: 4,
    featuredDays: 7,
    amountOfPictures: 12,
    price: 15.00,
    expires: "EXPIRES IN 7 DAYS",
  },
  {
    head:"RECOMMENDED",
    title: " SPONSORED",
    autoRenewals: 3,
    featuredDays: 7,
    amountOfPictures: 12,
    price: 15.00,
    expires: "EXPIRES IN 7 DAYS",
  },
];

const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = cardsData.slice(currentIndex, currentIndex + 3);

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => prevIndex + 3);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => prevIndex - 3);
  };


  return (
    <div className="w-full flex justify-center ">
        <div className='w-11/12 flex'>
            {cardsData.map((card, index) => {
        return  <Subscription
            key={index}
            title={card.title}
            autoRenewals={card.autoRenewals}
            featuredDays={card.featuredDays}
            amountOfPictures={card.amountOfPictures}
            price={card.price}
            expires={card.expires}
            description={card.description}
        />
    })}
        </div>
  </div>
  );
}

export default SubscriptionData;
