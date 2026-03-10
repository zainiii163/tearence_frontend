// Books helpers utility functions for WWA Books Adverts System

/**
 * Format price with currency
 */
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

/**
 * Get book badge color based on advert type
 */
export const getBookBadgeColor = (advertType) => {
  switch (advertType) {
    case 'promoted':
      return 'bg-blue-600';
    case 'featured':
      return 'bg-purple-600';
    case 'sponsored':
      return 'bg-green-600';
    case 'top_category':
      return 'bg-yellow-600';
    default:
      return 'bg-gray-600';
  }
};

/**
 * Get book badge text based on advert type
 */
export const getBookBadgeText = (advertType) => {
  switch (advertType) {
    case 'promoted':
      return 'Promoted';
    case 'featured':
      return 'Featured';
    case 'sponsored':
      return 'Sponsored';
    case 'top_category':
      return 'Top of Category';
    default:
      return '';
  }
};

/**
 * Format publication date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};

/**
 * Get country flag emoji from country code
 */
export const getCountryFlag = (countryCode) => {
  const flags = {
    'US': '🇺🇸',
    'GB': '🇬🇧',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'IN': '🇮🇳',
    'NG': '🇳🇬',
    'CN': '🇨🇳',
    'FR': '🇫🇷',
    'DE': '🇩🇪',
    'IT': '🇮🇹',
    'ES': '🇪🇸',
    'JP': '🇯🇵',
    'KR': '🇰🇷',
    'BR': '🇧🇷',
    'MX': '🇲🇽',
    'ZA': '🇿🇦',
    'RU': '🇷🇺',
    'TR': '🇹🇷',
    'AE': '🇦🇪',
    'SA': '🇸🇦',
    'EG': '🇪🇬',
    'KE': '🇰🇪',
    'TH': '🇹🇭',
    'SG': '🇸🇬',
    'MY': '🇲🇾',
    'PH': '🇵🇭',
    'ID': '🇮🇩',
    'VN': '🇻🇳',
    'PK': '🇵🇰',
    'BD': '🇧🇩',
    'LK': '🇱🇰',
    'NP': '🇳🇵',
    'MM': '🇲🇲',
    'KH': '🇰🇭',
    'LA': '🇱🇦',
    'MM': '🇲🇲',
    'NZ': '🇳🇿',
    'FJ': '🇫🇯',
    'PG': '🇵🇬',
    'SB': '🇸🇧',
    'VU': '🇻🇺',
    'NC': '🇳🇨',
    'PF': '🇵🇫',
    'AS': '🇦🇸',
    'TO': '🇹🇴',
    'WS': '🇼🇸',
    'KI': '🇰🇮',
    'TV': '🇹🇻',
    'NR': '🇳🇷',
    'PW': '🇵🇼',
    'FM': '🇫🇲',
    'MH': '🇲🇭',
    'MP': '🇲🇵',
    'GU': '🇬🇺',
    'VI': '🇻🇮',
    'PR': '🇵🇷',
    'UM': '🇺🇲',
    'GG': '🇬🇬',
    'JE': '🇯🇪',
    'IM': '🇮🇲',
    'FO': '🇫🇴',
    'GL': '🇬🇱',
    'AX': '🇦🇽',
  };
  
  return flags[countryCode?.toUpperCase()] || '🌍';
};

/**
 * Get country name from country code
 */
export const getCountryName = (countryCode) => {
  const countries = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'IN': 'India',
    'NG': 'Nigeria',
    'CN': 'China',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'ES': 'Spain',
    'JP': 'Japan',
    'KR': 'South Korea',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'ZA': 'South Africa',
    'RU': 'Russia',
    'TR': 'Turkey',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'EG': 'Egypt',
    'KE': 'Kenya',
    'TH': 'Thailand',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'PH': 'Philippines',
    'ID': 'Indonesia',
    'VN': 'Vietnam',
    'PK': 'Pakistan',
    'BD': 'Bangladesh',
    'LK': 'Sri Lanka',
    'NP': 'Nepal',
    'MM': 'Myanmar',
    'KH': 'Cambodia',
    'LA': 'Laos',
    'NZ': 'New Zealand',
    'FJ': 'Fiji',
    'PG': 'Papua New Guinea',
    'SB': 'Solomon Islands',
    'VU': 'Vanuatu',
    'NC': 'New Caledonia',
    'PF': 'French Polynesia',
    'AS': 'American Samoa',
    'TO': 'Tonga',
    'WS': 'Samoa',
    'KI': 'Kiribati',
    'TV': 'Tuvalu',
    'NR': 'Nauru',
    'PW': 'Palau',
    'FM': 'Federated States of Micronesia',
    'MH': 'Marshall Islands',
    'MP': 'Northern Mariana Islands',
    'GU': 'Guam',
    'VI': 'Virgin Islands',
    'PR': 'Puerto Rico',
    'UM': 'United States Minor Outlying Islands',
    'GG': 'Guernsey',
    'JE': 'Jersey',
    'IM': 'Isle of Man',
    'FO': 'Faroe Islands',
    'GL': 'Greenland',
    'AX': 'Åland Islands',
  };
  
  return countries[countryCode?.toUpperCase()] || 'Unknown';
};

/**
 * Get book format display text
 */
export const getBookFormatText = (format) => {
  const formats = {
    'paperback': 'Paperback',
    'hardcover': 'Hardcover',
    'ebook': 'eBook',
    'audiobook': 'Audiobook',
    'pdf': 'PDF',
    'kindle': 'Kindle',
  };
  
  return formats[format?.toLowerCase()] || format;
};

/**
 * Get book type display text
 */
export const getBookTypeText = (bookType) => {
  const types = {
    'fiction': 'Fiction',
    'non_fiction': 'Non-Fiction',
    'children': 'Children\'s',
    'young_adult': 'Young Adult',
    'educational': 'Educational',
    'academic': 'Academic',
    'business': 'Business',
    'self_help': 'Self-Help',
    'biography': 'Biography',
    'memoir': 'Memoir',
    'poetry': 'Poetry',
    'drama': 'Drama',
    'cookbook': 'Cookbook',
    'travel': 'Travel',
    'health': 'Health',
    'science': 'Science',
    'technology': 'Technology',
    'history': 'History',
    'religion': 'Religion',
    'philosophy': 'Philosophy',
    'art': 'Art',
    'music': 'Music',
    'sports': 'Sports',
    'humor': 'Humor',
    'romance': 'Romance',
    'thriller': 'Thriller',
    'mystery': 'Mystery',
    'scifi': 'Science Fiction',
    'fantasy': 'Fantasy',
    'horror': 'Horror',
    'western': 'Western',
    'literary': 'Literary Fiction',
    'contemporary': 'Contemporary',
    'historical': 'Historical Fiction',
    'dystopian': 'Dystopian',
    'magical_realism': 'Magical Realism',
    'graphic_novel': 'Graphic Novel',
    'comic': 'Comic',
    'manga': 'Manga',
  };
  
  return types[bookType?.toLowerCase()] || bookType;
};

/**
 * Generate book slug
 */
export const generateBookSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Validate ISBN format
 */
export const validateISBN = (isbn) => {
  // Remove any non-digit characters
  const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
  
  // Check if it's ISBN-10 or ISBN-13
  if (cleanISBN.length === 10) {
    return validateISBN10(cleanISBN);
  } else if (cleanISBN.length === 13) {
    return validateISBN13(cleanISBN);
  }
  
  return false;
};

/**
 * Validate ISBN-10
 */
const validateISBN10 = (isbn) => {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * parseInt(isbn[i]);
  }
  
  const checksum = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
  return (sum + checksum) % 11 === 0;
};

/**
 * Validate ISBN-13
 */
const validateISBN13 = (isbn) => {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn[i]);
  }
  
  const checksum = 10 - (sum % 10);
  return checksum === parseInt(isbn[12]);
};

/**
 * Format ISBN with hyphens
 */
export const formatISBN = (isbn) => {
  const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
  
  if (cleanISBN.length === 10) {
    return `${cleanISBN.substring(0, 1)}-${cleanISBN.substring(1, 4)}-${cleanISBN.substring(4, 9)}-${cleanISBN.substring(9)}`;
  } else if (cleanISBN.length === 13) {
    return `${cleanISBN.substring(0, 3)}-${cleanISBN.substring(3, 4)}-${cleanISBN.substring(4, 8)}-${cleanISBN.substring(8, 12)}-${cleanISBN.substring(12)}`;
  }
  
  return isbn;
};

/**
 * Get rating stars HTML
 */
export const getRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '⭐';
  }
  
  // Half star
  if (hasHalfStar) {
    stars += '⭐';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆';
  }
  
  return stars;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get file size in human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if file is valid image
 */
export const isValidImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Check if file is valid PDF
 */
export const isValidPDF = (file) => {
  return file.type === 'application/pdf';
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Check if URL is valid
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate unique ID
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Download file from URL
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get age range display text
 */
export const getAgeRangeText = (ageRange) => {
  const ageRanges = {
    '0-5': 'Ages 0-5',
    '6-8': 'Ages 6-8',
    '9-12': 'Ages 9-12',
    '13-17': 'Ages 13-17',
    '18+': 'Adult',
    'all': 'All Ages',
  };
  
  return ageRanges[ageRange] || ageRange;
};

/**
 * Get language display text
 */
export const getLanguageText = (language) => {
  const languages = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'bn': 'Bengali',
    'ur': 'Urdu',
    'tr': 'Turkish',
    'pl': 'Polish',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'da': 'Danish',
    'fi': 'Finnish',
    'el': 'Greek',
    'he': 'Hebrew',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'id': 'Indonesian',
    'ms': 'Malay',
    'tl': 'Filipino',
    'sw': 'Swahili',
    'af': 'Afrikaans',
    'is': 'Icelandic',
    'mt': 'Maltese',
    'cy': 'Welsh',
    'ga': 'Irish',
    'gd': 'Scottish Gaelic',
    'eu': 'Basque',
    'ca': 'Catalan',
    'gl': 'Galician',
    'oc': 'Occitan',
    'eo': 'Esperanto',
    'la': 'Latin',
  };
  
  return languages[language?.toLowerCase()] || language;
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency) => {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CNY': '¥',
    'KRW': '₩',
    'INR': '₹',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'CHF',
    'SEK': 'kr',
    'NOK': 'kr',
    'DKK': 'kr',
    'PLN': 'zł',
    'CZK': 'Kč',
    'HUF': 'Ft',
    'RUB': '₽',
    'BRL': 'R$',
    'MXN': '$',
    'ARS': '$',
    'CLP': '$',
    'COP': '$',
    'PEN': 'S/',
    'UYU': '$',
    'ZAR': 'R',
    'NGN': '₦',
    'KES': 'KSh',
    'EGP': 'E£',
    'SAR': 'SR',
    'AED': 'د.إ',
    'QAR': 'QR',
    'KWD': 'KD',
    'BHD': 'BD',
    'OMR': 'RO',
    'JOD': 'JD',
    'LBP': 'L£',
    'ILS': '₪',
    'TRY': '₺',
    'THB': '฿',
    'VND': '₫',
    'IDR': 'Rp',
    'MYR': 'RM',
    'PHP': '₱',
    'SGD': 'S$',
    'HKD': 'HK$',
    'NZD': 'NZ$',
    'FJD': 'FJ$',
    'PGK': 'K',
    'SBD': 'SI$',
    'VUV': 'VT',
    'XPF': 'CFP',
    'TOP': 'T$',
    'WST': 'WS$',
    'KID': 'A$',
    'TVD': '$',
    'NRU': '$',
    'PW': '$',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
  };
  
  return symbols[currency?.toUpperCase()] || currency;
};
