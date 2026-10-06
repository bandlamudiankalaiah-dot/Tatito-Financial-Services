import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  Download, 
  ArrowRight,
  TrendingDown,
  Building,
  RefreshCw
} from 'lucide-react';

export const LoanDetailsModal: React.FC<{
  loanId: string | null;
  onClose: () => void;
}> = ({ loanId, onClose }) => {
  const { 
    applications, 
    payEmi, 
    makePartPayment, 
    forecloseLoan, 
    user 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'schedule' | 'pay' | 'part_payment' | 'foreclose' | 'noc'>('schedule');
  const [selectedEmiNo, setSelectedEmiNo] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking'>('upi');
  const [partAmount, setPartAmount] = useState<number>(50000);
  const [partOption, setPartOption] = useState<'reduce_tenure' | 'reduce_emi'>('reduce_tenure');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  if (!loanId) return null;
  const loan = applications.find(a => a.id === loanId);
  if (!loan) return null;

  const dueEmi = loan.emiSchedule.find(e => e.status === 'due') || loan.emiSchedule.find(e => e.status === 'upcoming');

  const handlePayEmi = (emiNo: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      payEmi(loan.id, emiNo, paymentMethod);
      setIsProcessing(false);
      setSuccessNotice(`EMI #${emiNo} payment of ₹${loan.monthlyEmi.toLocaleString('en-IN')} confirmed!`);
      setTimeout(() => {
        setSuccessNotice('');
        setActiveTab('schedule');
      }, 1200);
    }, 700);
  };

  const handlePartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (partAmount <= 0 || partAmount > loan.outstandingPrincipal) return;
    setIsProcessing(true);
    setTimeout(() => {
      makePartPayment(loan.id, partAmount, partOption);
      setIsProcessing(false);
      setSuccessNotice(`Part payment of ₹${partAmount.toLocaleString('en-IN')} applied! Outstanding principal reduced.`);
      setTimeout(() => {
        setSuccessNotice('');
        setActiveTab('schedule');
      }, 1200);
    }, 800);
  };

  const handleForeclosure = () => {
    if (!confirm(`Are you sure you want to foreclose Loan #${loan.id} by paying the full outstanding amount of ₹${loan.outstandingPrincipal.toLocaleString('en-IN')}?`)) return;
    setIsProcessing(true);
    setTimeout(() => {
      forecloseLoan(loan.id);
      setIsProcessing(false);
      setSuccessNotice(`Loan #${loan.id} foreclosed successfully! No Objection Certificate generated.`);
      setActiveTab('noc');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">{loan.productName}</span>
              <span className="text-xs font-mono text-slate-400">#{loan.id}</span>
              <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm ${
                loan.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                loan.status === 'closed' ? 'bg-slate-700 text-slate-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {loan.status}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Sanction: ₹{loan.amountRequested.toLocaleString('en-IN')} · Rate: {loan.interestRate}% p.a. · Mode: {loan.loanMode === 'secured_collateral' ? 'Secured' : 'Unsecured'}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'schedule' ? 'border-blue-600 text-blue-900 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Amortisation Schedule ({loan.emiSchedule.length} EMIs)
          </button>

          {loan.status === 'active' && (
            <>
              <button
                onClick={() => setActiveTab('pay')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'pay' ? 'border-blue-600 text-blue-900 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Pay EMI Online
              </button>
              <button
                onClick={() => setActiveTab('part_payment')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'part_payment' ? 'border-blue-600 text-blue-900 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Part-Payment
              </button>
              <button
                onClick={() => setActiveTab('foreclose')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'foreclose' ? 'border-rose-600 text-rose-900 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Foreclose Loan
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('noc')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'noc' ? 'border-emerald-600 text-emerald-900 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            NOC & Documents
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {successNotice && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successNotice}</span>
            </div>
          )}

          {/* TAB 1: Amortisation Schedule */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">Outstanding Principal</span>
                  <div className="font-bold font-mono-numbers text-base text-slate-900 mt-0.5">
                    ₹{loan.outstandingPrincipal.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Total Paid So Far</span>
                  <div className="font-bold font-mono-numbers text-base text-emerald-700 mt-0.5">
                    ₹{loan.totalPaid.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Monthly EMI</span>
                  <div className="font-bold font-mono-numbers text-base text-slate-900 mt-0.5">
                    ₹{loan.monthlyEmi.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Auto-Debit Bank</span>
                  <div className="font-semibold text-slate-800 truncate mt-0.5">
                    {user.bankAccount.bankName}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3 text-right">EMI Amount</th>
                      <th className="py-2.5 px-3 text-right">Principal</th>
                      <th className="py-2.5 px-3 text-right">Interest</th>
                      <th className="py-2.5 px-3 text-right">Closing Balance</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loan.emiSchedule.map((item) => (
                      <tr key={item.emiNumber} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-500">{item.emiNumber}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.dueDate}</td>
                        <td className="py-2.5 px-3 text-right font-mono-numbers font-bold text-slate-900">
                          ₹{item.emiAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono-numbers text-slate-600">
                          ₹{item.principalComponent.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono-numbers text-slate-600">
                          ₹{item.interestComponent.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono-numbers text-slate-700">
                          ₹{item.balancePrincipal.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase ${
                            item.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                            item.status === 'due' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {item.status !== 'paid' && loan.status === 'active' ? (
                            <button
                              onClick={() => {
                                setSelectedEmiNo(item.emiNumber);
                                setActiveTab('pay');
                              }}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold"
                            >
                              Pay
                            </button>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400">
                              {item.transactionRef || 'Cleared'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Pay EMI Online */}
          {activeTab === 'pay' && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">EMI to Pay:</span>
                  <span className="font-semibold text-slate-900">EMI #{selectedEmiNo || dueEmi?.emiNumber || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Due Amount:</span>
                  <span className="font-bold font-mono-numbers text-base text-slate-900">₹{loan.monthlyEmi.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="text-slate-800">M/s. Tatito Projects NBFC Collection A/C</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Payment Channel</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200'
                    }`}
                  >
                    UPI Payment
                    <div className="text-[10px] text-slate-500 font-normal">GPay, PhonePe, Paytm QR</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      paymentMethod === 'netbanking' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200'
                    }`}
                  >
                    Internet Banking
                    <div className="text-[10px] text-slate-500 font-normal">HDFC, ICICI, SBI, Axis</div>
                  </button>
                </div>
              </div>

              <button
                onClick={() => handlePayEmi(selectedEmiNo || dueEmi?.emiNumber || 1)}
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>Pay ₹{loan.monthlyEmi.toLocaleString('en-IN')} Now</>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: Part-Payment */}
          {activeTab === 'part_payment' && (
            <form onSubmit={handlePartPayment} className="max-w-md mx-auto space-y-4 text-xs">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
                <div className="font-bold">Part-Prepayment Facility</div>
                <div className="text-[11.5px] text-blue-800">
                  Reduce your interest burden by making an unscheduled principal payment. As per RBI, no penalty is levied.
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Part-Payment Amount (₹)</label>
                <input
                  type="number"
                  min={10000}
                  max={loan.outstandingPrincipal - 10000}
                  step={5000}
                  value={partAmount}
                  onChange={(e) => setPartAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono-numbers text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10.5px] text-slate-400">Max permissible: ₹{(loan.outstandingPrincipal - 10000).toLocaleString('en-IN')}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">How would you like to apply the reduction?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPartOption('reduce_tenure')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      partOption === 'reduce_tenure' ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold' : 'border-slate-200'
                    }`}
                  >
                    Reduce Tenure
                    <div className="text-[10px] text-slate-500 font-normal">Keep EMI same, finish early</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartOption('reduce_emi')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      partOption === 'reduce_emi' ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold' : 'border-slate-200'
                    }`}
                  >
                    Reduce Monthly EMI
                    <div className="text-[10px] text-slate-500 font-normal">Keep tenure, lower monthly outgo</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors"
              >
                {isProcessing ? 'Processing Part-Payment...' : `Pay ₹${partAmount.toLocaleString('en-IN')} Part-Payment`}
              </button>
            </form>
          )}

          {/* TAB 4: Foreclose Loan */}
          {activeTab === 'foreclose' && (
            <div className="max-w-md mx-auto space-y-4 text-xs">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-900">
                <div className="font-bold">Full Loan Foreclosure & Settlement</div>
                <div className="text-[11.5px] text-rose-800">
                  Pay off your entire outstanding loan balance in a single transaction. Your e-NACH auto-debit will be cancelled immediately and an official No Objection Certificate (NOC) will be generated.
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Outstanding Balance:</span>
                  <span className="font-bold font-mono-numbers text-slate-900">₹{loan.outstandingPrincipal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Foreclosure Charges:</span>
                  <span className="font-semibold text-emerald-600">₹0 (NIL per RBI guidelines)</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                  <span>Net Settlement Amount:</span>
                  <span className="font-mono-numbers text-slate-900">₹{loan.outstandingPrincipal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleForeclosure}
                disabled={isProcessing}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors"
              >
                {isProcessing ? 'Settling Loan Account...' : `Settle & Foreclose (₹${loan.outstandingPrincipal.toLocaleString('en-IN')})`}
              </button>
            </div>
          )}

          {/* TAB 5: NOC & Documents */}
          {activeTab === 'noc' && (
            <div className="space-y-4 text-xs">
              <div className="border border-slate-300 rounded-xl p-6 bg-slate-50 space-y-4">
                <div className="text-center border-b border-slate-300 pb-4">
                  <div className="font-bold text-slate-900 text-sm uppercase">M/S. TATITO PROJECTS PRIVATE LIMITED</div>
                  <div className="text-[11px] text-slate-500">Regd. Office: Plot 88, Financial District, Hyderabad · CIN: U65922TG2022PTC160412</div>
                  <div className="text-xs font-bold text-blue-900 mt-2">
                    {loan.status === 'closed' ? 'NO OBJECTION CERTIFICATE (NOC) / LOAN CLOSURE CERTIFICATE' : 'LOAN SANCTION & REPAYMENT SUMMARY'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500">Borrower:</span>
                    <div className="font-bold text-slate-900">{loan.applicantName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Loan Account No:</span>
                    <div className="font-mono font-bold text-slate-900">{loan.id}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Sanctioned Principal:</span>
                    <div className="font-mono text-slate-900 font-semibold">₹{loan.amountRequested.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Account Status:</span>
                    <div className="font-bold text-slate-900 uppercase">{loan.status}</div>
                  </div>
                </div>

                <p className="text-[11.5px] text-slate-600 leading-relaxed pt-2 border-t border-slate-200">
                  {loan.status === 'closed' ? (
                    <>
                      This is to certify that Loan Account #{loan.id} stands completely repaid and closed in our books. No dues or encumbrances remain outstanding against the borrower. Any collateral liens or hypothecation recorded have been released.
                    </>
                  ) : (
                    <>
                      This certificate summarizes the active debt exposure under Sanction #{loan.sanctionLetterNo || loan.id}. Total repayments made to date amount to ₹{loan.totalPaid.toLocaleString('en-IN')}.
                    </>
                  )}
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200 text-[11px] text-slate-500">
                  <div>Digital Sign: Authorised Signatory, Credit Operations, Tatito NBFC</div>
                  <button
                    onClick={() => alert(`Downloaded Official Certificate for ${loan.id} (PDF signed by Tatito NBFC)`)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF Certificate
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
