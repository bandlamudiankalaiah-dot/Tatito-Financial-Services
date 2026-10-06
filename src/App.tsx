import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { LoansHub } from './components/loans/LoansHub';
import { LoanDetailsModal } from './components/loans/LoanDetailsModal';
import { StocksHub } from './components/invest/StocksHub';
import { MutualFundsHub } from './components/invest/MutualFundsHub';
import { DematHub } from './components/demat/DematHub';
import { CreditOfficerDesk } from './components/credit-officer/CreditOfficerDesk';
import { AgentDsaPortal } from './components/agent/AgentDsaPortal';
import { AdminMisDesk } from './components/admin/AdminMisDesk';
import { KycModal } from './components/onboarding/KycModal';
import { WalletModal } from './components/wallet/WalletModal';

const MainContent: React.FC = () => {
  const { role, activeTab, setActiveTab, selectedLoanId, setSelectedLoanId } = useApp();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [openLoanApplyDefault, setOpenLoanApplyDefault] = useState(false);

  const handleOpenLoanApply = () => {
    setActiveTab('loans');
    setOpenLoanApplyDefault(true);
  };

  const handleOpenLoanDetails = (loanId: string) => {
    setSelectedLoanId(loanId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <Header onOpenWallet={() => setIsWalletOpen(true)} />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Persona Views */}
        {role === 'customer' && (
          <>
            {activeTab === 'dashboard' && (
              <CustomerDashboard
                onOpenLoanApply={handleOpenLoanApply}
                onOpenLoanDetails={handleOpenLoanDetails}
                onOpenWallet={() => setIsWalletOpen(true)}
              />
            )}

            {activeTab === 'loans' && (
              <LoansHub
                onOpenLoanDetails={handleOpenLoanDetails}
                openApplyDefault={openLoanApplyDefault}
              />
            )}

            {activeTab === 'stocks' && (
              <StocksHub onOpenWallet={() => setIsWalletOpen(true)} />
            )}

            {activeTab === 'mutual_funds' && (
              <MutualFundsHub onOpenWallet={() => setIsWalletOpen(true)} />
            )}

            {activeTab === 'demat' && (
              <DematHub />
            )}
          </>
        )}

        {/* Credit Officer Persona */}
        {role === 'credit_officer' && (
          <CreditOfficerDesk onOpenLoanDetails={handleOpenLoanDetails} />
        )}

        {/* DSA / Agent Persona */}
        {role === 'agent' && (
          <AgentDsaPortal />
        )}

        {/* Executive Admin MIS Persona */}
        {role === 'admin' && (
          <AdminMisDesk />
        )}
      </main>

      {/* Global Modals */}
      <KycModal />
      
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />

      <LoanDetailsModal
        loanId={selectedLoanId}
        onClose={() => setSelectedLoanId(null)}
      />

      {/* Compliance Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
