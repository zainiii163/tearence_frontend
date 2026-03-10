import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Book, 
  Calendar, 
  Award, 
  ExternalLink,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Edit,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';

const AuthorProfile = ({ author, onClose }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('books');

  const handleSaveAuthor = () => {
    setIsSaved(!isSaved);
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${author.name} - Author Profile`,
        text: `Check out ${author.name}'s books and profile`,
        url: window.location.href
      });
    }
  };

  const tabs = [
    { id: 'books', label: 'Books', icon: Book, count: author.books?.length || 0 },
    { id: 'about', label: 'About', icon: Edit, count: null },
    { id: 'reviews', label: 'Reviews', icon: MessageCircle, count: author.reviews?.length || 0 },
    { id: 'contact', label: 'Contact', icon: Mail, count: null }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'books':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {author.books?.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex space-x-4 p-4">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{book.genre}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(book.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({book.rating || 0})</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-600 mt-2">${book.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Biography</h3>
              <p className="text-gray-700 leading-relaxed">{author.bio}</p>
            </div>

            {author.achievements && author.achievements.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-3">
                  {author.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Writing Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Books</span>
                    <span className="font-semibold">{author.totalBooks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="font-semibold">{author.totalSales?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold">{author.averageRating || 0}/5</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {author.genres?.map((genre) => (
                    <span
                      key={genre}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-4">
            {author.reviews?.map((review) => (
              <div key={review.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.reviewer.avatar}
                    alt={review.reviewer.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{review.reviewer.name}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {author.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a
                      href={`mailto:${author.email}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {author.email}
                    </a>
                  </div>
                )}
                
                {author.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a
                      href={`tel:${author.phone}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {author.phone}
                    </a>
                  </div>
                )}

                {author.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span>{author.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {author.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{author.location}</span>
                  </div>
                )}
              </div>
            </div>

            {author.socialLinks && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow on Social Media</h3>
                <div className="flex space-x-4">
                  {author.socialLinks.twitter && (
                    <a
                      href={author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {author.socialLinks.instagram && (
                    <a
                      href={author.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {author.socialLinks.facebook && (
                    <a
                      href={author.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {author.socialLinks.linkedin && (
                    <a
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Form</h3>
              <p className="text-gray-600 mb-4">
                Send a direct message to {author.name}
              </p>
              <button className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Send Message
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="relative">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-2xl relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                ×
              </button>
              
              {/* Author Photo Overlay */}
              <div className="absolute -bottom-16 left-8">
                <img
                  src={author.photo}
                  alt={author.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                />
                {author.verified && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                    <Award className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Author Info */}
            <div className="pt-20 px-8 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{author.name}</h2>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{author.country}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {author.joinDate}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 max-w-2xl mb-6">{author.shortBio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{author.totalBooks || 0}</div>
                      <div className="text-sm text-gray-600">Books</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{author.totalReviews || 0}</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{author.averageRating || 0}</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{author.followers?.toLocaleString() || 0}</div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Contact Author</span>
                    </button>
                    
                    <button
                      onClick={handleSaveAuthor}
                      className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                        isSaved
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      <span>{isSaved ? 'Saved' : 'Save Author'}</span>
                    </button>
                    
                    <button
                      onClick={handleShareProfile}
                      className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex space-x-8 px-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 border-b-2 transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-8 py-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
