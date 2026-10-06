import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  LoanProduct,
  LoanApplication,
  Stock,
  PortfolioHolding,
  MutualFund,
  ActiveSip,
  AgentLead,
  NotificationItem,
  EmiScheduleItem,
} from '../types';
import {
  INITIAL_USER,
  LOAN_PRODUCTS,
  INITIAL_APPLICATIONS,
  STOCKS_DATA,
  INITIAL_HOLDINGS,
  MUTUAL_FUNDS_DATA,
  INITIAL_SIPS,
  INITIAL_LEADS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // Loans
  products: LoanProduct[];
  applications: LoanApplication[];
  selectedLoanId: string | null;
  setSelectedLoanId: (id: string | null) => void;
  applyForLoan: (data: Partial<LoanApplication>) => LoanApplication;
  approveLoanSanction: (appId: string, officerNotes?: string) => void;
  rejectLoan: (appId: string, reason: string) => void;
  signLoanAgreement: (appId: string) => void;
  registerENachMandate: (appId: string) => void;
  disburseLoanAmount: (appId: string) => void;
  payEmi: (appId: string, emiNumber: number, paymentMethod: string) => void;
  makePartPayment: (appId: string, amount: number, option: 'reduce_tenure' | 'reduce_emi') => void;
  forecloseLoan: (appId: string) => void;
  
  // Stocks & Market
  stocks: Stock[];
  holdings: PortfolioHolding[];
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  buyStock: (symbol: string, quantity: number, orderType: 'MARKET' | 'LIMIT', productType: 'DELIVERY' | 'INTRADAY') => boolean;
  sellStock: (symbol: string, quantity: number) => boolean;
  isMarketLive: boolean;
  setIsMarketLive: (live: boolean) => void;
  
  // Mutual Funds
  mutualFunds: MutualFund[];
  activeSips: ActiveSip[];
  startSip: (fundId: string, monthlyAmount: number, debitDate: number) => void;
  investLumpSum: (fundId: string, amount: number) => boolean;
  toggleSipStatus: (sipId: string) => void;
  cancelSip: (sipId: string) => void;
  
  // Wallet
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => boolean;
  
  // Agent Leads
  agentLeads: AgentLead[];
  createLead: (lead: Omit<AgentLead, 'id' | 'commissionEarned' | 'dateCreated'>) => void;
  
  // KYC Modal Flow
  isKycModalOpen: boolean;
  setIsKycModalOpen: (open: boolean) => void;
  completeKyc: (pan: string, aadhaar: string, bank: { accountNumber: string; ifsc: string; bankName: string }) => void;
  
  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type: 'loan' | 'invest' | 'sip' | 'system') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage if present, else mock
  const [role, setRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tatito_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [products] = useState<LoanProduct[]>(LOAN_PRODUCTS);
  const [applications, setApplications] = useState<LoanApplication[]>(() => {
    const saved = localStorage.getItem('tatito_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  const [stocks, setStocks] = useState<Stock[]>(STOCKS_DATA);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    const saved = localStorage.getItem('tatito_holdings');
    return saved ? JSON.parse(saved) : INITIAL_HOLDINGS;
  });
  const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'TCS', 'TATAMOTORS', 'HDFCBANK']);
  const [isMarketLive, setIsMarketLive] = useState<boolean>(true);

  const [mutualFunds] = useState<MutualFund[]>(MUTUAL_FUNDS_DATA);
  const [activeSips, setActiveSips] = useState<ActiveSip[]>(() => {
    const saved = localStorage.getItem('tatito_sips');
    return saved ? JSON.parse(saved) : INITIAL_SIPS;
  });

  const [agentLeads, setAgentLeads] = useState<AgentLead[]>(() => {
    const saved = localStorage.getItem('tatito_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('tatito_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [isKycModalOpen, setIsKycModalOpen] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('tatito_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tatito_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('tatito_holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem('tatito_sips', JSON.stringify(activeSips));
  }, [activeSips]);

  useEffect(() => {
    localStorage.setItem('tatito_leads', JSON.stringify(agentLeads));
  }, [agentLeads]);

  useEffect(() => {
    localStorage.setItem('tatito_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Simulated live stock price ticker
  useEffect(() => {
    if (!isMarketLive) return;
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          // Subtle realistic random fluctuation (-0.35% to +0.35%)
          const pctDelta = (Math.random() - 0.48) * 0.7;
          const priceDelta = Number(((stock.price * pctDelta) / 100).toFixed(2));
          const newPrice = Math.max(10, Number((stock.price + priceDelta).toFixed(2)));
          const newChange = Number((newPrice - stock.close).toFixed(2));
          const newChangePercent = Number(((newChange / stock.close) * 100).toFixed(2));
          const newSparkline = [...stock.sparkline.slice(1), newPrice];

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high: Math.max(stock.high, newPrice),
            low: Math.min(stock.low, newPrice),
            sparkline: newSparkline,
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [isMarketLive]);

  // Keep holdings current prices updated
  useEffect(() => {
    setHoldings((prevHoldings) =>
      prevHoldings.map((holding) => {
        const liveStock = stocks.find((s) => s.symbol === holding.symbol);
        if (!liveStock) return holding;
        const curPrice = liveStock.price;
        const curVal = curPrice * holding.quantity;
        const pnl = curVal - holding.investedValue;
        const pnlPct = (pnl / holding.investedValue) * 100;
        return {
          ...holding,
          currentPrice: curPrice,
          currentValue: Number(curVal.toFixed(2)),
          pnl: Number(pnl.toFixed(2)),
          pnlPercent: Number(pnlPct.toFixed(2)),
        };
      })
    );
  }, [stocks]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addNotification = (title: string, message: string, type: 'loan' | 'invest' | 'sip' | 'system') => {
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Generate realistic amortisation schedule
  const generateAmortisationSchedule = (principal: number, annualRate: number, tenureMonths: number): EmiScheduleItem[] => {
    const monthlyRate = annualRate / 12 / 100;
    const emi = Math.round(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );

    let balance = principal;
    const schedule: EmiScheduleItem[] = [];
    const today = new Date();

    for (let i = 1; i <= tenureMonths; i++) {
      const interest = Math.round(balance * monthlyRate);
      const princ = Math.min(balance, emi - interest);
      balance = Math.max(0, balance - princ);

      const dueDateObj = new Date(today.getFullYear(), today.getMonth() + i, 5);
      const dueDate = dueDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      schedule.push({
        emiNumber: i,
        dueDate,
        emiAmount: emi,
        principalComponent: princ,
        interestComponent: interest,
        balancePrincipal: balance,
        status: 'upcoming',
      });
    }

    return schedule;
  };

  // Apply for loan
  const applyForLoan = (data: Partial<LoanApplication>): LoanApplication => {
    const randomId = `TAT-LN-${Math.floor(1000 + Math.random() * 9000)}`;
    const product = products.find((p) => p.id === data.productId) || products[0];
    const amount = data.amountRequested || 200000;
    const tenure = data.tenureMonths || 24;
    const rate = data.loanMode === 'secured_collateral' ? product.collateralRatePercent : product.baseRatePercent;
    
    const monthlyRate = rate / 12 / 100;
    const emi = Math.round(
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
        (Math.pow(1 + monthlyRate, tenure) - 1)
    );

    const schedule = generateAmortisationSchedule(amount, rate, tenure);

    const newApp: LoanApplication = {
      id: randomId,
      userId: user.id,
      applicantName: user.fullName,
      phone: user.phone,
      productId: product.id,
      productName: product.name,
      loanMode: data.loanMode || 'unsecured_interest_only',
      amountRequested: amount,
      tenureMonths: tenure,
      interestRate: rate,
      monthlyEmi: emi,
      purpose: data.purpose || 'Personal financing',
      collateralDetails: data.collateralDetails,
      cibilScore: user.cibilScore,
      dtiRatio: 28,
      status: 'underwriting',
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      outstandingPrincipal: amount,
      totalPaid: 0,
      emiSchedule: schedule,
      documents: [
        { id: `DOC-${Date.now()}-1`, name: 'PAN e-KYC', category: 'Identity', status: 'verified', uploadDate: 'Today' },
        { id: `DOC-${Date.now()}-2`, name: 'Aadhaar DigiLocker Verified', category: 'Identity', status: 'verified', uploadDate: 'Today' },
        { id: `DOC-${Date.now()}-3`, name: 'Bank Statement', category: 'Income', status: 'verified', uploadDate: 'Today' },
      ],
      mandateStatus: 'not_set',
      eSignStatus: 'pending',
      sanctionLetterNo: `TAT/SAN/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setApplications((prev) => [newApp, ...prev]);
    addNotification(
      'Loan Application Submitted',
      `Your application #${newApp.id} for ₹${amount.toLocaleString('en-IN')} has been routed to Credit Underwriting desk.`,
      'loan'
    );
    return newApp;
  };

  // Underwriting Desk: Sanction loan
  const approveLoanSanction = (appId: string, officerNotes?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'sanctioned',
              sanctionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              officerNotes: officerNotes || 'Approved with standard NBFC credit underwriting terms.',
            }
          : app
      )
    );
    addNotification(
      'Loan Sanction Approved!',
      `Application #${appId} has been sanctioned by Senior Credit Officer. Please review KFS and e-Sign.`,
      'loan'
    );
  };

  const rejectLoan = (appId: string, reason: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'rejected',
              officerNotes: reason || 'Application does not meet current credit risk parameters.',
            }
          : app
      )
    );
    addNotification(
      'Loan Application Rejected',
      `Application #${appId} was rejected. Reason: ${reason}`,
      'loan'
    );
  };

  const signLoanAgreement = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              eSignStatus: 'signed',
              status: app.mandateStatus === 'registered' ? 'disbursed' : 'e_signed',
            }
          : app
      )
    );
    addNotification(
      'Agreement Digitally e-Signed',
      `Loan contract #${appId} has been verified with Aadhaar electronic signature.`,
      'loan'
    );
  };

  const registerENachMandate = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              mandateStatus: 'registered',
              status: app.eSignStatus === 'signed' ? 'disbursed' : 'mandate_registered',
            }
          : app
      )
    );
    addNotification(
      'e-NACH Mandate Registered',
      `Auto-debit mandate registered for #${appId} on ${user.bankAccount.bankName}.`,
      'loan'
    );
  };

  const disburseLoanAmount = (appId: string) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'active',
              disbursementDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : app
      )
    );

    // Credit funds to user wallet/bank
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + targetApp.amountRequested,
    }));

    addNotification(
      'Loan Amount Disbursed!',
      `₹${targetApp.amountRequested.toLocaleString('en-IN')} has been disbursed to your account. EMI schedule is now live.`,
      'loan'
    );
  };

  const payEmi = (appId: string, emiNumber: number, paymentMethod: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const updatedSchedule = app.emiSchedule.map((item) => {
          if (item.emiNumber === emiNumber) {
            return {
              ...item,
              status: 'paid' as const,
              paidDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              transactionRef: `${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
            };
          }
          return item;
        });

        const targetEmi = app.emiSchedule.find((item) => item.emiNumber === emiNumber);
        const princPaid = targetEmi ? targetEmi.principalComponent : 0;
        const newOutstanding = Math.max(0, app.outstandingPrincipal - princPaid);
        const newTotalPaid = app.totalPaid + (targetEmi ? targetEmi.emiAmount : 0);

        return {
          ...app,
          emiSchedule: updatedSchedule,
          outstandingPrincipal: newOutstanding,
          totalPaid: newTotalPaid,
          status: newOutstanding <= 0 ? 'closed' : app.status,
          closureDate: newOutstanding <= 0 ? new Date().toLocaleDateString('en-GB') : undefined,
        };
      })
    );

    addNotification(
      'EMI Payment Successful',
      `EMI #${emiNumber} for loan #${appId} paid via ${paymentMethod}.`,
      'loan'
    );
  };

  const makePartPayment = (appId: string, amount: number, option: 'reduce_tenure' | 'reduce_emi') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newOutstanding = Math.max(0, app.outstandingPrincipal - amount);
        const newTotalPaid = app.totalPaid + amount;

        // Recalculate schedule
        const remainingSchedule = app.emiSchedule.filter((item) => item.status !== 'paid');
        const remainingTenure = option === 'reduce_tenure' ? Math.max(6, remainingSchedule.length - 6) : remainingSchedule.length;
        const newSchedule = generateAmortisationSchedule(newOutstanding, app.interestRate, remainingTenure);

        return {
          ...app,
          outstandingPrincipal: newOutstanding,
          totalPaid: newTotalPaid,
          emiSchedule: [
            ...app.emiSchedule.filter((item) => item.status === 'paid'),
            ...newSchedule,
          ],
        };
      })
    );

    addNotification(
      'Part-Payment Credited',
      `Part-payment of ₹${amount.toLocaleString('en-IN')} credited to loan #${appId}. Principal reduced.`,
      'loan'
    );
  };

  const forecloseLoan = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          outstandingPrincipal: 0,
          totalPaid: app.totalPaid + app.outstandingPrincipal,
          status: 'closed',
          closureDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          emiSchedule: app.emiSchedule.map((item) => ({ ...item, status: 'paid' as const })),
        };
      })
    );

    addNotification(
      'Loan Foreclosed & Closed',
      `Loan #${appId} has been completely settled. No Objection Certificate (NOC) is ready to download.`,
      'loan'
    );
  };

  // Stock trading
  const buyStock = (symbol: string, quantity: number, orderType: 'MARKET' | 'LIMIT', productType: 'DELIVERY' | 'INTRADAY'): boolean => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock) return false;

    const totalCost = stock.price * quantity;
    if (user.walletBalance < totalCost) {
      alert(`Insufficient balance! Available: ₹${user.walletBalance.toLocaleString('en-IN')}, Required: ₹${totalCost.toLocaleString('en-IN')}`);
      return false;
    }

    // Deduct wallet
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance - totalCost }));

    // Update holdings
    setHoldings((prev) => {
      const existing = prev.find((h) => h.symbol === symbol);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const newInvested = existing.investedValue + totalCost;
        const newAvg = newInvested / newQty;
        const newCurVal = newQty * stock.price;
        const pnl = newCurVal - newInvested;
        return prev.map((h) =>
          h.symbol === symbol
            ? {
                ...h,
                quantity: newQty,
                investedValue: newInvested,
                avgBuyPrice: Number(newAvg.toFixed(2)),
                currentValue: Number(newCurVal.toFixed(2)),
                pnl: Number(pnl.toFixed(2)),
                pnlPercent: Number(((pnl / newInvested) * 100).toFixed(2)),
              }
            : h
        );
      } else {
        return [
          ...prev,
          {
            symbol,
            name: stock.name,
            quantity,
            avgBuyPrice: stock.price,
            currentPrice: stock.price,
            investedValue: totalCost,
            currentValue: totalCost,
            pnl: 0,
            pnlPercent: 0,
          },
        ];
      }
    });

    addNotification(
      `Stock Buy Executed: ${symbol}`,
      `Bought ${quantity} shares of ${stock.name} @ ₹${stock.price} (${productType} ${orderType}).`,
      'invest'
    );
    return true;
  };

  const sellStock = (symbol: string, quantity: number): boolean => {
    const holding = holdings.find((h) => h.symbol === symbol);
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!holding || !stock || holding.quantity < quantity) {
      alert(`Insufficient shares in portfolio to sell!`);
      return false;
    }

    const proceeds = stock.price * quantity;
    // Credit wallet
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance + proceeds }));

    // Update holdings
    setHoldings((prev) => {
      if (holding.quantity === quantity) {
        return prev.filter((h) => h.symbol !== symbol);
      }
      const remainingQty = holding.quantity - quantity;
      const remainingInvested = holding.avgBuyPrice * remainingQty;
      const curVal = remainingQty * stock.price;
      const pnl = curVal - remainingInvested;
      return prev.map((h) =>
        h.symbol === symbol
          ? {
              ...h,
              quantity: remainingQty,
              investedValue: remainingInvested,
              currentValue: curVal,
              pnl: Number(pnl.toFixed(2)),
              pnlPercent: Number(((pnl / remainingInvested) * 100).toFixed(2)),
            }
          : h
      );
    });

    addNotification(
      `Stock Sell Executed: ${symbol}`,
      `Sold ${quantity} shares of ${holding.name} @ ₹${stock.price}. Proceeds ₹${proceeds.toLocaleString('en-IN')} credited to wallet.`,
      'invest'
    );
    return true;
  };

  // Mutual funds
  const startSip = (fundId: string, monthlyAmount: number, debitDate: number) => {
    const fund = mutualFunds.find((f) => f.id === fundId);
    if (!fund) return;

    const newSip: ActiveSip = {
      id: `SIP-${Math.floor(1000 + Math.random() * 9000)}`,
      fundId,
      fundName: fund.name,
      monthlyAmount,
      debitDate,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      nextDebitDate: `${debitDate} Nov 2026`,
      status: 'active',
      mandateId: `ENACH-${user.bankAccount.bankName.split(' ')[0]}-${Math.floor(10000 + Math.random() * 90000)}`,
      totalInvested: 0,
      currentUnits: 0,
    };

    setActiveSips((prev) => [newSip, ...prev]);
    addNotification(
      'Monthly SIP Activated',
      `SIP for ₹${monthlyAmount.toLocaleString('en-IN')}/mo in ${fund.name} started via e-NACH mandate.`,
      'sip'
    );
  };

  const investLumpSum = (fundId: string, amount: number): boolean => {
    const fund = mutualFunds.find((f) => f.id === fundId);
    if (!fund) return false;

    if (user.walletBalance < amount) {
      alert(`Insufficient funds in wallet!`);
      return false;
    }

    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance - amount }));
    addNotification(
      'Mutual Fund Lump Sum Purchase',
      `Invested ₹${amount.toLocaleString('en-IN')} in ${fund.name} at NAV ₹${fund.nav}.`,
      'sip'
    );
    return true;
  };

  const toggleSipStatus = (sipId: string) => {
    setActiveSips((prev) =>
      prev.map((s) =>
        s.id === sipId
          ? { ...s, status: s.status === 'active' ? 'paused' : 'active' }
          : s
      )
    );
  };

  const cancelSip = (sipId: string) => {
    setActiveSips((prev) => prev.filter((s) => s.id !== sipId));
    addNotification('SIP Cancelled', `SIP #${sipId} has been successfully cancelled.`, 'sip');
  };

  const addFunds = (amount: number) => {
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    addNotification('Funds Added', `₹${amount.toLocaleString('en-IN')} deposited to Tatito Trading & Lending Wallet.`, 'system');
  };

  const withdrawFunds = (amount: number): boolean => {
    if (user.walletBalance < amount) {
      alert('Insufficient wallet balance!');
      return false;
    }
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance - amount }));
    addNotification(
      'Withdrawal Processed',
      `₹${amount.toLocaleString('en-IN')} transferred to your linked bank account (${user.bankAccount.accountNumber}).`,
      'system'
    );
    return true;
  };

  const createLead = (lead: Omit<AgentLead, 'id' | 'commissionEarned' | 'dateCreated'>) => {
    const commission = (lead.loanAmount * lead.commissionRate) / 100;
    const newLead: AgentLead = {
      ...lead,
      id: `LEAD-${Math.floor(100 + Math.random() * 900)}`,
      commissionEarned: commission,
      dateCreated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setAgentLeads((prev) => [newLead, ...prev]);
    addNotification('New DSA Lead Registered', `Lead for ${newLead.applicantName} (${newLead.loanProduct}) logged.`, 'system');
  };

  const completeKyc = (pan: string, aadhaar: string, bank: { accountNumber: string; ifsc: string; bankName: string }) => {
    setUser((prev) => ({
      ...prev,
      panNumber: pan,
      aadhaarNumber: aadhaar,
      kycStatus: 'fully_verified',
      bankAccount: {
        accountNumber: bank.accountNumber,
        ifsc: bank.ifsc,
        bankName: bank.bankName,
        isVerified: true,
      },
      dematAccount: {
        ...prev.dematAccount,
        status: 'active',
      },
    }));
    setIsKycModalOpen(false);
    addNotification('Full e-KYC Verified', 'Your PAN, Aadhaar DigiLocker & Penny-drop Bank link are verified. High credit limits & Trading active.', 'system');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        user,
        updateUser,
        products,
        applications,
        selectedLoanId,
        setSelectedLoanId,
        applyForLoan,
        approveLoanSanction,
        rejectLoan,
        signLoanAgreement,
        registerENachMandate,
        disburseLoanAmount,
        payEmi,
        makePartPayment,
        forecloseLoan,
        stocks,
        holdings,
        watchlist,
        toggleWatchlist,
        buyStock,
        sellStock,
        isMarketLive,
        setIsMarketLive,
        mutualFunds,
        activeSips,
        startSip,
        investLumpSum,
        toggleSipStatus,
        cancelSip,
        addFunds,
        withdrawFunds,
        agentLeads,
        createLead,
        isKycModalOpen,
        setIsKycModalOpen,
        completeKyc,
        notifications,
        markNotificationRead,
        clearNotifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
