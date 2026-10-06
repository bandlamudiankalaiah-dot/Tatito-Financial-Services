import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

export const WalletModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, addFunds, withdrawFunds } = useApp();
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState<number>(10000);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const quickAmounts = [5000, 10000, 25000, 50000, 100000];

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (mode === 'deposit') {
        addFunds(amount);
        setSuccessMsg(`₹${amount.toLocaleString('en-IN')} added to your wallet!`);
      } else {
        const ok = withdrawFunds(amount);
        if (ok) {
          setSuccessMsg(`₹${amount.toLocaleString('en-IN')} transferred to ${user.bankAccount.bankName}!`);
        }
      }
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">Tatito Digital Wallet</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="text-xs text-slate-500">Available Balance</div>
          <div className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">
            ₹{user.walletBalance.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>Linked to: {user.bankAccount.bankName} (A/C: ••••{user.bankAccount.accountNumber.slice(-4)})</span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setMode('deposit')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              mode === 'deposit'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            Add Funds
          </button>
          <button
            onClick={() => setMode('withdraw')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              mode === 'withdraw'
                ? 'border-blue-600 text-blue-700 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
            Withdraw to Bank
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAction} className="p-6 space-y-4">
          {successMsg ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Enter Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    min={100}
                    max={mode === 'withdraw' ? user.walletBalance : 500000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg font-mono-numbers text-base font-semibold outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Quick Pills */}
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((q) => (
                  <button
                    type="button"
                    key={q}
                    onClick={() => setAmount(q)}
                    className="px-2.5 py-1 text-xs font-mono-numbers bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    +₹{q.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {mode === 'deposit' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                        paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      Instant UPI
                      <div className="text-[10px] text-slate-500 font-normal">GPay, PhonePe, Paytm</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                        paymentMethod === 'netbanking' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      Net Banking
                      <div className="text-[10px] text-slate-500 font-normal">HDFC, ICICI, SBI</div>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || (mode === 'withdraw' && amount > user.walletBalance)}
                className={`w-full py-2.5 px-4 text-white font-medium text-sm rounded-lg transition-colors ${
                  mode === 'deposit' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                } disabled:bg-slate-300`}
              >
                {isProcessing
                  ? 'Processing via NPCI...'
                  : mode === 'deposit'
                  ? `Deposit ₹${amount.toLocaleString('en-IN')}`
                  : `Transfer ₹${amount.toLocaleString('en-IN')} to Bank`}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
