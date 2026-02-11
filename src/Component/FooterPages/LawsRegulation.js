import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'

function LawsRegulation() {
  return (
    <div>
    <Navbar />
    <div className="w-full pt-32 flex justify-center">
      <div className="w-10/12">
        <div className="w-full flex justify-center text-center">
          <div className="text-4xl font-bold pt-2 pb-4 text-blue-950">
          ADVERTISING LAWS AND REGULATIONS
          </div>
        </div>
        <div className="bg-blue-400">
          <hr className="border border-blue-600"></hr>
        </div>
        <div className="">
              <div className="text-lg font-bold pt-4 pb-4 text-blue-900"></div>
              <div className="pt-2 pb-2"></div>             
        </div>
      </div>
    </div>
    <Footer />
  </div>
  )
}

export default LawsRegulation