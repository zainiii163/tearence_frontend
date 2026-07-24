import React, { useState } from 'react';
import { Calculator, Clock, Briefcase } from 'lucide-react';
import CalculatorGridLayout from '../shared/CalculatorGridLayout';

/**
 * Tech / freelance service calculators for Services & Solutions page.
 */
const ServicesCalculators = ({ hideHeader = false }) => {
  const [active, setActive] = useState(null);

  const [hourly, setHourly] = useState({
    desired: '',
    hoursPerWeek: '20',
    weeksPerYear: '48',
    expenses: '0',
    taxRate: '20',
  });
  const [hourlyResult, setHourlyResult] = useState(null);

  const [project, setProject] = useState({
    hours: '',
    rate: '',
    expenses: '0',
    margin: '20',
  });
  const [projectResult, setProjectResult] = useState(null);

  const calcHourly = () => {
    const desired = parseFloat(hourly.desired);
    const hpw = parseFloat(hourly.hoursPerWeek);
    const wpy = parseFloat(hourly.weeksPerYear);
    const expenses = parseFloat(hourly.expenses) || 0;
    const tax = parseFloat(hourly.taxRate) || 0;
    if (![desired, hpw, wpy].every((n) => Number.isFinite(n) && n > 0)) return;
    const billableHours = hpw * wpy;
    const preTaxNeeded = desired / (1 - tax / 100);
    const totalNeeded = preTaxNeeded + expenses;
    const rate = totalNeeded / billableHours;
    setHourlyResult({ rate, billableHours, totalNeeded });
  };

  const calcProject = () => {
    const hours = parseFloat(project.hours);
    const rate = parseFloat(project.rate);
    const expenses = parseFloat(project.expenses) || 0;
    const margin = parseFloat(project.margin) || 0;
    if (![hours, rate].every((n) => Number.isFinite(n) && n > 0)) return;
    const labour = hours * rate;
    const subtotal = labour + expenses;
    const quote = subtotal * (1 + margin / 100);
    setProjectResult({ labour, subtotal, quote });
  };

  const money = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      : '—';

  const items = [
    {
      id: 'hourly',
      name: 'Freelance Hourly Rate',
      emoji: '⏱️',
      icon: <Clock className="w-5 h-5" />,
      blurb: 'Work out what to charge from your target income.',
      onCalc: calcHourly,
      result: hourlyResult && (
        <div className="grid grid-cols-3 gap-2 text-sm bg-emerald-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Suggested rate</p>
            <p className="font-bold text-emerald-800">{money(hourlyResult.rate)}/hr</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Billable hours/yr</p>
            <p className="font-bold">{hourlyResult.billableHours.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Annual needed</p>
            <p className="font-bold">{money(hourlyResult.totalNeeded)}</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['desired', 'Desired take-home / year'],
            ['hoursPerWeek', 'Hours / week'],
            ['weeksPerYear', 'Weeks / year'],
            ['expenses', 'Business expenses / year'],
            ['taxRate', 'Tax rate %'],
          ].map(([key, label]) => (
            <label key={key} className="text-xs font-medium text-gray-600">
              {label}
              <input
                type="number"
                value={hourly[key]}
                onChange={(e) => setHourly({ ...hourly, [key]: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'project',
      name: 'Project Quote Calculator',
      emoji: '💼',
      icon: <Briefcase className="w-5 h-5" />,
      blurb: 'Price a gig from hours, rate, expenses and margin.',
      onCalc: calcProject,
      result: projectResult && (
        <div className="grid grid-cols-3 gap-2 text-sm bg-emerald-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Labour</p>
            <p className="font-bold">{money(projectResult.labour)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Subtotal</p>
            <p className="font-bold">{money(projectResult.subtotal)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Client quote</p>
            <p className="font-bold text-emerald-800">{money(projectResult.quote)}</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['hours', 'Estimated hours'],
            ['rate', 'Hourly rate'],
            ['expenses', 'Extra costs'],
            ['margin', 'Profit margin %'],
          ].map(([key, label]) => (
            <label key={key} className="text-xs font-medium text-gray-600">
              {label}
              <input
                type="number"
                value={project[key]}
                onChange={(e) => setProject({ ...project, [key]: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
          ))}
        </div>
      ),
    },
  ];

  return (
    <CalculatorGridLayout
      title="Service Calculators"
      subtitle="Price your tech gigs with confidence"
      items={items}
      activeId={active}
      onSelect={(id) => setActive(active === id ? null : id)}
      theme="emerald"
      hideHeader={hideHeader}
    />
  );
};

export default ServicesCalculators;
