import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api';

const calculatorAPI = {
  // Business Calculators
  breakEven: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/business/break-even`, data);
      return response.data;
    } catch (error) {
      console.error('Break-even calculator error:', error);
      // Fallback to client-side calculation
      return calculateBreakEvenClient(data);
    }
  },

  roe: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/business/roe`, data);
      return response.data;
    } catch (error) {
      console.error('ROE calculator error:', error);
      return calculateROEClient(data);
    }
  },

  operatingMargin: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/business/operating-margin`, data);
      return response.data;
    } catch (error) {
      console.error('Operating margin calculator error:', error);
      return calculateOperatingMarginClient(data);
    }
  },

  grossMargin: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/business/gross-margin`, data);
      return response.data;
    } catch (error) {
      console.error('Gross margin calculator error:', error);
      return calculateGrossMarginClient(data);
    }
  },

  businessValuation: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/business/valuation`, data);
      return response.data;
    } catch (error) {
      console.error('Business valuation calculator error:', error);
      return calculateBusinessValuationClient(data);
    }
  },

  vat: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/business/vat`, data);
      return response.data;
    } catch (error) {
      console.error('VAT calculator error:', error);
      return calculateVATClient(data);
    }
  },

  fcff: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/business/fcff`, data);
      return response.data;
    } catch (error) {
      console.error('FCFF calculator error:', error);
      return calculateFCFFClient(data);
    }
  },

  // Real Estate Calculators
  mortgage: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/real-estate/mortgage`, data);
      return response.data;
    } catch (error) {
      console.error('Mortgage calculator error:', error);
      return calculateMortgageClient(data);
    }
  },

  affordability: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/real-estate/affordability`, data);
      return response.data;
    } catch (error) {
      console.error('Affordability calculator error:', error);
      return calculateAffordabilityClient(data);
    }
  },

  roi: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/real-estate/roi`, data);
      return response.data;
    } catch (error) {
      console.error('ROI calculator error:', error);
      return calculateROIClient(data);
    }
  },

  rentVsBuy: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/real-estate/rent-vs-buy`, data);
      return response.data;
    } catch (error) {
      console.error('Rent vs buy calculator error:', error);
      return calculateRentVsBuyClient(data);
    }
  },

  propertyTax: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/real-estate/property-tax`, data);
      return response.data;
    } catch (error) {
      console.error('Property tax calculator error:', error);
      return calculatePropertyTaxClient(data);
    }
  },

  closingCosts: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/real-estate/closing-costs`, data);
      return response.data;
    } catch (error) {
      console.error('Closing costs calculator error:', error);
      return calculateClosingCostsClient(data);
    }
  },

  // Vehicle Calculators
  autoLoan: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/vehicle/auto-loan`, data);
      return response.data;
    } catch (error) {
      console.error('Auto loan calculator error:', error);
      return calculateAutoLoanClient(data);
    }
  },

  leaseVsBuy: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/vehicle/lease-vs-buy`, data);
      return response.data;
    } catch (error) {
      console.error('Lease vs buy calculator error:', error);
      return calculateLeaseVsBuyClient(data);
    }
  },

  depreciation: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/vehicle/depreciation`, data);
      return response.data;
    } catch (error) {
      console.error('Depreciation calculator error:', error);
      return calculateDepreciationClient(data);
    }
  },

  fuelCost: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/vehicle/fuel-cost`, data);
      return response.data;
    } catch (error) {
      console.error('Fuel cost calculator error:', error);
      return calculateFuelCostClient(data);
    }
  },

  insurance: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/vehicle/insurance`, data);
      return response.data;
    } catch (error) {
      console.error('Insurance calculator error:', error);
      return calculateInsuranceClient(data);
    }
  },

  tco: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculators/vehicle/tco`, data);
      return response.data;
    } catch (error) {
      console.error('TCO calculator error:', error);
      return calculateTCOClient(data);
    }
  }
};

// Client-side fallback calculations
const calculateBreakEvenClient = (data) => {
  const fixedCosts = parseFloat(data.fixed_costs);
  const variableCost = parseFloat(data.variable_cost_per_unit);
  const price = parseFloat(data.price_per_unit);
  const units = fixedCosts / (price - variableCost);
  const revenue = units * price;
  return { data: { units: units.toFixed(2), revenue: revenue.toFixed(2) } };
};

const calculateROEClient = (data) => {
  const netIncome = parseFloat(data.net_income);
  const totalAssets = parseFloat(data.total_assets);
  const totalEquity = parseFloat(data.total_equity);
  const revenue = parseFloat(data.revenue);
  const profitMargin = (netIncome / revenue) * 100;
  const assetTurnover = revenue / totalAssets;
  const financialLeverage = totalAssets / totalEquity;
  const roe = profitMargin * assetTurnover * financialLeverage;
  return { data: { profit_margin: profitMargin.toFixed(2), asset_turnover: assetTurnover.toFixed(2), financial_leverage: financialLeverage.toFixed(2), roe: roe.toFixed(2) } };
};

const calculateOperatingMarginClient = (data) => {
  const operatingIncome = parseFloat(data.operating_income);
  const revenue = parseFloat(data.revenue);
  const margin = (operatingIncome / revenue) * 100;
  return { data: { margin: margin.toFixed(2) } };
};

const calculateGrossMarginClient = (data) => {
  const revenue = parseFloat(data.revenue);
  const cogs = parseFloat(data.cost_of_goods_sold);
  const grossProfit = revenue - cogs;
  const margin = (grossProfit / revenue) * 100;
  const markup = (grossProfit / cogs) * 100;
  return { data: { gross_profit: grossProfit.toFixed(2), margin: margin.toFixed(2), markup: markup.toFixed(2) } };
};

const calculateBusinessValuationClient = (data) => {
  const fcf = parseFloat(data.free_cash_flow);
  const growthRate = parseFloat(data.growth_rate) / 100;
  const discountRate = parseFloat(data.discount_rate) / 100;
  const terminalGrowthRate = parseFloat(data.terminal_growth_rate) / 100;
  const years = parseInt(data.years);
  let presentValue = 0;
  let projectedFCF = fcf;

  for (let i = 1; i <= years; i++) {
    projectedFCF *= (1 + growthRate);
    presentValue += projectedFCF / Math.pow(1 + discountRate, i);
  }

  const terminalValue = (projectedFCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
  const terminalValuePV = terminalValue / Math.pow(1 + discountRate, years);
  const totalValue = presentValue + terminalValuePV;
  return { data: { present_value: presentValue.toFixed(2), terminal_value: terminalValue.toFixed(2), terminal_value_pv: terminalValuePV.toFixed(2), total_value: totalValue.toFixed(2) } };
};

const calculateVATClient = (data) => {
  const amount = parseFloat(data.amount);
  const rate = parseFloat(data.vat_rate) / 100;
  if (data.calculation_type === 'add') {
    const vatAmount = amount * rate;
    const total = amount + vatAmount;
    return { data: { net_amount: amount.toFixed(2), vat_amount: vatAmount.toFixed(2), total: total.toFixed(2) } };
  } else {
    const netAmount = amount / (1 + rate);
    const vatAmount = amount - netAmount;
    return { data: { gross_amount: amount.toFixed(2), vat_amount: vatAmount.toFixed(2), net_amount: netAmount.toFixed(2) } };
  }
};

const calculateFCFFClient = (data) => {
  const ebit = parseFloat(data.ebit);
  const taxRate = parseFloat(data.tax_rate) / 100;
  const depreciation = parseFloat(data.depreciation);
  const capex = parseFloat(data.capital_expenditure);
  const changeWC = parseFloat(data.change_in_working_capital);
  const nopat = ebit * (1 - taxRate);
  const fcffValue = nopat + depreciation - capex - changeWC;
  return { data: { nopat: nopat.toFixed(2), fcff: fcffValue.toFixed(2) } };
};

const calculateMortgageClient = (data) => {
  const principal = parseFloat(data.principal) - parseFloat(data.down_payment || 0);
  const annualRate = parseFloat(data.interest_rate) / 100;
  const monthlyRate = annualRate / 12;
  const numberOfPayments = parseFloat(data.loan_term) * 12;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - principal;
  return { data: { monthly_payment: monthlyPayment.toFixed(2), total_payment: totalPayment.toFixed(2), total_interest: totalInterest.toFixed(2), principal: principal.toFixed(2) } };
};

const calculateAffordabilityClient = (data) => {
  const annualIncome = parseFloat(data.annual_income);
  const monthlyDebt = parseFloat(data.monthly_debt);
  const downPayment = parseFloat(data.down_payment);
  const annualRate = parseFloat(data.interest_rate) / 100;
  const monthlyRate = annualRate / 12;
  const numberOfPayments = parseFloat(data.loan_term) * 12;
  const monthlyIncome = annualIncome / 12;
  const maxDTI = 0.36;
  const maxMonthlyPayment = (monthlyIncome * maxDTI) - monthlyDebt;
  const maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
  const maxHomePrice = maxLoanAmount + downPayment;
  return { data: { max_monthly_payment: maxMonthlyPayment.toFixed(2), max_loan_amount: maxLoanAmount.toFixed(2), max_home_price: maxHomePrice.toFixed(2) } };
};

const calculateROIClient = (data) => {
  const purchasePrice = parseFloat(data.purchase_price);
  const monthlyRent = parseFloat(data.monthly_rent);
  const annualExpenses = parseFloat(data.expenses) * 12;
  const downPayment = parseFloat(data.down_payment);
  const annualRent = monthlyRent * 12;
  const annualCashFlow = annualRent - annualExpenses;
  const cashOnCashROI = (annualCashFlow / downPayment) * 100;
  const capRate = (annualCashFlow / purchasePrice) * 100;
  return { data: { annual_rent: annualRent.toFixed(2), annual_cash_flow: annualCashFlow.toFixed(2), cash_on_cash_roi: cashOnCashROI.toFixed(2), cap_rate: capRate.toFixed(2) } };
};

const calculateRentVsBuyClient = (data) => {
  const homePrice = parseFloat(data.home_price);
  const monthlyRent = parseFloat(data.monthly_rent);
  const downPayment = parseFloat(data.down_payment);
  const interestRate = parseFloat(data.interest_rate) / 100;
  const propertyTaxRate = parseFloat(data.property_tax_rate) / 100;
  const appreciationRate = parseFloat(data.appreciation_rate) / 100;
  const rentIncreaseRate = parseFloat(data.rent_increase_rate) / 100;
  const years = parseFloat(data.years);
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 12;
  const numberOfPayments = years * 12;
  const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const monthlyPropertyTax = (homePrice * propertyTaxRate) / 12;
  const monthlyBuyingCost = monthlyMortgage + monthlyPropertyTax;
  let totalRentCost = 0;
  let totalBuyCost = downPayment;
  let currentRent = monthlyRent;
  let currentHomeValue = homePrice;

  for (let i = 0; i < years; i++) {
    totalRentCost += currentRent * 12;
    totalBuyCost += (monthlyMortgage + monthlyPropertyTax) * 12;
    currentRent *= (1 + rentIncreaseRate);
    currentHomeValue *= (1 + appreciationRate);
  }

  const homeEquity = currentHomeValue - (loanAmount - downPayment);
  const netBuyCost = totalBuyCost - homeEquity;
  return { data: { monthly_buying_cost: monthlyBuyingCost.toFixed(2), total_rent_cost: totalRentCost.toFixed(2), total_buy_cost: totalBuyCost.toFixed(2), home_equity: homeEquity.toFixed(2), net_buy_cost: netBuyCost.toFixed(2), recommendation: totalRentCost < netBuyCost ? 'Renting is better' : 'Buying is better' } };
};

const calculatePropertyTaxClient = (data) => {
  const propertyValue = parseFloat(data.property_value);
  const taxRate = parseFloat(data.tax_rate) / 100;
  const annualTax = propertyValue * taxRate;
  const monthlyTax = annualTax / 12;
  return { data: { annual_tax: annualTax.toFixed(2), monthly_tax: monthlyTax.toFixed(2) } };
};

const calculateClosingCostsClient = (data) => {
  const homePrice = parseFloat(data.home_price);
  const loanAmount = parseFloat(data.loan_amount);
  const originationFee = parseFloat(data.origination_fee) / 100;
  const titleInsurance = parseFloat(data.title_insurance) / 100;
  const appraisalFee = parseFloat(data.appraisal_fee);
  const attorneyFee = parseFloat(data.attorney_fee);
  const otherFees = parseFloat(data.other_fees);
  const originationFeeAmount = loanAmount * originationFee;
  const titleInsuranceAmount = homePrice * titleInsurance;
  const totalClosingCosts = originationFeeAmount + titleInsuranceAmount + appraisalFee + attorneyFee + otherFees;
  return { data: { origination_fee: originationFeeAmount.toFixed(2), title_insurance: titleInsuranceAmount.toFixed(2), appraisal_fee: appraisalFee.toFixed(2), attorney_fee: attorneyFee.toFixed(2), other_fees: otherFees.toFixed(2), total_closing_costs: totalClosingCosts.toFixed(2), percentage_of_price: ((totalClosingCosts / homePrice) * 100).toFixed(2) } };
};

const calculateAutoLoanClient = (data) => {
  const principal = parseFloat(data.vehicle_price) - parseFloat(data.down_payment || 0);
  const annualRate = parseFloat(data.interest_rate) / 100;
  const monthlyRate = annualRate / 12;
  const numberOfPayments = parseFloat(data.loan_term);
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - principal;
  return { data: { monthly_payment: monthlyPayment.toFixed(2), total_payment: totalPayment.toFixed(2), total_interest: totalInterest.toFixed(2), principal: principal.toFixed(2) } };
};

const calculateLeaseVsBuyClient = (data) => {
  const vehiclePrice = parseFloat(data.vehicle_price);
  const downPayment = parseFloat(data.down_payment);
  const residualValuePercent = parseFloat(data.residual_value) / 100;
  const leaseTerm = parseFloat(data.lease_term);
  const moneyFactor = parseFloat(data.money_factor);
  const loanInterestRate = parseFloat(data.loan_interest_rate) / 100;
  const loanTerm = parseFloat(data.loan_term);
  const residualValue = vehiclePrice * residualValuePercent;
  const depreciation = (vehiclePrice - residualValue) / leaseTerm;
  const rentCharge = (vehiclePrice + residualValue) * moneyFactor;
  const leasePayment = depreciation + rentCharge;
  const totalLeaseCost = (leasePayment * leaseTerm) + downPayment;
  const loanAmount = vehiclePrice - downPayment;
  const monthlyRate = loanInterestRate / 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  const totalBuyCost = (monthlyPayment * loanTerm) + downPayment;
  return { data: { lease_payment: leasePayment.toFixed(2), total_lease_cost: totalLeaseCost.toFixed(2), buy_payment: monthlyPayment.toFixed(2), total_buy_cost: totalBuyCost.toFixed(2), monthly_difference: (monthlyPayment - leasePayment).toFixed(2), recommendation: totalLeaseCost < totalBuyCost ? 'Leasing is better' : 'Buying is better' } };
};

const calculateDepreciationClient = (data) => {
  const purchasePrice = parseFloat(data.purchase_price);
  const years = parseFloat(data.years);
  const depreciationRate = parseFloat(data.depreciation_rate) / 100;
  let currentValue = purchasePrice;
  const yearlyValues = [];

  for (let i = 1; i <= years; i++) {
    currentValue = currentValue * (1 - depreciationRate);
    yearlyValues.push({ year: i, value: currentValue.toFixed(2), depreciated: (purchasePrice - currentValue).toFixed(2) });
  }
  return { data: { yearly_values: yearlyValues, final_value: currentValue.toFixed(2), total_depreciation: (purchasePrice - currentValue).toFixed(2) } };
};

const calculateFuelCostClient = (data) => {
  const distance = parseFloat(data.distance);
  const mpg = parseFloat(data.mpg);
  const fuelPrice = parseFloat(data.fuel_price);
  const gallonsNeeded = distance / mpg;
  const totalCost = gallonsNeeded * fuelPrice;
  const costPerMile = totalCost / distance;
  return { data: { gallons_needed: gallonsNeeded.toFixed(2), total_cost: totalCost.toFixed(2), cost_per_mile: costPerMile.toFixed(3) } };
};

const calculateInsuranceClient = (data) => {
  const vehicleValue = parseFloat(data.vehicle_value);
  const driverAge = parseFloat(data.driver_age);
  const drivingRecord = data.driving_record;
  const coverageLevel = data.coverage_level;
  let baseRate = vehicleValue * 0.03;

  if (driverAge < 25) baseRate *= 1.5;
  else if (driverAge >= 65) baseRate *= 1.2;

  if (drivingRecord === 'clean') baseRate *= 1;
  else if (drivingRecord === 'minor') baseRate *= 1.3;
  else if (drivingRecord === 'major') baseRate *= 1.8;

  if (coverageLevel === 'liability') baseRate *= 0.6;
  else if (coverageLevel === 'full') baseRate *= 1;
  else if (coverageLevel === 'premium') baseRate *= 1.4;

  const monthlyPremium = baseRate / 12;
  const annualPremium = baseRate;
  return { data: { monthly_premium: monthlyPremium.toFixed(2), annual_premium: annualPremium.toFixed(2) } };
};

const calculateTCOClient = (data) => {
  const purchasePrice = parseFloat(data.purchase_price);
  const downPayment = parseFloat(data.down_payment);
  const loanInterestRate = parseFloat(data.loan_interest_rate) / 100;
  const loanTerm = parseFloat(data.loan_term);
  const annualMiles = parseFloat(data.annual_miles);
  const mpg = parseFloat(data.mpg);
  const fuelPrice = parseFloat(data.fuel_price);
  const insuranceMonthly = parseFloat(data.insurance_monthly);
  const maintenanceAnnual = parseFloat(data.maintenance_annual);
  const ownershipYears = parseFloat(data.ownership_years);

  const loanAmount = purchasePrice - downPayment;
  const monthlyRate = loanInterestRate / 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  const totalLoanCost = monthlyPayment * loanTerm;
  const totalMiles = annualMiles * ownershipYears;
  const totalGallons = totalMiles / mpg;
  const totalFuelCost = totalGallons * fuelPrice;
  const totalInsuranceCost = insuranceMonthly * 12 * ownershipYears;
  const totalMaintenanceCost = maintenanceAnnual * ownershipYears;

  let depreciation = 0;
  let currentValue = purchasePrice;
  for (let i = 0; i < ownershipYears; i++) {
    const yearlyDep = currentValue * 0.15;
    depreciation += yearlyDep;
    currentValue -= yearlyDep;
  }

  const totalCost = downPayment + totalLoanCost + totalFuelCost + totalInsuranceCost + totalMaintenanceCost + depreciation;
  const monthlyAverage = totalCost / (ownershipYears * 12);
  const costPerMile = totalCost / totalMiles;
  return { data: { down_payment: downPayment.toFixed(2), total_loan_cost: totalLoanCost.toFixed(2), total_fuel_cost: totalFuelCost.toFixed(2), total_insurance_cost: totalInsuranceCost.toFixed(2), total_maintenance_cost: totalMaintenanceCost.toFixed(2), depreciation: depreciation.toFixed(2), total_cost: totalCost.toFixed(2), monthly_average: monthlyAverage.toFixed(2), cost_per_mile: costPerMile.toFixed(2) } };
};

export default calculatorAPI;
