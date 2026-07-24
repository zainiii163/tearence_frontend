import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, Search, Upload, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: 'Browse or search',
    text: 'Find the right skill across IT, finance, legal and more.',
  },
  {
    icon: Handshake,
    title: 'Connect & hire',
    text: 'Message providers, agree scope and price online.',
  },
  {
    icon: Upload,
    title: 'Offer your skills',
    text: 'Post a gig in minutes — free or promoted for visibility.',
  },
];

/**
 * How-it-works + trust strip — replaces sparse handshake-only section.
 */
const ServicesHandshakeBanner = ({ onPostClick }) => (
  <section className="mt-6 sm:mt-8">
    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-100/80 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trusted online marketplace
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
            Connect with skilled professionals worldwide
          </h3>
          <p className="mt-1 text-sm text-gray-600 max-w-md mx-auto lg:mx-0">
            Hire online or offer your expertise — like Fiverr and PeoplePerHour, built for global freelancers.
          </p>
          {typeof onPostClick === 'function' && (
            <button
              type="button"
              onClick={onPostClick}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-colors"
            >
              Start selling your service
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-center">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center rounded-2xl bg-white shadow-inner border border-emerald-100">
            <Handshake className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-600" strokeWidth={1.5} />
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400/90 blur-[1px]" />
            <div className="absolute -bottom-1 -left-2 w-6 h-6 rounded-full bg-sky-400/80 blur-[1px]" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-5 border-t border-emerald-100">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-3 items-start rounded-xl bg-white/70 p-3 border border-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default ServicesHandshakeBanner;
