import React, { useState } from 'react';
import { DollarSign, Clock, TrendingUp, Briefcase, Users } from 'lucide-react';
import CalculatorGridLayout from '../shared/CalculatorGridLayout';

/**
 * Salary / hiring calculators for Jobs & Vacancies.
 */
const JobsCalculators = ({ hideHeader = false }) => {
  const [active, setActive] = useState(null);

  const [salaryHourly, setSalaryHourly] = useState({
    amount: '',
    mode: 'salary', // salary → hourly, or hourly → salary
    hoursPerWeek: '40',
    weeksPerYear: '52',
  });
  const [salaryHourlyResult, setSalaryHourlyResult] = useState(null);

  const [takeHome, setTakeHome] = useState({
    gross: '',
    taxRate: '25',
    otherDeductions: '0',
  });
  const [takeHomeResult, setTakeHomeResult] = useState(null);

  const [raise, setRaise] = useState({
    current: '',
    percent: '10',
    orTarget: '',
  });
  const [raiseResult, setRaiseResult] = useState(null);

  const [dayRate, setDayRate] = useState({
    annual: '',
    billableDays: '220',
    overhead: '30',
  });
  const [dayRateResult, setDayRateResult] = useState(null);

  const [hireCost, setHireCost] = useState({
    salary: '',
    benefitsPct: '25',
    recruitingFeePct: '15',
    onboarding: '2000',
  });
  const [hireCostResult, setHireCostResult] = useState(null);

  const money = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      : '—';

  const moneyExact = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      : '—';

  const calcSalaryHourly = () => {
    const amount = parseFloat(salaryHourly.amount);
    const hpw = parseFloat(salaryHourly.hoursPerWeek);
    const wpy = parseFloat(salaryHourly.weeksPerYear);
    if (![amount, hpw, wpy].every((n) => Number.isFinite(n) && n > 0)) return;
    const hours = hpw * wpy;
    if (salaryHourly.mode === 'salary') {
      setSalaryHourlyResult({
        mode: 'salary',
        hourly: amount / hours,
        weekly: amount / wpy,
        monthly: amount / 12,
        hours,
      });
    } else {
      setSalaryHourlyResult({
        mode: 'hourly',
        annual: amount * hours,
        weekly: amount * hpw,
        monthly: (amount * hours) / 12,
        hours,
      });
    }
  };

  const calcTakeHome = () => {
    const gross = parseFloat(takeHome.gross);
    const tax = parseFloat(takeHome.taxRate) || 0;
    const other = parseFloat(takeHome.otherDeductions) || 0;
    if (!Number.isFinite(gross) || gross <= 0) return;
    const taxAmount = gross * (tax / 100);
    const net = Math.max(0, gross - taxAmount - other);
    setTakeHomeResult({
      taxAmount,
      net,
      monthly: net / 12,
      weekly: net / 52,
    });
  };

  const calcRaise = () => {
    const current = parseFloat(raise.current);
    if (!Number.isFinite(current) || current <= 0) return;
    const target = parseFloat(raise.orTarget);
    if (Number.isFinite(target) && target > 0) {
      const delta = target - current;
      const pct = (delta / current) * 100;
      setRaiseResult({ newSalary: target, delta, pct, fromTarget: true });
      return;
    }
    const pct = parseFloat(raise.percent) || 0;
    const newSalary = current * (1 + pct / 100);
    setRaiseResult({ newSalary, delta: newSalary - current, pct, fromTarget: false });
  };

  const calcDayRate = () => {
    const annual = parseFloat(dayRate.annual);
    const days = parseFloat(dayRate.billableDays);
    const overhead = parseFloat(dayRate.overhead) || 0;
    if (![annual, days].every((n) => Number.isFinite(n) && n > 0)) return;
    const base = annual / days;
    const withOverhead = base * (1 + overhead / 100);
    setDayRateResult({ base, withOverhead, hourly: withOverhead / 8 });
  };

  const calcHireCost = () => {
    const salary = parseFloat(hireCost.salary);
    const benefits = parseFloat(hireCost.benefitsPct) || 0;
    const fee = parseFloat(hireCost.recruitingFeePct) || 0;
    const onboarding = parseFloat(hireCost.onboarding) || 0;
    if (!Number.isFinite(salary) || salary <= 0) return;
    const benefitsCost = salary * (benefits / 100);
    const recruiting = salary * (fee / 100);
    const yearOne = salary + benefitsCost + recruiting + onboarding;
    setHireCostResult({ benefitsCost, recruiting, yearOne });
  };

  const fieldClass = 'mt-1 w-full border rounded-lg px-2 py-2 text-sm';
  const labelClass = 'text-xs font-medium text-gray-600';

  const items = [
    {
      id: 'salary-hourly',
      name: 'Salary ↔ Hourly',
      emoji: '💱',
      icon: <Clock className="w-5 h-5" />,
      blurb: 'Convert annual salary to hourly (or the reverse).',
      onCalc: calcSalaryHourly,
      result: salaryHourlyResult && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm bg-blue-50 rounded-lg p-3">
          {salaryHourlyResult.mode === 'salary' ? (
            <>
              <div>
                <p className="text-xs text-gray-500">Hourly</p>
                <p className="font-bold text-blue-800">{moneyExact(salaryHourlyResult.hourly)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Weekly</p>
                <p className="font-bold">{money(salaryHourlyResult.weekly)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Monthly</p>
                <p className="font-bold">{money(salaryHourlyResult.monthly)}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs text-gray-500">Annual</p>
                <p className="font-bold text-blue-800">{money(salaryHourlyResult.annual)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Weekly</p>
                <p className="font-bold">{money(salaryHourlyResult.weekly)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Monthly</p>
                <p className="font-bold">{money(salaryHourlyResult.monthly)}</p>
              </div>
            </>
          )}
        </div>
      ),
      fields: (
        <div className="space-y-3">
          <div className="flex gap-2">
            {[
              ['salary', 'Annual → hourly'],
              ['hourly', 'Hourly → annual'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSalaryHourly({ ...salaryHourly, mode: value })}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg border ${
                  salaryHourly.mode === value
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass}>
              {salaryHourly.mode === 'salary' ? 'Annual salary' : 'Hourly rate'}
              <input
                type="number"
                value={salaryHourly.amount}
                onChange={(e) => setSalaryHourly({ ...salaryHourly, amount: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              Hours / week
              <input
                type="number"
                value={salaryHourly.hoursPerWeek}
                onChange={(e) => setSalaryHourly({ ...salaryHourly, hoursPerWeek: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              Weeks / year
              <input
                type="number"
                value={salaryHourly.weeksPerYear}
                onChange={(e) => setSalaryHourly({ ...salaryHourly, weeksPerYear: e.target.value })}
                className={fieldClass}
              />
            </label>
          </div>
        </div>
      ),
    },
    {
      id: 'take-home',
      name: 'Take-Home Pay',
      emoji: '💵',
      icon: <DollarSign className="w-5 h-5" />,
      blurb: 'Estimate net pay after tax and deductions (rough guide).',
      onCalc: calcTakeHome,
      result: takeHomeResult && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm bg-blue-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Est. tax</p>
            <p className="font-bold">{money(takeHomeResult.taxAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Annual net</p>
            <p className="font-bold text-blue-800">{money(takeHomeResult.net)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Monthly</p>
            <p className="font-bold">{money(takeHomeResult.monthly)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Weekly</p>
            <p className="font-bold">{money(takeHomeResult.weekly)}</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['gross', 'Gross annual salary'],
            ['taxRate', 'Est. tax / NI %'],
            ['otherDeductions', 'Other deductions / year'],
          ].map(([key, label]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                type="number"
                value={takeHome[key]}
                onChange={(e) => setTakeHome({ ...takeHome, [key]: e.target.value })}
                className={fieldClass}
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'raise',
      name: 'Raise / Counter-Offer',
      emoji: '📈',
      icon: <TrendingUp className="w-5 h-5" />,
      blurb: 'See what a % raise (or target salary) looks like.',
      onCalc: calcRaise,
      result: raiseResult && (
        <div className="grid grid-cols-3 gap-2 text-sm bg-blue-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">New salary</p>
            <p className="font-bold text-blue-800">{money(raiseResult.newSalary)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Increase</p>
            <p className="font-bold">{money(raiseResult.delta)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">%</p>
            <p className="font-bold">{raiseResult.pct.toFixed(1)}%</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>
            Current salary
            <input
              type="number"
              value={raise.current}
              onChange={(e) => setRaise({ ...raise, current: e.target.value })}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Raise %
            <input
              type="number"
              value={raise.percent}
              onChange={(e) => setRaise({ ...raise, percent: e.target.value, orTarget: '' })}
              className={fieldClass}
            />
          </label>
          <label className={`${labelClass} col-span-2`}>
            Or target salary (overrides %)
            <input
              type="number"
              value={raise.orTarget}
              onChange={(e) => setRaise({ ...raise, orTarget: e.target.value })}
              className={fieldClass}
              placeholder="Optional"
            />
          </label>
        </div>
      ),
    },
    {
      id: 'day-rate',
      name: 'Contract Day Rate',
      emoji: '🗓️',
      icon: <Briefcase className="w-5 h-5" />,
      blurb: 'Turn a target income into a contractor day / hour rate.',
      onCalc: calcDayRate,
      result: dayRateResult && (
        <div className="grid grid-cols-3 gap-2 text-sm bg-blue-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Base day rate</p>
            <p className="font-bold">{moneyExact(dayRateResult.base)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">With overhead</p>
            <p className="font-bold text-blue-800">{moneyExact(dayRateResult.withOverhead)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">≈ Hourly</p>
            <p className="font-bold">{moneyExact(dayRateResult.hourly)}</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['annual', 'Target annual income'],
            ['billableDays', 'Billable days / year'],
            ['overhead', 'Overhead / buffer %'],
          ].map(([key, label]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                type="number"
                value={dayRate[key]}
                onChange={(e) => setDayRate({ ...dayRate, [key]: e.target.value })}
                className={fieldClass}
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'hire-cost',
      name: 'Cost of Hire',
      emoji: '🤝',
      icon: <Users className="w-5 h-5" />,
      blurb: 'Estimate year-one cost for employers (salary + benefits + fees).',
      onCalc: calcHireCost,
      result: hireCostResult && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm bg-blue-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Benefits</p>
            <p className="font-bold">{money(hireCostResult.benefitsCost)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Recruiting fee</p>
            <p className="font-bold">{money(hireCostResult.recruiting)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Year-one total</p>
            <p className="font-bold text-blue-800">{money(hireCostResult.yearOne)}</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['salary', 'Base salary'],
            ['benefitsPct', 'Benefits % of salary'],
            ['recruitingFeePct', 'Recruiting fee %'],
            ['onboarding', 'Onboarding / setup $'],
          ].map(([key, label]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                type="number"
                value={hireCost[key]}
                onChange={(e) => setHireCost({ ...hireCost, [key]: e.target.value })}
                className={fieldClass}
              />
            </label>
          ))}
        </div>
      ),
    },
  ];

  return (
    <CalculatorGridLayout
      title="Jobs Calculators"
      subtitle="Salary, take-home, raises, contract rates and hiring costs"
      items={items}
      activeId={active}
      onSelect={(id) => setActive(active === id ? null : id)}
      theme="blue"
      hideHeader={hideHeader}
    />
  );
};

export default JobsCalculators;
