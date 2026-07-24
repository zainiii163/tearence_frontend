import React from 'react';
import {
  FaCalculator,
  FaChartLine,
  FaBalanceScale,
  FaPercent,
  FaCar,
  FaHome,
  FaBriefcase,
  FaLaptop,
  FaDollarSign,
  FaChartPie,
  FaFileInvoiceDollar,
  FaIndustry,
  FaClock,
  FaProjectDiagram,
  FaGasPump,
  FaShieldAlt,
  FaTools,
} from 'react-icons/fa';

const CALC_META = {
  // Hub groups
  trading: { icon: FaChartLine, gradient: 'from-emerald-500 to-teal-600', emoji: '📈' },
  vehicles: { icon: FaCar, gradient: 'from-red-500 to-rose-600', emoji: '🚗' },
  property: { icon: FaHome, gradient: 'from-green-500 to-emerald-600', emoji: '🏠' },
  business: { icon: FaBriefcase, gradient: 'from-purple-500 to-indigo-600', emoji: '💼' },
  services: { icon: FaLaptop, gradient: 'from-cyan-500 to-blue-600', emoji: '💻' },
  // Trading
  pnl: { icon: FaDollarSign, gradient: 'from-emerald-500 to-green-600', emoji: '💰' },
  position: { icon: FaChartPie, gradient: 'from-blue-500 to-indigo-600', emoji: '📊' },
  rr: { icon: FaBalanceScale, gradient: 'from-amber-500 to-orange-600', emoji: '⚖️' },
  compound: { icon: FaChartLine, gradient: 'from-teal-500 to-cyan-600', emoji: '📈' },
  pct: { icon: FaPercent, gradient: 'from-violet-500 to-purple-600', emoji: '％' },
  // Business
  'break-even': { icon: FaBalanceScale, gradient: 'from-blue-500 to-indigo-600', emoji: '⚖️' },
  roe: { icon: FaChartLine, gradient: 'from-purple-500 to-fuchsia-600', emoji: '📈' },
  'operating-margin': { icon: FaPercent, gradient: 'from-cyan-500 to-blue-600', emoji: '📊' },
  'gross-margin': { icon: FaChartPie, gradient: 'from-emerald-500 to-teal-600', emoji: '💹' },
  'business-valuation': { icon: FaBriefcase, gradient: 'from-indigo-500 to-purple-600', emoji: '🏢' },
  vat: { icon: FaFileInvoiceDollar, gradient: 'from-amber-500 to-yellow-600', emoji: '🧾' },
  fcff: { icon: FaIndustry, gradient: 'from-slate-500 to-gray-600', emoji: '🏭' },
  // Services
  hourly: { icon: FaClock, gradient: 'from-emerald-500 to-teal-600', emoji: '⏱️' },
  project: { icon: FaProjectDiagram, gradient: 'from-blue-500 to-cyan-600', emoji: '💼' },
  // Vehicles
  'auto-loan': { icon: FaCar, gradient: 'from-red-500 to-rose-600', emoji: '🚗' },
  'lease-vs-buy': { icon: FaBalanceScale, gradient: 'from-orange-500 to-amber-600', emoji: '⚖️' },
  depreciation: { icon: FaChartLine, gradient: 'from-slate-500 to-zinc-600', emoji: '📉' },
  'fuel-cost': { icon: FaGasPump, gradient: 'from-yellow-500 to-amber-600', emoji: '⛽' },
  insurance: { icon: FaShieldAlt, gradient: 'from-blue-500 to-indigo-600', emoji: '🛡️' },
  tco: { icon: FaTools, gradient: 'from-gray-600 to-slate-700', emoji: '🔧' },
  // Property
  mortgage: { icon: FaHome, gradient: 'from-green-500 to-emerald-600', emoji: '🏠' },
  affordability: { icon: FaDollarSign, gradient: 'from-teal-500 to-green-600', emoji: '💵' },
  roi: { icon: FaChartLine, gradient: 'from-lime-500 to-green-600', emoji: '📈' },
  'rent-vs-buy': { icon: FaBalanceScale, gradient: 'from-cyan-500 to-blue-600', emoji: '⚖️' },
  'rental-yield': { icon: FaPercent, gradient: 'from-emerald-500 to-teal-600', emoji: '📊' },
  'cap-rate': { icon: FaChartPie, gradient: 'from-indigo-500 to-purple-600', emoji: '📉' },
};

const SIZE_MAP = {
  sm: { box: 'w-9 h-9', icon: 'h-4 w-4', emoji: 'text-lg' },
  md: { box: 'w-11 h-11', icon: 'h-5 w-5', emoji: 'text-xl' },
};

export const getCalculatorMeta = (id) =>
  CALC_META[id] || { icon: FaCalculator, gradient: 'from-emerald-500 to-teal-600', emoji: '🧮' };

/** Circular gradient icon — same visual language as Buy & Sell category grid. */
const CalculatorCategoryIcon = ({ id, emoji, size = 'sm', className = '' }) => {
  const meta = getCalculatorMeta(id);
  const sizes = SIZE_MAP[size] || SIZE_MAP.sm;
  const Icon = meta.icon;
  const displayEmoji = emoji || meta.emoji;

  if (displayEmoji && !meta.icon) {
    return (
      <div
        className={`${sizes.box} rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br ${meta.gradient} shadow-sm ${className}`}
      >
        <span className={`${sizes.emoji} leading-none select-none`} aria-hidden="true">
          {displayEmoji}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizes.box} rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br ${meta.gradient} shadow-sm ${className}`}
    >
      {displayEmoji && displayEmoji.length <= 4 ? (
        <span className={`${sizes.emoji} leading-none select-none`} aria-hidden="true">
          {displayEmoji}
        </span>
      ) : (
        <Icon className={`${sizes.icon} text-white`} />
      )}
    </div>
  );
};

export default CalculatorCategoryIcon;
