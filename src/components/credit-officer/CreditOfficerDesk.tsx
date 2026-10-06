import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoanApplication } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Building, 
  TrendingUp, 
  User, 
  DollarSign, 
  Check, 
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

export const CreditOfficerDesk: React.FC<{ onOpenLoanDetails: (id: string) => void }> = ({ onOpenLoanDetails }) => {
  const { 
    applications, 
    approveLoanSanction, 
    rejectLoan, 
    disburseLoanAmount 
  } = useApp();

  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(
    applications.find(a => a.status === 'underwriting') || applications[0]
  );
  const [officerNotes, setOfficerNotes] = useState('Applicant exhibits prime credit history (CIBIL 785) with healthy DTI ratio under 35%. Recommended for sanction.');
  const [rejectReason, setRejectReason] = useState('DTI ratio exceeds NBFC prudential underwriting ceiling.');
  const [isRejectModal, setIsRejectModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = applications.filter(a => a.status === 'underwriting').length;

  return (
    <div className="space-y-6">
      {/* Officer Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/images/avatar_officer_raghav_1791280496573.jpg"
            alt="Raghav Mehra"
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">Raghav Mehra, Senior Credit Risk Officer</span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] rounded uppercase font-semibold">
                Sanction Authority Level III
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Tatito NBFC Underwriting Desk · Daily Sanction Limit: ₹5,00,00,000 (₹5 Cr)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Applications Awaiting Review</div>
            <div className="text-xl font-bold font-mono-numbers text-amber-400">{pendingCount} Pending</div>
          </div>
        </div>
      </div>

      {/* Main Two-Panel Layout: Pipeline List & Appraisal Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Applications Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Loan Underwriting Queue</h2>
            <div className="flex gap-1 text-xs">
              {['all', 'underwriting', 'sanctioned', 'active'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 rounded capitalize text-[11px] transition-colors ${
                    statusFilter === st ? 'bg-slate-900 text-white font-semibold' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, borrower name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
            {filteredApps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">#{app.id}</span>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm ${
                      app.status === 'underwriting' ? 'bg-amber-100 text-amber-800' :
                      app.status === 'sanctioned' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{app.applicantName}</span>
                    <span className="font-mono-numbers font-bold text-slate-900">
                      ₹{app.amountRequested.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{app.productName} · {app.tenureMonths} Mo</span>
                    <span>CIBIL: <strong className="text-emerald-700">{app.cibilScore}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Underwriting Inspection View (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {selectedApp ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{selectedApp.productName}</span>
                    <span className="font-mono text-xs text-slate-500">#{selectedApp.id}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Borrower: <strong>{selectedApp.applicantName}</strong> · Phone: {selectedApp.phone}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Requested Amount</div>
                  <div className="text-xl font-bold font-mono-numbers text-slate-900">
                    ₹{selectedApp.amountRequested.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Credit Risk Matrix */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">CIBIL Bureau Score</span>
                  <div className="text-lg font-bold font-mono-numbers text-emerald-700 mt-0.5">
                    {selectedApp.cibilScore} / 900
                  </div>
                  <div className="text-[10.5px] text-emerald-600 mt-0.5">Prime Low Risk</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Fixed Obligation (DTI)</span>
                  <div className="text-lg font-bold font-mono-numbers text-slate-800 mt-0.5">
                    {selectedApp.dtiRatio}%
                  </div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">Ceiling: 50%</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Proposed EMI</span>
                  <div className="text-lg font-bold font-mono-numbers text-slate-900 mt-0.5">
                    ₹{selectedApp.monthlyEmi.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">{selectedApp.interestRate}% p.a.</div>
                </div>
              </div>

              {/* Collateral & Surety inspection */}
              {selectedApp.collateralDetails ? (
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Collateral & Surety Valuation Verification</span>
                  </div>
                  <div className="text-slate-700">
                    Asset Type: <strong>{selectedApp.collateralDetails.type}</strong>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Description: {selectedApp.collateralDetails.description}
                  </div>
                  <div className="flex justify-between pt-1 border-t border-emerald-200/60 font-semibold text-emerald-800">
                    <span>Assessed Market Value:</span>
                    <span>₹{selectedApp.collateralDetails.estimatedValue.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedApp.collateralDetails.suretyGuarantorName && (
                    <div className="text-[11px] text-slate-600">
                      Surety Guarantor: <strong>{selectedApp.collateralDetails.suretyGuarantorName}</strong> ({selectedApp.collateralDetails.suretyGuarantorPhone})
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  Loan Mode: <strong>Unsecured Interest-Only</strong> (Underwritten solely on cashflow & bureau score)
                </div>
              )}

              {/* Verified Documents Checklist */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-800">KYC & Financial Documents</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedApp.documents.map((doc) => (
                    <div key={doc.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900 truncate max-w-[140px]">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">{doc.category}</div>
                      </div>
                      <span className="text-emerald-600 text-[10px] font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Underwriting Actions Bar */}
              {selectedApp.status === 'underwriting' && (
                <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Underwriter Appraisal Notes</label>
                    <textarea
                      rows={2}
                      value={officerNotes}
                      onChange={(e) => setOfficerNotes(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => approveLoanSanction(selectedApp.id, officerNotes)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Issue Sanction Letter & KFS
                    </button>
                    <button
                      onClick={() => setIsRejectModal(true)}
                      className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}

              {/* If Sanctioned or e-Signed, direct disbursement control */}
              {(selectedApp.status === 'sanctioned' || selectedApp.status === 'e_signed' || selectedApp.status === 'mandate_registered') && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-blue-900">Post-Sanction Execution Status</div>
                  <div className="text-slate-700">
                    e-Sign: <strong>{selectedApp.eSignStatus}</strong> · Mandate: <strong>{selectedApp.mandateStatus}</strong>
                  </div>
                  <button
                    onClick={() => disburseLoanAmount(selectedApp.id)}
                    className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    Authorize Direct Disbursement of ₹{selectedApp.amountRequested.toLocaleString('en-IN')}
                  </button>
                </div>
              )}

              {selectedApp.status === 'active' && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-500">Loan is actively serviced in LMS</span>
                  <button
                    onClick={() => onOpenLoanDetails(selectedApp.id)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold"
                  >
                    View Amortisation & Repayments
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">Select an application from the queue to appraise</div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Reject Application #{selectedApp.id}</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">State Statutory Reason</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  rejectLoan(selectedApp.id, rejectReason);
                  setIsRejectModal(false);
                }}
                className="flex-1 py-2 bg-rose-600 text-white font-semibold rounded-lg"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setIsRejectModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
