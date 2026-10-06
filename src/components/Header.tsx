import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Wallet, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase, 
  ChevronDown,
  X,
  CreditCard,
  Building2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC<{ onOpenWallet: () => void }> = ({ onOpenWallet }) => {
  const { 
    role, 
    setRole, 
    activeTab, 
    setActiveTab, 
    user, 
    setIsKycModalOpen,
    notifications,
    markNotificationRead,
    clearNotifications
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleTitles: Record<UserRole, { label: string; badge: string; icon: string }> = {
    customer: { label: 'Customer View (Borrower & Investor)', badge: 'Ananya Sharma', icon: '👤' },
    credit_officer: { label: 'Credit Underwriting Desk', badge: 'Raghav Mehra (Chief Risk)', icon: '🛡️' },
    agent: { label: 'DSA & Channel Partner', badge: 'Vikram Agency (Tier 1)', icon: '🤝' },
    admin: { label: 'Executive MIS & Admin Desk', badge: 'Tatito Projects HQ', icon: '🏛️' },
  };

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'loans', label: 'Loans & NBFC Credit' },
    { id: 'stocks', label: 'Stocks & Screener' },
    { id: 'mutual_funds', label: 'Mutual Funds & SIP' },
    { id: 'demat', label: 'Demat & Depository' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      {/* Top Banner: RBI Registered NBFC Partner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="font-medium text-white">M/s. Tatito Projects</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-300">RBI Regulated NBFC Credit & SEBI-Depository Broking Platform</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs">
          <span>CIN: U65922TG2022PTC160412</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-mono-numbers">Live Rates from 8.50% p.a.</span>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand - Nav Links - Primary Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <img 
              src="/src/assets/images/tatito_logo_mark_1791280465323.jpg" 
              alt="Tatito" 
              className="w-9 h-9 rounded-lg object-cover shadow-xs border border-slate-200"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback styled insignia
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                Tatito Financial Services
              </span>
              <span className="text-[11px] text-slate-700 tracking-wide">
                Borrow · Invest · Trade
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id && role === 'customer';
            return (
              <button
                key={link.id}
                onClick={() => {
                  setRole('customer');
                  setActiveTab(link.id);
                }}
                className={`py-1 relative whitespace-nowrap transition-colors ${
                  isActive ? 'text-slate-950 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions - Role Switcher & User Hub */}
        <div className="flex items-center gap-3">
          
          {/* Role Switcher Pill/Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
            >
              <span className="text-sm">{roleTitles[role].icon}</span>
              <span className="hidden sm:inline font-semibold">{role === 'customer' ? 'Customer' : role === 'credit_officer' ? 'Credit Desk' : role === 'agent' ? 'DSA Portal' : 'Admin MIS'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-900">Switch Workspace Role</div>
                  <div className="text-[11px] text-slate-500">Test full NBFC ecosystem across personas</div>
                </div>
                {(['customer', 'credit_officer', 'agent', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setIsRoleDropdownOpen(false);
                      if (r === 'customer' && activeTab === 'dashboard') {
                        setActiveTab('dashboard');
                      }
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      role === r ? 'bg-blue-50/60 text-blue-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{roleTitles[r].icon}</span>
                        <span>{roleTitles[r].label}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 ml-5">{roleTitles[r].badge}</div>
                    </div>
                    {role === r && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wallet Balance Shortcut */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
            title="Trading & Lending Wallet"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono-numbers font-semibold text-emerald-800">
              ₹{user.walletBalance.toLocaleString('en-IN')}
            </span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono-numbers px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-sm">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-500 hover:text-slate-800"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                          !n.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-semibold ${!n.read ? 'text-blue-900' : 'text-slate-800'}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 mt-1 leading-relaxed text-[11.5px]">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / KYC trigger */}
          <button
            onClick={() => setIsKycModalOpen(true)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <img
              src="/src/assets/images/avatar_customer_ananya_1791280507858.jpg"
              alt={user.fullName}
              className="w-8 h-8 rounded-full object-cover border border-slate-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hidden xl:block text-xs leading-tight">
              <div className="font-semibold text-slate-900 truncate max-w-[100px]">{user.fullName}</div>
              <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> e-KYC Done
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden border-t border-slate-200 bg-slate-50/80 px-4 py-2 overflow-x-auto flex items-center gap-2 text-xs font-medium">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id && role === 'customer';
          return (
            <button
              key={link.id}
              onClick={() => {
                setRole('customer');
                setActiveTab(link.id);
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
