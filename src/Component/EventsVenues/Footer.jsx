import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Calendar, Map } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WA</span>
              </div>
              <span className="font-bold text-xl">WorldwideAdverts</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier platform for discovering and promoting events and venues worldwide. 
              Connect with millions of users and make your event or venue stand out.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Events Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>Events</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Browse All Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Concerts & Music
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Business Conferences
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Workshops & Seminars
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Festivals & Celebrations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Post an Event
                </a>
              </li>
            </ul>
          </div>

          {/* Venues Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-teal-400" />
              <span>Venues</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Browse All Venues
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Wedding Venues
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Conference Centers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Party Halls
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Outdoor Spaces
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Post a Venue
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Map className="w-5 h-5 text-amber-400" />
              <span>Categories</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  All Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Help & Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">support@worldwideadverts.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="w-5 h-5 text-teal-400" />
              <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span className="text-gray-400 text-sm">Global Platform • Worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 WorldwideAdverts. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
