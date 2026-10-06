import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  CreditCard, 
  Building, 
  PieChart, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  ChevronRight, 
  Calendar,
  Sparkles
} from 'lucide-react';

export const CustomerDashboard: React.FC<{
  onOpenLoanApply: () => void;
  onOpenLoanDetails: (loanId: string) => void;
  onOpenWallet: () => void;
}> = ({ onOpenLoanApply, onOpenLoanDetails, onOpenWallet }) => {
  const { 
    user, 
    applications, 
    holdings, 
    stocks, 
    activeSips, 
    setActiveTab, 
    setIsKycModalOpen 
  } = useApp();

  // Financial calculations
  const totalStockValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalStockInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalStockPnl = totalStockValue - totalStockInvested;

  const totalSipInvested = activeSips.reduce((sum, s) => sum + s.totalInvested, 0);
  const totalInvestments = totalStockValue + totalSipInvested;
  
  const activeLoans = applications.filter(a => a.status === 'active');
  const totalOutstandingLoan = activeLoans.reduce((sum, a) => sum + a.outstandingPrincipal, 0);
  
  const netWorth = totalInvestments + user.walletBalance - totalOutstandingLoan;

  // Next due EMI
  const nextDueLoan = activeLoans.find(a => a.emiSchedule.some(e => e.status === 'due' || e.status === 'upcoming'));
  const nextEmiItem = nextDueLoan?.emiSchedule.find(e => e.status === 'due') || nextDueLoan?.emiSchedule.find(e => e.status === 'upcoming');

  return (
    <div className="space-y-8">
      {/* Hero Financial Overview Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-1">
              <span>Namaste, {user.fullName}</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">CIBIL {user.cibilScore} (Prime)</span>
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Net Portfolio Position</div>
            <div className="text-3xl sm:text-4xl font-bold font-mono-numbers mt-1 flex items-baseline gap-2">
              <span>₹{netWorth.toLocaleString('en-IN')}</span>
              <span className="text-xs font-normal text-slate-400">Total Net Worth</span>
            </div>

            {/* Micro Breakdown */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Investments: <strong className="font-mono-numbers text-white">₹{totalInvestments.toLocaleString('en-IN')}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Wallet Cash: <strong className="font-mono-numbers text-white">₹{user.walletBalance.toLocaleString('en-IN')}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>Debt: <strong className="font-mono-numbers text-white">₹{totalOutstandingLoan.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
            <button
              onClick={onOpenLoanApply}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <CreditCard className="w-4 h-4" />
              Apply for Loan
            </button>
            <button
              onClick={() => setActiveTab('stocks')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Trade Stocks
            </button>
            <button
              onClick={onOpenWallet}
              className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Money
            </button>
          </div>
        </div>

        {/* Decorative backdrop mesh */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <img
            src="/src/assets/images/tatito_hero_banner_1791280484411.jpg"
            alt="Tatito Finance"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>

      {/* Main Grid: Active Loans & Investments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Loans & EMI servicing (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Loans Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Active NBFC Loans & Credit Lines</h2>
                <p className="text-xs text-slate-500 mt-0.5">Flexible EMI servicing, part-payment, and instant foreclosure</p>
              </div>
              <button
                onClick={() => setActiveTab('loans')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                All Products <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeLoans.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl">
                <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">You have no active loans right now.</p>
                <p className="text-xs text-slate-400 mt-1">Pre-approved limits available up to ₹25 Lakhs at 8.50% p.a.</p>
                <button
                  onClick={onOpenLoanApply}
                  className="mt-3 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                >
                  Explore Loan Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeLoans.map((loan) => {
                  const paidEmis = loan.emiSchedule.filter(e => e.status === 'paid').length;
                  const totalEmis = loan.emiSchedule.length;
                  const progressPct = totalEmis > 0 ? (paidEmis / totalEmis) * 100 : 0;
                  const currentDue = loan.emiSchedule.find(e => e.status === 'due');

                  return (
                    <div
                      key={loan.id}
                      className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{loan.productName}</span>
                            <span className="text-xs font-mono text-slate-500">#{loan.id}</span>
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-sm">
                              Active
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                            <span>Rate: <strong className="text-slate-800">{loan.interestRate}% p.a.</strong></span>
                            <span>·</span>
                            <span>Mode: <strong className="text-slate-800">{loan.loanMode === 'secured_collateral' ? 'Secured' : 'Unsecured'}</strong></span>
                            <span>·</span>
                            <span>Disbursed: <strong className="text-slate-800">{loan.disbursementDate}</strong></span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-slate-500">Monthly EMI</div>
                          <div className="text-base font-bold font-mono-numbers text-slate-900">
                            ₹{loan.monthlyEmi.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Repayment Progress ({paidEmis} of {totalEmis} EMIs Paid)</span>
                          <span className="font-mono-numbers font-medium text-slate-700">
                            Balance: ₹{loan.outstandingPrincipal.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                        {currentDue ? (
                          <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <span>EMI Due: Due date {currentDue.dueDate}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>All current dues cleared</span>
                          </div>
                        )}

                        <button
                          onClick={() => onOpenLoanDetails(loan.id)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          Manage Loan & Pay EMI <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Holdings Portfolio Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Stock Holdings & Equity P&L</h2>
                <p className="text-xs text-slate-500 mt-0.5">Dematerialised holdings with CDSL BOID: {user.dematAccount.clientId}</p>
              </div>
              <button
                onClick={() => setActiveTab('stocks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Open Screener <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">Stock</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Avg Price</th>
                    <th className="py-2.5 px-3 text-right">LTP (₹)</th>
                    <th className="py-2.5 px-3 text-right">Current Value</th>
                    <th className="py-2.5 px-3 text-right">Total P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holdings.map((h) => {
                    const isProfit = h.pnl >= 0;
                    return (
                      <tr key={h.symbol} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{h.symbol}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{h.name}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono-numbers">{h.quantity}</td>
                        <td className="py-3 px-3 text-right font-mono-numbers text-slate-600">₹{h.avgBuyPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-mono-numbers font-semibold text-slate-900">₹{h.currentPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-mono-numbers font-semibold text-slate-900">₹{h.currentValue.toLocaleString('en-IN')}</td>
                        <td className={`py-3 px-3 text-right font-mono-numbers font-semibold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isProfit ? '+' : ''}₹{h.pnl.toLocaleString('en-IN')} ({isProfit ? '+' : ''}{h.pnlPercent}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Mutual Funds SIPs & Credit Profile (1 col) */}
        <div className="space-y-6">
          
          {/* Credit Bureau Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Credit Health</span>
              <span className="text-[10px] text-slate-500">TransUnion CIBIL</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-lg font-mono-numbers text-emerald-700 bg-emerald-50">
                {user.cibilScore}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Excellent Standing</div>
                <div className="text-xs text-slate-500">Qualifies for lowest NBFC borrowing rates (from 8.50%)</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-500 text-[11px]">DTI Ratio</span>
                <div className="font-bold text-slate-800 font-mono-numbers mt-0.5">26% (Safe)</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg">
                <span className="text-slate-500 text-[11px]">e-KYC Status</span>
                <div className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> DigiLocker
                </div>
              </div>
            </div>
          </div>

          {/* Active SIPs & Mandates */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Mutual Fund SIPs</h3>
                <p className="text-[11px] text-slate-500">Auto-debited via e-NACH</p>
              </div>
              <button
                onClick={() => setActiveTab('mutual_funds')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View Funds
              </button>
            </div>

            <div className="space-y-3">
              {activeSips.map((sip) => (
                <div key={sip.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-900 truncate">{sip.fundName}</div>
                  <div className="flex items-center justify-between mt-2 text-[11.5px]">
                    <span className="text-slate-500 font-mono-numbers">
                      ₹{sip.monthlyAmount.toLocaleString('en-IN')}/mo
                    </span>
                    <span className="text-slate-700 font-medium">
                      Debit on {sip.debitDate}th
                    </span>
                  </div>
                  <div className="mt-2 text-[10.5px] text-slate-400 flex items-center justify-between">
                    <span>Mandate: {sip.mandateId}</span>
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('mutual_funds')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
            >
              Start New SIP or Lump Sum
            </button>
          </div>

          {/* Quick Demat Snapshot */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Demat Account</div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-mono text-slate-200">{user.dematAccount.clientId}</div>
                <div className="text-[11px] text-slate-400">Depository: CDSL · DP ID: {user.dematAccount.dpId}</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-sm font-semibold uppercase">
                Active
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Nominee: {user.dematAccount.nominee}</span>
              <button
                onClick={() => setActiveTab('demat')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Demat Details →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
