import React from "react";
import { FaStar, FaRocket, FaCheck } from "react-icons/fa";

const UpsellSelector = ({ selectedUpsells, setSelectedUpsells, type = "job" }) => {
  const jobUpsells = [
    {
      id: "featured",
      name: "Featured Job",
      description: "Highlight your job and pin it to the top of listings",
      price: 29.99,
      duration: "30 days",
      icon: <FaStar className="h-6 w-6" />,
      benefits: [
        "Pinned to top of job listings",
        "Featured badge on job card",
        "Higher visibility in search results",
        "Priority in category pages",
      ],
    },
    {
      id: "suggested",
      name: "Suggested Jobs",
      description: "Cross-promote your job on homepage, newsletters, and other category pages",
      price: 49.99,
      duration: "30 days",
      icon: <FaRocket className="h-6 w-6" />,
      benefits: [
        "Featured on homepage",
        "Included in email newsletters",
        "Cross-promoted on related pages",
        "Increased application rate",
      ],
    },
  ];

  const candidateUpsells = [
    {
      id: "featured",
      name: "Featured Profile",
      description: "Highlight your profile in recruiter search results",
      price: 19.99,
      duration: "30 days",
      icon: <FaStar className="h-6 w-6" />,
      benefits: [
        "Top placement in search results",
        "Featured badge on profile",
        "Priority matching for jobs",
        "Increased profile views",
      ],
    },
    {
      id: "job_alerts_boost",
      name: "Job Alerts Boost",
      description: "Get priority matching for job alerts and recommendations",
      price: 14.99,
      duration: "30 days",
      icon: <FaRocket className="h-6 w-6" />,
      benefits: [
        "Priority job matching",
        "Early access to new jobs",
        "Personalized recommendations",
        "Email alerts for perfect matches",
      ],
    },
  ];

  const upsells = type === "job" ? jobUpsells : candidateUpsells;

  const toggleUpsell = (upsellId) => {
    setSelectedUpsells((prev) => ({
      ...prev,
      [upsellId]: !prev[upsellId],
    }));
  };

  const totalPrice = upsells.reduce((sum, upsell) => {
    return sum + (selectedUpsells[upsell.id] ? upsell.price : 0);
  }, 0);

  return (
    <div className="space-y-4">
      {upsells.map((upsell) => (
        <div
          key={upsell.id}
          className={`rounded-lg border-2 p-6 transition-all cursor-pointer ${
            selectedUpsells[upsell.id]
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => toggleUpsell(upsell.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedUpsells[upsell.id]
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {upsell.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{upsell.name}</h3>
                  {selectedUpsells[upsell.id] && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <FaCheck className="mr-1 h-3 w-3" />
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {upsell.description}
                </p>
                <ul className="space-y-2">
                  {upsell.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <FaCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-end ml-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  ${upsell.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  for {upsell.duration}
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="checkbox"
                  checked={selectedUpsells[upsell.id] || false}
                  onChange={() => toggleUpsell(upsell.id)}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {totalPrice > 0 && (
        <div className="rounded-lg border bg-muted/50 p-4 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Payment will be processed after job posting is submitted
          </p>
        </div>
      )}
    </div>
  );
};

export default UpsellSelector;

