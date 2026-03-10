import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const ServicesFooter = () => {
  const [expandedSections, setExpandedSections] = useState({
    about: false,
    services: false,
    categories: false,
    support: false
  });

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const footerSections = {
    about: {
      title: 'About',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    services: {
      title: 'Services',
      links: [
        { name: 'Freelance Services', href: '/services?type=freelance' },
        { name: 'Local Services', href: '/services?type=local' },
        { name: 'Business Services', href: '/services?type=business' },
        { name: 'Post a Service', href: '/services/post' },
        { name: 'Service Directory', href: '/services/directory' }
      ]
    },
    categories: {
      title: 'Categories',
      links: [
        { name: 'Graphic Design', href: '/categories/graphic-design' },
        { name: 'Web Development', href: '/categories/web-development' },
        { name: 'Writing & Translation', href: '/categories/writing' },
        { name: 'Marketing & SEO', href: '/categories/marketing' },
        { name: 'All Categories', href: '/categories' }
      ]
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Safety Center', href: '/safety' },
        { name: 'Community Guidelines', href: '/guidelines' },
        { name: 'FAQ', href: '/faq' }
      ]
    }
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold">WorldwideAdverts</span>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Connect with skilled professionals worldwide. Find the perfect service for your needs or offer your expertise to a global audience.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-sm text-green-400">Successfully subscribed!</p>
              )}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links - Desktop */}
          <div className="hidden lg:block">
            <h3 className="text-lg font-semibold mb-4">{footerSections.about.title}</h3>
            <ul className="space-y-2">
              {footerSections.about.links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <h3 className="text-lg font-semibold mb-4">{footerSections.services.title}</h3>
            <ul className="space-y-2">
              {footerSections.services.links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <h3 className="text-lg font-semibold mb-4">{footerSections.categories.title}</h3>
            <ul className="space-y-2">
              {footerSections.categories.links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Footer Links */}
        <div className="lg:hidden space-y-4 mt-8">
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="border-b border-gray-800 pb-4">
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                {expandedSections[key] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections[key] && (
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Mobile Support Section */}
          <div className="border-b border-gray-800 pb-4">
            <button
              onClick={() => toggleSection('support')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold">{footerSections.support.title}</h3>
              {expandedSections.support ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.support && (
              <ul className="mt-4 space-y-2">
                {footerSections.support.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">support@worldwideadverts.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Office</p>
                <p className="text-white">New York, USA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} WorldwideAdverts. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center space-x-6">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ServicesFooter;
