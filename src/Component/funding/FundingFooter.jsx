import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronRight,
  Send,
  Shield,
  Users,
  Target
} from 'lucide-react';

const FundingFooter = () => {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'API Documentation', href: '/api-docs' }
      ]
    },
    {
      title: 'Categories',
      links: [
        { name: 'Technology & Innovation', href: '/funding?category=technology' },
        { name: 'Creative Arts', href: '/funding?category=creative' },
        { name: 'Community Projects', href: '/funding?category=community' },
        { name: 'Startups', href: '/funding?category=startups' },
        { name: 'Health & Wellness', href: '/funding?category=health' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Creator Guidelines', href: '/creator-guidelines' },
        { name: 'Funding Tips', href: '/funding-tips' },
        { name: 'Marketing Guide', href: '/marketing-guide' },
        { name: 'Success Metrics', href: '/success-metrics' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' }
  ];

  const trustBadges = [
    { icon: <Shield className="w-6 h-6" />, text: 'Secure Payments' },
    { icon: <Users className="w-6 h-6" />, text: '15K+ Funders' },
    { icon: <Target className="w-6 h-6" />, text: '89% Success Rate' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">WorldwideAdverts</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Empowering creators and innovators to bring their ideas to life through global funding support.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-3">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600/20 rounded-lg text-blue-400">
                    {badge.icon}
                  </div>
                  <span className="text-sm text-gray-300">{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Get the latest funding opportunities and success stories delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <span className="text-gray-400">Global Funding Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} WorldwideAdverts. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FundingFooter;
