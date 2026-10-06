import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoanProduct, LoanMode, LoanApplication } from '../../types';
import { 
  CreditCard, 
  ShieldCheck, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Building, 
  Car, 
  Home, 
  MapPin, 
  Briefcase, 
  Coins, 
  Lock, 
  Check, 
  AlertCircle,
  Clock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const LoansHub: React.FC<{
  onOpenLoanDetails: (loanId: string) => void;
  openApplyDefault?: boolean;
}> = ({ onOpenLoanDetails, openApplyDefault = false }) => {
  const { 
    products, 
    applications, 
    applyForLoan, 
    signLoanAgreement, 
    registerENachMandate, 
    disburseLoanAmount, 
    user 
  } = useApp();

  // Wizard state
  const [isApplying, setIsApplying] = useState(openApplyDefault);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct>(products[0]);
  const [loanMode, setLoanMode] = useState<LoanMode>('unsecured_interest_only');
  const [amount, setAmount] = useState<number>(300000);
  const [tenure, setTenure] = useState<number>(24);
  const [purpose, setPurpose] = useState('Personal financing & lifestyle upgrade');
  
  // Collateral / surety
  const [collateralType, setCollateralType] = useState('Fixed Deposit Lien');
  const [collateralDesc, setCollateralDesc] = useState('HDFC FD No: 910248102, Value: ₹5,00,000');
  const [collateralValue, setCollateralValue] = useState(500000);
  const [guarantorName, setGuarantorName] = useState('Rajesh Sharma');
  const [guarantorPhone, setGuarantorPhone] = useState('+91 98451 12389');

  // Multi-step journey
  const [applyStep, setApplyStep] = useState<number>(1);
  const [currentCreatedApp, setCurrentCreatedApp] = useState<LoanApplication | null>(null);

  // EMI calculator math
  const currentRate = loanMode === 'secured_collateral' ? selectedProduct.collateralRatePercent : selectedProduct.baseRatePercent;
  const monthlyRate = currentRate / 12 / 100;
  const monthlyEmi = Math.round(
    (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
  );
  const totalAmountPayable = monthlyEmi * tenure;
  const totalInterestPayable = totalAmountPayable - amount;
  const processingFee = Math.round((amount * selectedProduct.processingFeePercent) / 100);
  const gstOnFee = Math.round(processingFee * 0.18);

  const productIcons: Record<string, React.ReactNode> = {
    personal: <CreditCard className="w-5 h-5 text-blue-600" />,
    home: <Home className="w-5 h-5 text-emerald-600" />,
    vehicle: <Car className="w-5 h-5 text-amber-600" />,
    plot: <MapPin className="w-5 h-5 text-violet-600" />,
    business: <Briefcase className="w-5 h-5 text-rose-600" />,
    lap: <Building className="w-5 h-5 text-indigo-600" />,
    gold: <Coins className="w-5 h-5 text-yellow-600" />,
  };

  const handleSelectProduct = (prod: LoanProduct) => {
    setSelectedProduct(prod);
    setAmount(Math.max(prod.minAmount, Math.min(amount, prod.maxAmount)));
    setTenure(Math.max(prod.minTenureMonths, Math.min(tenure, prod.maxTenureMonths)));
  };

  const handleSubmitApplication = () => {
    const newApp = applyForLoan({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      loanMode,
      amountRequested: amount,
      tenureMonths: tenure,
      purpose,
      collateralDetails: loanMode === 'secured_collateral' ? {
        type: collateralType,
        description: collateralDesc,
        estimatedValue: collateralValue,
        suretyGuarantorName: guarantorName,
        suretyGuarantorPhone: guarantorPhone,
      } : undefined,
    });
    setCurrentCreatedApp(newApp);
    setApplyStep(2); // Go to Underwriting & Credit Bureau check
  };

  return (
    <div className="space-y-8">
      {/* Header & Mode Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>M/s. Tatito Projects NBFC Credit Origination System (LOS)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Borrow & Credit Solutions</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Choose between <strong>Interest-only (unsecured)</strong> for immediate liquidity or <strong>Collateral / Surety (secured)</strong> for our lowest interest rates.
          </p>
        </div>

        <button
          onClick={() => {
            setIsApplying(!isApplying);
            setApplyStep(1);
          }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start md:self-auto flex items-center gap-2"
        >
          {isApplying ? 'Close Application View' : 'Start New Loan Application'}
        </button>
      </div>

      {/* APPLICATION WIZARD (When triggered) */}
      {isApplying && (
        <div className="bg-white rounded-2xl border-2 border-blue-500/30 p-6 sm:p-8 shadow-xl">
          <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Digital Loan Origination & Disbursement</h2>
              <p className="text-xs text-slate-500">Step {applyStep} of 4: {
                applyStep === 1 ? 'Configure Product & Loan Mode' :
                applyStep === 2 ? 'Bureau Verification & Sanction Letter' :
                applyStep === 3 ? 'Aadhaar e-Sign Agreement' :
                'e-NACH Mandate & Instant Disbursement'
              }</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-mono-numbers">{applyStep}</span>
              <span className="text-slate-400">/ 4</span>
            </div>
          </div>

          {/* STEP 1: Product & Amount Config */}
          {applyStep === 1 && (
            <div className="space-y-6">
              {/* Product Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Loan Product</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {products.map((p) => {
                    const isSelected = selectedProduct.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProduct(p)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="mb-2">{productIcons[p.id]}</div>
                        <div className="font-bold text-xs text-slate-900 leading-tight">{p.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1">From {p.collateralRatePercent}%</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Loan Mode Segmented Control */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Loan Mode</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    onClick={() => setLoanMode('unsecured_interest_only')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      loanMode === 'unsecured_interest_only'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Interest-Only / Unsecured</span>
                      <span className="text-xs font-bold text-blue-700 font-mono-numbers">{selectedProduct.baseRatePercent}% p.a.</span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 mt-1">
                      No physical collateral required. Fast 10-minute automated bureau underwriting with instant digital sanction.
                    </p>
                  </div>

                  <div
                    onClick={() => setLoanMode('secured_collateral')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      loanMode === 'secured_collateral'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Collateral or Surety (Secured)</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono-numbers">{selectedProduct.collateralRatePercent}% p.a.</span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 mt-1">
                      Discounted interest rate. Backed by Property, Fixed Deposit, Gold, or co-borrower surety guarantor.
                    </p>
                  </div>
                </div>
              </div>

              {/* Collateral details if secured */}
              {loanMode === 'secured_collateral' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-slate-900">Secured Collateral / Surety Guarantor Details</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Collateral Asset Type</label>
                      <select
                        value={collateralType}
                        onChange={(e) => setCollateralType(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        {selectedProduct.eligibleCollaterals.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Estimated Asset Value (₹)</label>
                      <input
                        type="number"
                        value={collateralValue}
                        onChange={(e) => setCollateralValue(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono-numbers"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Surety Guarantor Name</label>
                      <input
                        type="text"
                        value={guarantorName}
                        onChange={(e) => setGuarantorName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Guarantor Mobile</label>
                      <input
                        type="tel"
                        value={guarantorPhone}
                        onChange={(e) => setGuarantorPhone(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sliders for Amount & Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Required Loan Amount</span>
                    <span className="font-bold font-mono-numbers text-slate-900 text-sm">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={selectedProduct.minAmount}
                    max={selectedProduct.maxAmount}
                    step={10000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹{selectedProduct.minAmount.toLocaleString('en-IN')}</span>
                    <span>₹{selectedProduct.maxAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Tenure (Months)</span>
                    <span className="font-bold font-mono-numbers text-slate-900 text-sm">{tenure} Months ({Math.round(tenure/12 * 10)/10} Yrs)</span>
                  </div>
                  <input
                    type="range"
                    min={selectedProduct.minTenureMonths}
                    max={selectedProduct.maxTenureMonths}
                    step={6}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>{selectedProduct.minTenureMonths} Mo</span>
                    <span>{selectedProduct.maxTenureMonths} Mo</span>
                  </div>
                </div>
              </div>

              {/* Calculated EMI Strip */}
              <div className="p-4 bg-blue-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-blue-200">Calculated Monthly EMI</div>
                  <div className="text-2xl font-bold font-mono-numbers">₹{monthlyEmi.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-blue-300 mt-0.5">
                    Interest Rate: {currentRate}% p.a. · Total Interest: ₹{totalInterestPayable.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
                >
                  Proceed to Sanction Desk <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Underwriting & Sanction Letter */}
          {applyStep === 2 && currentCreatedApp && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-900">Application #{currentCreatedApp.id} Created</div>
                  <div className="text-[11.5px] text-emerald-800">
                    CIBIL Score: <strong>{user.cibilScore}</strong> · DTI Ratio: <strong>26%</strong> · Risk Tier: <strong>AAA (Pre-Approved)</strong>
                  </div>
                </div>
              </div>

              {/* Official NBFC Key Fact Statement (KFS) Card */}
              <div className="border border-slate-300 rounded-xl p-5 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Key Fact Statement (KFS) & Sanction Offer</span>
                    <div className="text-[11px] text-slate-500">M/s. Tatito Projects Pvt Ltd (Regd NBFC)</div>
                  </div>
                  <div className="text-xs font-mono text-slate-600">{currentCreatedApp.sanctionLetterNo}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Sanctioned Amount</span>
                    <div className="font-bold font-mono-numbers text-slate-900 text-sm mt-0.5">
                      ₹{currentCreatedApp.amountRequested.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Interest Rate (Fixed)</span>
                    <div className="font-bold font-mono-numbers text-slate-900 text-sm mt-0.5">
                      {currentCreatedApp.interestRate}% p.a.
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Monthly EMI</span>
                    <div className="font-bold font-mono-numbers text-slate-900 text-sm mt-0.5">
                      ₹{currentCreatedApp.monthlyEmi.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Tenure</span>
                    <div className="font-bold font-mono-numbers text-slate-900 text-sm mt-0.5">
                      {currentCreatedApp.tenureMonths} Months
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>
                    Processing Fee: <strong>₹{processingFee.toLocaleString('en-IN')}</strong> + 18% GST (₹{gstOnFee})
                  </div>
                  <div>
                    Foreclosure Charges: <strong>NIL (0%)</strong> as per RBI guidelines
                  </div>
                  <div>
                    Disbursement Channel: <strong>Direct Bank NEFT / Wallet</strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyStep(3)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
                >
                  Accept Sanction & Proceed to e-Sign <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Digital e-Sign Agreement */}
          {applyStep === 3 && currentCreatedApp && (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Aadhaar e-Sign Loan Contract Agreement</span>
                </div>
                <div className="h-44 overflow-y-auto bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono leading-relaxed">
                  LOAN AGREEMENT EXECUTED BETWEEN M/S. TATITO PROJECTS (LENDER) AND {user.fullName.toUpperCase()} (BORROWER).
                  <br /><br />
                  1. PRINCIPAL SUM: The Lender agrees to lend the principal sum of ₹{currentCreatedApp.amountRequested.toLocaleString('en-IN')}.
                  <br />
                  2. REPAYMENT: Borrower shall repay in {currentCreatedApp.tenureMonths} consecutive monthly installments of ₹{currentCreatedApp.monthlyEmi.toLocaleString('en-IN')}.
                  <br />
                  3. CHARGES & APPLICABLE LAW: Contract governed by the laws of India and RBI NBFC Fair Practices Code.
                  <br />
                  4. SECURITY & HYPOTHECATION: Hypothecation / lien recorded on beneficiary bank mandate.
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" id="consent" defaultChecked className="accent-blue-600" />
                  <label htmlFor="consent">
                    I have read and consent to sign this digital contract using Aadhaar Electronic Signature.
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    signLoanAgreement(currentCreatedApp.id);
                    setApplyStep(4);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
                >
                  e-Sign Agreement with Aadhaar OTP <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: e-NACH Mandate & Disbursement */}
          {applyStep === 4 && currentCreatedApp && (
            <div className="space-y-6">
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                <div className="text-xs font-bold text-slate-900">National Automated Clearing House (e-NACH) Mandate</div>
                <p className="text-xs text-slate-600">
                  Authorize monthly auto-debit of ₹{currentCreatedApp.monthlyEmi.toLocaleString('en-IN')} on 5th of every month from:
                </p>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                  <div>Bank: <strong>{user.bankAccount.bankName}</strong></div>
                  <div>Account Number: <strong className="font-mono">••••{user.bankAccount.accountNumber.slice(-4)}</strong></div>
                  <div>IFSC: <strong className="font-mono">{user.bankAccount.ifsc}</strong></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> NPCI Digio Gateway Verified
                </div>

                <button
                  type="button"
                  onClick={() => {
                    registerENachMandate(currentCreatedApp.id);
                    disburseLoanAmount(currentCreatedApp.id);
                    setIsApplying(false);
                    onOpenLoanDetails(currentCreatedApp.id);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  Confirm Mandate & Disburse Loan Immediately! <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standalone Interactive EMI Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Interactive NBFC EMI & Amortisation Calculator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore monthly payment schedules across all retail and asset-backed categories</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            APR from {currentRate}%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Principal Loan Amount</span>
                <span className="font-bold font-mono-numbers text-base text-slate-900">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={25000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹50,000</span>
                <span>₹50,00,000 (₹50 Lakhs)</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Loan Tenure</span>
                <span className="font-bold font-mono-numbers text-base text-slate-900">{tenure} Months ({Math.round(tenure/12 * 10)/10} Years)</span>
              </div>
              <input
                type="range"
                min={12}
                max={120}
                step={6}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>12 Months</span>
                <span>120 Months (10 Years)</span>
              </div>
            </div>

            {/* Mode switch */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-slate-600">Pricing Mode:</span>
              <button
                type="button"
                onClick={() => setLoanMode('unsecured_interest_only')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  loanMode === 'unsecured_interest_only'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Unsecured ({selectedProduct.baseRatePercent}%)
              </button>
              <button
                type="button"
                onClick={() => setLoanMode('secured_collateral')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  loanMode === 'secured_collateral'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Secured Collateral ({selectedProduct.collateralRatePercent}%)
              </button>
            </div>
          </div>

          {/* Calculator Output summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs text-slate-500">Monthly EMI</div>
              <div className="text-3xl font-bold font-mono-numbers text-slate-900 mt-0.5">
                ₹{monthlyEmi.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Principal Amount:</span>
                <span className="font-mono-numbers font-semibold text-slate-900">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Interest Payable:</span>
                <span className="font-mono-numbers font-semibold text-slate-900">₹{totalInterestPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Payable (P+I):</span>
                <span className="font-mono-numbers font-bold text-slate-900">₹{totalAmountPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Est. Processing Fee:</span>
                <span className="font-mono-numbers text-slate-700">₹{processingFee.toLocaleString('en-IN')} + GST</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsApplying(true);
                setApplyStep(1);
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              Apply with this EMI <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Existing Loan Applications & Servicing Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">Your Loan Applications & History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5 px-3">Application ID</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3 text-right">Sanction Amount</th>
                <th className="py-2.5 px-3 text-right">Rate</th>
                <th className="py-2.5 px-3 text-right">Monthly EMI</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{app.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{app.productName}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{app.loanMode.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono-numbers font-semibold text-slate-900">
                    ₹{app.amountRequested.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono-numbers text-slate-600">{app.interestRate}%</td>
                  <td className="py-3 px-3 text-right font-mono-numbers font-semibold text-slate-900">
                    ₹{app.monthlyEmi.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase ${
                      app.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'underwriting' ? 'bg-amber-100 text-amber-800' :
                      app.status === 'sanctioned' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'closed' ? 'bg-slate-200 text-slate-700' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onOpenLoanDetails(app.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs transition-colors"
                    >
                      {app.status === 'active' ? 'Manage / Pay' : 'View Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
