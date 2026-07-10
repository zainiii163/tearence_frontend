// Mock data for Jobs page
export const mockJobsData = {
  success: true,
  data: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      logo: "https://via.placeholder.com/48x48/3B82F6/FFFFFF?text=TC",
      location: "New York, NY",
      salary: "$120,000 - $160,000",
      type: "Full-time",
      remote: true,
      posted: "2 days ago",
      views: 245,
      applicants: 12,
      badges: ["Featured", "Remote"],
      urgent: false,
      companyVerified: true,
      countryFlag: "🇺🇸",
      description: "We are looking for an experienced Frontend Developer to join our growing team."
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      logo: "https://via.placeholder.com/48x48/10B981/FFFFFF?text=IL",
      location: "San Francisco, CA",
      salary: "$140,000 - $180,000",
      type: "Full-time",
      remote: true,
      posted: "1 week ago",
      views: 189,
      applicants: 8,
      badges: ["Urgent Hire"],
      urgent: true,
      companyVerified: true,
      countryFlag: "🇺🇸",
      description: "Seeking a strategic Product Manager to lead our product development initiatives."
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "Creative Studio",
      logo: "https://via.placeholder.com/48x48/8B5CF6/FFFFFF?text=CS",
      location: "Austin, TX",
      salary: "$90,000 - $120,000",
      type: "Full-time",
      remote: false,
      posted: "3 days ago",
      views: 156,
      applicants: 15,
      badges: ["Featured"],
      urgent: false,
      companyVerified: false,
      countryFlag: "🇺🇸",
      description: "Join our creative team as a UX/UI Designer to create amazing user experiences."
    },
    {
      id: 4,
      title: "Backend Engineer",
      company: "Data Systems Inc",
      logo: "https://via.placeholder.com/48x48/F59E0B/FFFFFF?text=DS",
      location: "Seattle, WA",
      salary: "$130,000 - $170,000",
      type: "Full-time",
      remote: true,
      posted: "4 days ago",
      views: 203,
      applicants: 6,
      badges: ["Remote", "Sponsored"],
      urgent: false,
      companyVerified: true,
      countryFlag: "🇺🇸",
      description: "Looking for a skilled Backend Engineer to work on our distributed systems."
    },
    {
      id: 5,
      title: "Marketing Manager",
      company: "Growth Agency",
      logo: "https://via.placeholder.com/48x48/EF4444/FFFFFF?text=GA",
      location: "Los Angeles, CA",
      salary: "$85,000 - $110,000",
      type: "Full-time",
      remote: false,
      posted: "5 days ago",
      views: 134,
      applicants: 9,
      badges: [],
      urgent: false,
      companyVerified: true,
      countryFlag: "🇺🇸",
      description: "We need a creative Marketing Manager to drive our growth strategies."
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "CloudTech Solutions",
      logo: "https://via.placeholder.com/48x48/06B6D4/FFFFFF?text=CT",
      location: "Denver, CO",
      salary: "$125,000 - $155,000",
      type: "Full-time",
      remote: true,
      posted: "1 day ago",
      views: 267,
      applicants: 11,
      badges: ["Urgent Hire", "Remote"],
      urgent: true,
      companyVerified: true,
      countryFlag: "🇺🇸",
      description: "Join our DevOps team to build and maintain scalable cloud infrastructure."
    },
    {
      id: 7,
      title: "Content Writer",
      company: "Media House",
      logo: "https://via.placeholder.com/48x48/84CC16/FFFFFF?text=MH",
      location: "Chicago, IL",
      salary: "$60,000 - $75,000",
      type: "Contract",
      remote: true,
      posted: "1 week ago",
      views: 98,
      applicants: 18,
      badges: ["Remote"],
      urgent: false,
      companyVerified: false,
      countryFlag: "🇺🇸",
      description: "Looking for talented content writers to create engaging content for our clients."
    },
    {
      id: 8,
      title: "Sales Representative",
      company: "Sales Pro Inc",
      logo: "https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=SP",
      location: "Boston, MA",
      salary: "$70,000 - $90,000 + Commission",
      type: "Full-time",
      remote: false,
      posted: "6 days ago",
      views: 145,
      applicants: 7,
      badges: [],
      urgent: false,
      companyVerified: true,
      countryFlag: "🇺🇸",
      description: "Join our sales team and help us grow our customer base."
    }
  ]
};

export const mockJobCategories = [
  {
    id: 1,
    name: "Engineering",
    slug: "engineering",
    count: 1245,
    icon: "⚙️"
  },
  {
    id: 2,
    name: "Design",
    slug: "design",
    count: 876,
    icon: "🎨"
  },
  {
    id: 3,
    name: "Marketing",
    slug: "marketing",
    count: 654,
    icon: "📢"
  },
  {
    id: 4,
    name: "Sales",
    slug: "sales",
    count: 543,
    icon: "💼"
  },
  {
    id: 5,
    name: "Product",
    slug: "product",
    count: 432,
    icon: "📱"
  },
  {
    id: 6,
    name: "Data Science",
    slug: "data-science",
    count: 321,
    icon: "📊"
  }
];

export const mockJobStats = {
  success: true,
  data: {
    total_jobs: 4532,
    new_this_week: 234,
    companies_hiring: 892,
    remote_jobs: 1234
  }
};
