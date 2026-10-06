import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, 
  CheckCircle2, 
  Copy, 
  FileText, 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  CreditCard,
  UserCheck,
  Download,
  AlertCircle
} from 'lucide-react';

export const DematHub: React.FC = () => {
  const { user, updateUser } = useApp();
  const [copied, setCopied] = useState(false);
  const [isNomineeEdit, setIsNomineeEdit] = useState(false);
  const [nomineeName, setNomineeName] = useState(user.dematAccount.nominee);

  const handleCopyClientId = () => {
    navigator.clipboard.writeText(user.dematAccount.clientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNominee = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      dematAccount: {
        ...user.dematAccount,
        nominee: nomineeName,
      },
    });
    setIsNomineeEdit(false);
  };

  const segments = [
    { name: 'NSE Equity (Cash)', status: 'Active', code: 'NSE_EQ' },
    { name: 'BSE Equity (Cash)', status: 'Active', code: 'BSE_EQ' },
    { name: 'NSE Equity Derivatives (F&O)', status: 'Active', code: 'NSE_FO' },
    { name: 'Mutual Funds (BSE Star MF / NSE NMF II)', status: 'Active', code: 'MF_PLATFORM' },
    { name: 'Sovereign Gold Bonds & T-Bills', status: 'Active', code: 'DEBT_GSEC' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Central Depository Services (India) Limited (CDSL) Partner DP</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Digital Demat & Trading Account</h1>
          <p className="text-xs text-slate-500 mt-0.5">Dematerialised safe-custody of Indian equities, ETFs, and debt instruments</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            DP Status: Active & Operational
          </span>
        </div>
      </div>

      {/* Main Credentials Card (Styled like premium Depository Pass) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">16-Digit Beneficial Owner ID (BOID / Client ID)</div>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-wider mt-1 flex items-center gap-3">
              <span>{user.dematAccount.clientId}</span>
              <button
                onClick={handleCopyClientId}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy BOID"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs font-sans text-emerald-400 font-semibold">Copied!</span>}
            </div>
          </div>

          <div className="sm:text-right">
            <div className="text-xs text-slate-400">Depository Participant</div>
            <div className="text-sm font-bold text-white mt-0.5">TATITO SECURITIES (IN300183)</div>
            <div className="text-[11px] text-slate-400">SEBI Reg: INZ000201834 · CDSL DP ID: {user.dematAccount.dpId}</div>
          </div>
        </div>

        {/* Demat Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-xs">
          <div>
            <span className="text-slate-400 text-[11px]">Primary Account Holder</span>
            <div className="font-bold text-slate-100 text-sm mt-0.5">{user.fullName}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">PAN Linked</span>
            <div className="font-mono font-bold text-slate-100 text-sm mt-0.5">{user.panNumber}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">Date of Account Opening</span>
            <div className="font-medium text-slate-100 text-sm mt-0.5">{user.dematAccount.openDate}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px]">DDPI / POA Status</span>
            <div className="font-medium text-emerald-400 text-sm mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stamp Signed
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Trading Segments & Nominee/Tariffs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trading Segments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Exchange Trading Enablement</h2>
            <p className="text-xs text-slate-500 mt-0.5">SEBI verified market access profiles linked with your Demat account</p>
          </div>

          <div className="space-y-3">
            {segments.map((seg) => (
              <div
                key={seg.code}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{seg.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{seg.code}</div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase rounded-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Enabled
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center justify-between">
            <span>Commodity MCX Segment</span>
            <button
              onClick={() => alert('Income proof (6-month bank statement) submitted for MCX enablement.')}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-[11px]"
            >
              Enable MCX
            </button>
          </div>
        </div>

        {/* Nominee & Brokerage Tariff Schedule */}
        <div className="space-y-6">
          {/* Nominee Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registered Nominee</h3>
                <p className="text-xs text-slate-500 mt-0.5">Statutory requirement per SEBI Circular 2023</p>
              </div>
              {!isNomineeEdit && (
                <button
                  onClick={() => setIsNomineeEdit(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Update Nominee
                </button>
              )}
            </div>

            {isNomineeEdit ? (
              <form onSubmit={handleSaveNominee} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominee Full Name & Relation</label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 text-white rounded font-semibold"
                  >
                    Save Nominee
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNomineeEdit(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900">{user.dematAccount.nominee}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Share: 100% · e-Sign OTP Verified</div>
                </div>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Valid
                </span>
              </div>
            )}
          </div>

          {/* Brokerage & AMC Tariff Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">Brokerage & Depository Charges</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600">Equity Delivery (CNC)</span>
                <span className="font-bold text-emerald-600">₹0 (Zero Brokerage)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600">Equity Intraday (MIS)</span>
                <span className="font-semibold text-slate-900">₹20 per executed order</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600">Annual Demat Maintenance (AMC)</span>
                <span className="font-semibold text-emerald-600">₹0 Lifetime Free</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600">CDSL Depository DP Charges</span>
                <span className="font-semibold text-slate-900">₹13.50 + GST per debit transaction</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
