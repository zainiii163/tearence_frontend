import React, { useState } from 'react';
import { Calculator, Car, DollarSign, Fuel, Shield, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import calculatorAPI from '../../services/calculatorAPI';

const VehicleCalculators = () => {
  const [activeCalculator, setActiveCalculator] = useState(null);

  // Auto Loan Calculator
  const [autoLoan, setAutoLoan] = useState({
    vehiclePrice: '',
    downPayment: '',
    interestRate: '6.5',
    loanTerm: '60'
  });
  const [autoLoanResult, setAutoLoanResult] = useState(null);

  const calculateAutoLoan = async () => {
    try {
      const response = await calculatorAPI.autoLoan({
        vehicle_price: autoLoan.vehiclePrice,
        down_payment: autoLoan.downPayment,
        interest_rate: autoLoan.interestRate,
        loan_term: autoLoan.loanTerm
      });
      setAutoLoanResult(response.data);
    } catch (error) {
      console.error('Error calculating auto loan:', error);
    }
  };

  // Lease vs Buy Calculator
  const [leaseVsBuy, setLeaseVsBuy] = useState({
    vehiclePrice: '',
    residualValue: '50',
    leaseTerm: '36',
    moneyFactor: '0.00125',
    loanInterestRate: '6.5',
    loanTerm: '60',
    downPayment: ''
  });
  const [leaseVsBuyResult, setLeaseVsBuyResult] = useState(null);

  const calculateLeaseVsBuy = async () => {
    try {
      const response = await calculatorAPI.leaseVsBuy({
        vehicle_price: leaseVsBuy.vehiclePrice,
        down_payment: leaseVsBuy.downPayment,
        residual_value: leaseVsBuy.residualValue,
        lease_term: leaseVsBuy.leaseTerm,
        money_factor: leaseVsBuy.moneyFactor,
        loan_interest_rate: leaseVsBuy.loanInterestRate,
        loan_term: leaseVsBuy.loanTerm
      });
      setLeaseVsBuyResult(response.data);
    } catch (error) {
      console.error('Error calculating lease vs buy:', error);
    }
  };

  // Depreciation Calculator
  const [depreciation, setDepreciation] = useState({
    purchasePrice: '',
    years: '5',
    depreciationRate: '15'
  });
  const [depreciationResult, setDepreciationResult] = useState(null);

  const calculateDepreciation = async () => {
    try {
      const response = await calculatorAPI.depreciation({
        purchase_price: depreciation.purchasePrice,
        years: depreciation.years,
        depreciation_rate: depreciation.depreciationRate
      });
      setDepreciationResult(response.data);
    } catch (error) {
      console.error('Error calculating depreciation:', error);
    }
  };

  // Fuel Cost Calculator
  const [fuelCost, setFuelCost] = useState({
    distance: '',
    mpg: '25',
    fuelPrice: '3.50'
  });
  const [fuelCostResult, setFuelCostResult] = useState(null);

  const calculateFuelCost = async () => {
    try {
      const response = await calculatorAPI.fuelCost({
        distance: fuelCost.distance,
        mpg: fuelCost.mpg,
        fuel_price: fuelCost.fuelPrice
      });
      setFuelCostResult(response.data);
    } catch (error) {
      console.error('Error calculating fuel cost:', error);
    }
  };

  // Insurance Estimator
  const [insurance, setInsurance] = useState({
    vehicleValue: '',
    driverAge: '30',
    drivingRecord: 'clean',
    coverageLevel: 'full'
  });
  const [insuranceResult, setInsuranceResult] = useState(null);

  const calculateInsurance = async () => {
    try {
      const response = await calculatorAPI.insurance({
        vehicle_value: insurance.vehicleValue,
        driver_age: insurance.driverAge,
        driving_record: insurance.drivingRecord,
        coverage_level: insurance.coverageLevel
      });
      setInsuranceResult({
        monthlyPremium: response.data.monthly_premium,
        annualPremium: response.data.annual_premium
      });
    } catch (error) {
      console.error('Error calculating insurance:', error);
    }
  };

  // Total Cost of Ownership Calculator
  const [tco, setTco] = useState({
    purchasePrice: '',
    downPayment: '',
    loanInterestRate: '6.5',
    loanTerm: '60',
    annualMiles: '12000',
    mpg: '25',
    fuelPrice: '3.50',
    insuranceMonthly: '150',
    maintenanceAnnual: '500',
    ownershipYears: '5'
  });
  const [tcoResult, setTcoResult] = useState(null);

  const calculateTCO = async () => {
    try {
      const response = await calculatorAPI.tco({
        purchase_price: tco.purchasePrice,
        down_payment: tco.downPayment,
        loan_interest_rate: tco.loanInterestRate,
        loan_term: tco.loanTerm,
        annual_miles: tco.annualMiles,
        mpg: tco.mpg,
        fuel_price: tco.fuelPrice,
        insurance_monthly: tco.insuranceMonthly,
        maintenance_annual: tco.maintenanceAnnual,
        ownership_years: tco.ownershipYears
      });
      setTcoResult(response.data);
    } catch (error) {
      console.error('Error calculating TCO:', error);
    }
  };

  const calculators = [
    {
      id: 'auto-loan',
      name: 'Auto Loan Calculator',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Calculate monthly car loan payments',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price ($)</label>
            <input
              type="number"
              value={autoLoan.vehiclePrice}
              onChange={(e) => setAutoLoan({ ...autoLoan, vehiclePrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 35000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
            <input
              type="number"
              value={autoLoan.downPayment}
              onChange={(e) => setAutoLoan({ ...autoLoan, downPayment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 7000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={autoLoan.interestRate}
              onChange={(e) => setAutoLoan({ ...autoLoan, interestRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 6.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (Months)</label>
            <select
              value={autoLoan.loanTerm}
              onChange={(e) => setAutoLoan({ ...autoLoan, loanTerm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
              <option value="72">72 months</option>
            </select>
          </div>
          <button
            onClick={calculateAutoLoan}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Calculate
          </button>
          {autoLoanResult && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Results</h4>
              <p className="text-sm text-red-700 font-bold">Monthly Payment: ${autoLoanResult.monthly_payment}</p>
              <p className="text-sm text-red-700">Total Payment: ${autoLoanResult.total_payment}</p>
              <p className="text-sm text-red-700">Total Interest: ${autoLoanResult.total_interest}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'lease-vs-buy',
      name: 'Lease vs Buy Calculator',
      icon: <Car className="w-5 h-5" />,
      description: 'Compare leasing vs buying costs',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price ($)</label>
            <input
              type="number"
              value={leaseVsBuy.vehiclePrice}
              onChange={(e) => setLeaseVsBuy({ ...leaseVsBuy, vehiclePrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 35000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
            <input
              type="number"
              value={leaseVsBuy.downPayment}
              onChange={(e) => setLeaseVsBuy({ ...leaseVsBuy, downPayment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 3000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Residual Value (%)</label>
            <input
              type="number"
              value={leaseVsBuy.residualValue}
              onChange={(e) => setLeaseVsBuy({ ...leaseVsBuy, residualValue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 50"
            />
          </div>
          <button
            onClick={calculateLeaseVsBuy}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Calculate
          </button>
          {leaseVsBuyResult && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Results</h4>
              <p className="text-sm text-red-700 font-bold">{leaseVsBuyResult.recommendation}</p>
              <p className="text-sm text-red-700">Lease Payment: ${leaseVsBuyResult.lease_payment}/mo</p>
              <p className="text-sm text-red-700">Buy Payment: ${leaseVsBuyResult.buy_payment}/mo</p>
              <p className="text-sm text-red-700">Total Lease Cost: ${leaseVsBuyResult.total_lease_cost}</p>
              <p className="text-sm text-red-700">Total Buy Cost: ${leaseVsBuyResult.total_buy_cost}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'depreciation',
      name: 'Depreciation Calculator',
      icon: <TrendingDown className="w-5 h-5" />,
      description: 'Calculate vehicle depreciation over time',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
            <input
              type="number"
              value={depreciation.purchasePrice}
              onChange={(e) => setDepreciation({ ...depreciation, purchasePrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 35000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years to Depreciate</label>
            <input
              type="number"
              value={depreciation.years}
              onChange={(e) => setDepreciation({ ...depreciation, years: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Depreciation Rate (%)</label>
            <input
              type="number"
              value={depreciation.depreciationRate}
              onChange={(e) => setDepreciation({ ...depreciation, depreciationRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 15"
            />
          </div>
          <button
            onClick={calculateDepreciation}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Calculate
          </button>
          {depreciationResult && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Results</h4>
              <p className="text-sm text-red-700 font-bold">Final Value: ${depreciationResult.final_value}</p>
              <p className="text-sm text-red-700">Total Depreciation: ${depreciationResult.total_depreciation}</p>
              <div className="mt-2 space-y-1">
                {depreciationResult.yearly_values.map((year) => (
                  <p key={year.year} className="text-xs text-red-600">
                    Year {year.year}: ${year.value} (Depreciated: ${year.depreciated})
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'fuel-cost',
      name: 'Fuel Cost Calculator',
      icon: <Fuel className="w-5 h-5" />,
      description: 'Calculate fuel costs for trips',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distance (Miles)</label>
            <input
              type="number"
              value={fuelCost.distance}
              onChange={(e) => setFuelCost({ ...fuelCost, distance: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Efficiency (MPG)</label>
            <input
              type="number"
              value={fuelCost.mpg}
              onChange={(e) => setFuelCost({ ...fuelCost, mpg: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Price per Gallon ($)</label>
            <input
              type="number"
              step="0.01"
              value={fuelCost.fuelPrice}
              onChange={(e) => setFuelCost({ ...fuelCost, fuelPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 3.50"
            />
          </div>
          <button
            onClick={calculateFuelCost}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Calculate
          </button>
          {fuelCostResult && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Results</h4>
              <p className="text-sm text-red-700 font-bold">Total Cost: ${fuelCostResult.total_cost}</p>
              <p className="text-sm text-red-700">Gallons Needed: {fuelCostResult.gallons_needed}</p>
              <p className="text-sm text-red-700">Cost per Mile: ${fuelCostResult.cost_per_mile}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'insurance',
      name: 'Insurance Estimator',
      icon: <Shield className="w-5 h-5" />,
      description: 'Estimate auto insurance premiums',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Value ($)</label>
            <input
              type="number"
              value={insurance.vehicleValue}
              onChange={(e) => setInsurance({ ...insurance, vehicleValue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 35000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver Age</label>
            <input
              type="number"
              value={insurance.driverAge}
              onChange={(e) => setInsurance({ ...insurance, driverAge: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driving Record</label>
            <select
              value={insurance.drivingRecord}
              onChange={(e) => setInsurance({ ...insurance, drivingRecord: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="clean">Clean</option>
              <option value="minor">Minor Violations</option>
              <option value="major">Major Violations</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Level</label>
            <select
              value={insurance.coverageLevel}
              onChange={(e) => setInsurance({ ...insurance, coverageLevel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="liability">Liability Only</option>
              <option value="full">Full Coverage</option>
              <option value="premium">Premium Coverage</option>
            </select>
          </div>
          <button
            onClick={calculateInsurance}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Calculate
          </button>
          {insuranceResult && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Estimated Premium</h4>
              <p className="text-sm text-red-700 font-bold">Monthly: ${insuranceResult.monthlyPremium}</p>
              <p className="text-sm text-red-700">Annual: ${insuranceResult.annualPremium}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'tco',
      name: 'Total Cost of Ownership',
      icon: <Calculator className="w-5 h-5" />,
      description: 'Calculate complete ownership costs',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
            <input
              type="number"
              value={tco.purchasePrice}
              onChange={(e) => setTco({ ...tco, purchasePrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 35000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
            <input
              type="number"
              value={tco.downPayment}
              onChange={(e) => setTco({ ...tco, downPayment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 7000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Miles</label>
            <input
              type="number"
              value={tco.annualMiles}
              onChange={(e) => setTco({ ...tco, annualMiles: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 12000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Efficiency (MPG)</label>
            <input
              type="number"
              value={tco.mpg}
              onChange={(e) => setTco({ ...tco, mpg: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Years</label>
            <input
              type="number"
              value={tco.ownershipYears}
              onChange={(e) => setTco({ ...tco, ownershipYears: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 5"
            />
          </div>
          <button
            onClick={calculateTCO}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Calculate
          </button>
          {tcoResult && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Results</h4>
              <p className="text-sm text-red-700 font-bold">Total Cost: ${tcoResult.total_cost}</p>
              <p className="text-sm text-red-700">Monthly Average: ${tcoResult.monthly_average}</p>
              <p className="text-sm text-red-700">Cost per Mile: ${tcoResult.cost_per_mile}</p>
              <p className="text-sm text-red-700">Loan Cost: ${tcoResult.total_loan_cost}</p>
              <p className="text-sm text-red-700">Fuel Cost: ${tcoResult.total_fuel_cost}</p>
              <p className="text-sm text-red-700">Insurance Cost: ${tcoResult.total_insurance_cost}</p>
              <p className="text-sm text-red-700">Maintenance Cost: ${tcoResult.total_maintenance_cost}</p>
              <p className="text-sm text-red-700">Depreciation: ${tcoResult.depreciation}</p>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Car className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vehicle Calculators</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Make smart vehicle decisions with our comprehensive calculators. Calculate loan payments, compare leasing vs buying, 
            estimate fuel costs, and determine the total cost of ownership.
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
                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
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
            💡 These calculators are provided for informational purposes only. Consult with a financial advisor for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCalculators;
