import React from 'react'
import Navbar from '../Navbar'
import FooterBanner from '../FooterBanner';
import Footer from '../Footer'

function Developer() {

  return (
    <div>
    <Navbar />
    <FooterBanner title={'Developer'} />
    <div className="w-full pt-10 flex justify-center">
      <div className="w-10/12">
        {/* <div className="w-full flex justify-center text-center">
          <div className="text-4xl font-bold pt-2 pb-4 text-blue-950">
          Developer
          </div>
        </div>
        <div className="bg-blue-400">
          <hr className="border border-cyan-400"></hr>
        </div> */}
        <div className="">
              
              <div className="text-lg font-bold pt-4 pb-4 text-blue-900">About Worldwideadverts Developer Documentation</div>
              <div className="pt-4 pb-4">We're designing Worldwideadverts Developer to better help you implement end-to-end sharing adverts. Please check on <span className='text-cyan-600'>https://worldwideadverts.info/api</span></div>
              <div className="text-lg font-bold pt-4 pb-4 text-blue-900">Our mission</div>
              <div className="pt-4 pb-4">We want to help you:</div>
              <div className="pt-4 pb-4">  - Make adverts</div>
              <div className="pt-4 pb-4">- Manage adverts</div>
              <div className="pt-4 pb-4">- Streamline operations</div>
              <div className="pt-4 pb-4"> - Grow your business faster</div>
              <div className="pt-4 pb-4">Our new portal supports you while you:</div>
              <div className="pt-4 pb-4">  - Discover the right solutions</div>
              <div className="pt-4 pb-4">  - Develop great adverts experiences</div>
              <div className="pt-4 pb-4">- Connect with a community of passionate developers</div>
              
        </div>
      </div>
    </div>
    <Footer />
  </div>
  )
}

export default Developer
