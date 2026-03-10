import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiDownload, FiCalendar, FiTrendingUp, FiEye, FiMousePointer, FiPackage, FiCreditCard, FiFilter, FiSearch } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const UserInvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [filters, searchTerm]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock API calls - in production, these would fetch from backend
      const mockInvoices = getMockInvoices();
      const mockAnalytics = getMockAnalytics();
      
      // Apply filters to invoices
      let filteredInvoices = mockInvoices.filter(invoice => {
        if (filters.status !== 'all' && invoice.status !== filters.status) return false;
        if (filters.type !== 'all' && invoice.type !== filters.type) return false;
        if (searchTerm && !invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !invoice.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      });
      
      setInvoices(filteredInvoices);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (invoice) => {
    // Mock PDF download
    const invoiceData = JSON.stringify(invoice, null, 2);
    const blob = new Blob([invoiceData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800' },
      paid: { color: 'bg-green-100 text-green-800' },
      overdue: { color: 'bg-red-100 text-red-800' },
      cancelled: { color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getMockInvoices = () => {
    return [
      {
        id: 1,
        invoiceNumber: 'INV-2024001',
        type: 'subscription',
        amount: 49.00,
        currency: 'USD',
        status: 'paid',
        createdAt: '2024-01-15T10:30:00Z',
        dueDate: '2024-02-15T10:30:00Z',
        description: 'Premium subscription plan - Monthly',
        advertReference: 'N/A'
      },
      {
        id: 2,
        invoiceNumber: 'INV-2024002',
        type: 'promoted',
        amount: 25.00,
        currency: 'USD',
        status: 'pending',
        createdAt: '2024-01-16T14:20:00Z',
        dueDate: '2024-01-30T14:20:00Z',
        description: 'Promoted advert boost - 7 days',
        advertReference: 'ADV-10393'
      },
      {
        id: 3,
        invoiceNumber: 'INV-2024003',
        type: 'featured',
        amount: 35.00,
        currency: 'USD',
        status: 'paid',
        createdAt: '2024-01-10T09:15:00Z',
        dueDate: '2024-01-25T09:15:00Z',
        description: 'Featured advert placement - 14 days',
        advertReference: 'ADV-10394'
      },
      {
        id: 4,
        invoiceNumber: 'INV-2024004',
        type: 'sponsored',
        amount: 50.00,
        currency: 'USD',
        status: 'overdue',
        createdAt: '2024-01-17T16:45:00Z',
        dueDate: '2024-02-01T16:45:00Z',
        description: 'Sponsored advert campaign - 30 days',
        advertReference: 'ADV-10395'
      }
    ];
  };

  const getMockAnalytics = () => {
    return {
      totalAdverts: 12,
      totalViews: 15420,
      totalClicks: 3240,
      totalSpent: 259.00,
      avgClickRate: 21.0,
      revenueData: [
        { month: 'Jan', revenue: 159 },
        { month: 'Feb', revenue: 189 },
        { month: 'Mar', revenue: 234 },
        { month: 'Apr', revenue: 178 },
        { month: 'May', revenue: 267 },
        { month: 'Jun', revenue: 259 }
      ],
      advertPerformance: [
        { name: 'Cars', views: 4500, clicks: 890 },
        { name: 'Electronics', views: 3200, clicks: 680 },
        { name: 'Property', views: 2800, clicks: 520 },
        { name: 'Clothing', views: 2100, clicks: 450 },
        { name: 'Books', views: 1820, clicks: 380 },
        { name: 'Other', views: 1000, clicks: 320 }
      ],
      spendingBreakdown: [
        { name: 'Subscriptions', value: 49, color: '#3B82F6' },
        { name: 'Promoted Ads', value: 85, color: '#8B5CF6' },
        { name: 'Featured Ads', value: 70, color: '#10B981' },
        { name: 'Sponsored Ads', value: 55, color: '#F59E0B' }
      ]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Invoice Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your invoices and track advert performance</p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiPackage className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Adverts</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalAdverts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiEye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalViews?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiMousePointer className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalClicks?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${analytics?.totalSpent?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.revenueData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Spending Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.spendingBreakdown || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(analytics?.spendingBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Advert Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advert Performance by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.advertPerformance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#3B82F6" />
              <Bar dataKey="clicks" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Invoices Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Invoices</h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="subscription">Subscription</option>
                    <option value="promoted">Promoted</option>
                    <option value="featured">Featured</option>
                    <option value="sponsored">Sponsored</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-xs text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900 capitalize">{invoice.type}</div>
                          <div className="text-xs text-gray-500">{invoice.advertReference}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${invoice.amount.toFixed(2)} {invoice.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <FiDownload className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analytics?.avgClickRate?.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Average Click Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${((analytics?.totalClicks || 0) * 0.05).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Estimated Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                ${((analytics?.totalSpent || 0) / (analytics?.totalAdverts || 1)).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Cost Per Advert</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInvoiceDashboard;
