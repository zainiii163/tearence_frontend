import React from 'react';
import { Check, Star, Eye, Crown } from 'lucide-react';

const TIER_ICON = {
  promoted: Eye,
  featured: Star,
  sponsored: Crown,
  paid: Star,
};

const TIER_COLOR = {
  promoted: 'blue',
  featured: 'purple',
  sponsored: 'yellow',
  paid: 'slate',
};

/**
 * Shared Promotion Tier picker — prices/features come from Filament via API.
 */
const PromotionTierPicker = ({
  plans = [],
  loading = false,
  value,
  onChange,
  title = 'Promotion Tier',
  emptyMessage = 'No promotion plans configured. Add them in Admin → Promo Pricing Plans.',
}) => {
  if (loading) {
    return (
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5" /> {title}
        </h3>
        <p className="text-sm text-gray-500">Loading plans from admin…</p>
      </section>
    );
  }

  if (!plans.length) {
    return (
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5" /> {title}
        </h3>
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <Star className="w-5 h-5" /> {title}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((tier) => {
          const id = tier.id || tier.tier || tier.slug;
          const Icon = TIER_ICON[tier.tier] || TIER_ICON[id] || Star;
          const color = TIER_COLOR[tier.tier] || TIER_COLOR[id] || 'blue';
          const active = value === id || value === tier.tier || value === tier.slug;
          const popular = tier.popular || tier.is_popular;
          const priceLabel =
            tier.price_label ||
            (tier.price_usd != null
              ? `$${Number(tier.price_usd).toFixed(Number(tier.price_usd) % 1 ? 2 : 0)}`
              : tier.price != null
                ? (String(tier.price).startsWith('$') ? tier.price : `$${tier.price}`)
                : '');
          const features = tier.features || tier.benefits || [];

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange?.(id, tier)}
              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                active ? 'border-blue-500 shadow-lg bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <Icon className={`w-6 h-6 text-${color}-600 mb-2`} />
              <div className="font-semibold text-gray-900">{tier.name}</div>
              <div className="text-xl font-bold text-gray-900 mt-1">{priceLabel}</div>
              {tier.duration_label && (
                <p className="text-xs text-gray-500 mt-0.5">{tier.duration_label}</p>
              )}
              <ul className="mt-3 space-y-1">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-1 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default PromotionTierPicker;
