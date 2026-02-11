import React from 'react'
import Navbar from '../Navbar'
import FooterBanner from '../FooterBanner'
import Footer from '../Footer'

function CareerWithUs() {
  return (
    <div>
    <Navbar />
    <FooterBanner title={'Career With Us'} />
    <div className="w-full pt-10 flex justify-center">
      <div className="w-10/12">
        {/* <div className="w-full flex justify-center text-center">
          <div className="text-4xl font-bold pt-2 pb-4 text-blue-950">
          Career With Us
          </div>
        </div>
        <div className="bg-blue-400">
          <hr className="border border-cyan-400"></hr>
        </div> */}
        <div className="">
              
              <div className="pt-4 pb-4">World Wide Adverts Ltd . Want to work with us ? Please fill the form below will contact you soon</div>
              <div className="pt-2 pb-4"><span className='text-cyan-600'>Apply Here</span></div>
              
        </div>
      </div>
    </div>
    <Footer />
  </div>
  )
}

export default CareerWithUs
