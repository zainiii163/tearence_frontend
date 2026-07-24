import React, { useState } from 'react';
import { Calculator, Home, DollarSign, TrendingUp, PieChart, Percent } from 'lucide-react';
import calculatorAPI from '../../services/calculatorAPI';
import CalculatorGridLayout from '../shared/CalculatorGridLayout';

const RealEstateCalculators = ({ hideHeader = false }) => {
  const [activeCalculator, setActiveCalculator] = useState(null);

  // Mortgage Calculator
  const [mortgage, setMortgage] = useState({
    principal: '',
    interestRate: '',
    loanTerm: '30',
    downPayment: ''
  });
  const [mortgageResult, setMortgageResult] = useState(null);

  const calculateMortgage = async () => {
    try {
      const response = await calculatorAPI.mortgage({
        principal: mortgage.principal,
        down_payment: mortgage.downPayment,
        interest_rate: mortgage.interestRate,
        loan_term: mortgage.loanTerm
      });
      setMortgageResult(response.data);
    } catch (error) {
      console.error('Error calculating mortgage:', error);
    }
  };

  // Affordability Calculator
  const [affordability, setAffordability] = useState({
    annualIncome: '',
    monthlyDebt: '',
    downPayment: '',
    interestRate: '6.5',
    loanTerm: '30'
  });
  const [affordabilityResult, setAffordabilityResult] = useState(null);

  const calculateAffordability = async () => {
    try {
      const response = await calculatorAPI.affordability({
        annual_income: affordability.annualIncome,
        monthly_debt: affordability.monthlyDebt,
        down_payment: affordability.downPayment,
        interest_rate: affordability.interestRate,
        loan_term: affordability.loanTerm
      });
      setAffordabilityResult(response.data);
    } catch (error) {
      console.error('Error calculating affordability:', error);
    }
  };

  // ROI Calculator
  const [roi, setRoi] = useState({
    purchasePrice: '',
    monthlyRent: '',
    expenses: '',
    downPayment: ''
  });
  const [roiResult, setRoiResult] = useState(null);

  const calculateROI = async () => {
    try {
      const response = await calculatorAPI.roi({
        purchase_price: roi.purchasePrice,
        monthly_rent: roi.monthlyRent,
        expenses: roi.expenses,
        down_payment: roi.downPayment
      });
      setRoiResult({
        annualRent: response.data.annual_rent,
        annualCashFlow: response.data.annual_cash_flow,
        cashOnCashROI: response.data.cash_on_cash_roi,
        capRate: response.data.cap_rate
      });
    } catch (error) {
      console.error('Error calculating ROI:', error);
    }
  };

  // Rent vs Buy Calculator
  const [rentVsBuy, setRentVsBuy] = useState({
    homePrice: '',
    monthlyRent: '',
    downPayment: '',
    interestRate: '6.5',
    propertyTaxRate: '1.2',
    appreciationRate: '3',
    rentIncreaseRate: '3',
    years: '5'
  });
  const [rentVsBuyResult, setRentVsBuyResult] = useState(null);

  const calculateRentVsBuy = async () => {
    try {
      const response = await calculatorAPI.rentVsBuy({
        home_price: rentVsBuy.homePrice,
        monthly_rent: rentVsBuy.monthlyRent,
        down_payment: rentVsBuy.downPayment,
        interest_rate: rentVsBuy.interestRate,
        property_tax_rate: rentVsBuy.propertyTaxRate,
        appreciation_rate: rentVsBuy.appreciationRate,
        rent_increase_rate: rentVsBuy.rentIncreaseRate,
        years: rentVsBuy.years
      });
      setRentVsBuyResult(response.data);
    } catch (error) {
      console.error('Error calculating rent vs buy:', error);
    }
  };

  // Property Tax Calculator
  const [propertyTax, setPropertyTax] = useState({
    propertyValue: '',
    taxRate: '1.2'
  });
  const [propertyTaxResult, setPropertyTaxResult] = useState(null);

  const calculatePropertyTax = async () => {
    try {
      const response = await calculatorAPI.propertyTax({
        property_value: propertyTax.propertyValue,
        tax_rate: propertyTax.taxRate
      });
      setPropertyTaxResult(response.data);
    } catch (error) {
      console.error('Error calculating property tax:', error);
    }
  };

  // Closing Costs Calculator
  const [closingCosts, setClosingCosts] = useState({
    homePrice: '',
    loanAmount: '',
    originationFee: '1',
    titleInsurance: '0.5',
    appraisalFee: '500',
    attorneyFee: '1000',
    otherFees: '2000'
  });
  const [closingCostsResult, setClosingCostsResult] = useState(null);

  const calculateClosingCosts = async () => {
    try {
      const response = await calculatorAPI.closingCosts({
        home_price: closingCosts.homePrice,
        loan_amount: closingCosts.loanAmount,
        origination_fee: closingCosts.originationFee,
        title_insurance: closingCosts.titleInsurance,
        appraisal_fee: closingCosts.appraisalFee,
        attorney_fee: closingCosts.attorneyFee,
        other_fees: closingCosts.otherFees
      });
      setClosingCostsResult({
        originationFee: response.data.origination_fee,
        titleInsurance: response.data.title_insurance,
        appraisalFee: response.data.appraisal_fee,
        attorneyFee: response.data.attorney_fee,
        otherFees: response.data.other_fees,
        totalClosingCosts: response.data.total_closing_costs,
        percentageOfPrice: response.data.percentage_of_price
      });
    } catch (error) {
      console.error('Error calculating closing costs:', error);
    }
  };

  const calculators = [
    {
      id: 'mortgage',
      name: 'Mortgage Calculator',
      icon: <Home className="w-5 h-5" />,
      description: 'Calculate monthly mortgage payments',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Price ($)</label>
            <input
              type="number"
              value={mortgage.principal}
              onChange={(e) => setMortgage({ ...mortgage, principal: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 300000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
            <input
              type="number"
              value={mortgage.downPayment}
              onChange={(e) => setMortgage({ ...mortgage, downPayment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 60000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={mortgage.interestRate}
              onChange={(e) => setMortgage({ ...mortgage, interestRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 6.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (Years)</label>
            <select
              value={mortgage.loanTerm}
              onChange={(e) => setMortgage({ ...mortgage, loanTerm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="15">15 years</option>
              <option value="20">20 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
          <button
            onClick={calculateMortgage}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Calculate
          </button>
          {mortgageResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700 font-bold">Monthly Payment: ${mortgageResult.monthly_payment}</p>
              <p className="text-sm text-green-700">Total Payment: ${mortgageResult.total_payment}</p>
              <p className="text-sm text-green-700">Total Interest: ${mortgageResult.total_interest}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'affordability',
      name: 'Affordability Calculator',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Determine how much home you can afford',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income ($)</label>
            <input
              type="number"
              value={affordability.annualIncome}
              onChange={(e) => setAffordability({ ...affordability, annualIncome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 75000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Debt Payments ($)</label>
            <input
              type="number"
              value={affordability.monthlyDebt}
              onChange={(e) => setAffordability({ ...affordability, monthlyDebt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment Available ($)</label>
            <input
              type="number"
              value={affordability.downPayment}
              onChange={(e) => setAffordability({ ...affordability, downPayment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 60000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={affordability.interestRate}
              onChange={(e) => setAffordability({ ...affordability, interestRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 6.5"
            />
          </div>
          <button
            onClick={calculateAffordability}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Calculate
          </button>
          {affordabilityResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700 font-bold">Max Home Price: ${affordabilityResult.max_home_price}</p>
              <p className="text-sm text-green-700">Max Loan Amount: ${affordabilityResult.max_loan_amount}</p>
              <p className="text-sm text-green-700">Max Monthly Payment: ${affordabilityResult.max_monthly_payment}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'roi',
      name: 'ROI Calculator',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Calculate rental property returns',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
            <input
              type="number"
              value={roi.purchasePrice}
              onChange={(e) => setRoi({ ...roi, purchasePrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 200000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
            <input
              type="number"
              value={roi.monthlyRent}
              onChange={(e) => setRoi({ ...roi, monthlyRent: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 1800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Expenses ($)</label>
            <input
              type="number"
              value={roi.expenses}
              onChange={(e) => setRoi({ ...roi, expenses: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
            <input
              type="number"
              value={roi.downPayment}
              onChange={(e) => setRoi({ ...roi, downPayment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 40000"
            />
          </div>
          <button
            onClick={calculateROI}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Calculate
          </button>
          {roiResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700 font-bold">Cash-on-Cash ROI: {roiResult.cashOnCashROI}%</p>
              <p className="text-sm text-green-700">Cap Rate: {roiResult.capRate}%</p>
              <p className="text-sm text-green-700">Annual Cash Flow: ${roiResult.annualCashFlow}</p>
              <p className="text-sm text-green-700">Annual Rent: ${roiResult.annualRent}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'rent-vs-buy',
      name: 'Rent vs Buy Calculator',
      icon: <PieChart className="w-5 h-5" />,
      description: 'Compare renting vs buying costs',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Price ($)</label>
            <input
              type="number"
              value={rentVsBuy.homePrice}
              onChange={(e) => setRentVsBuy({ ...rentVsBuy, homePrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 300000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
            <input
              type="number"
              value={rentVsBuy.monthlyRent}
              onChange={(e) => setRentVsBuy({ ...rentVsBuy, monthlyRent: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 2000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
            <input
              type="number"
              value={rentVsBuy.downPayment}
              onChange={(e) => setRentVsBuy({ ...rentVsBuy, downPayment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 60000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Period (Years)</label>
            <input
              type="number"
              value={rentVsBuy.years}
              onChange={(e) => setRentVsBuy({ ...rentVsBuy, years: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 5"
            />
          </div>
          <button
            onClick={calculateRentVsBuy}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Calculate
          </button>
          {rentVsBuyResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700 font-bold">{rentVsBuyResult.recommendation}</p>
              <p className="text-sm text-green-700">Total Rent Cost: ${rentVsBuyResult.total_rent_cost}</p>
              <p className="text-sm text-green-700">Net Buy Cost: ${rentVsBuyResult.net_buy_cost}</p>
              <p className="text-sm text-green-700">Home Equity: ${rentVsBuyResult.home_equity}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'property-tax',
      name: 'Property Tax Calculator',
      icon: <Percent className="w-5 h-5" />,
      description: 'Calculate annual property taxes',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Value ($)</label>
            <input
              type="number"
              value={propertyTax.propertyValue}
              onChange={(e) => setPropertyTax({ ...propertyTax, propertyValue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 300000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={propertyTax.taxRate}
              onChange={(e) => setPropertyTax({ ...propertyTax, taxRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 1.2"
            />
          </div>
          <button
            onClick={calculatePropertyTax}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Calculate
          </button>
          {propertyTaxResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700 font-bold">Annual Tax: ${propertyTaxResult.annual_tax}</p>
              <p className="text-sm text-green-700">Monthly Tax: ${propertyTaxResult.monthly_tax}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'closing-costs',
      name: 'Closing Costs Calculator',
      icon: <Calculator className="w-5 h-5" />,
      description: 'Estimate closing costs for purchase',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Price ($)</label>
            <input
              type="number"
              value={closingCosts.homePrice}
              onChange={(e) => setClosingCosts({ ...closingCosts, homePrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 300000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount ($)</label>
            <input
              type="number"
              value={closingCosts.loanAmount}
              onChange={(e) => setClosingCosts({ ...closingCosts, loanAmount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 240000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origination Fee (%)</label>
            <input
              type="number"
              step="0.1"
              value={closingCosts.originationFee}
              onChange={(e) => setClosingCosts({ ...closingCosts, originationFee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Insurance (%)</label>
            <input
              type="number"
              step="0.1"
              value={closingCosts.titleInsurance}
              onChange={(e) => setClosingCosts({ ...closingCosts, titleInsurance: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 0.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appraisal Fee ($)</label>
            <input
              type="number"
              value={closingCosts.appraisalFee}
              onChange={(e) => setClosingCosts({ ...closingCosts, appraisalFee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attorney Fee ($)</label>
            <input
              type="number"
              value={closingCosts.attorneyFee}
              onChange={(e) => setClosingCosts({ ...closingCosts, attorneyFee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other Fees ($)</label>
            <input
              type="number"
              value={closingCosts.otherFees}
              onChange={(e) => setClosingCosts({ ...closingCosts, otherFees: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 2000"
            />
          </div>
          <button
            onClick={calculateClosingCosts}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Calculate
          </button>
          {closingCostsResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Results</h4>
              <p className="text-sm text-green-700 font-bold">Total Closing Costs: ${closingCostsResult.totalClosingCosts}</p>
              <p className="text-sm text-green-700">Percentage of Price: {closingCostsResult.percentageOfPrice}%</p>
              <p className="text-sm text-green-700">Origination Fee: ${closingCostsResult.originationFee}</p>
              <p className="text-sm text-green-700">Title Insurance: ${closingCostsResult.titleInsurance}</p>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <CalculatorGridLayout
      title="Real Estate Calculators"
      subtitle="Mortgage, affordability, ROI and rent vs buy — pick a tool below."
      items={calculators}
      activeId={activeCalculator}
      onSelect={(id) => setActiveCalculator(activeCalculator === id ? null : id)}
      theme="green"
      hideHeader={hideHeader}
    />
  );
};

export default RealEstateCalculators;
