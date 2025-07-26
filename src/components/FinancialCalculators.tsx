import React, { useState, useCallback } from 'react';
import { Calculator, TrendingUp, PiggyBank, Calendar, DollarSign, Percent, Target, CreditCard, Building, Coins, ArrowUpDown, BarChart3 } from 'lucide-react';

interface CalculatorResult {
  monthlyPayment?: number;
  totalAmount?: number;
  totalInterest?: number;
  maturityAmount?: number;
  monthlyWithdrawal?: number;
  taxSavings?: number;
  realReturns?: number;
  futureValue?: number;
  presentValue?: number;
}

const FinancialCalculators: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState('emi');
  const [results, setResults] = useState<CalculatorResult>({});

  // EMI Calculator
  const [emiInputs, setEmiInputs] = useState({
    principal: '',
    rate: '',
    tenure: ''
  });

  // SIP Calculator
  const [sipInputs, setSipInputs] = useState({
    monthlyAmount: '',
    expectedReturn: '',
    timePeriod: '',
    inflation: ''
  });

  // SWP Calculator
  const [swpInputs, setSwpInputs] = useState({
    investment: '',
    withdrawalAmount: '',
    expectedReturn: '',
    timePeriod: ''
  });

  // STP Calculator
  const [stpInputs, setStpInputs] = useState({
    totalInvestment: '',
    monthlyTransfer: '',
    debtReturn: '',
    equityReturn: '',
    timePeriod: ''
  });

  // PPF Calculator
  const [ppfInputs, setPpfInputs] = useState({
    yearlyInvestment: '',
    timePeriod: '',
    currentAge: ''
  });

  // FD Calculator
  const [fdInputs, setFdInputs] = useState({
    principal: '',
    rate: '',
    tenure: '',
    compoundingFrequency: '4'
  });

  // NPS Calculator
  const [npsInputs, setNpsInputs] = useState({
    monthlyContribution: '',
    currentAge: '',
    retirementAge: '',
    expectedReturn: '',
    annuityReturn: ''
  });

  // Inflation Calculator
  const [inflationInputs, setInflationInputs] = useState({
    currentAmount: '',
    inflationRate: '',
    years: ''
  });

  // Goal Planning Calculator
  const [goalInputs, setGoalInputs] = useState({
    targetAmount: '',
    currentSavings: '',
    timeToGoal: '',
    expectedReturn: ''
  });

  // Tax Calculator
  const [taxInputs, setTaxInputs] = useState({
    annualIncome: '',
    investments80C: '',
    otherDeductions: '',
    regime: 'old'
  });

  const calculateEMI = useCallback(() => {
    const P = parseFloat(emiInputs.principal);
    const r = parseFloat(emiInputs.rate) / 12 / 100;
    const n = parseFloat(emiInputs.tenure) * 12;

    if (P && r && n) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - P;

      setResults({
        monthlyPayment: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest)
      });
    }
  }, [emiInputs]);

  const calculateSIP = useCallback(() => {
    const P = parseFloat(sipInputs.monthlyAmount);
    const r = parseFloat(sipInputs.expectedReturn) / 12 / 100;
    const n = parseFloat(sipInputs.timePeriod) * 12;
    const inflation = parseFloat(sipInputs.inflation) / 100;

    if (P && r && n) {
      const maturityAmount = P * (((Math.pow(1 + r, n)) - 1) / r) * (1 + r);
      const totalInvestment = P * n;
      const totalReturns = maturityAmount - totalInvestment;
      
      // Real returns after inflation
      const realReturns = maturityAmount / Math.pow(1 + inflation, parseFloat(sipInputs.timePeriod));

      setResults({
        maturityAmount: Math.round(maturityAmount),
        totalAmount: Math.round(totalInvestment),
        totalInterest: Math.round(totalReturns),
        realReturns: Math.round(realReturns)
      });
    }
  }, [sipInputs]);

  const calculateSWP = useCallback(() => {
    const investment = parseFloat(swpInputs.investment);
    const withdrawal = parseFloat(swpInputs.withdrawalAmount);
    const rate = parseFloat(swpInputs.expectedReturn) / 12 / 100;
    const months = parseFloat(swpInputs.timePeriod) * 12;

    if (investment && withdrawal && rate && months) {
      let balance = investment;
      let totalWithdrawn = 0;

      for (let i = 0; i < months; i++) {
        balance = balance * (1 + rate) - withdrawal;
        totalWithdrawn += withdrawal;
        if (balance <= 0) break;
      }

      setResults({
        monthlyWithdrawal: withdrawal,
        totalAmount: Math.round(totalWithdrawn),
        maturityAmount: Math.round(Math.max(0, balance))
      });
    }
  }, [swpInputs]);

  const calculateSTP = useCallback(() => {
    const totalInv = parseFloat(stpInputs.totalInvestment);
    const monthlyTransfer = parseFloat(stpInputs.monthlyTransfer);
    const debtReturn = parseFloat(stpInputs.debtReturn) / 12 / 100;
    const equityReturn = parseFloat(stpInputs.equityReturn) / 12 / 100;
    const months = parseFloat(stpInputs.timePeriod) * 12;

    if (totalInv && monthlyTransfer && debtReturn && equityReturn && months) {
      let debtBalance = totalInv;
      let equityBalance = 0;

      for (let i = 0; i < months; i++) {
        debtBalance = debtBalance * (1 + debtReturn) - monthlyTransfer;
        equityBalance = equityBalance * (1 + equityReturn) + monthlyTransfer;
        if (debtBalance <= 0) break;
      }

      const totalValue = Math.max(0, debtBalance) + equityBalance;

      setResults({
        maturityAmount: Math.round(totalValue),
        totalAmount: Math.round(equityBalance),
        totalInterest: Math.round(Math.max(0, debtBalance))
      });
    }
  }, [stpInputs]);

  const calculatePPF = useCallback(() => {
    const yearlyInv = parseFloat(ppfInputs.yearlyInvestment);
    const years = parseFloat(ppfInputs.timePeriod);
    const rate = 7.1 / 100; // Current PPF rate

    if (yearlyInv && years) {
      const maturityAmount = yearlyInv * (((Math.pow(1 + rate, years)) - 1) / rate) * (1 + rate);
      const totalInvestment = yearlyInv * years;
      const totalReturns = maturityAmount - totalInvestment;

      // Tax savings (80C benefit)
      const taxSavings = Math.min(yearlyInv, 150000) * 0.3; // Assuming 30% tax bracket

      setResults({
        maturityAmount: Math.round(maturityAmount),
        totalAmount: Math.round(totalInvestment),
        totalInterest: Math.round(totalReturns),
        taxSavings: Math.round(taxSavings)
      });
    }
  }, [ppfInputs]);

  const calculateFD = useCallback(() => {
    const P = parseFloat(fdInputs.principal);
    const r = parseFloat(fdInputs.rate) / 100;
    const t = parseFloat(fdInputs.tenure);
    const n = parseFloat(fdInputs.compoundingFrequency);

    if (P && r && t && n) {
      const maturityAmount = P * Math.pow(1 + r / n, n * t);
      const totalInterest = maturityAmount - P;

      setResults({
        maturityAmount: Math.round(maturityAmount),
        totalAmount: Math.round(P),
        totalInterest: Math.round(totalInterest)
      });
    }
  }, [fdInputs]);

  const calculateNPS = useCallback(() => {
    const monthlyContrib = parseFloat(npsInputs.monthlyContribution);
    const currentAge = parseFloat(npsInputs.currentAge);
    const retirementAge = parseFloat(npsInputs.retirementAge);
    const expectedReturn = parseFloat(npsInputs.expectedReturn) / 12 / 100;
    const annuityReturn = parseFloat(npsInputs.annuityReturn) / 12 / 100;

    if (monthlyContrib && currentAge && retirementAge && expectedReturn) {
      const years = retirementAge - currentAge;
      const months = years * 12;
      
      const corpusAtRetirement = monthlyContrib * (((Math.pow(1 + expectedReturn, months)) - 1) / expectedReturn) * (1 + expectedReturn);
      
      // 40% compulsory annuity, 60% lump sum
      const annuityAmount = corpusAtRetirement * 0.4;
      const lumpSum = corpusAtRetirement * 0.6;
      
      // Monthly pension calculation
      const monthlyPension = annuityAmount * annuityReturn;

      setResults({
        maturityAmount: Math.round(corpusAtRetirement),
        totalAmount: Math.round(lumpSum),
        monthlyWithdrawal: Math.round(monthlyPension),
        totalInterest: Math.round(monthlyContrib * months)
      });
    }
  }, [npsInputs]);

  const calculateInflation = useCallback(() => {
    const currentAmount = parseFloat(inflationInputs.currentAmount);
    const inflationRate = parseFloat(inflationInputs.inflationRate) / 100;
    const years = parseFloat(inflationInputs.years);

    if (currentAmount && inflationRate && years) {
      const futureValue = currentAmount * Math.pow(1 + inflationRate, years);
      const presentValue = currentAmount / Math.pow(1 + inflationRate, years);

      setResults({
        futureValue: Math.round(futureValue),
        presentValue: Math.round(presentValue)
      });
    }
  }, [inflationInputs]);

  const calculateGoal = useCallback(() => {
    const targetAmount = parseFloat(goalInputs.targetAmount);
    const currentSavings = parseFloat(goalInputs.currentSavings);
    const timeToGoal = parseFloat(goalInputs.timeToGoal);
    const expectedReturn = parseFloat(goalInputs.expectedReturn) / 12 / 100;

    if (targetAmount && timeToGoal && expectedReturn) {
      const months = timeToGoal * 12;
      const futureValueOfCurrent = currentSavings * Math.pow(1 + expectedReturn, months);
      const remainingAmount = targetAmount - futureValueOfCurrent;
      
      const monthlyInvestment = remainingAmount / (((Math.pow(1 + expectedReturn, months)) - 1) / expectedReturn);

      setResults({
        monthlyPayment: Math.round(Math.max(0, monthlyInvestment)),
        futureValue: Math.round(futureValueOfCurrent),
        totalAmount: Math.round(remainingAmount)
      });
    }
  }, [goalInputs]);

  const calculateTax = useCallback(() => {
    const income = parseFloat(taxInputs.annualIncome);
    const investments80C = Math.min(parseFloat(taxInputs.investments80C) || 0, 150000);
    const otherDeductions = parseFloat(taxInputs.otherDeductions) || 0;

    if (income) {
      let taxableIncome = income;
      let tax = 0;

      if (taxInputs.regime === 'old') {
        // Old regime with deductions
        taxableIncome = income - investments80C - otherDeductions - 50000; // Standard deduction
        
        if (taxableIncome <= 250000) tax = 0;
        else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
        else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
        else tax = 112500 + (taxableIncome - 1000000) * 0.3;
      } else {
        // New regime without deductions
        taxableIncome = income - 50000; // Standard deduction only
        
        if (taxableIncome <= 300000) tax = 0;
        else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
        else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
        else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
        else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
        else tax = 150000 + (taxableIncome - 1500000) * 0.3;
      }

      // Add cess
      tax = tax * 1.04;

      const taxSavings = taxInputs.regime === 'old' ? investments80C * 0.3 : 0;

      setResults({
        totalAmount: Math.round(tax),
        taxSavings: Math.round(taxSavings),
        totalInterest: Math.round(income - tax)
      });
    }
  }, [taxInputs]);

  const calculators = [
    { id: 'emi', name: 'EMI Calculator', icon: CreditCard, description: 'Calculate loan EMI' },
    { id: 'sip', name: 'SIP Calculator', icon: TrendingUp, description: 'Systematic Investment Plan' },
    { id: 'swp', name: 'SWP Calculator', icon: ArrowUpDown, description: 'Systematic Withdrawal Plan' },
    { id: 'stp', name: 'STP Calculator', icon: BarChart3, description: 'Systematic Transfer Plan' },
    { id: 'ppf', name: 'PPF Calculator', icon: PiggyBank, description: 'Public Provident Fund' },
    { id: 'fd', name: 'FD Calculator', icon: Building, description: 'Fixed Deposit Calculator' },
    { id: 'nps', name: 'NPS Calculator', icon: Target, description: 'National Pension System' },
    { id: 'inflation', name: 'Inflation Calculator', icon: Percent, description: 'Inflation Impact Calculator' },
    { id: 'goal', name: 'Goal Planning', icon: Target, description: 'Financial Goal Planning' },
    { id: 'tax', name: 'Tax Calculator', icon: Coins, description: 'Income Tax Calculator' }
  ];

  const renderCalculatorForm = () => {
    switch (activeCalculator) {
      case 'emi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
              <input
                type="number"
                value={emiInputs.principal}
                onChange={(e) => setEmiInputs({ ...emiInputs, principal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 1000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% per annum)</label>
              <input
                type="number"
                step="0.1"
                value={emiInputs.rate}
                onChange={(e) => setEmiInputs({ ...emiInputs, rate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 8.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Tenure (Years)</label>
              <input
                type="number"
                value={emiInputs.tenure}
                onChange={(e) => setEmiInputs({ ...emiInputs, tenure: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 20"
              />
            </div>
            <button
              onClick={calculateEMI}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
            >
              Calculate EMI
            </button>
            {results.monthlyPayment && (
              <div className="mt-4 p-4 bg-orange-50 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">EMI Calculation Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly EMI:</span>
                    <span className="font-semibold">₹{results.monthlyPayment?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount Payable:</span>
                    <span className="font-semibold">₹{results.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Interest:</span>
                    <span className="font-semibold">₹{results.totalInterest?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'sip':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Investment (₹)</label>
              <input
                type="number"
                value={sipInputs.monthlyAmount}
                onChange={(e) => setSipInputs({ ...sipInputs, monthlyAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return (% per annum)</label>
              <input
                type="number"
                step="0.1"
                value={sipInputs.expectedReturn}
                onChange={(e) => setSipInputs({ ...sipInputs, expectedReturn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Period (Years)</label>
              <input
                type="number"
                value={sipInputs.timePeriod}
                onChange={(e) => setSipInputs({ ...sipInputs, timePeriod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Inflation (% per annum)</label>
              <input
                type="number"
                step="0.1"
                value={sipInputs.inflation}
                onChange={(e) => setSipInputs({ ...sipInputs, inflation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 6"
              />
            </div>
            <button
              onClick={calculateSIP}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
            >
              Calculate SIP
            </button>
            {results.maturityAmount && (
              <div className="mt-4 p-4 bg-orange-50 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">SIP Calculation Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Maturity Amount:</span>
                    <span className="font-semibold">₹{results.maturityAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Investment:</span>
                    <span className="font-semibold">₹{results.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Returns:</span>
                    <span className="font-semibold">₹{results.totalInterest?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Real Value (After Inflation):</span>
                    <span className="font-semibold">₹{results.realReturns?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'ppf':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Investment (₹)</label>
              <input
                type="number"
                value={ppfInputs.yearlyInvestment}
                onChange={(e) => setPpfInputs({ ...ppfInputs, yearlyInvestment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 150000 (Max limit)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Period (Years)</label>
              <input
                type="number"
                value={ppfInputs.timePeriod}
                onChange={(e) => setPpfInputs({ ...ppfInputs, timePeriod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 15 (Minimum)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Age</label>
              <input
                type="number"
                value={ppfInputs.currentAge}
                onChange={(e) => setPpfInputs({ ...ppfInputs, currentAge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 30"
              />
            </div>
            <button
              onClick={calculatePPF}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
            >
              Calculate PPF
            </button>
            {results.maturityAmount && (
              <div className="mt-4 p-4 bg-orange-50 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">PPF Calculation Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Maturity Amount:</span>
                    <span className="font-semibold">₹{results.maturityAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Investment:</span>
                    <span className="font-semibold">₹{results.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Returns:</span>
                    <span className="font-semibold">₹{results.totalInterest?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Tax Savings:</span>
                    <span className="font-semibold">₹{results.taxSavings?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  * Current PPF rate: 7.1% per annum
                  <br />
                  * Tax-free returns under EEE category
                </div>
              </div>
            )}
          </div>
        );

      case 'fd':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount (₹)</label>
              <input
                type="number"
                value={fdInputs.principal}
                onChange={(e) => setFdInputs({ ...fdInputs, principal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% per annum)</label>
              <input
                type="number"
                step="0.1"
                value={fdInputs.rate}
                onChange={(e) => setFdInputs({ ...fdInputs, rate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 6.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (Years)</label>
              <input
                type="number"
                step="0.1"
                value={fdInputs.tenure}
                onChange={(e) => setFdInputs({ ...fdInputs, tenure: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compounding Frequency</label>
              <select
                value={fdInputs.compoundingFrequency}
                onChange={(e) => setFdInputs({ ...fdInputs, compoundingFrequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="1">Annually</option>
                <option value="2">Half-Yearly</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
              </select>
            </div>
            <button
              onClick={calculateFD}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
            >
              Calculate FD
            </button>
            {results.maturityAmount && (
              <div className="mt-4 p-4 bg-orange-50 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">FD Calculation Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Maturity Amount:</span>
                    <span className="font-semibold">₹{results.maturityAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Principal Amount:</span>
                    <span className="font-semibold">₹{results.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Earned:</span>
                    <span className="font-semibold">₹{results.totalInterest?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  * Interest is taxable as per your income tax slab
                </div>
              </div>
            )}
          </div>
        );

      case 'nps':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution (₹)</label>
              <input
                type="number"
                value={npsInputs.monthlyContribution}
                onChange={(e) => setNpsInputs({ ...npsInputs, monthlyContribution: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Age</label>
              <input
                type="number"
                value={npsInputs.currentAge}
                onChange={(e) => setNpsInputs({ ...npsInputs, currentAge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Age</label>
              <input
                type="number"
                value={npsInputs.retirementAge}
                onChange={(e) => setNpsInputs({ ...npsInputs, retirementAge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return (% per annum)</label>
              <input
                type="number"
                step="0.1"
                value={npsInputs.expectedReturn}
                onChange={(e) => setNpsInputs({ ...npsInputs, expectedReturn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annuity Return (% per annum)</label>
              <input
                type="number"
                step="0.1"
                value={npsInputs.annuityReturn}
                onChange={(e) => setNpsInputs({ ...npsInputs, annuityReturn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 6"
              />
            </div>
            <button
              onClick={calculateNPS}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
            >
              Calculate NPS
            </button>
            {results.maturityAmount && (
              <div className="mt-4 p-4 bg-orange-50 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">NPS Calculation Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Corpus at Retirement:</span>
                    <span className="font-semibold">₹{results.maturityAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lump Sum (60%):</span>
                    <span className="font-semibold">₹{results.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Pension:</span>
                    <span className="font-semibold">₹{results.monthlyWithdrawal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Investment:</span>
                    <span className="font-semibold">₹{results.totalInterest?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  * 40% corpus compulsory for annuity purchase
                  <br />
                  * Tax benefits under Section 80CCD
                </div>
              </div>
            )}
          </div>
        );

      case 'inflation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount (₹)</label>
              <input
                type="number"
                value={inflationInputs.currentAmount}
                onChange={(e) => setInflationInputs({ ...inflationInputs, currentAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inflation Rate (% per annum)</label>
              <input
                type="number"
                step="0.1"
                value={inflationInputs.inflationRate}
                onChange={(e) => setInflationInputs({ ...inflationInputs, inflationRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Years</label>
              <input
                type="number"
                value={inflationInputs.years}
                onChange={(e) => setInflationInputs({ ...inflationInputs, years: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 10"
              />
            </div>
            <button
              onClick={calculateInflation}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
            >
              Calculate Inflation Impact
            </button>
            {results.futureValue && (
              <div className="mt-4 p-4 bg-orange-50 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">Inflation Impact Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Future Value:</span>
                    <span className="font-semibold">₹{results.futureValue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Present Value:</span>
                    <span className="font-semibold">₹{results.presentValue?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  * Future value shows what today's amount will be worth in future
                  <br />
                  * Present value shows today's purchasing power of future amount
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>Select a calculator to get started</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Calculators</h1>
        <p className="text-gray-600">Plan your financial future with accurate calculations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calculator Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Calculator</h2>
            <div className="space-y-2">
              {calculators.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <button
                    key={calc.id}
                    onClick={() => setActiveCalculator(calc.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      activeCalculator === calc.id
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{calc.name}</div>
                        <div className="text-xs text-gray-500">{calc.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calculator className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                {calculators.find(c => c.id === activeCalculator)?.name}
              </h2>
            </div>
            
            {renderCalculatorForm()}
          </div>
        </div>
      </div>

      {/* Financial Tips */}
      <div className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Financial Planning Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Emergency Fund</h4>
            <p className="text-gray-600">Maintain 6-12 months of expenses in liquid funds for emergencies.</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Diversification</h4>
            <p className="text-gray-600">Don't put all eggs in one basket. Diversify across asset classes.</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Start Early</h4>
            <p className="text-gray-600">The power of compounding works best when you start investing early.</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Tax Planning</h4>
            <p className="text-gray-600">Use tax-saving instruments like PPF, ELSS, and NPS effectively.</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Inflation Protection</h4>
            <p className="text-gray-600">Ensure your investments beat inflation to maintain purchasing power.</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Regular Review</h4>
            <p className="text-gray-600">Review and rebalance your portfolio annually or when life changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCalculators;