import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Lock
} from 'lucide-react';

export const AdminMisDesk: React.FC = () => {
  const { products, applications, agentLeads, user } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'rates' | 'audit'>('overview');
  const [successRateNotice, setSuccessRateNotice] = useState('');

  // Computations
  const activeLoans = applications.filter(a => a.status === 'active');
  const totalLoanBookAUM = activeLoans.reduce((sum, a) => sum + a.outstandingPrincipal, 0);
  const totalDisbursedYTD = applications.reduce((sum, a) => sum + (a.status === 'active' || a.status === 'closed' ? a.amountRequested : 0), 0);
  const totalApplications = applications.length;
  const gnpaRatio = 0.42; // Gross NPA % (Industry prime benchmark < 1.5%)

  const auditLogs = [
    { id: 'LOG-881', event: 'Base Lending Rate Updated for Home Loan to 9.25%', user: 'Admin (System)', time: '10 mins ago', ip: '14.139.12.88' },
    { id: 'LOG-880', event: 'Disbursement of ₹3,00,000 for #TAT-LN-8812 authorized', user: 'Raghav Mehra (Credit Risk)', time: '1 hour ago', ip: '14.139.12.89' },
    { id: 'LOG-879', event: 'e-KYC verified for Ananya Sharma via UIDAI DigiLocker', user: 'Automated Gateway', time: '3 hours ago', ip: 'NPCI.DG.01' },
    { id: 'LOG-878', event: 'DSA Vikram Agency commission accrual processed (₹31,250)', user: 'Accounts Desk', time: '1 day ago', ip: '14.139.12.91' },
    { id: 'LOG-877', event: 'CDSL Demat DP Holding file sync completed successfully', user: 'CDSL Host 4', time: '1 day ago', ip: 'CDSL.GW.02' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>M/s. Tatito Projects Executive Management Console</span>
          </div>
          <h1 className="text-xl font-bold">NBFC Lending & Wealth MIS</h1>
          <p className="text-xs text-slate-400 mt-0.5">Asset Under Management (AUM), Capital Adequacy, and Risk Compliance</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 font-semibold">
            RBI Tier-2 NBFC Compliant
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-6 pt-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Executive MIS & Portfolio Risk
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'rates' ? 'border-blue-600 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Product & Interest Rate Engine
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'audit' ? 'border-blue-600 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Statutory Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW MIS */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500">Live Loan Book AUM</span>
              <div className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">
                ₹{totalLoanBookAUM.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{activeLoans.length} Active Accounts</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500">Disbursed Volume (FY26)</span>
              <div className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">
                ₹{totalDisbursedYTD.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">+28.4% QoQ Growth</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500">Gross NPA Ratio</span>
              <div className="text-2xl font-bold font-mono-numbers text-emerald-700 mt-1">
                {gnpaRatio}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">RBI Norm: Below 4.0%</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500">Capital Adequacy (CRAR)</span>
              <div className="text-2xl font-bold font-mono-numbers text-blue-700 mt-1">
                22.8%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Statutory Min: 15.0%</div>
            </div>
          </div>

          {/* Applications Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800">
              Active Lending Portfolio Summary
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Loan ID</th>
                  <th className="py-2.5 px-3">Borrower</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-right">Sanction Amount</th>
                  <th className="py-2.5 px-3 text-right">Outstanding</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Mandate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{app.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{app.applicantName}</td>
                    <td className="py-3 px-3 text-slate-700">{app.productName}</td>
                    <td className="py-3 px-3 text-right font-mono-numbers">₹{app.amountRequested.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-slate-900">
                      ₹{app.outstandingPrincipal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-100 text-slate-700">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 font-semibold">
                      {app.mandateStatus === 'registered' ? 'Active e-NACH' : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT & RATES CONFIG */}
      {activeTab === 'rates' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">NBFC Product & Pricing Matrix</h2>
              <p className="text-xs text-slate-500">Regulate base APR, secured discount rates, and processing fee tariffs</p>
            </div>
            {successRateNotice && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {successRateNotice}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => (
              <div key={prod.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{prod.name}</span>
                  <span className="text-slate-500">{prod.category}</span>
                </div>
                
                <p className="text-[11.5px] text-slate-600">{prod.description}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Unsecured Base</span>
                    <strong className="text-blue-700 font-mono-numbers">{prod.baseRatePercent}%</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Secured Collateral</span>
                    <strong className="text-emerald-700 font-mono-numbers">{prod.collateralRatePercent}%</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Processing Fee</span>
                    <strong className="text-slate-800 font-mono-numbers">{prod.processingFeePercent}%</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Limits: ₹{prod.minAmount.toLocaleString('en-IN')} - ₹{prod.maxAmount.toLocaleString('en-IN')}</span>
                  <span>Tenure: {prod.minTenureMonths}-{prod.maxTenureMonths} Mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">Regulatory Audit & Event Logs</h2>
            <p className="text-slate-500 mt-0.5">Immutable tracking of underwriting decisions, disbursements, and KYC access per RBI IT Security Framework</p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{log.id}</span>
                    <span className="text-slate-700 font-medium">{log.event}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>User: {log.user}</span>
                    <span>·</span>
                    <span>IP / Node: {log.ip}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-mono shrink-0">{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
