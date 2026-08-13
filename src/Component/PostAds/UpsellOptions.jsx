import React, { useEffect, useState } from "react";
import { FaStar, FaRocket, FaDollarSign, FaBullhorn, FaCheck } from "react-icons/fa";
import promoService from "../../services/PromoService";
import { PROMO_PRICING_PLANS, formatDurationLabel } from "../../config/promoPricing";
import RewardCodeInput from "../Promo/RewardCodeInput";

const ICONS = {
  paid: FaDollarSign,
  featured: FaStar,
  promoted: FaRocket,
  sponsored: FaBullhorn,
};

const UpsellOptions = ({ selectedUpsells, setSelectedUpsells, onRewardCodeApplied }) => {
  const [plans, setPlans] = useState(PROMO_PRICING_PLANS);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { plans: apiPlans } = await promoService.getPricingPlans();
      if (!cancelled && apiPlans?.length) setPlans(apiPlans);
    })();
    return () => { cancelled = true; };
  }, []);

  const upsellOptions = plans.map((p) => {
    const Icon = ICONS[p.tier] || FaDollarSign;
    return {
      id: p.slug,
      tier: p.tier,
      name: p.name,
      description: p.description || '',
      price: Number(p.price_usd),
      duration: p.duration_label || formatDurationLabel(p.duration_days),
      duration_days: p.duration_days,
      icon: <Icon className="h-6 w-6" />,
      benefits: p.features || [],
    };
  });

  const toggleUpsell = (optionId) => {
    if (selectedUpsells.includes(optionId)) {
      setSelectedUpsells(selectedUpsells.filter((id) => id !== optionId));
    } else {
      setSelectedUpsells([...selectedUpsells, optionId]);
    }
  };

  const selectedPlans = upsellOptions.filter((o) => selectedUpsells.includes(o.id));
  const subtotal = selectedPlans.reduce((sum, o) => sum + o.price, 0);
  const primaryTier = selectedPlans[0]?.tier || null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Boost your listing</h3>
        <p className="text-sm text-gray-600">
          Free 3 days · Paid $10 / 1 week · Promoted $20 / 1 week · Featured $30 / 1 week · Sponsored $40 / 1 week
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {upsellOptions.map((option) => {
          const selected = selectedUpsells.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleUpsell(option.id)}
              className={`text-left rounded-xl border p-4 transition ${
                selected
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {option.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{option.name}</h4>
                    <p className="text-xs text-gray-500">{option.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${option.price.toFixed(2)}</div>
                  {selected && <FaCheck className="ml-auto mt-1 text-blue-600" />}
                </div>
              </div>
              {option.benefits?.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {option.benefits.slice(0, 4).map((b, i) => (
                    <li key={i} className="text-xs text-gray-600">• {b}</li>
                  ))}
                </ul>
              )}
            </button>
          );
        })}
      </div>

      {selectedPlans.length > 0 && (
        <div className="space-y-3">
          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)} USD</span>
          </div>
          <RewardCodeInput
            tier={primaryTier}
            planSlug={selectedPlans[0]?.id}
            originalPrice={subtotal}
            onApplied={(data) => {
              setReward(data);
              if (onRewardCodeApplied) onRewardCodeApplied(data);
            }}
            onCleared={() => {
              setReward(null);
              if (onRewardCodeApplied) onRewardCodeApplied(null);
            }}
          />
          {reward?.final_price != null && reward.discount_amount > 0 && (
            <p className="text-sm text-green-700">
              After code: ${Number(reward.final_price).toFixed(2)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UpsellOptions;
