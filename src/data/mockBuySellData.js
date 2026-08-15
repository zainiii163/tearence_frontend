import React from 'react';
import { FaCar, FaHome, FaBook, FaTshirt, FaGamepad, FaDumbbell, FaBaby, FaMusic, FaDog } from 'react-icons/fa';
import { FiSmartphone, FiHome as FiHomeIcon, FiTool, FiCamera, FiMonitor, FiPackage } from 'react-icons/fi';

export const mockBuySellData = [
  {
    id: 1,
    title: "iPhone 14 Pro Max 256GB",
    description: "Like new iPhone 14 Pro Max, 256GB storage, excellent condition, comes with original box and accessories",
    price: 899,
    currency: "USD",
    category: "electronics",
    condition: "like_new",
    brand: "Apple",
    model: "iPhone 14 Pro Max",
    color: "Deep Purple",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      "https://images.unsplash.com/photo-1591337646795-e7b162bb9a89?w=400"
    ],
    location: "New York, USA",
    distance: 2.5,
    seller: {
      name: "John Smith",
      rating: 4.8,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    },
    views: 245,
    likes: 18,
    createdAt: "2024-01-15T10:30:00Z",
    promoted: true,
    itemType: "for_sale"
  },
  {
    id: 2,
    title: "2020 Toyota Camry SE",
    description: "Well-maintained Toyota Camry, 45,000 miles, perfect condition, regular service history",
    price: 22500,
    currency: "USD",
    category: "vehicles",
    condition: "excellent",
    brand: "Toyota",
    model: "Camry SE",
    year: 2020,
    mileage: 45000,
    color: "Silver",
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400"
    ],
    location: "Los Angeles, USA",
    distance: 15.2,
    seller: {
      name: "Auto World Dealership",
      rating: 4.9,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100"
    },
    views: 523,
    likes: 42,
    createdAt: "2024-01-14T15:45:00Z",
    featured: true,
    itemType: "for_sale"
  },
  {
    id: 3,
    title: "Designer Leather Jacket",
    description: "Genuine leather jacket, size M, worn only twice, perfect for fall/winter",
    price: 150,
    currency: "USD",
    category: "fashion",
    condition: "excellent",
    brand: "Premium Leather Co",
    size: "M",
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400"
    ],
    location: "Chicago, USA",
    distance: 8.7,
    seller: {
      name: "Fashion Forward",
      rating: 4.6,
      verified: false,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c3ca?w=100"
    },
    views: 156,
    likes: 12,
    createdAt: "2024-01-13T09:20:00Z",
    itemType: "for_sale"
  },
  {
    id: 4,
    title: "MacBook Pro 16\" M2 Pro",
    description: "Powerful MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD, perfect for creative work",
    price: 1899,
    currency: "USD",
    category: "computers",
    condition: "like_new",
    brand: "Apple",
    model: "MacBook Pro 16\"",
    specs: {
      ram: "16GB",
      storage: "512GB SSD",
      processor: "M2 Pro"
    },
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"
    ],
    location: "San Francisco, USA",
    distance: 5.3,
    seller: {
      name: "Tech Solutions",
      rating: 4.7,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    },
    views: 389,
    likes: 28,
    createdAt: "2024-01-12T14:15:00Z",
    sponsored: true,
    itemType: "for_sale"
  },
  {
    id: 5,
    title: "Modern Apartment Downtown",
    description: "2 bedroom, 2 bathroom apartment in prime downtown location, great amenities",
    price: 2500,
    currency: "USD",
    category: "property",
    condition: "excellent",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: "950 sq ft",
    images: [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400"
    ],
    location: "Miami, USA",
    distance: 12.8,
    seller: {
      name: "Miami Properties",
      rating: 4.8,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
    },
    views: 678,
    likes: 56,
    createdAt: "2024-01-11T11:30:00Z",
    featured: true,
    itemType: "for_rent"
  },
  {
    id: 6,
    title: "Gaming Console Bundle",
    description: "PlayStation 5 with 2 controllers and 5 games, perfect condition",
    price: 650,
    currency: "USD",
    category: "gaming",
    condition: "excellent",
    brand: "Sony",
    model: "PlayStation 5",
    includes: ["2 Controllers", "5 Games", "All Cables"],
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99e429?w=400",
      "https://images.unsplash.com/photo-15187092688055-4e9042af2176?w=400"
    ],
    location: "Seattle, USA",
    distance: 3.2,
    seller: {
      name: "GameZone",
      rating: 4.9,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    },
    views: 412,
    likes: 35,
    createdAt: "2024-01-10T16:45:00Z",
    itemType: "for_sale"
  },
  {
    id: 7,
    title: "Professional DSLR Camera",
    description: "Canon EOS R5 with 24-70mm lens, perfect for photography enthusiasts",
    price: 3200,
    currency: "USD",
    category: "cameras",
    condition: "like_new",
    brand: "Canon",
    model: "EOS R5",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b24436eb?w=400",
      "https://images.unsplash.com/photo-15420387844561-4d3f47b2ad3f?w=400"
    ],
    location: "Boston, USA",
    distance: 7.9,
    seller: {
      name: "Photo Pro Shop",
      rating: 4.7,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    },
    views: 234,
    likes: 19,
    createdAt: "2024-01-09T13:20:00Z",
    itemType: "for_sale"
  },
  {
    id: 8,
    title: "Baby Furniture Set",
    description: "Complete nursery furniture set including crib, dresser, and changing table",
    price: 450,
    currency: "USD",
    category: "baby",
    condition: "good",
    brand: "BabyDream",
    includes: ["Crib", "Dresser", "Changing Table", "Mattress"],
    images: [
      "https://images.unsplash.com/photo-1571115765409-d6211c9bf8af?w=400",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
    ],
    location: "Denver, USA",
    distance: 11.4,
    seller: {
      name: "Baby Essentials",
      rating: 4.5,
      verified: false,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
    },
    views: 189,
    likes: 15,
    createdAt: "2024-01-08T10:15:00Z",
    itemType: "for_sale"
  },
  {
    id: 9,
    title: "Home Gym Equipment Set",
    description: "Complete home gym setup with weights, bench, and cardio equipment",
    price: 1200,
    currency: "USD",
    category: "sports",
    condition: "good",
    includes: ["Weight Bench", "Dumbbells", "Treadmill", "Yoga Mat"],
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400"
    ],
    location: "Austin, USA",
    distance: 6.8,
    seller: {
      name: "Fitness World",
      rating: 4.6,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    },
    views: 267,
    likes: 22,
    createdAt: "2024-01-07T14:30:00Z",
    itemType: "for_sale"
  },
  {
    id: 10,
    title: "Acoustic Guitar Bundle",
    description: "Yamaha acoustic guitar with case, tuner, and beginner books",
    price: 280,
    currency: "USD",
    category: "music",
    condition: "excellent",
    brand: "Yamaha",
    model: "FG830",
    includes: ["Guitar Case", "Digital Tuner", "Instruction Books"],
    images: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d6?w=400"
    ],
    location: "Nashville, USA",
    distance: 4.5,
    seller: {
      name: "Music Corner",
      rating: 4.8,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    },
    views: 198,
    likes: 16,
    createdAt: "2024-01-06T12:45:00Z",
    itemType: "for_sale"
  },
  {
    id: 11,
    title: "Power Tool Set",
    description: "DeWalt 20V cordless tool set with drill, saw, and impact driver",
    price: 550,
    currency: "USD",
    category: "tools",
    condition: "good",
    brand: "DeWalt",
    includes: ["Drill", "Circular Saw", "Impact Driver", "2 Batteries", "Charger"],
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400"
    ],
    location: "Phoenix, USA",
    distance: 9.2,
    seller: {
      name: "Tool Masters",
      rating: 4.7,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    },
    views: 145,
    likes: 11,
    createdAt: "2024-01-05T15:20:00Z",
    itemType: "for_sale"
  },
  {
    id: 12,
    title: "Book Collection - Fiction & Non-Fiction",
    description: "Collection of 50+ books in excellent condition, various genres",
    price: 0,
    currency: "USD",
    category: "books",
    condition: "good",
    genres: ["Fiction", "Non-Fiction", "Biography", "Science"],
    count: 50,
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"
    ],
    location: "Portland, USA",
    distance: 2.8,
    seller: {
      name: "Book Lover",
      rating: 4.9,
      verified: false,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    },
    views: 89,
    likes: 7,
    createdAt: "2024-01-04T09:30:00Z",
    itemType: "give_away"
  }
];

export const categories = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: <FaCar className="h-6 w-6" />,
    description: 'Cars, motorcycles, boats, and more',
    count: 1234,
    color: 'bg-blue-500'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: <FiSmartphone className="h-6 w-6" />,
    description: 'Phones, computers, gadgets',
    count: 3456,
    color: 'bg-purple-500'
  },
  {
    id: 'property',
    name: 'Property',
    icon: <FaHome className="h-6 w-6" />,
    description: 'Homes, apartments, land for sale',
    count: 890,
    color: 'bg-green-500'
  },
  {
    id: 'fashion',
    name: 'Fashion & Accessories',
    icon: <FaTshirt className="h-6 w-6" />,
    description: 'Clothing, shoes, jewelry',
    count: 2567,
    color: 'bg-pink-500'
  },
  {
    id: 'books',
    name: 'Books & Media',
    icon: <FaBook className="h-6 w-6" />,
    description: 'Books, movies, music',
    count: 1876,
    color: 'bg-indigo-500'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: <FaGamepad className="h-6 w-6" />,
    description: 'Video games, consoles, accessories',
    count: 987,
    color: 'bg-red-500'
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    icon: <FaDumbbell className="h-6 w-6" />,
    description: 'Equipment, gear, fitness items',
    count: 1234,
    color: 'bg-orange-500'
  },
  {
    id: 'baby',
    name: 'Baby & Kids',
    icon: <FaBaby className="h-6 w-6" />,
    description: 'Baby items, toys, kids products',
    count: 876,
    color: 'bg-yellow-500'
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    icon: <FiHomeIcon className="h-6 w-6" />,
    description: 'Furniture, appliances, garden tools',
    count: 2145,
    color: 'bg-teal-500'
  },
  {
    id: 'tools',
    name: 'Tools & Hardware',
    icon: <FiTool className="h-6 w-6" />,
    description: 'Power tools, hardware, equipment',
    count: 654,
    color: 'bg-gray-500'
  },
  {
    id: 'music',
    name: 'Musical Instruments',
    icon: <FaMusic className="h-6 w-6" />,
    description: 'Guitars, pianos, audio equipment',
    count: 432,
    color: 'bg-rose-500'
  },
  {
    id: 'cameras',
    name: 'Cameras & Photo',
    icon: <FiCamera className="h-6 w-6" />,
    description: 'Cameras, lenses, photography gear',
    count: 321,
    color: 'bg-cyan-500'
  },
  {
    id: 'pets',
    name: 'Animals & Pets',
    icon: <FaDog className="h-6 w-6" />,
    description: 'Animals, pets, pet supplies, accessories',
    count: 543,
    color: 'bg-amber-500'
  },
  {
    id: 'computers',
    name: 'Computers',
    icon: <FiMonitor className="h-6 w-6" />,
    description: 'Laptops, desktops, accessories',
    count: 789,
    color: 'bg-blue-600'
  },
  {
    id: 'other',
    name: 'Other Items',
    icon: <FiPackage className="h-6 w-6" />,
    description: 'Everything else',
    count: 1567,
    color: 'bg-slate-500'
  }
];
