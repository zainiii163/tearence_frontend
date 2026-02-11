import React, { useState } from "react";
import { FaFileDownload, FaFileInvoice, FaCalendarAlt, FaDollarSign, FaSearch } from "react-icons/fa";

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const invoicesData = [
    { 
      id: 1, 
      title: "Invoice #001", 
      amount: 199.0, 
      date: "2024-01-15",
      status: "Paid",
      description: "Premium listing upgrade"
    },
    { 
      id: 2, 
      title: "Invoice #002", 
      amount: 699.0, 
      date: "2024-01-10",
      status: "Paid",
      description: "Business store subscription"
    },
    { 
      id: 3, 
      title: "Invoice #003", 
      amount: 299.0, 
      date: "2024-01-05",
      status: "Pending",
      description: "Featured ad promotion"
    },
    { 
      id: 4, 
      title: "Invoice #004", 
      amount: 599.0, 
      date: "2023-12-28",
      status: "Paid",
      description: "Annual subscription renewal"
    },
  ];

  const handleDownload = (id) => {
    // In a real app, this would trigger actual download
    alert(`Downloading Invoice ${id}`);
  };

  const filteredInvoices = invoicesData.filter(invoice =>
    invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    if (status === "Paid") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === "Pending") {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and download your billing invoices
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FaFileInvoice className="h-5 w-5" />
          <span className="text-sm font-medium">{filteredInvoices.length} invoices</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <FaFileInvoice className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? "No invoices found" : "No invoices yet"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : "Your invoices will appear here when you make purchases"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-foreground">{invoice.title}</h3>
                      <span className={getStatusBadge(invoice.status)}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {invoice.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="h-4 w-4" />
                        <span>{formatDate(invoice.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="h-4 w-4" />
                        <span className="font-medium text-foreground">${invoice.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(invoice.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 text-sm font-medium transition-colors"
                  >
                    <FaFileDownload className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredInvoices.length > 0 && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-medium text-foreground">
              ${filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;