import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Globe, Heart, Shield, Truck, Users } from 'lucide-react';

const VehicleFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'About',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Vehicles',
      links: [
        { name: 'Cars for Sale', href: '/vehicles?category=sale' },
        { name: 'Vehicle Hire', href: '/vehicles?category=hire' },
        { name: 'Vehicle Leasing', href: '/vehicles?category=lease' },
        { name: 'Transport Services', href: '/vehicles?category=transport' },
        { name: 'Dealer Directory', href: '/dealers' }
      ]
    },
    {
      title: 'Categories',
      links: [
        { name: 'Properties', href: '/properties' },
        { name: 'Services', href: '/services' },
        { name: 'Banner Adverts', href: '/banner-adverts' },
        { name: 'Books', href: '/books' },
        { name: 'Events & Venues', href: '/events-venues' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Safety', href: '/safety' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Contact Us', href: '/contact' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-700' }
  ];

  const features = [
    { icon: Shield, title: 'Secure Transactions', description: 'Safe and secure payment processing' },
    { icon: Truck, title: 'Global Delivery', description: 'Worldwide shipping and delivery options' },
    { icon: Users, title: 'Verified Sellers', description: 'Trusted and verified vehicle dealers' },
    { icon: Heart, title: 'Customer Support', description: '24/7 customer service and support' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="page-container py-12">
          <div className="text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold mb-4"
            >
              Stay Updated with Latest Vehicle Listings
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Get notified about new vehicles, exclusive deals, and marketplace updates in your area.
            </motion.p>
            
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Subscribe
              </button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="page-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold">WorldwideAdverts</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              The world's leading global marketplace for vehicles, connecting buyers and sellers across 142 countries.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`text-gray-400 transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium">support@worldwideadverts.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-400">Headquarters</p>
                <p className="font-medium">London, United Kingdom</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} WorldwideAdverts. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Globe className="w-4 h-4" />
              <select className="bg-transparent border-none text-gray-400 focus:outline-none focus:text-white">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VehicleFooter;
