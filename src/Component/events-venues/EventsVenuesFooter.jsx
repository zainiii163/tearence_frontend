import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Calendar, Building } from 'lucide-react';

const EventsVenuesFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    events: [
      { name: 'Concerts', href: '/events-venues?category=concerts' },
      { name: 'Conferences', href: '/events-venues?category=conferences' },
      { name: 'Sports Events', href: '/events-venues?category=sports' },
      { name: 'Festivals', href: '/events-venues?category=festivals' },
      { name: 'Workshops', href: '/events-venues?category=workshops' },
    ],
    venues: [
      { name: 'Hotels', href: '/events-venues?category=hotels' },
      { name: 'Restaurants', href: '/events-venues?category=restaurants' },
      { name: 'Conference Centers', href: '/events-venues?category=conference-centers' },
      { name: 'Wedding Venues', href: '/events-venues?category=wedding-venues' },
      { name: 'Party Venues', href: '/events-venues?category=party-venues' },
    ],
    company: [
      { name: 'About Us', href: '/about/company' },
      { name: 'Contact', href: '/about/contact' },
      { name: 'Careers', href: '/about/career-with-us' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/about/developer' },
    ],
    support: [
      { name: 'Help Center', href: '/help/help' },
      { name: 'Safety', href: '/help/ads-policies' },
      { name: 'Terms of Service', href: '/help/terms-of-use' },
      { name: 'Privacy Policy', href: '/help/privacy-policy' },
      { name: 'Cookie Policy', href: '/help/cookie-policy' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">WorldwideAdverts</h3>
                <p className="text-sm text-purple-400">Events & Venues</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Discover amazing events and find the perfect venues for your next gathering. Connect with event organizers and venue owners worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Events Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-purple-400" />
              Events
            </h4>
            <ul className="space-y-2">
              {footerLinks.events.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="hover:text-purple-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Venues Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Building className="w-4 h-4 mr-2 text-blue-400" />
              Venues
            </h4>
            <ul className="space-y-2">
              {footerLinks.venues.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                <span>123 Event Street, City, Country</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-purple-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>events@worldwideadverts.info</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} WorldwideAdverts. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/help/terms-of-use" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/help/privacy-policy" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/help/cookie-policy" className="hover:text-purple-400 transition-colors">
                Cookie Policy
              </Link>
              <Link to="/help/ads-policies" className="hover:text-purple-400 transition-colors">
                Ads Policies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EventsVenuesFooter;
