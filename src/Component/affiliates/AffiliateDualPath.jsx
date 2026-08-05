import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Target,
  Globe,
  DollarSign,
  CheckCircle,
  Star,
  Shield
} from 'lucide-react';

const AffiliateDualPath = ({ onPostBusiness, onPostPromoter }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="page-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Choose Your Path to Success
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Whether you're a business looking for promoters or a promoter looking for offers, 
            our platform connects you with the right opportunities.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12"
        >
          {/* Business Path */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">For Businesses</h3>
                <p className="text-gray-600">Find promoters for your products</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Reach Global Audience</h4>
                  <p className="text-gray-600 text-sm">Connect with promoters worldwide</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Performance-Based</h4>
                  <p className="text-gray-600 text-sm">Pay only for results you get</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Brand Protection</h4>
                  <p className="text-gray-600 text-sm">Verified promoters and quality control</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Analytics & Tracking</h4>
                  <p className="text-gray-600 text-sm">Real-time performance insights</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-blue-600">2.4M+</span>
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-gray-700">Total earnings generated for businesses</p>
            </div>

            <button
              type="button"
              onClick={onPostBusiness}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Post Business Offer</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Promoter Path */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">For Promoters</h3>
                <p className="text-gray-600">Promote products and earn</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">High Commissions</h4>
                  <p className="text-gray-600 text-sm">Earn up to 50% commission rates</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Quality Products</h4>
                  <p className="text-gray-600 text-sm">Promote verified, trusted brands</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Marketing Assets</h4>
                  <p className="text-gray-600 text-sm">Get banners, images, and content</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Flexible Work</h4>
                  <p className="text-gray-600 text-sm">Promote on your own schedule</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-purple-600">$1.8M+</span>
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-gray-700">Paid to promoters monthly</p>
            </div>

            <button
              type="button"
              onClick={onPostPromoter}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Post Affiliate Link</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-8 bg-white rounded-full px-8 py-4 shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">Verified Businesses</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-700">4.8/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700">142 Countries</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AffiliateDualPath;
