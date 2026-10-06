import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MutualFund, ActiveSip } from '../../types';
import { 
  TrendingUp, 
  Calendar, 
  Sliders, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Play, 
  Pause, 
  Trash2, 
  ArrowRight, 
  Star,
  Award,
  Wallet
} from 'lucide-react';

export const MutualFundsHub: React.FC<{ onOpenWallet: () => void }> = ({ onOpenWallet }) => {
  const { 
    mutualFunds, 
    activeSips, 
    startSip, 
    investLumpSum, 
    toggleSipStatus, 
    cancelSip, 
    user 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'funds' | 'calculator' | 'sips'>('funds');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(null);
  
  // SIP modal
  const [isSipModalOpen, setIsSipModalOpen] = useState(false);
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [sipDate, setSipDate] = useState<number>(5);
  const [isLumpSum, setIsLumpSum] = useState<boolean>(false);
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(10000);

  // Standalone SIP calculator state
  const [calcMonthly, setCalcMonthly] = useState<number>(10000);
  const [calcRate, setCalcRate] = useState<number>(14);
  const [calcYears, setCalcYears] = useState<number>(10);

  // SIP Math calculation
  const totalMonths = calcYears * 12;
  const monthlyR = calcRate / 12 / 100;
  // FV = P * [ ((1 + r)^n - 1) / r ] * (1 + r)
  const maturityValue = Math.round(
    calcMonthly * ((Math.pow(1 + monthlyR, totalMonths) - 1) / monthlyR) * (1 + monthlyR)
  );
  const totalInvested = calcMonthly * totalMonths;
  const estimatedReturns = maturityValue - totalInvested;

  const categories = ['all', 'Large Cap', 'Flexi Cap', 'Mid Cap', 'Small Cap', 'ELSS Tax Saver', 'Debt & Liquid'];

  const filteredFunds = mutualFunds.filter((fund) => {
    return selectedCategory === 'all' || fund.category === selectedCategory;
  });

  const handleOpenInvest = (fund: MutualFund, lumpSum: boolean = false) => {
    setSelectedFund(fund);
    setIsLumpSum(lumpSum);
    setSipAmount(fund.minSipAmount);
    setLumpSumAmount(fund.minLumpSum);
    setIsSipModalOpen(true);
  };

  const handleExecuteInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFund) return;

    if (isLumpSum) {
      const ok = investLumpSum(selectedFund.id, lumpSumAmount);
      if (ok) {
        setIsSipModalOpen(false);
      }
    } else {
      startSip(selectedFund.id, sipAmount, sipDate);
      setIsSipModalOpen(false);
      setActiveTab('sips');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Award className="w-4 h-4 text-blue-600" />
            <span>AMFI Registered Mutual Fund Distributor ARN-249018</span>
            <span>·</span>
            <span>Zero Commission Direct Plans</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Mutual Funds & Wealth SIPs</h1>
          <p className="text-xs text-slate-500 mt-0.5">Automated wealth compounding via paperless e-mandates</p>
        </div>

        <button
          onClick={onOpenWallet}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Wallet className="w-3.5 h-3.5" />
          Wallet: ₹{user.walletBalance.toLocaleString('en-IN')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-6 pt-3">
        <button
          onClick={() => setActiveTab('funds')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'funds' ? 'border-blue-600 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Curated Funds Catalog ({mutualFunds.length})
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'calculator' ? 'border-blue-600 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          SIP Growth Calculator
        </button>
        <button
          onClick={() => setActiveTab('sips')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'sips' ? 'border-blue-600 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Active Auto-Debit SIPs ({activeSips.length})
        </button>
      </div>

      {/* TAB 1: FUNDS CATALOG */}
      {activeTab === 'funds' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          {/* Category filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat === 'all' ? 'All Schemes' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFunds.map((fund) => (
              <div
                key={fund.id}
                className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-blue-600">{fund.category}</span>
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: fund.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{fund.name}</h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">{fund.amc}</div>

                  <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">1Y Return</div>
                      <div className="font-bold font-mono-numbers text-emerald-600 mt-0.5">+{fund.returns1Y}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">3Y Return</div>
                      <div className="font-bold font-mono-numbers text-emerald-600 mt-0.5">+{fund.returns3Y}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">NAV (₹)</div>
                      <div className="font-bold font-mono-numbers text-slate-900 mt-0.5">₹{fund.nav.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>AUM: <strong className="text-slate-700">{fund.aum}</strong></span>
                    <span>Exp. Ratio: <strong className="text-slate-700">{fund.expenseRatio}%</strong></span>
                    <span>Min SIP: <strong className="text-slate-700">₹{fund.minSipAmount}</strong></span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenInvest(fund, false)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    Start SIP
                  </button>
                  <button
                    onClick={() => handleOpenInvest(fund, true)}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    Lump Sum
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SIP CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Systematic Investment Plan (SIP) Compounder
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Calculate how regular monthly contributions grow with compound interest over time</p>
              </div>

              {/* Monthly Contribution */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Monthly SIP Amount</span>
                  <span className="font-bold font-mono-numbers text-base text-slate-900">₹{calcMonthly.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={100000}
                  step={500}
                  value={calcMonthly}
                  onChange={(e) => setCalcMonthly(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹500 / mo</span>
                  <span>₹1,00,000 / mo</span>
                </div>
              </div>

              {/* Expected Return */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Expected Annual Return Rate (p.a.)</span>
                  <span className="font-bold font-mono-numbers text-base text-slate-900">{calcRate}%</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={25}
                  step={0.5}
                  value={calcRate}
                  onChange={(e) => setCalcRate(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>8% (Conservative)</span>
                  <span>25% (High Growth)</span>
                </div>
              </div>

              {/* Investment Horizon */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Time Horizon</span>
                  <span className="font-bold font-mono-numbers text-base text-slate-900">{calcYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={calcYears}
                  onChange={(e) => setCalcYears(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>

            {/* Results preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Projected Maturity Corpus</div>
                <div className="text-3xl font-bold font-mono-numbers text-slate-900 mt-1">
                  ₹{maturityValue.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-3 text-xs border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Invested Capital:</span>
                  <span className="font-bold font-mono-numbers text-slate-800">₹{totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Estimated Wealth Gain:</span>
                  <span className="font-bold font-mono-numbers text-emerald-600">+₹{estimatedReturns.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className="bg-slate-700 h-full"
                    style={{ width: `${(totalInvested / maturityValue) * 100}%` }}
                    title="Invested"
                  ></div>
                  <div
                    className="bg-emerald-500 h-full flex-1"
                    title="Returns"
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>■ Invested ({Math.round((totalInvested / maturityValue) * 100)}%)</span>
                  <span>■ Returns ({Math.round((estimatedReturns / maturityValue) * 100)}%)</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('funds')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                Pick a Fund & Start SIP <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVE SIPS */}
      {activeTab === 'sips' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="text-xs text-slate-500">Manage monthly recurring debits executed via registered bank mandates.</div>

          {activeSips.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <p className="text-xs">No active SIPs found.</p>
              <button
                onClick={() => setActiveTab('funds')}
                className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Browse Funds
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSips.map((sip) => (
                <div
                  key={sip.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{sip.fundName}</span>
                      <span className="text-xs font-mono text-slate-400">#{sip.id}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm ${
                        sip.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sip.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span>Monthly: <strong className="font-mono-numbers text-slate-800">₹{sip.monthlyAmount.toLocaleString('en-IN')}</strong></span>
                      <span>·</span>
                      <span>Next Debit: <strong className="text-slate-800">{sip.nextDebitDate}</strong></span>
                      <span>·</span>
                      <span>Mandate: <strong className="text-slate-700 font-mono">{sip.mandateId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSipStatus(sip.id)}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      {sip.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {sip.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => cancelSip(sip.id)}
                      className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INVEST MODAL (SIP / Lump Sum) */}
      {isSipModalOpen && selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">{isLumpSum ? 'Lump Sum Investment' : 'Start Monthly SIP'}</div>
                <div className="text-xs text-slate-400">{selectedFund.name}</div>
              </div>
              <button onClick={() => setIsSipModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteInvestment} className="p-6 space-y-4 text-xs">
              <div className="flex justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500">Current NAV</span>
                <span className="font-bold font-mono-numbers text-slate-900">₹{selectedFund.nav.toFixed(2)}</span>
              </div>

              {isLumpSum ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Investment Amount (₹)</label>
                  <input
                    type="number"
                    min={selectedFund.minLumpSum}
                    max={user.walletBalance}
                    step={1000}
                    value={lumpSumAmount}
                    onChange={(e) => setLumpSumAmount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono-numbers text-base font-bold outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">Min: ₹{selectedFund.minLumpSum.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monthly SIP Amount (₹)</label>
                    <input
                      type="number"
                      min={selectedFund.minSipAmount}
                      max={100000}
                      step={500}
                      value={sipAmount}
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg font-mono-numbers text-base font-bold outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">Min: ₹{selectedFund.minSipAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monthly Auto-Debit Day</label>
                    <select
                      value={sipDate}
                      onChange={(e) => setSipDate(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg font-medium"
                    >
                      {[1, 5, 10, 15, 20, 25].map((d) => (
                        <option key={d} value={d}>{d}th of every month</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
                <div className="font-bold">Auto-Debit Bank Mandate</div>
                <div className="text-[11px] text-blue-800">
                  Debits will be drawn from {user.bankAccount.bankName} (••••{user.bankAccount.accountNumber.slice(-4)})
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                {isLumpSum ? `Confirm Investment of ₹${lumpSumAmount.toLocaleString('en-IN')}` : `Activate Monthly SIP of ₹${sipAmount.toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
