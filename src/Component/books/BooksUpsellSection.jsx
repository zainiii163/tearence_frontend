import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Rocket, Star, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    id: 'promoted',
    name: 'Promoted',
    icon: Zap,
    price: '$29',
    period: '/30 days',
    benefit: '2× visibility in search & category pages',
    highlight: false,
  },
  {
    id: 'featured',
    name: 'Featured',
    icon: Crown,
    price: '$79',
    period: '/60 days',
    benefit: 'Top placement in featured carousel',
    highlight: true,
  },
  {
    id: 'sponsored',
    name: 'Sponsored',
    icon: Rocket,
    price: '$149',
    period: '/90 days',
    benefit: 'Homepage & network-wide boost',
    highlight: false,
  },
  {
    id: 'top_category',
    name: 'Top of Category',
    icon: Star,
    price: '$299',
    period: '/90 days',
    benefit: 'Pinned at the top of your genre',
    highlight: false,
  },
];

const BooksUpsellSection = ({ onPostBook }) => (
  <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-amber-400 font-semibold uppercase tracking-wider text-sm mb-3">
          For Authors & Publishers
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Want your book at the top?
        </h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Upgrade to Featured or Sponsored and reach readers across the Worldwide Adverts network.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              className={`rounded-2xl p-6 border transition-shadow ${
                plan.highlight
                  ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-900/30'
                  : 'bg-white/5 border-white/10 hover:border-amber-400/40'
              }`}
            >
              {plan.highlight && (
                <span className="inline-block text-xs font-bold text-amber-900 bg-amber-400 px-2 py-0.5 rounded-full mb-3">
                  Most Popular
                </span>
              )}
              <Icon className={`w-8 h-8 mb-4 ${plan.highlight ? 'text-amber-400' : 'text-amber-300'}`} />
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>
              <p className="text-slate-300 text-sm mb-5">{plan.benefit}</p>
              <button
                type="button"
                onClick={onPostBook}
                className="w-full py-2.5 rounded-lg font-semibold text-sm bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors"
              >
                Upgrade Now
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onPostBook}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
        >
          Post Your Book
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </section>
);

export default BooksUpsellSection;
