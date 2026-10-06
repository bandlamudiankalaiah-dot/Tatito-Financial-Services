import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Smartphone, 
  CreditCard, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const KycModal: React.FC = () => {
  const { isKycModalOpen, setIsKycModalOpen, user, completeKyc } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'pan' | 'aadhaar' | 'aadhaar_otp' | 'bank' | 'done'>('phone');
  const [phone, setPhone] = useState(user.phone.replace('+91 ', ''));
  const [otp, setOtp] = useState('4829');
  const [pan, setPan] = useState(user.panNumber || 'ABCPS8192K');
  const [panName, setPanName] = useState('ANANYA SHARMA');
  const [aadhaar, setAadhaar] = useState('784920196721');
  const [aadhaarOtp, setAadhaarOtp] = useState('9014');
  const [accountNo, setAccountNo] = useState(user.bankAccount.accountNumber || '50100489102451');
  const [ifsc, setIfsc] = useState(user.bankAccount.ifsc || 'HDFC0000128');
  const [bankName, setBankName] = useState(user.bankAccount.bankName || 'HDFC Bank Ltd');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pennyDropSuccess, setPennyDropSuccess] = useState(false);

  if (!isKycModalOpen) return null;

  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('otp');
    }, 700);
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('pan');
    }, 600);
  };

  const handleVerifyPan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPanName(user.fullName.toUpperCase());
      setStep('aadhaar');
    }, 800);
  };

  const handleSendAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('aadhaar_otp');
    }, 700);
  };

  const handleVerifyAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('bank');
    }, 900);
  };

  const handlePennyDropVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPennyDropSuccess(true);
      setTimeout(() => {
        completeKyc(pan, `XXXX-XXXX-${aadhaar.slice(-4)}`, {
          accountNumber: accountNo,
          ifsc: ifsc.toUpperCase(),
          bankName,
        });
        setStep('done');
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-sm font-bold">Paperless e-KYC & Onboarding</div>
              <div className="text-[11px] text-slate-300">RBI & UIDAI Compliant Digital Verification</div>
            </div>
          </div>
          <button
            onClick={() => setIsKycModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-medium text-slate-500">
          <span className={step === 'phone' || step === 'otp' ? 'text-blue-600 font-semibold' : ''}>1. Mobile</span>
          <span>→</span>
          <span className={step === 'pan' ? 'text-blue-600 font-semibold' : ''}>2. PAN Card</span>
          <span>→</span>
          <span className={step === 'aadhaar' || step === 'aadhaar_otp' ? 'text-blue-600 font-semibold' : ''}>3. Aadhaar</span>
          <span>→</span>
          <span className={step === 'bank' || step === 'done' ? 'text-blue-600 font-semibold' : ''}>4. Bank Link</span>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: Phone */}
          {step === 'phone' && (
            <form onSubmit={handleSendPhoneOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <span className="bg-slate-100 text-slate-600 px-3 py-2 text-sm font-medium border-r border-slate-300 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="flex-1 px-3 py-2 text-sm outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  An instant 4-digit OTP will be dispatched via SMS gateway.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifying || phone.length < 10}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Sending OTP...
                    </>
                  ) : (
                    <>
                      Send Secure OTP <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Phone OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
              <div className="text-center py-2">
                <p className="text-xs text-slate-600">Enter the 4-digit code sent to +91 {phone}</p>
                <div className="mt-1 text-xs text-blue-600 font-mono">Demo OTP: 4829</div>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center text-2xl tracking-widest font-mono py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.length < 4}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify Mobile OTP'}
              </button>
            </form>
          )}

          {/* STEP 3: PAN Card Verification */}
          {step === 'pan' && (
            <form onSubmit={handleVerifyPan} className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>NSDL / Income Tax PAN Verification</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full uppercase font-mono tracking-wider px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Required by RBI & SEBI for credit underwriting and Demat activation.
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying || pan.length !== 10}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Checking NSDL Database...
                  </>
                ) : (
                  <>Verify PAN Record</>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: Aadhaar DigiLocker */}
          {step === 'aadhaar' && (
            <form onSubmit={handleSendAadhaarOtp} className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DigiLocker / Aadhaar e-KYC</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PAN matched: <strong>{panName}</strong></span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">12-Digit Aadhaar Number</label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234 5678 9012"
                  className="w-full font-mono tracking-wider px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Consent: I agree to authenticate via UIDAI DigiLocker OTP for Tatito NBFC onboarding.
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying || aadhaar.length !== 12}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Get Aadhaar OTP'}
              </button>
            </form>
          )}

          {/* STEP 5: Aadhaar OTP */}
          {step === 'aadhaar_otp' && (
            <form onSubmit={handleVerifyAadhaarOtp} className="space-y-4">
              <div className="text-center py-2">
                <p className="text-xs text-slate-600">Enter OTP received from UIDAI</p>
                <div className="mt-1 text-xs text-emerald-600 font-mono">Demo UIDAI OTP: 9014</div>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value)}
                  className="w-full text-center text-2xl tracking-widest font-mono py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Validate Aadhaar e-KYC'}
              </button>
            </form>
          )}

          {/* STEP 6: Bank Account Penny Drop */}
          {step === 'bank' && (
            <form onSubmit={handlePennyDropVerification} className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Bank Account Link & Penny Drop Check</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full font-mono px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full uppercase font-mono px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                Tatito will deposit <strong>₹1.00</strong> into your account via IMPS to verify beneficiary name match with PAN.
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Executing IMPS Penny Drop...
                  </>
                ) : pennyDropSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Beneficiary Matched!
                  </>
                ) : (
                  <>Test Penny Drop & Link Bank</>
                )}
              </button>
            </form>
          )}

          {/* STEP 7: Completed */}
          {step === 'done' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">e-KYC Successfully Verified!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Your identity, credit bureau profile, and bank mandate are officially registered with M/s. Tatito Projects.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-semibold text-slate-900">{user.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PAN:</span>
                  <span className="font-mono font-medium text-slate-800">{pan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CIBIL Bureau Score:</span>
                  <span className="font-mono font-bold text-emerald-600">{user.cibilScore} (Prime Excellent)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CDSL Demat Client ID:</span>
                  <span className="font-mono text-slate-800">{user.dematAccount.clientId}</span>
                </div>
              </div>

              <button
                onClick={() => setIsKycModalOpen(false)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
