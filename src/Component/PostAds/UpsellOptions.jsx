import React from "react";
import { FaStar, FaRocket, FaDollarSign, FaBullhorn, FaStore, FaBriefcase, FaCheck } from "react-icons/fa";

const UpsellOptions = ({ selectedUpsells, setSelectedUpsells }) => {
  const upsellOptions = [
    {
      id: "paid",
      name: "Paid Listing",
      description: "Pay to have your listing prioritized in search results",
      price: 9.99,
      duration: "30 days",
      icon: <FaDollarSign className="h-6 w-6" />,
      benefits: [
        "Priority placement in search",
        "Higher visibility",
        "Increased views and clicks",
      ],
    },
    {
      id: "featured",
      name: "Featured Listing",
      description: "Highlight your listing with a featured badge at the top of category pages",
      price: 19.99,
      duration: "30 days",
      icon: <FaStar className="h-6 w-6" />,
      benefits: [
        "Featured badge on listing",
        "Top placement in category pages",
        "Pinned to top of search results",
        "Higher conversion rate",
      ],
    },
    {
      id: "promoted",
      name: "Promoted Listing",
      description: "Promote your listing across the platform for maximum visibility",
      price: 29.99,
      duration: "30 days",
      icon: <FaRocket className="h-6 w-6" />,
      benefits: [
        "Cross-platform promotion",
        "Featured on homepage",
        "Email newsletter inclusion",
        "Social media promotion",
      ],
    },
    {
      id: "sponsored",
      name: "Sponsored Listing",
      description: "Premium sponsorship package with maximum exposure",
      price: 49.99,
      duration: "30 days",
      icon: <FaBullhorn className="h-6 w-6" />,
      benefits: [
        "Premium placement everywhere",
        "Banner ad spots",
        "Priority customer support",
        "Analytics dashboard",
      ],
    },
    {
      id: "business",
      name: "Business Listing",
      description: "List as a business to get business-specific features and visibility",
      price: 39.99,
      duration: "30 days",
      icon: <FaBriefcase className="h-6 w-6" />,
      benefits: [
        "Business profile page",
        "Business verification badge",
        "Multiple listing management",
        "Business analytics",
      ],
    },
    {
      id: "store",
      name: "Store Listing",
      description: "Create a storefront with multiple products and enhanced features",
      price: 59.99,
      duration: "30 days",
      icon: <FaStore className="h-6 w-6" />,
      benefits: [
        "Full storefront page",
        "Multiple product listings",
        "Store catalog view",
        "Advanced inventory management",
      ],
    },
  ];

  const toggleUpsell = (upsellId) => {
    setSelectedUpsells((prev) => ({
      ...prev,
      [upsellId]: !prev[upsellId],
    }));
  };

  const calculateTotal = () => {
    return upsellOptions.reduce((total, option) => {
      return total + (selectedUpsells[option.id] ? option.price : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Boost Your Listing
        </h3>
        <p className="text-sm text-muted-foreground">
          Select additional features to increase your listing's visibility and reach
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upsellOptions.map((option) => {
          const isSelected = selectedUpsells[option.id] || false;
          return (
            <div
              key={option.id}
              onClick={() => toggleUpsell(option.id)}
              className={`relative rounded-lg border-2 p-5 cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-input hover:border-primary/50"
              }`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <FaCheck className="h-3 w-3 text-white" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center mb-3 ${
                  isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {option.icon}
              </div>

              {/* Content */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-foreground">
                    {option.name}
                  </h4>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      ${option.price}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      / {option.duration}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {option.description}
                </p>
                <ul className="space-y-1">
                  {option.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-xs text-muted-foreground">
                      <FaCheck className="h-3 w-3 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      {Object.values(selectedUpsells).some((selected) => selected) && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Total Upsell Cost:</span>
            <span className="text-2xl font-bold text-primary">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            This amount will be added to your package price during checkout
          </p>
        </div>
      )}
    </div>
  );
};

export default UpsellOptions;

