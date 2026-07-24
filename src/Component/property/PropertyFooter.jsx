import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Globe,
  Heart,
  ArrowUp,
  Send,
  Shield,
  Users,
  TrendingUp
} from 'lucide-react';

const PropertyFooter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const footerSections = [
    {
      title: 'Property Categories',
      links: [
        { name: 'Residential Properties', href: '/properties?category=residential' },
        { name: 'Commercial Real Estate', href: '/properties?category=commercial' },
        { name: 'Industrial Properties', href: '/properties?category=industrial' },
        { name: 'Land & Plots', href: '/properties?category=land' },
        { name: 'Luxury Properties', href: '/properties?category=luxury' },
        { name: 'Investment Properties', href: '/properties?category=investment' }
      ]
    },
    {
      title: 'Regions',
      links: [
        { name: 'Europe Properties', href: '/properties?region=europe' },
        { name: 'Asia Pacific', href: '/properties?region=asia' },
        { name: 'North America', href: '/properties?region=north-america' },
        { name: 'Middle East', href: '/properties?region=middle-east' },
        { name: 'Africa', href: '/properties?region=africa' },
        { name: 'South America', href: '/properties?region=south-america' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Post Property', href: '/properties?postForm=true' },
        { name: 'Property Alerts', href: '/alerts' },
        { name: 'Mortgage Calculator', href: '/calculators' },
        { name: 'Property Valuation', href: '/valuation' },
        { name: 'Agent Directory', href: '/agents' },
        { name: 'Market Reports', href: '/reports' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'Press & Media', href: '/press' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact Us', href: '/contact' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Safety & Security', href: '/safety' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'FAQs', href: '/faq' }
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

  const stats = [
    { icon: Building, value: '245K+', label: 'Properties' },
    { icon: Users, value: '45K+', label: 'Active Users' },
    { icon: Globe, value: '142', label: 'Countries' },
    { icon: TrendingUp, value: '98%', label: 'Satisfaction' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
        <div className="page-container">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Property Trends</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get the latest property listings, market insights, and exclusive offers delivered to your inbox
            </p>
            
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
            
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-green-300"
              >
                Successfully subscribed! Check your email for confirmation.
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="page-container">
          
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {footerSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact Info & Social */}
          <div className="border-t border-gray-800 pt-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-white mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400">support@worldwideadverts.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400">123 Business Ave, Suite 100, New York, NY 10001</span>
                  </div>
                </div>
              </div>

              {/* Social Links & Trust Badges */}
              <div>
                <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex items-center gap-4 mb-6">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Secure Platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Verified Agents</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">
                © 2024 WorldwideAdverts Property Hub. All rights reserved.
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
              <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for property seekers worldwide
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default PropertyFooter;
