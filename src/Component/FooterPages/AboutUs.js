import React from 'react'
import UnifiedNavbar from '../UnifiedNavbar'
import FooterBanner from '../FooterBanner'
import Footer from '../Footer'

function AboutUs() {
  return (
    <div>
      <UnifiedNavbar />
      <FooterBanner title={'About Us'} />
      <div className="w-full pt-10 flex justify-center">
        <div className="w-10/12">
          {/* <div className="w-full flex justify-center text-center">
            <div className="text-4xl font-bold pt-2 pb-4 text-blue-950">
            About Us
            </div>
          </div>
          <div className="bg-blue-400">
            <hr className="border border-cyan-400"></hr>
          </div> */}
          <div className="">
               
                <div className="pt-4 pb-4">Welcome to World Wide Adverts, a leading digital marketing company dedicated to helping businesses and brands grow globally. With our innovative platform, we offer a marketplace for businesses of all sizes, from large corporations to small enterprises and individual entrepreneurs, to advertise their products and services to a worldwide audience.</div>
                <div className="pt-4 pb-4">Our mission is to create a dynamic global marketplace that facilitates engagement between businesses and customers from all corners of the world. We believe in making it easier for everyone to access a wide range of services and products, while adhering to the legal parameters of each country and fostering international trade.</div>
                <div className="pt-4 pb-4">At World Wide Adverts, we strive to be the premier one-stop marketplace, catering to the needs of buyers, sellers, service providers, event planners, and more. Our comprehensive range of services is designed to support businesses in expanding their reach, growing their brands, and achieving their goals.</div>
                <div className="pt-4 pb-4">We are committed to helping businesses transcend borders, enabling them to reach new markets and customers around the globe. Our ultimate goal is to foster trade and collaboration between nations and continents, promoting development and technological advancements worldwide.We are committed to helping businesses transcend borders, enabling them to reach new markets and customers around the globe. Our ultimate goal is to foster trade and collaboration between nations and continents, promoting development and technological advancements worldwide.</div>
                <div className="pt-4 pb-4">World Wide Adverts Ltd, operating under the domain worldwideadverts.org, provides an open market for legal products and services, facilitating seamless transactions between individuals, companies, and a combination thereof. Through our advertising and marketing strategies, we empower businesses and investments to flourish by connecting them with a broader audience.</div>
                <div className="pt-4 pb-4">As your partner in growth, we are dedicated to expanding your market presence and ensuring your success. We believe that by working together, our businesses can excel and contribute to the advancement of industries and economies worldwide.  </div>
                <div className="pt-4 pb-4">Join World Wide Adverts today and embark on a journey of unlimited opportunities. Let us help you unlock the full potential of your business as we strive for mutual growth and success.</div>
                <div className="pt-4 pb-4">Together, we can make a difference.</div>
                <div className="pt-4 pb-4">World Wide Adverts Team</div>
                
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUs
