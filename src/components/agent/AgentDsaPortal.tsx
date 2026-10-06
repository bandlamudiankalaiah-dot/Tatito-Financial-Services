import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentLead } from '../../types';
import { 
  Users, 
  DollarSign, 
  Plus, 
  Share2, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Briefcase,
  Copy,
  ExternalLink
} from 'lucide-react';

export const AgentDsaPortal: React.FC = () => {
  const { agentLeads, createLead, products } = useApp();

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [productId, setProductId] = useState(products[0].id);
  const [amount, setAmount] = useState<number>(1000000);
  const [commissionRate, setCommissionRate] = useState<number>(1.25);
  const [copiedLink, setCopiedLink] = useState(false);

  const totalCommissionEarned = agentLeads.reduce((sum, l) => sum + l.commissionEarned, 0);
  const totalVolumeReferred = agentLeads.reduce((sum, l) => sum + l.loanAmount, 0);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const prod = products.find(p => p.id === productId) || products[0];

    createLead({
      applicantName: name,
      phone: `+91 ${phone}`,
      loanProduct: prod.name,
      loanAmount: amount,
      status: 'Lead Generated',
      commissionRate,
    });

    setName('');
    setPhone('');
    setIsNewLeadOpen(false);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('https://tatito.in/apply?partner_code=DSA_VIKRAM_991');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Tatito Direct Selling Agent (DSA) & Channel Partner Network</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Partner Leads & Payout Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">Submit customer loan applications, track sanctions, and earn instant commissions</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyReferral}
            className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copiedLink ? 'Referral Link Copied!' : 'Copy Partner Referral Link'}
          </button>
          <button
            onClick={() => setIsNewLeadOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Submit New Lead
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-slate-500">Total Referred Volume</span>
          <div className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">
            ₹{totalVolumeReferred.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{agentLeads.length} Total Leads Sourced</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-slate-500">Accrued Commission Payout</span>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-600 mt-1">
            ₹{totalCommissionEarned.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">Average Payout: 1.15% on Disbursement</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-slate-500">Partner Code & Tier</span>
          <div className="text-lg font-bold text-slate-900 font-mono mt-1">
            DSA_VIKRAM_991
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Tier-1 Preferred Partner Status</div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Leads Pipeline & Commission Tracking</h2>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Lead ID</th>
                <th className="py-2.5 px-3">Applicant Name</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3 text-right">Loan Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Payout %</th>
                <th className="py-2.5 px-3 text-right">Commission (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{lead.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{lead.applicantName}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono">{lead.phone}</td>
                  <td className="py-3 px-3 text-slate-800">{lead.loanProduct}</td>
                  <td className="py-3 px-3 text-right font-mono-numbers font-bold text-slate-900">
                    ₹{lead.loanAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase ${
                      lead.status === 'Disbursed' ? 'bg-emerald-100 text-emerald-800' :
                      lead.status === 'Sanctioned' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono-numbers text-slate-600">{lead.commissionRate}%</td>
                  <td className="py-3 px-3 text-right font-mono-numbers font-bold text-emerald-700">
                    ₹{lead.commissionEarned.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lead Modal */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Submit Customer Loan Lead</h3>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Mobile Number</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98490 12345"
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loan Product</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (from {p.collateralRatePercent}%)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Loan Amount (₹)</label>
                <input
                  type="number"
                  min={50000}
                  step={50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono-numbers"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                >
                  Submit & Log Commission
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewLeadOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
