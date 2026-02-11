import React, { useState, useEffect } from "react";
import { 
  FaDollarSign, 
  FaChartLine, 
  FaCalendarAlt, 
  FaDownload, 
  FaFilter,
  FaEye,
  FaUsers,
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AffiliateServices from "../services/AffiliateServices";
import toast from "react-hot-toast";

const AffiliatePaymentTracker = ({ userId, className = "" }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    nextPayout: 0,
    lastPayout: null,
    paymentHistory: [],
    commissionBreakdown: [],
    conversionStats: {
      totalClicks: 0,
      totalConversions: 0,
      conversionRate: 0,
      avgOrderValue: 0
    }
  });
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showDetails, setShowDetails] = useState(false);

  const periods = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "1year", label: "Last Year" },
    { value: "all", label: "All Time" }
  ];

  const statusFilters = [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "processing", label: "Processing" }
  ];

  // Mock data for demonstration - replace with actual API calls
  const mockPaymentHistory = [
    {
      id: 1,
      date: "2024-01-20",
      amount: 245.67,
      commission: 49.13,
      orderId: "ORD-12345",
      referralId: "REF-001",
      referralName: "John Doe",
      status: "paid",
      paymentMethod: "PayPal",
      commissionRate: 20,
      productType: "premium",
      trackingDate: "2024-01-15"
    },
    {
      id: 2,
      date: "2024-01-19",
      amount: 189.99,
      commission: 37.99,
      orderId: "ORD-12346",
      referralId: "REF-002",
      referralName: "Jane Smith",
      status: "pending",
      paymentMethod: "Stripe",
      commissionRate: 20,
      productType: "standard",
      trackingDate: "2024-01-14"
    },
    {
      id: 3,
      date: "2024-01-18",
      amount: 599.00,
      commission: 179.70,
      orderId: "ORD-12347",
      referralId: "REF-003",
      referralName: "Bob Johnson",
      status: "processing",
      paymentMethod: "Wire Transfer",
      commissionRate: 30,
      productType: "enterprise",
      trackingDate: "2024-01-10"
    },
    {
      id: 4,
      date: "2024-01-17",
      amount: 99.00,
      commission: 19.80,
      orderId: "ORD-12348",
      referralId: "REF-004",
      referralName: "Alice Brown",
      status: "paid",
      paymentMethod: "PayPal",
      commissionRate: 20,
      productType: "basic",
      trackingDate: "2024-01-12"
    },
    {
      id: 5,
      date: "2024-01-16",
      amount: 299.00,
      commission: 59.80,
      orderId: "ORD-12349",
      referralId: "REF-005",
      referralName: "Charlie Wilson",
      status: "failed",
      paymentMethod: "Check",
      commissionRate: 20,
      productType: "professional",
      trackingDate: "2024-01-08"
    }
  ];

  const mockCommissionBreakdown = [
    { type: "Percentage Sales", amount: 425.50, percentage: 65, count: 15 },
    { type: "Fixed Commissions", amount: 150.00, percentage: 23, count: 8 },
    { type: "Recurring Commissions", amount: 75.00, percentage: 12, count: 3 }
  ];

  useEffect(() => {
    loadPaymentData();
  }, [selectedPeriod, selectedStatus]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      // In production, replace with actual API calls
      // const response = await AffiliateServices.getEarnings(selectedPeriod, selectedStatus);
      
      // Mock data processing
      const filteredHistory = mockPaymentHistory.filter(payment => {
        const statusMatch = selectedStatus === "all" || payment.status === selectedStatus;
        return statusMatch;
      });

      const totalEarnings = filteredHistory.reduce((sum, payment) => sum + payment.commission, 0);
      const pendingEarnings = filteredHistory
        .filter(p => p.status === "pending")
        .reduce((sum, payment) => sum + payment.commission, 0);
      const paidEarnings = filteredHistory
        .filter(p => p.status === "paid")
        .reduce((sum, payment) => sum + payment.commission, 0);

      const totalClicks = 1256;
      const totalConversions = filteredHistory.length;
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : 0;
      const avgOrderValue = filteredHistory.length > 0 
        ? (filteredHistory.reduce((sum, p) => sum + p.amount, 0) / filteredHistory.length).toFixed(2)
        : 0;

      setPaymentData({
        totalEarnings,
        pendingEarnings,
        paidEarnings,
        nextPayout: pendingEarnings,
        lastPayout: filteredHistory.filter(p => p.status === "paid").slice(-1)[0]?.date || null,
        paymentHistory: filteredHistory,
        commissionBreakdown: mockCommissionBreakdown,
        conversionStats: {
          totalClicks,
          totalConversions,
          conversionRate,
          avgOrderValue
        }
      });

    } catch (error) {
      console.error("Error loading payment data:", error);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "failed": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid": return <FaCheckCircle className="text-green-600" />;
      case "pending": return <FaClock className="text-blue-600" />;
      case "processing": return <FaInfoCircle className="text-blue-600" />;
      case "failed": return <FaExclamationTriangle className="text-purple-600" />;
      default: return <FaInfoCircle className="text-gray-600" />;
    }
  };

  const exportReport = async () => {
    try {
      // In production, use actual API call
      // const response = await AffiliateServices.exportEarningsReport(selectedPeriod, 'csv');
      
      // Mock export functionality
      const csvContent = [
        "Date,Order ID,Referral,Amount,Commission,Status,Payment Method",
        ...paymentData.paymentHistory.map(payment => 
          `${payment.date},${payment.orderId},${payment.referralName},${payment.amount},${payment.commission},${payment.status},${payment.paymentMethod}`
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `affiliate-earnings-${selectedPeriod}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Report exported successfully!");
    } catch (error) {
      toast.error("Failed to export report");
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FaDollarSign className="h-8 w-8 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${paymentData.totalEarnings.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Earnings</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FaClock className="h-8 w-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Pending</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${paymentData.pendingEarnings.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Pending Earnings</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FaCheckCircle className="h-8 w-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Paid</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${paymentData.paidEarnings.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Paid Earnings</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FaChartLine className="h-8 w-8 text-purple-600" />
            <span className="text-sm text-purple-600 font-medium">{paymentData.conversionStats.conversionRate}%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{paymentData.conversionStats.totalConversions}</div>
          <div className="text-sm text-gray-600">Conversions</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
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
            </div>

            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaDownload />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Commission Breakdown */}
      {showDetails && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Breakdown</h3>
          <div className="space-y-3">
            {paymentData.commissionBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.type}</div>
                  <div className="text-sm text-gray-600">{item.count} transactions</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${item.amount.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">{item.percentage}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          <div className="text-sm text-gray-600">
            {paymentData.paymentHistory.length} transactions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Referral</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Commission</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{payment.date}</td>
                  <td className="py-3 px-4 text-gray-900 font-mono text-xs">{payment.orderId}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-gray-900">{payment.referralName}</div>
                      <div className="text-gray-500 text-xs">{payment.referralId}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">${payment.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">${payment.commission.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-600">{payment.commissionRate}%</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{payment.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paymentData.paymentHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FaDollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No payment transactions found for the selected period</p>
          </div>
        )}
      </div>

      {/* Payout Information */}
      {(paymentData.nextPayout > 0 || paymentData.lastPayout) && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {paymentData.nextPayout > 0 && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Next Payout</div>
                <div className="text-2xl font-bold text-gray-900">${paymentData.nextPayout.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Expected in next payment cycle</div>
              </div>
            )}
            {paymentData.lastPayout && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Last Payout</div>
                <div className="text-2xl font-bold text-gray-900">{paymentData.lastPayout}</div>
                <div className="text-sm text-gray-600">Payment date</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliatePaymentTracker;
