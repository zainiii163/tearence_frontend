import React, { useState, useEffect } from "react";
import { 
  FaDollarSign, 
  FaCalendarAlt, 
  FaDownload, 
  FaFilter,
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFileInvoice,
  FaCreditCard,
  FaUniversity,
  FaBitcoin,
  FaEnvelope,
  FaChartLine,
  FaTrendingUp,
  FaTrendingDown,
  FaMinus
} from "react-icons/fa";
import AffiliateServices from "../services/AffiliateServices";
import toast from "react-hot-toast";

const AffiliatePaymentHistory = ({ userId, className = "" }) => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [showDetails, setShowDetails] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Statistics
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalPending: 0,
    totalFailed: 0,
    averagePayout: 0,
    nextPayoutDate: null,
    totalTransactions: 0
  });

  const periods = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last Year" },
    { value: "all", label: "All Time" }
  ];

  const statusOptions = [
    { value: "all", label: "All Status", color: "bg-gray-100 text-gray-800" },
    { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
    { value: "pending", label: "Pending", color: "bg-blue-100 text-blue-800" },
    { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
    { value: "failed", label: "Failed", color: "bg-purple-100 text-purple-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-gray-100 text-gray-800" }
  ];

  const paymentMethods = [
    { value: "all", label: "All Methods" },
    { value: "paypal", label: "PayPal", icon: <FaCreditCard /> },
    { value: "stripe", label: "Stripe", icon: <FaCreditCard /> },
    { value: "wire", label: "Wire Transfer", icon: <FaUniversity /> },
    { value: "check", label: "Check", icon: <FaFileInvoice /> },
    { value: "crypto", label: "Cryptocurrency", icon: <FaBitcoin /> },
    { value: "bank", label: "Direct Bank", icon: <FaUniversity /> }
  ];

  // Mock payment data - replace with actual API calls
  const mockPayments = [
    {
      id: 1,
      date: "2024-01-20",
      amount: 1245.67,
      commission: 249.13,
      status: "paid",
      paymentMethod: "paypal",
      transactionId: "TXN-12345-ABC",
      orderId: "ORD-2024-001",
      referralName: "John Doe",
      referralId: "REF-001",
      commissionRate: 20,
      productType: "premium",
      trackingDate: "2024-01-15",
      processedDate: "2024-01-22",
      notes: "Monthly commission payment",
      fees: 12.45,
      netAmount: 236.68,
      currency: "USD"
    },
    {
      id: 2,
      date: "2024-01-19",
      amount: 899.99,
      commission: 179.99,
      status: "pending",
      paymentMethod: "stripe",
      transactionId: "TXN-12346-DEF",
      orderId: "ORD-2024-002",
      referralName: "Jane Smith",
      referralId: "REF-002",
      commissionRate: 20,
      productType: "professional",
      trackingDate: "2024-01-14",
      processedDate: null,
      notes: "Pending verification",
      fees: 8.99,
      netAmount: 171.00,
      currency: "USD"
    },
    {
      id: 3,
      date: "2024-01-18",
      amount: 2999.00,
      commission: 899.70,
      status: "processing",
      paymentMethod: "wire",
      transactionId: "TXN-12347-GHI",
      orderId: "ORD-2024-003",
      referralName: "Bob Johnson",
      referralId: "REF-003",
      commissionRate: 30,
      productType: "enterprise",
      trackingDate: "2024-01-10",
      processedDate: "2024-01-25",
      notes: "High-value enterprise commission",
      fees: 29.99,
      netAmount: 869.71,
      currency: "USD"
    },
    {
      id: 4,
      date: "2024-01-17",
      amount: 499.00,
      commission: 99.80,
      status: "failed",
      paymentMethod: "check",
      transactionId: "TXN-12348-JKL",
      orderId: "ORD-2024-004",
      referralName: "Alice Brown",
      referralId: "REF-004",
      commissionRate: 20,
      productType: "standard",
      trackingDate: "2024-01-12",
      processedDate: null,
      notes: "Payment failed - invalid address",
      fees: 4.99,
      netAmount: 94.81,
      currency: "USD"
    },
    {
      id: 5,
      date: "2024-01-16",
      amount: 1599.00,
      commission: 319.80,
      status: "paid",
      paymentMethod: "crypto",
      transactionId: "TXN-12349-MNO",
      orderId: "ORD-2024-005",
      referralName: "Charlie Wilson",
      referralId: "REF-005",
      commissionRate: 20,
      productType: "premium",
      trackingDate: "2024-01-08",
      processedDate: "2024-01-24",
      notes: "Bitcoin payment processed",
      fees: 15.99,
      netAmount: 303.81,
      currency: "USD"
    }
  ];

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  useEffect(() => {
    filterAndSortPayments();
  }, [payments, searchQuery, selectedPeriod, selectedStatus, selectedMethod, sortBy, sortOrder]);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      
      // In production, replace with actual API call
      // const response = await AffiliateServices.getPaymentHistory(userId);
      
      setPayments(mockPayments);
      
      // Calculate statistics
      const totalPaid = mockPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.netAmount, 0);
      const totalPending = mockPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.netAmount, 0);
      const totalFailed = mockPayments.filter(p => p.status === "failed").reduce((sum, p) => sum + p.netAmount, 0);
      const paidTransactions = mockPayments.filter(p => p.status === "paid");
      const averagePayout = paidTransactions.length > 0 ? totalPaid / paidTransactions.length : 0;
      
      setStats({
        totalPaid,
        totalPending,
        totalFailed,
        averagePayout,
        nextPayoutDate: "2024-02-01", // Mock next payout date
        totalTransactions: mockPayments.length
      });
      
    } catch (error) {
      console.error("Error loading payment history:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPayments = () => {
    let filtered = [...payments];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(payment => 
        payment.referralName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(payment => payment.status === selectedStatus);
    }
    
    // Apply method filter
    if (selectedMethod !== "all") {
      filtered = filtered.filter(payment => payment.paymentMethod === selectedMethod);
    }
    
    // Apply period filter (simplified - in production, use actual date calculations)
    if (selectedPeriod !== "all") {
      // Mock filtering - replace with actual date logic
      const days = parseInt(selectedPeriod.replace('days', '').replace('months', '').replace('year', ''));
      if (selectedPeriod.includes('days')) {
        filtered = filtered.slice(0, Math.min(days, filtered.length));
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "commission":
          aValue = a.commission;
          bValue = b.commission;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredPayments(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid": return <FaCheckCircle className="text-green-600" />;
      case "pending": return <FaClock className="text-blue-600" />;
      case "processing": return <FaInfoCircle className="text-blue-600" />;
      case "failed": return <FaExclamationTriangle className="text-purple-600" />;
      case "cancelled": return <FaMinus className="text-gray-600" />;
      default: return <FaInfoCircle className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };

  const getPaymentMethodIcon = (method) => {
    const methodOption = paymentMethods.find(opt => opt.value === method);
    return methodOption ? methodOption.icon : <FaCreditCard />;
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <FaTrendingUp className="text-green-600" />;
    if (current < previous) return <FaTrendingDown className="text-purple-600" />;
    return <FaMinus className="text-gray-600" />;
  };

  const exportPaymentHistory = async (format = "csv") => {
    try {
      // In production, use actual API call
      // const response = await AffiliateServices.exportPaymentHistory(userId, format);
      
      const csvContent = [
        "Date,Transaction ID,Order ID,Referral,Amount,Commission,Fees,Net Amount,Status,Payment Method,Processed Date",
        ...filteredPayments.map(payment => 
          `${payment.date},${payment.transactionId},${payment.orderId},${payment.referralName},${payment.amount},${payment.commission},${payment.fees},${payment.netAmount},${payment.status},${payment.paymentMethod},${payment.processedDate || ''}`
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-history-${selectedPeriod}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Payment history exported successfully!");
    } catch (error) {
      toast.error("Failed to export payment history");
    }
  };

  const retryPayment = async (paymentId) => {
    try {
      // In production, use actual API call
      // await AffiliateServices.retryPayment(paymentId);
      
      toast.success("Payment retry initiated!");
      loadPaymentHistory(); // Refresh the data
    } catch (error) {
      toast.error("Failed to retry payment");
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FaDollarSign className="h-8 w-8 text-green-600" />
            {getTrendIcon(stats.totalPaid, stats.totalPaid * 0.9)}
          </div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalPaid.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Paid</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FaClock className="h-8 w-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Pending</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalPending.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FaExclamationTriangle className="h-8 w-8 text-purple-600" />
            <span className="text-sm text-purple-600 font-medium">Failed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalFailed.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FaChartLine className="h-8 w-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Average</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${stats.averagePayout.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Average Payout</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="h-8 w-8 text-purple-600" />
            <span className="text-sm text-purple-600 font-medium">Next</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{stats.nextPayoutDate}</div>
          <div className="text-sm text-gray-600">Next Payout</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by referral, order ID, transaction ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="commission">Sort by Commission</option>
              <option value="status">Sort by Status</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            <button
              onClick={() => exportPaymentHistory()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <FaDownload />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          <div className="text-sm text-gray-600">
            {filteredPayments.length} of {payments.length} transactions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Transaction ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Referral</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Commission</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Fees</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Net Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{payment.date}</td>
                  <td className="py-3 px-4 text-gray-900 font-mono text-xs">{payment.transactionId}</td>
                  <td className="py-3 px-4 text-gray-900 font-mono text-xs">{payment.orderId}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-gray-900">{payment.referralName}</div>
                      <div className="text-gray-500 text-xs">{payment.referralId}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">${payment.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">${payment.commission.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-gray-600">${payment.fees.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">${payment.netAmount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="text-gray-600">{payment.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDetails(payment)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {payment.status === "failed" && (
                        <button
                          onClick={() => retryPayment(payment.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Retry Payment"
                        >
                          <FaCreditCard />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FaFileInvoice className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No payment transactions found</p>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
              <button
                onClick={() => setShowDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Transaction Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Transaction Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Transaction ID:</span>
                    <p className="font-medium">{showDetails.transactionId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <p className="font-medium">{showDetails.orderId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">{showDetails.date}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Processed Date:</span>
                    <p className="font-medium">{showDetails.processedDate || "Not processed"}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Financial Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Amount:</span>
                    <span className="font-medium">${showDetails.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission Rate:</span>
                    <span className="font-medium">{showDetails.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission:</span>
                    <span className="font-medium">${showDetails.commission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fees:</span>
                    <span className="font-medium">${showDetails.fees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Net Amount:</span>
                    <span>${showDetails.netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Referral Information */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Referral Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Referral Name:</span>
                    <p className="font-medium">{showDetails.referralName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Referral ID:</span>
                    <p className="font-medium">{showDetails.referralId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Product Type:</span>
                    <p className="font-medium">{showDetails.productType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tracking Date:</span>
                    <p className="font-medium">{showDetails.trackingDate}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Payment Method:</span>
                    <p className="font-medium">{showDetails.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(showDetails.status)}
                      <span className="font-medium">{showDetails.status}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Notes:</span>
                    <p className="font-medium">{showDetails.notes}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {showDetails.status === "failed" && (
                  <button
                    onClick={() => retryPayment(showDetails.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Retry Payment
                  </button>
                )}
                <button
                  onClick={() => setShowDetails(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliatePaymentHistory;
