import React, { useState } from 'react';
import { 
  BookOpen, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ChevronUp,
  Heart
} from 'lucide-react';

const BooksFooter = () => {
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    about: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/mission' },
      { name: 'Team', href: '/team' },
      { name: 'Careers', href: '/careers' }
    ],
    books: [
      { name: 'Browse Books', href: '/books' },
      { name: 'Categories', href: '/categories' },
      { name: 'Authors', href: '/authors' },
      { name: 'New Releases', href: '/new-releases' },
      { name: 'Bestsellers', href: '/bestsellers' }
    ],
    services: [
      { name: 'Post Your Book', href: '/books?postForm=true' },
      { name: 'Author Services', href: '/author-services' },
      { name: 'Promotion Packages', href: '/promotion' },
      { name: 'Analytics', href: '/analytics' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'bg-sky-500 hover:bg-sky-600' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'bg-pink-600 hover:bg-pink-700' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'bg-blue-700 hover:bg-blue-800' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'bg-red-600 hover:bg-red-700' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 py-12">
        <div className="page-container">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with New Books & Authors
            </h3>
            <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
              Get the latest book recommendations, author interviews, and exclusive content delivered to your inbox
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gray-900" />
              </div>
              <span className="text-xl font-bold">WorldwideAdverts</span>
            </div>
            <p className="text-gray-400 mb-6">
              Connecting readers with authors from every corner of the world. Discover your next favorite book today.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`p-2 rounded-lg ${social.color} transition-colors`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Books Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Books & Literature</h4>
            <ul className="space-y-2">
              {footerLinks.books.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@worldwideadverts.com" className="hover:text-yellow-400 transition-colors">
                  info@worldwideadverts.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="hover:text-yellow-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 mt-1" />
                <span>
                  123 Literary Lane<br />
                  Book City, BC 12345<br />
                  United States
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Popular Categories</h4>
            <div className="flex flex-wrap gap-2">
              {['Fiction', 'Non-Fiction', 'Romance', 'Thriller', 'Sci-Fi', 'Self-Help', 'Business', 'Poetry'].map((category) => (
                <a
                  key={category}
                  href={`/books?genre=${category.toLowerCase()}`}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-yellow-400 hover:text-gray-900 transition-colors"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} WorldwideAdverts. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Cookie Policy
              </a>
            </div>

            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for book lovers worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-yellow-400 text-gray-900 p-3 rounded-full shadow-lg hover:bg-yellow-500 transition-colors z-40"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};

export default BooksFooter;
