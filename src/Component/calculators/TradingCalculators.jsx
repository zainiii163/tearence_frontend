import React, { useState } from 'react';
import { Calculator, TrendingUp, Percent, Target, Layers } from 'lucide-react';
import CalculatorGridLayout from '../shared/CalculatorGridLayout';

/**
 * Trading-style calculators inspired by tradingcalculator.app — client-side, no API.
 * Clive: useful profit / risk tools for buyers & sellers.
 */
const TradingCalculators = ({ compact = false, hideHeader = false }) => {
  const [active, setActive] = useState(null);

  const [pnl, setPnl] = useState({
    entry: '',
    exit: '',
    quantity: '',
    side: 'long',
    fees: '0',
  });
  const [pnlResult, setPnlResult] = useState(null);

  const [position, setPosition] = useState({
    account: '',
    riskPercent: '1',
    entry: '',
    stop: '',
  });
  const [positionResult, setPositionResult] = useState(null);

  const [rr, setRr] = useState({ risk: '', reward: '' });
  const [rrResult, setRrResult] = useState(null);

  const [compound, setCompound] = useState({
    principal: '',
    rate: '10',
    years: '5',
    compoundsPerYear: '12',
  });
  const [compoundResult, setCompoundResult] = useState(null);

  const [pct, setPct] = useState({ start: '', end: '' });
  const [pctResult, setPctResult] = useState(null);

  const calcPnl = () => {
    const entry = parseFloat(pnl.entry);
    const exit = parseFloat(pnl.exit);
    const qty = parseFloat(pnl.quantity);
    const fees = parseFloat(pnl.fees) || 0;
    if (![entry, exit, qty].every((n) => Number.isFinite(n) && n > 0)) return;
    const raw = pnl.side === 'long' ? (exit - entry) * qty : (entry - exit) * qty;
    const net = raw - fees;
    const pctGain = entry * qty ? (net / (entry * qty)) * 100 : 0;
    setPnlResult({
      gross: raw,
      net,
      pctGain,
      cost: entry * qty,
    });
  };

  const calcPosition = () => {
    const account = parseFloat(position.account);
    const riskPct = parseFloat(position.riskPercent);
    const entry = parseFloat(position.entry);
    const stop = parseFloat(position.stop);
    if (![account, riskPct, entry, stop].every((n) => Number.isFinite(n))) return;
    const riskAmount = account * (riskPct / 100);
    const perUnitRisk = Math.abs(entry - stop);
    if (perUnitRisk <= 0) return;
    const size = riskAmount / perUnitRisk;
    setPositionResult({
      riskAmount,
      size,
      positionValue: size * entry,
    });
  };

  const calcRr = () => {
    const risk = parseFloat(rr.risk);
    const reward = parseFloat(rr.reward);
    if (![risk, reward].every((n) => Number.isFinite(n) && n > 0)) return;
    setRrResult({
      ratio: reward / risk,
      label: `1 : ${(reward / risk).toFixed(2)}`,
    });
  };

  const calcCompound = () => {
    const P = parseFloat(compound.principal);
    const r = parseFloat(compound.rate) / 100;
    const t = parseFloat(compound.years);
    const n = parseFloat(compound.compoundsPerYear) || 12;
    if (![P, r, t, n].every((n) => Number.isFinite(n) && n >= 0) || P <= 0) return;
    const future = P * Math.pow(1 + r / n, n * t);
    setCompoundResult({
      future,
      profit: future - P,
      multiple: future / P,
    });
  };

  const calcPct = () => {
    const start = parseFloat(pct.start);
    const end = parseFloat(pct.end);
    if (![start, end].every((n) => Number.isFinite(n)) || start === 0) return;
    const change = ((end - start) / Math.abs(start)) * 100;
    setPctResult({ change, abs: end - start });
  };

  const money = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      : '—';

  const calculators = [
    {
      id: 'pnl',
      name: 'Profit / Loss Calculator',
      emoji: '💰',
      icon: <TrendingUp className="w-5 h-5" />,
      blurb: 'Estimate net P&L before you buy or sell.',
      body: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <label className="text-xs font-medium text-gray-600">
              Side
              <select
                value={pnl.side}
                onChange={(e) => setPnl({ ...pnl, side: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              >
                <option value="long">Buy / Long</option>
                <option value="short">Sell / Short</option>
              </select>
            </label>
            <label className="text-xs font-medium text-gray-600">
              Entry price
              <input
                type="number"
                value={pnl.entry}
                onChange={(e) => setPnl({ ...pnl, entry: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-medium text-gray-600">
              Exit price
              <input
                type="number"
                value={pnl.exit}
                onChange={(e) => setPnl({ ...pnl, exit: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-medium text-gray-600">
              Quantity
              <input
                type="number"
                value={pnl.quantity}
                onChange={(e) => setPnl({ ...pnl, quantity: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-medium text-gray-600">
              Fees
              <input
                type="number"
                value={pnl.fees}
                onChange={(e) => setPnl({ ...pnl, fees: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={calcPnl}
            className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
          >
            Calculate
          </button>
          {pnlResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm bg-emerald-50 rounded-lg p-3">
              <div>
                <p className="text-gray-500 text-xs">Cost basis</p>
                <p className="font-bold">{money(pnlResult.cost)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Gross P&L</p>
                <p className="font-bold">{money(pnlResult.gross)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Net P&L</p>
                <p className={`font-bold ${pnlResult.net >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {money(pnlResult.net)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Return</p>
                <p className="font-bold">{pnlResult.pctGain.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'position',
      name: 'Position Size Calculator',
      emoji: '📊',
      icon: <Target className="w-5 h-5" />,
      blurb: 'Size your trade from account risk % and stop distance.',
      body: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              ['account', 'Account balance'],
              ['riskPercent', 'Risk %'],
              ['entry', 'Entry price'],
              ['stop', 'Stop-loss price'],
            ].map(([key, label]) => (
              <label key={key} className="text-xs font-medium text-gray-600">
                {label}
                <input
                  type="number"
                  value={position[key]}
                  onChange={(e) => setPosition({ ...position, [key]: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={calcPosition}
            className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
          >
            Calculate
          </button>
          {positionResult && (
            <div className="grid grid-cols-3 gap-2 text-sm bg-emerald-50 rounded-lg p-3">
              <div>
                <p className="text-gray-500 text-xs">Risk amount</p>
                <p className="font-bold">{money(positionResult.riskAmount)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Position size</p>
                <p className="font-bold">{positionResult.size.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Position value</p>
                <p className="font-bold">{money(positionResult.positionValue)}</p>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'rr',
      name: 'Risk / Reward Ratio',
      emoji: '⚖️',
      icon: <Percent className="w-5 h-5" />,
      blurb: 'Compare potential loss vs potential gain.',
      body: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-medium text-gray-600">
              Risk ($)
              <input
                type="number"
                value={rr.risk}
                onChange={(e) => setRr({ ...rr, risk: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-medium text-gray-600">
              Reward ($)
              <input
                type="number"
                value={rr.reward}
                onChange={(e) => setRr({ ...rr, reward: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={calcRr}
            className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
          >
            Calculate
          </button>
          {rrResult && (
            <p className="text-sm bg-emerald-50 rounded-lg p-3">
              Ratio: <span className="font-bold text-emerald-800">{rrResult.label}</span>
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'compound',
      name: 'Compounding Calculator',
      emoji: '📈',
      icon: <Layers className="w-5 h-5" />,
      blurb: 'Project growth with compound interest.',
      body: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              ['principal', 'Starting amount'],
              ['rate', 'Annual rate %'],
              ['years', 'Years'],
              ['compoundsPerYear', 'Compounds / year'],
            ].map(([key, label]) => (
              <label key={key} className="text-xs font-medium text-gray-600">
                {label}
                <input
                  type="number"
                  value={compound[key]}
                  onChange={(e) => setCompound({ ...compound, [key]: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={calcCompound}
            className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
          >
            Calculate
          </button>
          {compoundResult && (
            <div className="grid grid-cols-3 gap-2 text-sm bg-emerald-50 rounded-lg p-3">
              <div>
                <p className="text-gray-500 text-xs">Future value</p>
                <p className="font-bold">{money(compoundResult.future)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Profit</p>
                <p className="font-bold text-emerald-700">{money(compoundResult.profit)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Multiple</p>
                <p className="font-bold">{compoundResult.multiple.toFixed(2)}×</p>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'pct',
      name: 'Percentage Gain / Loss',
      emoji: '％',
      icon: <Calculator className="w-5 h-5" />,
      blurb: 'Quick % change between two prices.',
      body: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-medium text-gray-600">
              Start price
              <input
                type="number"
                value={pct.start}
                onChange={(e) => setPct({ ...pct, start: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-medium text-gray-600">
              End price
              <input
                type="number"
                value={pct.end}
                onChange={(e) => setPct({ ...pct, end: e.target.value })}
                className="mt-1 w-full border rounded-lg px-2 py-2 text-sm"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={calcPct}
            className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
          >
            Calculate
          </button>
          {pctResult && (
            <p className="text-sm bg-emerald-50 rounded-lg p-3">
              Change:{' '}
              <span className={`font-bold ${pctResult.change >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {pctResult.change.toFixed(2)}% ({money(pctResult.abs)})
              </span>
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <CalculatorGridLayout
      title={compact ? undefined : 'Trading Calculators'}
      subtitle={
        compact
          ? undefined
          : 'Free tools inspired by tradingcalculator.app — size risk, check P&L, and plan returns.'
      }
      items={calculators}
      activeId={active}
      onSelect={(id) => setActive(active === id ? null : id)}
      theme="emerald"
      hideHeader={hideHeader || compact}
    />
  );
};

export default TradingCalculators;
