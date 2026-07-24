import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ChevronUp, Zap, Crown, Star, Shield } from 'lucide-react';

const PromotedFooter = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Promoted Services',
      links: [
        { name: 'Promoted Adverts', href: '/promoted-adverts' },
        { name: 'Boost Your Listing', href: '/boost' },
        { name: 'Advertising Solutions', href: '/advertising' },
        { name: 'Premium Features', href: '/premium' },
        { name: 'Analytics Dashboard', href: '/analytics' }
      ]
    },
    {
      title: 'Categories',
      links: [
        { name: 'Property', href: '/property' },
        { name: 'Vehicles', href: '/vehicles' },
        { name: 'Services', href: '/services' },
        { name: 'Jobs', href: '/jobs' },
        { name: 'Events', href: '/events' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Community Guidelines', href: '/guidelines' },
        { name: 'Report an Issue', href: '/report' }
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

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR Compliance', href: '/gdpr' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
        <div className="page-container">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Get More Views with Promoted Adverts</h3>
            <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of sellers who get 4x more views with our promoted advertising solutions.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">WorldwideAdverts</span>
              </div>
              <p className="text-gray-300 mb-6">
                The world's leading marketplace for promoted adverts. Get maximum visibility for your listings with our premium advertising solutions.
              </p>
              
              {/* Promotion Tiers */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-orange-400" />
                  <span>Promoted Basic - $29</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>Featured Plus - $49</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span>Premium - $99</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@worldwideadverts.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1-800-PROMOTED</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Global Headquarters</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-8">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-8 h-8 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © 2024 WorldwideAdverts. All rights reserved.
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-400">15K+</div>
                <div className="text-sm text-gray-400">Promoted Adverts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">142</div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">8.5M</div>
                <div className="text-sm text-gray-400">Total Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">98%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </footer>
  );
};

export default PromotedFooter;
