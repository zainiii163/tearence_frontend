import React from 'react'
import Navbar from '../Navbar'
import FooterBanner from '../FooterBanner'
import Footer from '../Footer'

function Help() {
  return (
    <div>
    <Navbar />
    <FooterBanner title={"Help"} />
    <div className="w-full pt-10 flex justify-center">
      <div className="w-10/12">
        {/* <div className="w-full flex justify-center text-center">
          <div className="text-4xl font-bold pt-2 pb-4 text-blue-950">
          Help  
          </div>
        </div>
        <div className="bg-blue-400">
          <hr className="border border-blue-600"></hr>
        </div> */}
        <div className="">
              <div className="text-lg font-bold pt-4 pb-4 text-blue-900">How to sign up / register on world wide adverts</div>     
              <div className="text-lg font-bold pt-4 pb-4 text-blue-900">How to post adverts on world wide adverts</div>     
              <div className="text-lg font-bold pt-4 pb-4 text-blue-900">Products and services you can advertise </div>     
        </div>
      </div>
    </div>
    <Footer />
  </div>
  )
}

export default Help