import React, { useState } from 'react';
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Send,
  ChevronUp,
  Heart,
  Shield,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';

const FeaturedFooter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    marketplace: [
      { name: 'All Categories', href: '/categories' },
      { name: 'Featured Adverts', href: '/featured' },
      { name: 'Promoted Adverts', href: '/promoted' },
      { name: 'Sponsored Adverts', href: '/sponsored' },
      { name: 'Recent Listings', href: '/recent' },
      { name: 'Popular Searches', href: '/trending' }
    ],
    services: [
      { name: 'Post Advert', href: '/post' },
      { name: 'Premium Membership', href: '/premium' },
      { name: 'Advertising Solutions', href: '/advertise' },
      { name: 'Business Tools', href: '/business' },
      { name: 'API Access', href: '/api' },
      { name: 'Mobile App', href: '/mobile' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Safety Tips', href: '/safety' },
      { name: 'Contact Support', href: '/contact' },
      { name: 'Report Issue', href: '/report' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Community Guidelines', href: '/guidelines' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
      { name: 'Investors', href: '/investors' },
      { name: 'Partners', href: '/partners' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:bg-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:bg-blue-700' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:bg-red-600' }
  ];

  const paymentMethods = [
    'Visa', 'Mastercard', 'PayPal', 'Stripe', 'Apple Pay', 'Google Pay'
  ];

  const stats = [
    { icon: Users, label: 'Active Users', value: '45.2K+' },
    { icon: Globe, label: 'Countries', value: '142+' },
    { icon: Star, label: 'Featured Ads', value: '15.2K+' },
    { icon: TrendingUp, label: 'Daily Views', value: '2.3M+' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="page-container py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-purple-600/20">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">WorldwideAdverts</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              The world's premier marketplace for featured adverts. Connect with premium buyers and sellers across 142 countries.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* App Download */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-300">Download Our App</p>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                  <span>App Store</span>
                </button>
                <button className="w-full px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-sm" />
                  <span>Google Play</span>
                </button>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl border border-purple-500/30">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Featured Adverts
            </h3>
            <p className="text-gray-400 mb-6">
              Get the latest featured listings, exclusive deals, and marketplace insights delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2"
              >
                {isSubscribed ? (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © 2024 WorldwideAdverts. All rights reserved. Made with{' '}
              <Heart className="h-4 w-4 inline text-red-500 fill-current" />{' '}
              globally.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Accepted Payments:</span>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <span key={method} className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-110 flex items-center justify-center z-40"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default FeaturedFooter;
