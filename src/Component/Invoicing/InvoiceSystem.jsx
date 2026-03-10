import React, { useState, useEffect } from 'react';
import { FaDownload, FaFileInvoice, FaDollarSign, FaCalendarAlt, FaUser, FaBuilding, FaCreditCard, FaPaypal, FaStripe, FaCheck, FaTimes, FaEye, FaPrint, FaEnvelope } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

const InvoiceSystem = ({ userId, userType = 'user' }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New invoice form state
  const [newInvoice, setNewInvoice] = useState({
    customer_id: '',
    customer_name: '',
    customer_email: '',
    business_name: '',
    items: [],
    subtotal: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 0,
    due_date: '',
    notes: '',
    payment_methods: ['credit_card', 'paypal', 'stripe'],
    status: 'pending'
  });

  useEffect(() => {
    fetchInvoices();
  }, [filterStatus, searchTerm]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: filterStatus !== 'all' ? filterStatus : '',
        search: searchTerm,
        limit: 50
      });

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
    if (!newInvoice.customer_name || !newInvoice.items.length) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/invoices', newInvoice);
      
      if (response.data.success) {
        toast.success('Invoice created successfully!');
        setShowCreateModal(false);
        resetNewInvoice();
        fetchInvoices();
      } else {
        toast.error(response.data.message || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const sendInvoiceEmail = async (invoiceId) => {
    try {
      const response = await api.post(`/invoices/${invoiceId}/send-email`);
      
      if (response.data.success) {
        toast.success('Invoice sent via email successfully!');
      } else {
        toast.error(response.data.message || 'Failed to send invoice');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
    }
  };

  const updateInvoiceStatus = async (invoiceId, status) => {
    try {
      const response = await api.patch(`/invoices/${invoiceId}`, { status });
      
      if (response.data.success) {
        toast.success(`Invoice marked as ${status}!`);
        fetchInvoices();
      } else {
        toast.error(response.data.message || 'Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    }
  };

  const resetNewInvoice = () => {
    setNewInvoice({
      customer_id: '',
      customer_name: '',
      customer_email: '',
      business_name: '',
      items: [],
      subtotal: 0,
      tax_rate: 0,
      tax_amount: 0,
      total_amount: 0,
      due_date: '',
      notes: '',
      payment_methods: ['credit_card', 'paypal', 'stripe'],
      status: 'pending'
    });
  };

  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unit_price: 0,
        total: 0
      }]
    }));
  };

  const updateInvoiceItem = (index, field, value) => {
    setNewInvoice(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      
      // Recalculate item total
      if (field === 'quantity' || field === 'unit_price') {
        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unit_price;
      }
      
      // Recalculate subtotal and total
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = subtotal * (prev.tax_rate / 100);
      const total = subtotal + taxAmount;
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        tax_amount: taxAmount,
        total_amount: total
      };
    });
  };

  const removeInvoiceItem = (index) => {
    setNewInvoice(prev => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = subtotal * (prev.tax_rate / 100);
      const total = subtotal + taxAmount;
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        tax_amount: taxAmount,
        total_amount: total
      };
    });
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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          <p className="text-gray-600">Create, manage, and track your invoices</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaFileInvoice className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Invoices List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-2">Loading invoices...</span>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <FaFileInvoice className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Create your first invoice to get started'}
          </p>
          {(!searchTerm && filterStatus === 'all') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaFileInvoice className="h-4 w-4" />
              Create Your First Invoice
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{invoice.invoice_number}</div>
                      <div className="text-xs text-gray-500">{new Date(invoice.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.customer_name}</div>
                      {invoice.business_name && (
                        <div className="text-xs text-gray-500">{invoice.business_name}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${invoice.total_amount?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowPreviewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Preview"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadInvoice(invoice.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Download"
                        >
                          <FaDownload className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => sendInvoiceEmail(invoice.id)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Send Email"
                        >
                          <FaEnvelope className="h-4 w-4" />
                        </button>
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                            className="text-green-600 hover:text-green-800"
                            title="Mark as Paid"
                          >
                            <FaCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Create New Invoice</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={newInvoice.customer_name}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                  <input
                    type="email"
                    value={newInvoice.customer_email}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, customer_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={newInvoice.business_name}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, business_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Invoice Items</h4>
                  <button
                    onClick={addInvoiceItem}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Unit Price"
                        value={item.unit_price}
                        onChange={(e) => updateInvoiceItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex items-center px-2 py-1 bg-gray-50 rounded">
                        <span className="text-sm font-medium">${item.total.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => removeInvoiceItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax and Totals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={newInvoice.tax_rate}
                    onChange={(e) => {
                      const taxRate = parseFloat(e.target.value) || 0;
                      setNewInvoice(prev => {
                        const taxAmount = prev.subtotal * (taxRate / 100);
                        return {
                          ...prev,
                          tax_rate: taxRate,
                          tax_amount: taxAmount,
                          total_amount: prev.subtotal + taxAmount
                        };
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${newInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${newInvoice.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${newInvoice.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes or payment instructions..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createInvoice}
                disabled={loading || !newInvoice.customer_name || newInvoice.items.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showPreviewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Invoice Preview</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="text-gray-600 hover:text-gray-800"
                    title="Print"
                  >
                    <FaPrint className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6" id="invoice-preview">
              {/* Invoice Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
                    <p className="text-gray-600">#{selectedInvoice.invoice_number}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(selectedInvoice.status)}`}>
                      {selectedInvoice.status}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                    <p className="text-gray-700">{selectedInvoice.customer_name}</p>
                    {selectedInvoice.business_name && (
                      <p className="text-gray-700">{selectedInvoice.business_name}</p>
                    )}
                    {selectedInvoice.customer_email && (
                      <p className="text-gray-700">{selectedInvoice.customer_email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Invoice Date:</span> {new Date(selectedInvoice.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Due Date:</span> {new Date(selectedInvoice.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Items Table */}
              <div className="mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">Quantity</th>
                      <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium text-gray-700">Unit Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-700">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-sm text-gray-700">${item.unit_price.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-sm text-gray-700">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${selectedInvoice.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax ({selectedInvoice.tax_rate || 0}%):</span>
                      <span>${selectedInvoice.tax_amount?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${selectedInvoice.total_amount?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes:</h3>
                  <p className="text-gray-700">{selectedInvoice.notes}</p>
                </div>
              )}

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Methods:</h3>
                <div className="flex items-center gap-4">
                  {selectedInvoice.payment_methods?.includes('credit_card') && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCreditCard className="h-4 w-4" />
                      Credit Card
                    </div>
                  )}
                  {selectedInvoice.payment_methods?.includes('paypal') && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPaypal className="h-4 w-4" />
                      PayPal
                    </div>
                  )}
                  {selectedInvoice.payment_methods?.includes('stripe') && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaStripe className="h-4 w-4" />
                      Stripe
                    </div>
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

export default InvoiceSystem;
