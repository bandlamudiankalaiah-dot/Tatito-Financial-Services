export type UserRole = 'customer' | 'credit_officer' | 'agent' | 'admin';

export type LoanMode = 'unsecured_interest_only' | 'secured_collateral';

export type KycStatus = 'pending' | 'pan_verified' | 'aadhaar_verified' | 'bank_linked' | 'fully_verified';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  aadhaarNumber: string;
  dob: string;
  address: string;
  cibilScore: number;
  kycStatus: KycStatus;
  bankAccount: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    isVerified: boolean;
  };
  dematAccount: {
    clientId: string;
    dpId: string;
    depository: 'CDSL' | 'NSDL';
    status: 'active' | 'pending';
    nominee: string;
    openDate: string;
  };
  walletBalance: number;
}

export interface LoanProduct {
  id: 'personal' | 'home' | 'vehicle' | 'plot' | 'business' | 'lap' | 'gold';
  name: string;
  category: 'Retail' | 'Commercial' | 'Secured Asset';
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  baseRatePercent: number; // e.g. 10.5
  collateralRatePercent: number; // e.g. 8.75
  processingFeePercent: number;
  description: string;
  eligibleCollaterals: string[];
}

export type ApplicationStatus = 
  | 'draft' 
  | 'underwriting' 
  | 'sanctioned' 
  | 'e_signed' 
  | 'mandate_registered' 
  | 'disbursed' 
  | 'active' 
  | 'closed' 
  | 'rejected';

export interface EmiScheduleItem {
  emiNumber: number;
  dueDate: string;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  balancePrincipal: number;
  status: 'paid' | 'due' | 'upcoming';
  paidDate?: string;
  transactionRef?: string;
}

export interface LoanDocument {
  id: string;
  name: string;
  category: 'Identity' | 'Income' | 'Property' | 'Guarantor';
  status: 'verified' | 'pending';
  uploadDate: string;
}

export interface LoanApplication {
  id: string; // e.g. TAT-LN-9042
  userId: string;
  applicantName: string;
  phone: string;
  productId: LoanProduct['id'];
  productName: string;
  loanMode: LoanMode;
  amountRequested: number;
  tenureMonths: number;
  interestRate: number;
  monthlyEmi: number;
  purpose: string;
  collateralDetails?: {
    type: string;
    description: string;
    estimatedValue: number;
    suretyGuarantorName?: string;
    suretyGuarantorPhone?: string;
  };
  cibilScore: number;
  dtiRatio: number;
  status: ApplicationStatus;
  appliedDate: string;
  sanctionDate?: string;
  disbursementDate?: string;
  closureDate?: string;
  outstandingPrincipal: number;
  totalPaid: number;
  emiSchedule: EmiScheduleItem[];
  documents: LoanDocument[];
  mandateStatus: 'not_set' | 'registered';
  eSignStatus: 'pending' | 'signed';
  sanctionLetterNo?: string;
  officerNotes?: string;
}

export interface Stock {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: string;
  peRatio: number;
  marketCap: string;
  week52High: number;
  week52Low: number;
  sparkline: number[];
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface MutualFund {
  id: string;
  name: string;
  amc: string;
  category: 'Large Cap' | 'Flexi Cap' | 'Mid Cap' | 'Small Cap' | 'ELSS Tax Saver' | 'Debt & Liquid';
  nav: number;
  changePercent: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  expenseRatio: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  aum: string;
  minSipAmount: number;
  minLumpSum: number;
  rating: number;
}

export interface ActiveSip {
  id: string;
  fundId: string;
  fundName: string;
  monthlyAmount: number;
  debitDate: number; // day of month, e.g. 5
  startDate: string;
  nextDebitDate: string;
  status: 'active' | 'paused' | 'cancelled';
  mandateId: string;
  totalInvested: number;
  currentUnits: number;
}

export interface AgentLead {
  id: string;
  applicantName: string;
  phone: string;
  loanProduct: string;
  loanAmount: number;
  status: 'Lead Generated' | 'Under Review' | 'Sanctioned' | 'Disbursed';
  commissionRate: number; // e.g. 1.0%
  commissionEarned: number;
  dateCreated: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'loan' | 'invest' | 'sip' | 'system';
  read: boolean;
}
