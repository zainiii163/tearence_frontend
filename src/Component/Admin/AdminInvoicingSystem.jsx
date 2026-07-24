import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiFile, FiDownload, FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiCalendar, FiUser, FiPackage, FiCheck, FiX, FiClock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdminInvoicingSystem = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, [filters, searchTerm]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Mock API call - in production, this would fetch from backend
      const mockInvoices = getMockInvoices();
      
      // Apply filters
      let filteredInvoices = mockInvoices.filter(invoice => {
        // Status filter
        if (filters.status !== 'all' && invoice.status !== filters.status) {
          return false;
        }
        
        // Type filter
        if (filters.type !== 'all' && invoice.type !== filters.type) {
          return false;
        }
        
        // Search filter
        if (searchTerm && !invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !invoice.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !invoice.advertReference.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        return true;
      });
      
      setInvoices(filteredInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      // Mock API call
      const newInvoice = {
        id: Date.now(),
        invoiceNumber: `INV-${Date.now().toString().slice(-8)}`,
        ...invoiceData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      setInvoices(prev => [newInvoice, ...prev]);
      setShowCreateModal(false);
      toast.success('Invoice created successfully');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  const handleUpdateStatus = async (invoiceId, newStatus) => {
    try {
      // Mock API call
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, status: newStatus, updatedAt: new Date().toISOString() }
          : invoice
      ));
      toast.success(`Invoice status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      // Mock API call
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
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
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock className="h-3 w-3" /> },
      paid: { color: 'bg-green-100 text-green-800', icon: <FiCheck className="h-3 w-3" /> },
      overdue: { color: 'bg-red-100 text-red-800', icon: <FiX className="h-3 w-3" /> },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: <FiX className="h-3 w-3" /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      subscription: { color: 'bg-blue-100 text-blue-800', label: 'Subscription' },
      promoted: { color: 'bg-purple-100 text-purple-800', label: 'Promoted Ad' },
      featured: { color: 'bg-indigo-100 text-indigo-800', label: 'Featured Ad' },
      sponsored: { color: 'bg-green-100 text-green-800', label: 'Sponsored Ad' }
    };
    
    const config = typeConfig[type] || typeConfig.subscription;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getMockInvoices = () => {
    return [
      {
        id: 1,
        invoiceNumber: 'INV-2024001',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        advertReference: 'ADV-10392',
        type: 'subscription',
        amount: 49.00,
        currency: 'USD',
        status: 'paid',
        createdAt: '2024-01-15T10:30:00Z',
        dueDate: '2024-02-15T10:30:00Z',
        description: 'Premium subscription plan - Monthly',
        items: [
          { name: 'Premium Subscription', quantity: 1, price: 49.00 }
        ]
      },
      {
        id: 2,
        invoiceNumber: 'INV-2024002',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        advertReference: 'ADV-10393',
        type: 'promoted',
        amount: 25.00,
        currency: 'USD',
        status: 'pending',
        createdAt: '2024-01-16T14:20:00Z',
        dueDate: '2024-01-30T14:20:00Z',
        description: 'Promoted advert boost - 7 days',
        items: [
          { name: 'Promoted Ad - 7 Days', quantity: 1, price: 25.00 }
        ]
      },
      {
        id: 3,
        invoiceNumber: 'INV-2024003',
        userName: 'Bob Johnson',
        userEmail: 'bob@example.com',
        advertReference: 'ADV-10394',
        type: 'featured',
        amount: 35.00,
        currency: 'USD',
        status: 'overdue',
        createdAt: '2024-01-10T09:15:00Z',
        dueDate: '2024-01-25T09:15:00Z',
        description: 'Featured advert placement - 14 days',
        items: [
          { name: 'Featured Ad - 14 Days', quantity: 1, price: 35.00 }
        ]
      },
      {
        id: 4,
        invoiceNumber: 'INV-2024004',
        userName: 'Alice Brown',
        userEmail: 'alice@example.com',
        advertReference: 'ADV-10395',
        type: 'sponsored',
        amount: 50.00,
        currency: 'USD',
        status: 'paid',
        createdAt: '2024-01-17T16:45:00Z',
        dueDate: '2024-02-17T16:45:00Z',
        description: 'Sponsored advert campaign - 30 days',
        items: [
          { name: 'Sponsored Ad - 30 Days', quantity: 1, price: 50.00 }
        ]
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoicing System</h1>
            <p className="text-gray-600 mt-2">Manage customer invoices and payments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiFile className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${invoices.reduce((sum, inv) => inv.status === 'paid' ? sum + inv.amount : sum, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter(inv => inv.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiX className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter(inv => inv.status === 'overdue').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="subscription">Subscription</option>
                <option value="promoted">Promoted Ad</option>
                <option value="featured">Featured Ad</option>
                <option value="sponsored">Sponsored Ad</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
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
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    </td>
                  </tr>
                ) : invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-xs text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.userName}</div>
                        <div className="text-xs text-gray-500">{invoice.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(invoice.type)}
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
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Download"
                          >
                            <FiDownload className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="text-gray-600 hover:text-gray-900"
                            title="View Details"
                          >
                            <FiFile className="h-4 w-4" />
                          </button>
                          {invoice.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Paid"
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <CreateInvoiceModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateInvoice}
        />
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

// Create Invoice Modal Component
const CreateInvoiceModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    advertReference: '',
    type: 'subscription',
    amount: '',
    description: '',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Create New Invoice</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.userEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Advert Reference
                </label>
                <input
                  type="text"
                  value={formData.advertReference}
                  onChange={(e) => setFormData(prev => ({ ...prev, advertReference: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ADV-10392"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="subscription">Subscription</option>
                  <option value="promoted">Promoted Ad</option>
                  <option value="featured">Featured Ad</option>
                  <option value="sponsored">Sponsored Ad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what this invoice is for..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Invoice Details Modal Component
const InvoiceDetailsModal = ({ invoice, onClose, onUpdateStatus }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Invoice Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Invoice Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Invoice Number:</dt>
                  <dd className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Created Date:</dt>
                  <dd className="text-sm text-gray-900">{new Date(invoice.createdAt).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Due Date:</dt>
                  <dd className="text-sm text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Status:</dt>
                  <dd>
                    <select
                      value={invoice.status}
                      onChange={(e) => onUpdateStatus(invoice.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Customer Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Name:</dt>
                  <dd className="text-sm text-gray-900">{invoice.userName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Email:</dt>
                  <dd className="text-sm text-gray-900">{invoice.userEmail}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Advert Reference:</dt>
                  <dd className="text-sm text-gray-900">{invoice.advertReference}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-4">Order Summary</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {invoice.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${invoice.amount.toFixed(2)} {invoice.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{invoice.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoicingSystem;
