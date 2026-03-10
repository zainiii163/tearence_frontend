import React, { useState, useEffect } from 'react';
import { FaFileInvoice, FaDownload, FaEye, FaCalendarAlt, FaDollarSign, FaUser, FaBuilding, FaCreditCard, FaCheck, FaTimes, FaClock, FaFilter } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

const BackendInvoicingSystem = ({ userId, businessId }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customer_id: userId,
    business_id: businessId,
    amount: '',
    description: '',
    due_date: '',
    items: []
  });

  useEffect(() => {
    fetchInvoices();
  }, [userId, businessId, filterStatus, dateRange]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (userId) params.append('customer_id', userId);
      if (businessId) params.append('business_id', businessId);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (dateRange.start) params.append('start_date', dateRange.start);
      if (dateRange.end) params.append('end_date', dateRange.end);

      const response = await api.get(`/invoices?${params}`);
      setInvoices(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async () => {
    try {
      const invoiceData = {
        ...newInvoice,
        amount: parseFloat(newInvoice.amount),
        items: newInvoice.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price)
        }))
      };

      const response = await api.post('/invoices', invoiceData);
      
      if (response.data.success) {
        toast.success('Invoice created successfully');
        setShowCreateModal(false);
        setNewInvoice({
          customer_id: userId,
          business_id: businessId,
          amount: '',
          description: '',
          due_date: '',
          items: []
        });
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      const response = await api.patch(`/invoices/${invoiceId}/status`, { status: newStatus });
      
      if (response.data.success) {
        toast.success(`Invoice ${newStatus}`);
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unit_price: 0 }]
    }));
  };

  const updateInvoiceItem = (index, field, value) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeInvoiceItem = (index) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return newInvoice.items.reduce((total, item) => {
      return total + (item.quantity * item.unit_price);
    }, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <FaCheck className="h-3 w-3" />;
      case 'pending': return <FaClock className="h-3 w-3" />;
      case 'overdue': return <FaTimes className="h-3 w-3" />;
      case 'cancelled': return <FaTimes className="h-3 w-3" />;
      default: return <FaFileInvoice className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FaFileInvoice className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Invoicing System</h2>
              <p className="text-sm text-gray-600">Manage and track invoices</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaFileInvoice className="h-4 w-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
            <span className="ml-2">Loading invoices...</span>
          </div>
        ) : invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">Invoice #{invoice.invoice_number}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{invoice.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="h-3 w-3" />
                        <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaDollarSign className="h-3 w-3" />
                        <span className="font-medium text-gray-900">${invoice.amount.toFixed(2)}</span>
                      </div>
                      {invoice.customer_name && (
                        <div className="flex items-center gap-1">
                          <FaUser className="h-3 w-3" />
                          <span>{invoice.customer_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FaEye className="h-3 w-3" />
                      View
                    </button>
                    <button
                      onClick={() => downloadInvoice(invoice.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaDownload className="h-3 w-3" />
                      Download
                    </button>
                    {invoice.status === 'pending' && (
                      <button
                        onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FaCheck className="h-3 w-3" />
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaFileInvoice className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No invoices found</p>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Invoice</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={newInvoice.description}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Invoice description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Invoice Items</label>
                    <button
                      type="button"
                      onClick={addInvoiceItem}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newInvoice.items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', e.target.value)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.unit_price}
                          onChange={(e) => updateInvoiceItem(index, 'unit_price', e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeInvoiceItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createInvoice}
                  disabled={!newInvoice.description || newInvoice.items.length === 0}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Invoice #{selectedInvoice.invoice_number}</h3>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Invoice Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedInvoice.status)}`}>
                          {getStatusIcon(selectedInvoice.status)}
                          {selectedInvoice.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="ml-2 font-medium">${selectedInvoice.amount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Due Date:</span>
                        <span className="ml-2">{new Date(selectedInvoice.due_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <span className="ml-2">{new Date(selectedInvoice.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedInvoice.description}</p>
                </div>

                {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Description</th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-gray-900">Qty</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-900">Price</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-900">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                              <td className="px-4 py-2 text-center text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-4 py-2 text-right text-sm text-gray-900">${item.unit_price.toFixed(2)}</td>
                              <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                ${(item.quantity * item.unit_price).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => downloadInvoice(selectedInvoice.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDownload className="h-4 w-4" />
                    Download PDF
                  </button>
                  {selectedInvoice.status === 'pending' && (
                    <button
                      onClick={() => {
                        updateInvoiceStatus(selectedInvoice.id, 'paid');
                        setSelectedInvoice(null);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheck className="h-4 w-4" />
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendInvoicingSystem;
