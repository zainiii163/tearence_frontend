import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  ArrowUp,
  Briefcase,
  Building,
  Users,
  TrendingUp,
  Heart
} from 'lucide-react';

const JobsFooter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'For Job Seekers',
      icon: Users,
      links: [
        { name: 'Browse Job Seekers', href: '/jobs/seekers' },
        { name: 'Create Profile', href: '#create-profile' },
        { name: 'Job Alerts', href: '#alerts' },
        { name: 'Career Resources', href: '#resources' },
        { name: 'Resume Builder', href: '#resume' },
        { name: 'Interview Tips', href: '#interview' }
      ]
    },
    {
      title: 'For Employers',
      icon: Building,
      links: [
        { name: 'Post a Job', href: '#post-job' },
        { name: 'Employer Dashboard', href: '#dashboard' },
        { name: 'Pricing Plans', href: '#pricing' },
        { name: 'Talent Search', href: '#search' },
        { name: 'Company Profile', href: '#profile' },
        { name: 'Hiring Resources', href: '#hiring' }
      ]
    },
    {
      title: 'Platform',
      icon: Globe,
      links: [
        { name: 'About Us', href: '/about/about-us' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Success Stories', href: '#success' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press', href: '#press' },
        { name: 'Careers', href: '/about/career-with-us' }
      ]
    },
    {
      title: 'Support',
      icon: Briefcase,
      links: [
        { name: 'Help Center', href: '/help/help' },
        { name: 'Contact Us', href: '/about/contact' },
        { name: 'FAQs', href: '#faq' },
        { name: 'Privacy Policy', href: '/help/privacy-policy' },
        { name: 'Terms of Service', href: '/help/terms-and-condition' },
        { name: 'Cookie Policy', href: '/help/cookie-policy' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const stats = [
    { icon: Users, label: 'Active Job Seekers', value: '125K+' },
    { icon: Building, label: 'Companies', value: '8.4K+' },
    { icon: Briefcase, label: 'Jobs Posted', value: '45K+' },
    { icon: TrendingUp, label: 'Success Rate', value: '98%' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="page-container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Latest Opportunities</h2>
            <p className="text-gray-300 mb-8">
              Get weekly job alerts, career tips, and exclusive insights delivered to your inbox
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                Subscribe
              </button>
            </form>
            
            {isSubscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-green-400"
              >
                ✓ Successfully subscribed!
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="page-container py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">WorldwideAdverts</span>
            </div>
            <p className="text-gray-300 mb-6">
              Connecting global talent with opportunities worldwide. Your career journey starts here.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.div key={section.title} variants={itemVariants}>
                <div className="flex items-center space-x-2 mb-4">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
                <ul className="space-y-2">
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
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-700"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 WorldwideAdverts. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="/help/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/help/terms-and-condition" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/help/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 left-8 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      {/* Made with Love Badge */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
        Made with <Heart className="w-3 h-3 text-red-500 inline mx-1" /> for job seekers worldwide
      </div>
    </footer>
  );
};

export default JobsFooter;
