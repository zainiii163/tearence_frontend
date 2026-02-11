import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaPlus,
  FaSearch,
  FaSync,
  FaBriefcase,
  FaTag,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { PiFlagBanner } from 'react-icons/pi';
import { BiDesktop } from 'react-icons/bi';
import { getMyAffiliate } from '../slice/AffiliateSLice';
import { deleteAffiliate } from '../slice/AffiliateSLice';
import jobService from '../services/JobServices';
import toast from 'react-hot-toast';

const MyPostsManagement = () => {
  const dispatch = useDispatch();
  const { myAffiliateList } = useSelector((store) => store.aff);
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [myJobs, setMyJobs] = useState([]);
  const [myBanners, setMyBanners] = useState([]);
  const [myClassifieds, setMyClassifieds] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = userDetails?.customer_id || localStorage.getItem("customer_id");

  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch affiliate ads
      dispatch(getMyAffiliate());
      
      // Fetch jobs
      try {
        const jobsResponse = await jobService.getMyListings({ per_page: 100 });
        const jobs = jobsResponse?.data?.items || jobsResponse?.data?.data?.items || [];
        setMyJobs(Array.isArray(jobs) ? jobs : []);
      } catch (error) {
        console.debug("Error fetching my jobs:", error);
        setMyJobs([]);
      }

      // TODO: Add banner and classified ads API calls when available
      // For now, using empty arrays as placeholders
      setMyBanners([]);
      setMyClassifieds([]);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Fetch all user posts
  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts, userId]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await jobService.deleteJob(jobId);
        toast.success("Job deleted successfully");
        fetchAllPosts(); // Refresh all posts
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };

  const handleDeleteAffiliate = async (affiliateId) => {
    try {
      await dispatch(deleteAffiliate(affiliateId)).unwrap();
      toast.success('Affiliate ad deleted successfully');
      dispatch(getMyAffiliate());
    } catch (error) {
      toast.error('Failed to delete affiliate ad');
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'job':
        return <FaBriefcase className="h-4 w-4 text-blue-500" />;
      case 'banner':
        return <PiFlagBanner className="h-4 w-4 text-orange-500" />;
      case 'affiliate':
        return <BiDesktop className="h-4 w-4 text-purple-500" />;
      case 'classified':
        return <FaTag className="h-4 w-4 text-green-500" />;
      default:
        return <FaTag className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPostTypeBadge = (type) => {
    const badges = {
      job: 'bg-blue-100 text-blue-800',
      banner: 'bg-orange-100 text-orange-800',
      affiliate: 'bg-purple-100 text-purple-800',
      classified: 'bg-green-100 text-green-800',
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (post) => {
    if (post.type === 'affiliate') {
      const isExpired = post.expires_at && new Date(post.expires_at) < new Date();
      
      if (isExpired) {
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <FaTimesCircle className="mr-1 h-3 w-3" />
            Expired
          </span>
        );
      }
      
      if (post.payment_status === 'pending') {
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <FaClock className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      }
      
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <FaCheckCircle className="mr-1 h-3 w-3" />
          Active
        </span>
      );
    }
    
    if (post.type === 'job') {
      const status = post.status || 'active';
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        expired: 'bg-red-100 text-red-800',
        pending: 'bg-blue-100 text-blue-800',
      };
      
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    }
    
    // Default status for other types
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <FaCheckCircle className="mr-1 h-3 w-3" />
        Active
      </span>
    );
  };

  // Combine all posts
  const allPosts = [
    ...myJobs.map(job => ({ ...job, type: 'job', id: job.id || job.listing_id })),
    ...myAffiliateList.map(affiliate => ({ ...affiliate, type: 'affiliate' })),
    ...myBanners.map(banner => ({ ...banner, type: 'banner' })),
    ...myClassifieds.map(classified => ({ ...classified, type: 'classified' })),
  ];

  // Filter posts
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = searchQuery
      ? (post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         post.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         post.company?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    const matchesType = filterType === 'all' ? true : post.type === filterType;
    
    const matchesStatus = filterStatus === 'all' ? true :
      filterStatus === 'active' ? (post.status === 'active' || post.payment_status === 'paid') :
      filterStatus === 'expired' ? (post.expires_at && new Date(post.expires_at) < new Date()) :
      filterStatus === 'pending' ? (post.payment_status === 'pending' || post.status === 'pending') :
      true;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort posts by creation date (newest first)
  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt || a.posted_at);
    const dateB = new Date(b.created_at || b.createdAt || b.posted_at);
    return dateB - dateA;
  });

  const getPostEditLink = (post) => {
    switch (post.type) {
      case 'job':
        return `/jobs/post/${post.id}`;
      case 'banner':
        return `/postbanner/${post.id}`;
      case 'affiliate':
        return `/postaffiliate/${post.id}`;
      case 'classified':
        return `/postclassified/${post.id}`;
      default:
        return '#';
    }
  };

  const getPostViewLink = (post) => {
    switch (post.type) {
      case 'job':
        return `/jobs/${post.id}`;
      case 'banner':
        return `/banner/${post.id}`;
      case 'affiliate':
        return `/affiliate/${post.id}`;
      case 'classified':
        return `/classified/${post.id}`;
      default:
        return '#';
    }
  };

  const handleDelete = (post) => {
    switch (post.type) {
      case 'job':
        handleDeleteJob(post.id);
        break;
      case 'affiliate':
        handleDeleteAffiliate(post.id);
        break;
      // TODO: Add delete handlers for banner and classified when APIs are available
      default:
        toast.error('Delete functionality not available for this post type');
    }
  };

  const stats = {
    total: allPosts.length,
    jobs: myJobs.length,
    affiliate: myAffiliateList.length,
    banner: myBanners.length,
    classified: myClassifieds.length,
    active: allPosts.filter(p => p.status === 'active' || p.payment_status === 'paid').length,
    pending: allPosts.filter(p => p.status === 'pending' || p.payment_status === 'pending').length,
    expired: allPosts.filter(p => p.expires_at && new Date(p.expires_at) < new Date()).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">My Posts</h2>
          <p className="text-sm text-muted-foreground">
            Manage all your postings in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/jobs/post"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 text-sm font-medium"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Post New
          </Link>
          <button
            onClick={fetchAllPosts}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 text-sm font-medium"
          >
            <FaSync className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.jobs}</p>
            <p className="text-xs text-muted-foreground">Jobs</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.banner}</p>
            <p className="text-xs text-muted-foreground">Banners</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.affiliate}</p>
            <p className="text-xs text-muted-foreground">Affiliate</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.classified}</p>
            <p className="text-xs text-muted-foreground">Classified</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            <p className="text-xs text-muted-foreground">Expired</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 sm:flex-initial">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Types</option>
          <option value="job">Jobs</option>
          <option value="banner">Banner Ads</option>
          <option value="affiliate">Affiliate Ads</option>
          <option value="classified">Classified Ads</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Posts List */}
      {sortedPosts.length > 0 ? (
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <div
              key={`${post.type}-${post.id}`}
              className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Post Icon/Thumbnail */}
                <div className="lg:w-48 flex-shrink-0">
                  {post.type === 'affiliate' && post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/img/no-image-affiliate.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                      {getPostTypeIcon(post.type)}
                    </div>
                  )}
                </div>

                {/* Post Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {getPostTypeIcon(post.type)}
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPostTypeBadge(post.type)}`}>
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </span>
                      <h3 className="text-lg font-semibold">{post.title || post.position}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(post)}
                    </div>
                  </div>

                  {/* Post-specific details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    {post.type === 'job' && (
                      <>
                        <div className="flex items-center gap-2">
                          <FaBriefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{post.company || 'Company'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="h-4 w-4 text-muted-foreground" />
                          <span>{post.location || 'Location'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{post.salary_min && post.salary_max 
                            ? `$${post.salary_min} - $${post.salary_max}`
                            : post.salary_min 
                            ? `$${post.salary_min}+`
                            : 'Salary not specified'
                          }</span>
                        </div>
                      </>
                    )}
                    
                    {post.type === 'affiliate' && (
                      <>
                        <div className="flex items-center gap-2">
                          <FaExternalLinkAlt className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {post.link}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${post.price || '0.00'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {post.expires_at 
                              ? `Expires: ${new Date(post.expires_at).toLocaleDateString()}`
                              : 'No expiry'
                            }
                          </span>
                        </div>
                      </>
                    )}
                    
                    {/* Default details for other types */}
                    {(!post.type || ['banner', 'classified'].includes(post.type)) && (
                      <>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                          <span>Created: {new Date(post.created_at || post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEye className="h-4 w-4 text-muted-foreground" />
                          <span>Views: {post.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <span>{post.status || 'Active'}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t">
                    <Link
                      to={getPostViewLink(post)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-sm"
                    >
                      <FaEye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                    <Link
                      to={getPostEditLink(post)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-sm"
                    >
                      <FaEdit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-red-600 text-white hover:bg-red-700 h-9 px-4 text-sm"
                    >
                      <FaTrash className="mr-2 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <FaTag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Posts Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first post'
            }
          </p>
          {(!searchQuery && filterType === 'all' && filterStatus === 'all') && (
            <Link
              to="/jobs/post"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Create Your First Post
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPostsManagement;
