import React from 'react'
// import FooterBannerBackground from "/img/footer-banner.jpg"

function FooterBanner(props) {
    const capitalizedTitle = props.title.toUpperCase();

  return (

    <div className='h-80 w-full bg-cover bg-center text-center' style={{backgroundImage:`url(/img/footer-banner-4.jpg)`}}>
        <div className='pt-36 h-full bg-black bg-opacity-50'>
          <div className='text-6xl text-white font-bold cursor-pointer'>{capitalizedTitle}</div> <br></br>
        </div>
    </div>
  )
}

export default FooterBanner
