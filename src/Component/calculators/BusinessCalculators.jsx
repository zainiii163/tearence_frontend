import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, PieChart, Home, Car, ChevronDown, ChevronUp } from 'lucide-react';
import calculatorAPI from '../../services/calculatorAPI';

const BusinessCalculators = () => {
  const [activeCalculator, setActiveCalculator] = useState(null);

  // Break-Even Calculator
  const [breakEven, setBreakEven] = useState({
    fixedCosts: '',
    variableCostPerUnit: '',
    pricePerUnit: ''
  });
  const [breakEvenResult, setBreakEvenResult] = useState(null);

  const calculateBreakEven = async () => {
    try {
      const response = await calculatorAPI.breakEven({
        fixed_costs: breakEven.fixedCosts,
        variable_cost_per_unit: breakEven.variableCostPerUnit,
        price_per_unit: breakEven.pricePerUnit
      });
      setBreakEvenResult(response.data);
    } catch (error) {
      console.error('Error calculating break-even:', error);
    }
  };

  // ROE Calculator (DuPont Model)
  const [roe, setRoe] = useState({
    netIncome: '',
    totalAssets: '',
    totalEquity: '',
    revenue: ''
  });
  const [roeResult, setRoeResult] = useState(null);

  const calculateROE = async () => {
    try {
      const response = await calculatorAPI.roe({
        net_income: roe.netIncome,
        total_assets: roe.totalAssets,
        total_equity: roe.totalEquity,
        revenue: roe.revenue
      });
      setRoeResult({
        profitMargin: response.data.profit_margin,
        assetTurnover: response.data.asset_turnover,
        financialLeverage: response.data.financial_leverage,
        roe: response.data.roe
      });
    } catch (error) {
      console.error('Error calculating ROE:', error);
    }
  };

  // Operating Profit Margin Calculator
  const [operatingMargin, setOperatingMargin] = useState({
    operatingIncome: '',
    revenue: ''
  });
  const [operatingMarginResult, setOperatingMarginResult] = useState(null);

  const calculateOperatingMargin = async () => {
    try {
      const response = await calculatorAPI.operatingMargin({
        operating_income: operatingMargin.operatingIncome,
        revenue: operatingMargin.revenue
      });
      setOperatingMarginResult(response.data.margin);
    } catch (error) {
      console.error('Error calculating operating margin:', error);
    }
  };

  // Gross Profit Margin Calculator
  const [grossMargin, setGrossMargin] = useState({
    revenue: '',
    costOfGoodsSold: ''
  });
  const [grossMarginResult, setGrossMarginResult] = useState(null);

  const calculateGrossMargin = async () => {
    try {
      const response = await calculatorAPI.grossMargin({
        revenue: grossMargin.revenue,
        cost_of_goods_sold: grossMargin.costOfGoodsSold
      });
      setGrossMarginResult({
        grossProfit: response.data.gross_profit,
        margin: response.data.margin,
        markup: response.data.markup
      });
    } catch (error) {
      console.error('Error calculating gross margin:', error);
    }
  };

  // Business Valuation Calculator (DCF)
  const [businessValuation, setBusinessValuation] = useState({
    freeCashFlow: '',
    growthRate: '',
    discountRate: '',
    terminalGrowthRate: '',
    years: '5'
  });
  const [businessValuationResult, setBusinessValuationResult] = useState(null);

  const calculateBusinessValuation = async () => {
    try {
      const response = await calculatorAPI.businessValuation({
        free_cash_flow: businessValuation.freeCashFlow,
        growth_rate: businessValuation.growthRate,
        discount_rate: businessValuation.discountRate,
        terminal_growth_rate: businessValuation.terminalGrowthRate,
        years: businessValuation.years
      });
      setBusinessValuationResult({
        presentValue: response.data.present_value,
        terminalValue: response.data.terminal_value,
        terminalValuePV: response.data.terminal_value_pv,
        totalValue: response.data.total_value
      });
    } catch (error) {
      console.error('Error calculating business valuation:', error);
    }
  };

  // VAT Calculator
  const [vat, setVat] = useState({
    amount: '',
    vatRate: '20',
    calculationType: 'add'
  });
  const [vatResult, setVatResult] = useState(null);

  const calculateVAT = async () => {
    try {
      const response = await calculatorAPI.vat({
        amount: vat.amount,
        vat_rate: vat.vatRate,
        calculation_type: vat.calculationType
      });
      if (vat.calculationType === 'add') {
        setVatResult({
          netAmount: response.data.net_amount,
          vatAmount: response.data.vat_amount,
          total: response.data.total
        });
      } else {
        setVatResult({
          grossAmount: response.data.gross_amount,
          vatAmount: response.data.vat_amount,
          netAmount: response.data.net_amount
        });
      }
    } catch (error) {
      console.error('Error calculating VAT:', error);
    }
  };

  // FCFF Calculator
  const [fcff, setFcff] = useState({
    ebit: '',
    taxRate: '',
    depreciation: '',
    capitalExpenditure: '',
    changeInWorkingCapital: ''
  });
  const [fcffResult, setFcffResult] = useState(null);

  const calculateFCFF = async () => {
    try {
      const response = await calculatorAPI.fcff({
        ebit: fcff.ebit,
        tax_rate: fcff.taxRate,
        depreciation: fcff.depreciation,
        capital_expenditure: fcff.capitalExpenditure,
        change_in_working_capital: fcff.changeInWorkingCapital
      });
      setFcffResult({
        nopat: response.data.nopat,
        fcff: response.data.fcff
      });
    } catch (error) {
      console.error('Error calculating FCFF:', error);
    }
  };

  const calculators = [
    {
      id: 'break-even',
      name: 'Break-Even Calculator',
      icon: <Calculator className="w-5 h-5" />,
      description: 'Calculate units needed to cover costs',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Costs ($)</label>
            <input
              type="number"
              value={breakEven.fixedCosts}
              onChange={(e) => setBreakEven({ ...breakEven, fixedCosts: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 10000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variable Cost per Unit ($)</label>
            <input
              type="number"
              value={breakEven.variableCostPerUnit}
              onChange={(e) => setBreakEven({ ...breakEven, variableCostPerUnit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit ($)</label>
            <input
              type="number"
              value={breakEven.pricePerUnit}
              onChange={(e) => setBreakEven({ ...breakEven, pricePerUnit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 10"
            />
          </div>
          <button
            onClick={calculateBreakEven}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
          {breakEvenResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700">Break-Even Units: {breakEvenResult.units}</p>
              <p className="text-sm text-green-700">Break-Even Revenue: ${breakEvenResult.revenue}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'roe',
      name: 'Return on Equity (DuPont)',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Analyze profitability using DuPont model',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Net Income ($)</label>
            <input
              type="number"
              value={roe.netIncome}
              onChange={(e) => setRoe({ ...roe, netIncome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 50000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Assets ($)</label>
            <input
              type="number"
              value={roe.totalAssets}
              onChange={(e) => setRoe({ ...roe, totalAssets: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Equity ($)</label>
            <input
              type="number"
              value={roe.totalEquity}
              onChange={(e) => setRoe({ ...roe, totalEquity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 250000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Revenue ($)</label>
            <input
              type="number"
              value={roe.revenue}
              onChange={(e) => setRoe({ ...roe, revenue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 300000"
            />
          </div>
          <button
            onClick={calculateROE}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
          {roeResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700">Profit Margin: {roeResult.profitMargin}%</p>
              <p className="text-sm text-green-700">Asset Turnover: {roeResult.assetTurnover}x</p>
              <p className="text-sm text-green-700">Financial Leverage: {roeResult.financialLeverage}x</p>
              <p className="text-sm text-green-700 font-bold">ROE: {roeResult.roe}%</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'operating-margin',
      name: 'Operating Profit Margin',
      icon: <PieChart className="w-5 h-5" />,
      description: 'Assess core business efficiency',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Operating Income ($)</label>
            <input
              type="number"
              value={operatingMargin.operatingIncome}
              onChange={(e) => setOperatingMargin({ ...operatingMargin, operatingIncome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 75000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Revenue ($)</label>
            <input
              type="number"
              value={operatingMargin.revenue}
              onChange={(e) => setOperatingMargin({ ...operatingMargin, revenue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 300000"
            />
          </div>
          <button
            onClick={calculateOperatingMargin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
          {operatingMarginResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Result</h4>
              <p className="text-sm text-green-700 font-bold">Operating Profit Margin: {operatingMarginResult}%</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'gross-margin',
      name: 'Gross Profit Margin',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Calculate markup and margin percentages',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Revenue ($)</label>
            <input
              type="number"
              value={grossMargin.revenue}
              onChange={(e) => setGrossMargin({ ...grossMargin, revenue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 300000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost of Goods Sold ($)</label>
            <input
              type="number"
              value={grossMargin.costOfGoodsSold}
              onChange={(e) => setGrossMargin({ ...grossMargin, costOfGoodsSold: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 180000"
            />
          </div>
          <button
            onClick={calculateGrossMargin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
          {grossMarginResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700">Gross Profit: ${grossMarginResult.grossProfit}</p>
              <p className="text-sm text-green-700">Gross Margin: {grossMarginResult.margin}%</p>
              <p className="text-sm text-green-700">Markup: {grossMarginResult.markup}%</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'business-valuation',
      name: 'Business Valuation (DCF)',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Estimate business value using DCF model',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Free Cash Flow ($)</label>
            <input
              type="number"
              value={businessValuation.freeCashFlow}
              onChange={(e) => setBusinessValuation({ ...businessValuation, freeCashFlow: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 100000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Growth Rate (%)</label>
            <input
              type="number"
              value={businessValuation.growthRate}
              onChange={(e) => setBusinessValuation({ ...businessValuation, growthRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Rate (%)</label>
            <input
              type="number"
              value={businessValuation.discountRate}
              onChange={(e) => setBusinessValuation({ ...businessValuation, discountRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terminal Growth Rate (%)</label>
            <input
              type="number"
              value={businessValuation.terminalGrowthRate}
              onChange={(e) => setBusinessValuation({ ...businessValuation, terminalGrowthRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Projection Years</label>
            <input
              type="number"
              value={businessValuation.years}
              onChange={(e) => setBusinessValuation({ ...businessValuation, years: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5"
            />
          </div>
          <button
            onClick={calculateBusinessValuation}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
          {businessValuationResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700">PV of Cash Flows: ${businessValuationResult.presentValue}</p>
              <p className="text-sm text-green-700">Terminal Value: ${businessValuationResult.terminalValue}</p>
              <p className="text-sm text-green-700">PV of Terminal Value: ${businessValuationResult.terminalValuePV}</p>
              <p className="text-sm text-green-700 font-bold">Total Business Value: ${businessValuationResult.totalValue}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'vat',
      name: 'VAT Calculator',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Calculate VAT for UK/EU transactions',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              value={vat.amount}
              onChange={(e) => setVat({ ...vat, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate (%)</label>
            <select
              value={vat.vatRate}
              onChange={(e) => setVat({ ...vat, vatRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="20">20% (Standard UK)</option>
              <option value="5">5% (Reduced UK)</option>
              <option value="0">0% (Zero-rated)</option>
              <option value="19">19% (Germany)</option>
              <option value="21">21% (France)</option>
              <option value="23">23% (Ireland)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calculation Type</label>
            <select
              value={vat.calculationType}
              onChange={(e) => setVat({ ...vat, calculationType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="add">Add VAT</option>
              <option value="remove">Remove VAT</option>
            </select>
          </div>
          <button
            onClick={calculateVAT}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
          {vatResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              {vat.calculationType === 'add' ? (
                <>
                  <p className="text-sm text-green-700">Net Amount: ${vatResult.netAmount}</p>
                  <p className="text-sm text-green-700">VAT Amount: ${vatResult.vatAmount}</p>
                  <p className="text-sm text-green-700 font-bold">Total: ${vatResult.total}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-green-700">Gross Amount: ${vatResult.grossAmount}</p>
                  <p className="text-sm text-green-700">VAT Amount: ${vatResult.vatAmount}</p>
                  <p className="text-sm text-green-700 font-bold">Net Amount: ${vatResult.netAmount}</p>
                </>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'fcff',
      name: 'Free Cash Flow to Firm',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Calculate available cash after operations',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EBIT ($)</label>
            <input
              type="number"
              value={fcff.ebit}
              onChange={(e) => setFcff({ ...fcff, ebit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 100000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              value={fcff.taxRate}
              onChange={(e) => setFcff({ ...fcff, taxRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Depreciation & Amortization ($)</label>
            <input
              type="number"
              value={fcff.depreciation}
              onChange={(e) => setFcff({ ...fcff, depreciation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 15000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capital Expenditure ($)</label>
            <input
              type="number"
              value={fcff.capitalExpenditure}
              onChange={(e) => setFcff({ ...fcff, capitalExpenditure: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 20000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Change in Working Capital ($)</label>
            <input
              type="number"
              value={fcff.changeInWorkingCapital}
              onChange={(e) => setFcff({ ...fcff, changeInWorkingCapital: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5000"
            />
          </div>
          <button
            onClick={calculateFCFF}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
          {fcffResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700">NOPAT: ${fcffResult.nopat}</p>
              <p className="text-sm text-green-700 font-bold">FCFF: ${fcffResult.fcff}</p>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Calculators</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful financial tools to help you make informed business decisions. Calculate break-even points, 
            analyze profitability, and estimate business value with our comprehensive suite of calculators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc) => (
            <div
              key={calc.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => setActiveCalculator(activeCalculator === calc.id ? null : calc.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {calc.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{calc.name}</h3>
                      <p className="text-sm text-gray-600">{calc.description}</p>
                    </div>
                  </div>
                  {activeCalculator === calc.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {activeCalculator === calc.id && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  {calc.component}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            💡 These calculators are provided for informational purposes only. Consult with a financial advisor for professional advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessCalculators;
