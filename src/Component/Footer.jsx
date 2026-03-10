import React from "react";
import {
  BsInstagram,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import moment from 'moment';

function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-50 mt-auto">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div>
            <img src="/img/wwaLogoTransparantStroke.png" className="h-12" alt="World Wide Adverts" />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            World Wide Adverts, a leading digital marketing company dedicated to
            helping businesses and brands grow globally
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://www.facebook.com/worldwideadverts.info/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 bg-blue-600 text-white hover:bg-blue-700"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>
            <a 
              href="https://www.instagram.com/worldadverts/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 bg-pink-600 text-white hover:bg-pink-700"
            >
              <BsInstagram className="h-4 w-4" />
            </a>
            <a 
              href="https://twitter.com/worldwidead" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 bg-sky-500 text-white hover:bg-sky-600"
            >
              <BsTwitter className="h-4 w-4" />
            </a>
            <a 
              href="https://www.linkedin.com/company/world-wide-adverts/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 bg-blue-700 text-white hover:bg-blue-800"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>
            <a 
              href="https://www.youtube.com/@worldwideadverts3670" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 bg-red-600 text-white hover:bg-red-700"
            >
              <BsYoutube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Categories</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Link to='/category/business' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Business</Link>
              <Link to='/category/deals' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Deals</Link>
              <Link to='/events-venues' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Events</Link>
              <Link to='/category/sale' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">For Sale</Link>
              <Link to='/category/it-tech' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">IT/Tech</Link>
              <Link to='/classified' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Classified</Link>
            </div>
            <div className="space-y-2">
              <Link to='/category/Jobs' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Jobs</Link>
              <Link to='/category/Property' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Property</Link>
              <Link to='/category/Resort-travel' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Resort/Travel</Link>
              <Link to='/services' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Services</Link>
              <Link to='/category/Vehicle' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Vehicle</Link>
              <Link to='/investment-category' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Investment</Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Help</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Link to='/help/ads-policies' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Ads Policies</Link>
              <Link to='/help/terms-of-use' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Terms of use</Link>
              <Link to='/help/terms-and-condition' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Terms and condition</Link>
              <Link to='/help/privacy-policy' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Privacy policy</Link>
              <Link to='/help/disclaimer' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Disclaimer</Link>
            </div>
            <div className="space-y-2">
              <Link to='/help/cookie-policy' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Cookie policy</Link>
              <Link to='/help/user-agreement' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">User agreement</Link>
              <Link to='/help/data-protection' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Data protection</Link>
              <Link to='/help/laws-regulations' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Adverts policy</Link>
              <Link to='/help/help' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Help</Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Link to='/about/company' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Company</Link>
              <Link to='/about/business' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Business</Link>
              <Link to='/about/intern-program' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Intern program</Link>
              <Link to='/about/contact' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Contact</Link>
            </div>
            <div className="space-y-2">
              <Link to='/about/about-us' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">About us</Link>
              <Link to='/about/career-with-us' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Career with us</Link>
              <Link to='/about/developer' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Developer</Link>
              <Link to='/blog' className="block text-sm text-slate-400 hover:text-slate-50 transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 text-center">
        <p className="text-sm text-slate-400">
          © World Wide Adverts 2017-{moment().format('YYYY')}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
