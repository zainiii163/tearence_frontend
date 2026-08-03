import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Crown, Globe, Heart, ArrowRight, Send } from 'lucide-react';

const SponsoredFooter = () => {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Pricing Plans', href: '/pricing' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' }
      ]
    },
    {
      title: 'Categories',
      links: [
        { name: 'Property', href: '/properties' },
        { name: 'Vehicles', href: '/vehicles' },
        { name: 'Jobs', href: '/jobs' },
        { name: 'Services', href: '/services' },
        { name: 'Events', href: '/events-venues' },
        { name: 'Books', href: '/books' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' }
      ]
    },
    {
      title: 'Premium Features',
      links: [
        { name: 'Sponsored Ads', href: '/sponsored-adverts' },
        { name: 'Promoted Ads', href: '/promoted' },
        { name: 'Business Accounts', href: '/business' },
        { name: 'API Access', href: '/api' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Advertising Guide', href: '/advertising-guide' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const countries = [
    '🇺🇸 USA', '🇬🇧 UK', '🇨🇦 Canada', '🇦🇺 Australia', '🇩🇪 Germany', 
    '🇫🇷 France', '🇮🇹 Italy', '🇪🇸 Spain', '🇦🇪 UAE', '🇸🇬 Singapore'
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-12">
        <div className="page-container">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-white mr-3" />
              <h3 className="text-2xl font-bold text-white">Premium Advertising Platform</h3>
            </div>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses leveraging our sponsored advertising platform to reach millions of potential customers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">WorldwideAdverts</h3>
                <p className="text-xs text-gray-400">Sponsored Platform</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 text-sm">
              The world's premier sponsored advertising platform connecting businesses with global audiences through premium, high-visibility listings.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                );
              })}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@worldwideadverts.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Global Headquarters</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 4 }}
                      className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Global Reach */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <Globe className="w-6 h-6 text-yellow-500 mr-2" />
              <h4 className="text-lg font-semibold text-white">Global Reach</h4>
            </div>
            <p className="text-gray-400 mb-4">Serving businesses and customers in 142 countries worldwide</p>
            <div className="flex flex-wrap justify-center gap-2">
              {countries.map((country, index) => (
                <motion.span
                  key={country}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-yellow-500/20 transition-colors cursor-pointer"
                >
                  {country}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 WorldwideAdverts. All rights reserved. Premium Sponsored Advertising Platform.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/terms" className="hover:text-yellow-400 transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy</a>
              <a href="/cookies" className="hover:text-yellow-400 transition-colors">Cookies</a>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for businesses worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SponsoredFooter;
