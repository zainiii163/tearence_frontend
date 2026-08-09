import React, { useState } from 'react';
import { BookOpen, Percent, Printer, DollarSign, Truck, FileText } from 'lucide-react';
import CalculatorGridLayout from '../shared/CalculatorGridLayout';

/**
 * Author / bookseller calculators for Books & Literature.
 * Royalty, print-run, ebook pricing, word↔page, shipping, break-even.
 */
const BooksCalculators = ({ hideHeader = false }) => {
  const [active, setActive] = useState(null);

  const [royalty, setRoyalty] = useState({
    coverPrice: '',
    royaltyPct: '10',
    units: '1000',
  });
  const [royaltyResult, setRoyaltyResult] = useState(null);

  const [printRun, setPrintRun] = useState({
    copies: '500',
    costPerCopy: '3.50',
    setup: '250',
  });
  const [printRunResult, setPrintRunResult] = useState(null);

  const [ebook, setEbook] = useState({
    listPrice: '9.99',
    platformCut: '30',
  });
  const [ebookResult, setEbookResult] = useState(null);

  const [wordsPages, setWordsPages] = useState({
    words: '',
    wordsPerPage: '250',
    mode: 'words',
  });
  const [wordsPagesResult, setWordsPagesResult] = useState(null);

  const [shipping, setShipping] = useState({
    books: '1',
    weightEach: '0.5',
    ratePerKg: '8',
    packaging: '2',
  });
  const [shippingResult, setShippingResult] = useState(null);

  const [breakEven, setBreakEven] = useState({
    fixedCosts: '2000',
    coverPrice: '14.99',
    unitCost: '4.00',
    royaltyPct: '0',
  });
  const [breakEvenResult, setBreakEvenResult] = useState(null);

  const money = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      : '—';

  const fieldClass =
    'mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40';
  const labelClass = 'text-xs font-semibold text-gray-700';

  const calcRoyalty = () => {
    const price = parseFloat(royalty.coverPrice);
    const pct = parseFloat(royalty.royaltyPct);
    const units = parseFloat(royalty.units);
    if (![price, pct, units].every((n) => Number.isFinite(n) && n >= 0)) return;
    const perBook = price * (pct / 100);
    setRoyaltyResult({
      perBook,
      total: perBook * units,
      publisherShare: price * units - perBook * units,
    });
  };

  const calcPrintRun = () => {
    const copies = parseFloat(printRun.copies);
    const cpc = parseFloat(printRun.costPerCopy);
    const setup = parseFloat(printRun.setup);
    if (![copies, cpc, setup].every((n) => Number.isFinite(n) && n >= 0) || copies <= 0) return;
    const printCost = copies * cpc;
    const total = printCost + setup;
    setPrintRunResult({
      printCost,
      total,
      unitAllIn: total / copies,
    });
  };

  const calcEbook = () => {
    const price = parseFloat(ebook.listPrice);
    const cut = parseFloat(ebook.platformCut);
    if (![price, cut].every((n) => Number.isFinite(n) && n >= 0)) return;
    const platformFee = price * (cut / 100);
    const author = price - platformFee;
    setEbookResult({ platformFee, author, marginPct: price > 0 ? (author / price) * 100 : 0 });
  };

  const calcWordsPages = () => {
    const wpp = parseFloat(wordsPages.wordsPerPage) || 250;
    const value = parseFloat(wordsPages.words);
    if (!Number.isFinite(value) || value <= 0 || wpp <= 0) return;
    if (wordsPages.mode === 'words') {
      setWordsPagesResult({
        mode: 'words',
        pages: value / wpp,
        words: value,
      });
    } else {
      setWordsPagesResult({
        mode: 'pages',
        words: value * wpp,
        pages: value,
      });
    }
  };

  const calcShipping = () => {
    const books = parseFloat(shipping.books);
    const weight = parseFloat(shipping.weightEach);
    const rate = parseFloat(shipping.ratePerKg);
    const pack = parseFloat(shipping.packaging);
    if (![books, weight, rate, pack].every((n) => Number.isFinite(n) && n >= 0) || books <= 0) return;
    const kg = books * weight;
    const freight = kg * rate;
    const total = freight + pack;
    setShippingResult({ kg, freight, total, perBook: total / books });
  };

  const calcBreakEven = () => {
    const fixed = parseFloat(breakEven.fixedCosts);
    const price = parseFloat(breakEven.coverPrice);
    const unit = parseFloat(breakEven.unitCost);
    const roy = parseFloat(breakEven.royaltyPct) || 0;
    if (![fixed, price, unit].every((n) => Number.isFinite(n) && n >= 0)) return;
    const royaltyCost = price * (roy / 100);
    const contribution = price - unit - royaltyCost;
    if (contribution <= 0) {
      setBreakEvenResult({ impossible: true, contribution });
      return;
    }
    const units = Math.ceil(fixed / contribution);
    setBreakEvenResult({
      impossible: false,
      contribution,
      units,
      revenue: units * price,
    });
  };

  const items = [
    {
      id: 'royalty',
      name: 'Royalty Estimator',
      emoji: '📖',
      icon: <Percent className="w-5 h-5" />,
      blurb: 'Estimate author royalties from cover price, rate and units sold.',
      onCalc: calcRoyalty,
      result: royaltyResult && (
        <div className="grid grid-cols-3 gap-2 text-sm bg-amber-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Per book</p>
            <p className="font-bold">{money(royaltyResult.perBook)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Author total</p>
            <p className="font-bold text-amber-800">{money(royaltyResult.total)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Publisher share</p>
            <p className="font-bold">{money(royaltyResult.publisherShare)}</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['coverPrice', 'Cover / list price'],
            ['royaltyPct', 'Royalty %'],
            ['units', 'Units sold'],
          ].map(([key, label]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                type="number"
                value={royalty[key]}
                onChange={(e) => setRoyalty({ ...royalty, [key]: e.target.value })}
                className={fieldClass}
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'print-run',
      name: 'Print-Run Cost',
      emoji: '🖨️',
      icon: <Printer className="w-5 h-5" />,
      blurb: 'Total and all-in unit cost for a print run (POD or offset).',
      onCalc: calcPrintRun,
      result: printRunResult && (
        <div className="grid grid-cols-3 gap-2 text-sm bg-amber-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Print cost</p>
            <p className="font-bold">{money(printRunResult.printCost)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total with setup</p>
            <p className="font-bold text-amber-800">{money(printRunResult.total)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">All-in / copy</p>
            <p className="font-bold">{money(printRunResult.unitAllIn)}</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['copies', 'Number of copies'],
            ['costPerCopy', 'Cost per copy'],
            ['setup', 'Setup / plate fee'],
          ].map(([key, label]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                type="number"
                value={printRun[key]}
                onChange={(e) => setPrintRun({ ...printRun, [key]: e.target.value })}
                className={fieldClass}
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'ebook',
      name: 'Ebook Pricing',
      emoji: '📱',
      icon: <DollarSign className="w-5 h-5" />,
      blurb: 'See what you keep after marketplace / retailer cut (e.g. 30%).',
      onCalc: calcEbook,
      result: ebookResult && (
        <div className="grid grid-cols-3 gap-2 text-sm bg-amber-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Platform fee</p>
            <p className="font-bold">{money(ebookResult.platformFee)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">You keep</p>
            <p className="font-bold text-amber-800">{money(ebookResult.author)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Your %</p>
            <p className="font-bold">{ebookResult.marginPct.toFixed(1)}%</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['listPrice', 'Ebook list price'],
            ['platformCut', 'Platform cut %'],
          ].map(([key, label]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                type="number"
                value={ebook[key]}
                onChange={(e) => setEbook({ ...ebook, [key]: e.target.value })}
                className={fieldClass}
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'words-pages',
      name: 'Words ↔ Pages',
      emoji: '📝',
      icon: <FileText className="w-5 h-5" />,
      blurb: 'Convert manuscript word count to estimated printed pages (and back).',
      onCalc: calcWordsPages,
      result: wordsPagesResult && (
        <div className="grid grid-cols-2 gap-2 text-sm bg-amber-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Words</p>
            <p className="font-bold text-amber-800">
              {Math.round(wordsPagesResult.words).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">≈ Pages</p>
            <p className="font-bold">{Math.ceil(wordsPagesResult.pages).toLocaleString()}</p>
          </div>
        </div>
      ),
      fields: (
        <div className="space-y-3">
          <div className="flex gap-2">
            {[
              ['words', 'Words → pages'],
              ['pages', 'Pages → words'],
            ].map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setWordsPages({ ...wordsPages, mode })}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold ${
                  wordsPages.mode === mode
                    ? 'border-amber-600 bg-amber-50 text-amber-900'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass}>
              {wordsPages.mode === 'words' ? 'Word count' : 'Page count'}
              <input
                type="number"
                value={wordsPages.words}
                onChange={(e) => setWordsPages({ ...wordsPages, words: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              Words per page
              <input
                type="number"
                value={wordsPages.wordsPerPage}
                onChange={(e) => setWordsPages({ ...wordsPages, wordsPerPage: e.target.value })}
                className={fieldClass}
              />
            </label>
          </div>
        </div>
      ),
    },
    {
      id: 'shipping',
      name: 'Book Shipping',
      emoji: '📦',
      icon: <Truck className="w-5 h-5" />,
      blurb: 'Estimate parcel cost for selling books (weight × rate + packaging).',
      onCalc: calcShipping,
      result: shippingResult && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm bg-amber-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Weight (kg)</p>
            <p className="font-bold">{shippingResult.kg.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Freight</p>
            <p className="font-bold">{money(shippingResult.freight)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-bold text-amber-800">{money(shippingResult.total)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Per book</p>
            <p className="font-bold">{money(shippingResult.perBook)}</p>
          </div>
        </div>
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['books', 'Number of books'],
            ['weightEach', 'Weight each (kg)'],
            ['ratePerKg', 'Rate per kg'],
            ['packaging', 'Packaging $'],
          ].map(([key, label]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                type="number"
                value={shipping[key]}
                onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
                className={fieldClass}
              />
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'break-even',
      name: 'Break-Even Units',
      emoji: '📊',
      icon: <BookOpen className="w-5 h-5" />,
      blurb: 'How many copies to cover editing, design and print fixed costs.',
      onCalc: calcBreakEven,
      result: breakEvenResult && (
        breakEvenResult.impossible ? (
          <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">
            Contribution per book is zero or negative — raise price or lower unit cost.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-sm bg-amber-50 rounded-lg p-3">
            <div>
              <p className="text-xs text-gray-500">Contribution / book</p>
              <p className="font-bold">{money(breakEvenResult.contribution)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Break-even units</p>
              <p className="font-bold text-amber-800">{breakEvenResult.units.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Revenue at BE</p>
              <p className="font-bold">{money(breakEvenResult.revenue)}</p>
            </div>
          </div>
        )
      ),
      fields: (
        <div className="grid grid-cols-2 gap-3">
          {[
            ['fixedCosts', 'Fixed costs (edit/design/etc.)'],
            ['coverPrice', 'Cover price'],
            ['unitCost', 'Unit print / COGS'],
            ['royaltyPct', 'Royalty % (if any)'],
          ].map(([key, label]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                type="number"
                value={breakEven[key]}
                onChange={(e) => setBreakEven({ ...breakEven, [key]: e.target.value })}
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
      title="Books Calculators"
      subtitle="Royalty, print-run, ebook pricing, manuscript size, shipping and break-even"
      items={items}
      activeId={active}
      onSelect={(id) => setActive(active === id ? null : id)}
      theme="amber"
      hideHeader={hideHeader}
    />
  );
};

export default BooksCalculators;
