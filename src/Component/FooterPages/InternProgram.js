import React from 'react'
import Navbar from '../Navbar'
import FooterBanner from '../FooterBanner'
import Footer from '../Footer'

function InternProgram() {
  return (
    <div className=''>
      <Navbar />
      <FooterBanner title={'Intern Program'} />
      <div className="w-full pt-10 flex justify-center">
        <div className="w-10/12">
          {/* <div className="w-full flex justify-center text-center">
            <div className="text-4xl font-bold pt-2 pb-4 text-blue-950">
            Intern Program  
            </div>
          </div>
          <div className="bg-blue-400">
            <hr className="border border-cyan-400"></hr>
          </div> */}
          <div className="">
               
                <div className="pt-8 pb-12">Knowledge is power and at World Wide Adverts we take it upon ourselves to make sure we have the best in the business at all levels in our organization.We believe in growing with employees. Our intern program encourages new talent and training at all levels in the corporate ladder.We believe in investing in the future leaders.Our goal is to continue developing talent and nurturing it to highest possible level.Our program starts from the grassroots.We are constantly working on ways of improving our employees around the world to cater for their different Intellectual needs and career progression.Our internship programs will be different in each country, but we all work toward a common objective: to provide experience and skills that compliment academic training, and all alongside the best professionals in the sector.</div>
                <div className="pt-2 pb-2">Knowledge is power and at World Wide Adverts we take it upon ourselves to make sure we have the best in the business at all levels in our organization.We believe in growing with employees. Our intern program encourages new talent and training at all levels in the corporate ladder.We believe in investing in the future leaders.Our goal is to continue developing talent and nurturing it to highest possible level.Our program starts from the grassroots.We are constantly working on ways of improving our employees around the world to cater for their different Intellectual needs and career progression.Our internship programs will be different in each country, but we all work toward a common objective: to provide experience and skills that compliment academic training, and all alongside the best professionals in the sector.</div>
                
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default InternProgram
