import React from 'react';
import { ShieldCheck, Award, FileText, AlertCircle, Building, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      {/* Trust & Regulatory Credentials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>RBI Regulated NBFC Partner</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              M/s. Tatito Projects operates digital lending infrastructure in accordance with the RBI Digital Lending Guidelines 2022. All credit sanctions adhere to Fair Practices Code.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Award className="w-4 h-4 text-blue-400" />
              <span>SEBI & AMFI Registered</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              AMFI Registered Mutual Fund Distributor ARN-249018. Member NSE/BSE Broking and CDSL Depository Participant through accredited institutional clearing partners.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Key Fact Statement (KFS)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Zero hidden charges. Transparent APR, loan amortisation schedules, e-NACH mandates, and 30-day cooling off period provided upfront to every borrower.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <AlertCircle className="w-4 h-4 text-violet-400" />
              <span>Grievance Redressal</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Nodal Officer: S. K. Narayana Murthy | Email: grievance@tatito.in | Helpline: 1800-208-9844 | Response TAT: 24 to 48 business hours.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Compliance text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">Tatito Financial Services</span>
            <span>·</span>
            <span>A division of M/s. Tatito Projects Pvt Ltd</span>
          </div>
          <div className="flex items-center gap-6 text-[11.5px]">
            <a href="#terms" className="hover:text-white transition-colors">RBI Fair Practices Code</a>
            <a href="#privacy" className="hover:text-white transition-colors">Data Privacy & IT Act</a>
            <a href="#sebi" className="hover:text-white transition-colors">SEBI Disclosures</a>
            <a href="#interest" className="hover:text-white transition-colors">Interest Rate Policy</a>
            <a href="#contact" className="hover:text-white transition-colors">Branch Locators</a>
          </div>
        </div>

        {/* Regulatory fine print */}
        <p className="text-[10.5px] text-slate-500 leading-relaxed">
          <strong>Statutory Disclaimer:</strong> Mutual fund investments are subject to market risks, read all scheme related documents carefully before investing. Equity share trading involves financial risk and past returns are not indicative of future performance. Loans are sanctioned at the sole discretion of the NBFC credit underwriting committee based on customer credit bureau score, repayment capacity, DTI ratio, and documentation integrity. Tatito Financial Services does not charge any upfront cash advance fees prior to loan sanction.
        </p>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} M/s. Tatito Projects. All rights reserved. Registered Office: Plot 88, Financial District, Nanakramguda, Hyderabad, Telangana 500032.
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3 h-3" /> ISO 27001 Certified System
            </span>
            <span>·</span>
            <span>256-Bit SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
