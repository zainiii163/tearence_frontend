import React, { useMemo, useState } from 'react';
import { Calculator, DollarSign, Eye, MousePointerClick, Target } from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import BrowsePageBackBar from '../Component/shared/BrowsePageBackBar';

const AdvertsCalculatorsPage = () => {
  const [budget, setBudget] = useState(1000);
  const [cpm, setCpm] = useState(12);
  const [clicks, setClicks] = useState(500);
  const [conversions, setConversions] = useState(25);

  const results = useMemo(() => {
    const safeBudget = Math.max(Number(budget) || 0, 0);
    const safeCpm = Math.max(Number(cpm) || 0, 0);
    const safeClicks = Math.max(Number(clicks) || 0, 0);
    const safeConversions = Math.max(Number(conversions) || 0, 0);
    const impressions = safeCpm ? (safeBudget / safeCpm) * 1000 : 0;
    return {
      impressions: Math.round(impressions),
      cpc: safeClicks ? safeBudget / safeClicks : 0,
      cpa: safeConversions ? safeBudget / safeConversions : 0,
      ctr: impressions ? (safeClicks / impressions) * 100 : 0,
    };
  }, [budget, cpm, clicks, conversions]);

  const fields = [
    ['Campaign budget', budget, setBudget, 'Budget available for the campaign'],
    ['Expected CPM', cpm, setCpm, 'Cost per 1,000 impressions'],
    ['Expected clicks', clicks, setClicks, 'Estimated people who click'],
    ['Expected conversions', conversions, setConversions, 'Estimated leads, sales or enquiries'],
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavbar showBackButton backHref="/adverts" />
      <header className="bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-800 text-white">
        <div className="page-container py-8 text-center">
          <Calculator className="mx-auto mb-2 h-10 w-10 text-fuchsia-200" />
          <h1 className="text-2xl font-bold sm:text-3xl">Advertising Cost Calculators</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-purple-100">
            Estimate reach, clicks, click cost and conversion cost before you launch an advert.
          </p>
        </div>
      </header>

      <main className="page-container py-4 sm:py-6">
        <BrowsePageBackBar to="/adverts" label="Back to Adverts" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Campaign assumptions</h2>
            <p className="mt-1 text-sm text-slate-500">Adjust the figures to model a simple paid campaign.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map(([label, value, setter, hint]) => (
                <label key={label} className="block">
                  <span className="text-sm font-semibold text-slate-700">{label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{hint}</span>
                  <input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(event) => setter(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-slate-900 p-5 text-white shadow-sm sm:p-6">
            <h2 className="text-lg font-bold">Estimated results</h2>
            <div className="mt-4 grid gap-3">
              <Result icon={Eye} label="Impressions" value={results.impressions.toLocaleString()} />
              <Result icon={MousePointerClick} label="Cost per click" value={`$${results.cpc.toFixed(2)}`} />
              <Result icon={Target} label="Click-through rate" value={`${results.ctr.toFixed(2)}%`} />
              <Result icon={DollarSign} label="Cost per conversion" value={`$${results.cpa.toFixed(2)}`} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Result = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-3">
    <span className="flex items-center gap-2 text-sm text-slate-200">
      <Icon className="h-4 w-4 text-fuchsia-300" />
      {label}
    </span>
    <strong className="text-sm text-white">{value}</strong>
  </div>
);

export default AdvertsCalculatorsPage;
