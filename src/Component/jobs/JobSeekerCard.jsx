import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Eye,
  Calendar,
  MessageCircle,
  X
} from 'lucide-react';
import jobsAPI from '../../api/jobsAPI';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

const JobSeekerCard = ({ seeker, onClick }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    id,
    title,
    bio,
    profile_photo,
    country,
    city,
    experience_level,
    education_level,
    key_skills,
    desired_role,
    years_of_experience,
    views_count,
    created_at
  } = seeker;

  const skills = key_skills ? key_skills.split(',').map(s => s.trim()).filter(s => s) : [];
  const experienceLabels = {
    'entry': 'Entry Level',
    'junior': 'Junior',
    'mid': 'Mid-Level',
    'senior': 'Senior',
    'executive': 'Executive'
  };
  const educationLabels = {
    'high_school': 'High School',
    'diploma': 'Diploma',
    'bachelor': "Bachelor's Degree",
    'master': "Master's Degree",
    'phd': 'PhD',
    'none': 'None'
  };

  const handleContact = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const response = await jobsAPI.contactSeeker(id);
      console.log('Contact response:', response);
      const contactData = response.data?.data?.contact_info || response.data?.contact_info || response.contact_info;
      setContactInfo(contactData);
      setShowContactModal(true);
    } catch (error) {
      console.error('Error contacting seeker:', error);
      alert('Failed to load contact information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const profilePhotoUrl = getStorageAssetUrl(profile_photo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick && onClick(seeker)}
    >
      {/* Header with profile photo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden flex-shrink-0">
            {profilePhotoUrl ? (
              <img 
                src={profilePhotoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                {desired_role?.charAt(0) || 'J'}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title || desired_role || 'Job Seeker'}
            </h3>
            {desired_role && title && (
              <p className="text-sm text-gray-600 truncate">{desired_role}</p>
            )}
            
            <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {city && country ? `${city}, ${country}` : country || 'Location not specified'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {views_count || 0} views
              </span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="p-4 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="p-4 space-y-3">
        {experience_level && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4" />
              <span>Experience</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {experienceLabels[experience_level] || experience_level}
              {years_of_experience && ` (${years_of_experience} years)`}
            </span>
          </div>
        )}

        {education_level && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {educationLabels[education_level] || education_level}
            </span>
          </div>
        )}

        {bio && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2">
              {bio}
            </p>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {seeker.linkedin_url && (
            <a
              href={seeker.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {seeker.github_url && (
            <a
              href={seeker.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {seeker.website_url && (
            <a
              href={seeker.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
          {seeker.portfolio_link && (
            <a
              href={seeker.portfolio_link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-green-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>
        <button
          onClick={handleContact}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Contact</span>
        </button>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setShowContactModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {contactInfo?.email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.linkedin && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Linkedin className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">LinkedIn</p>
                    <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      View Profile
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.portfolio && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Portfolio</p>
                    <a href={contactInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      View Portfolio
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.github && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Github className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">GitHub</p>
                    <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      View GitHub
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.website && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
              {!contactInfo?.email && !contactInfo?.phone && !contactInfo?.linkedin && !contactInfo?.portfolio && !contactInfo?.github && !contactInfo?.website && (
                <p className="text-sm text-gray-500 text-center py-4">No contact information available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default JobSeekerCard;
