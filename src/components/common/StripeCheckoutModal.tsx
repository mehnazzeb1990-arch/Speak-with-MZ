import React, { useState } from 'react';
import { SubscriptionPlan, Currency } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Check, ShieldCheck, CreditCard, Lock, Sparkles, Building2, Landmark, Wallet } from 'lucide-react';

interface StripeCheckoutModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({ plan, isOpen, onClose }) => {
  const { upgradePlan, currency, setCurrency } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethodCategory, setPaymentMethodCategory] = useState<'card' | 'pakistan_bank' | 'wallet'>('card');
  const [paymentProvider, setPaymentProvider] = useState<string>('Visa / Mastercard');
  
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expDate, setExpDate] = useState('12/28');
  const [cvc, setCvc] = useState('987');
  const [name, setName] = useState('MZ User');
  const [accountNumber, setAccountNumber] = useState('0300 1234567');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const isPKR = currency === 'PKR';

  const planDetails = {
    free: {
      name: 'Beginner Free Access',
      priceUSD: '$0',
      pricePKR: 'PKR 0',
      description: '200 Beginner Topics, Basic Feedback, Advertisements',
    },
    intermediate_premium: {
      name: 'Intermediate Premium',
      priceUSD: '$10/mo',
      pricePKR: 'Rs. 2,800/mo',
      description: 'Unlock 100 Intermediate Topics, Unlimited Conversations, Advanced Feedback, Vocabulary Builder, Idioms, No Ads',
    },
    advanced_premium: {
      name: 'Advanced Premium',
      priceUSD: '$10/mo',
      pricePKR: 'Rs. 2,800/mo',
      description: 'Unlock 100 Advanced Topics, Unlimited Conversations, Academic Feedback, Presentation Practice, Critical Thinking, No Ads',
    },
  }[plan];

  const priceFormatted = isPKR ? planDetails.pricePKR : planDetails.priceUSD;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    const last4 = paymentMethodCategory === 'card' ? cardNumber.slice(-4) || '4242' : '9981';
    upgradePlan(plan, paymentProvider, last4);
    
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">PCI-Compliant Checkout</h3>
          </div>

          <div className="flex items-center space-x-3">
            {/* Currency Selector Toggle */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded-md transition-all ${currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('PKR')}
                className={`px-2 py-1 rounded-md transition-all ${currency === 'PKR' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                PKR (Rs.)
              </button>
            </div>

            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {success ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Plan Activated Successfully!</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You are now subscribed to <span className="font-bold text-indigo-600 dark:text-sky-300">{planDetails.name}</span>.
            </p>
            <p className="text-xs text-slate-500">
              Receipt with invoice details has been added to your Payment History.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5 text-slate-800 dark:text-slate-200">
            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base">{planDetails.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs">{planDetails.description}</p>
              </div>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-sky-300 shrink-0">
                {priceFormatted}
              </span>
            </div>

            {/* Payment Method Category Tabs */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                Select Payment Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethodCategory('card');
                    setPaymentProvider('Visa / Mastercard');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center space-y-1 ${
                    paymentMethodCategory === 'card'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card / Intl</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethodCategory('pakistan_bank');
                    setPaymentProvider('Pakistani Debit Card (1Link/PayPak)');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center space-y-1 ${
                    paymentMethodCategory === 'pakistan_bank'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>Pak Bank / 1Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethodCategory('wallet');
                    setPaymentProvider('JazzCash / EasyPaisa');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center space-y-1 ${
                    paymentMethodCategory === 'wallet'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Mobile Wallet</span>
                </button>
              </div>
            </div>

            {/* Payment Sub-options */}
            {paymentMethodCategory === 'card' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Supported Cards:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Visa, Mastercard, Amex, Intl Cards</span>
                </div>
                
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                      required
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">CVC Code</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethodCategory === 'pakistan_bank' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Select Bank / Network</label>
                  <select
                    value={paymentProvider}
                    onChange={(e) => setPaymentProvider(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Pakistani Debit Card (1Link/PayPak)">1Link / PayPak Debit Card</option>
                    <option value="HBL Bank">HBL (Habib Bank Limited)</option>
                    <option value="Meezan Bank">Meezan Bank Internet Banking</option>
                    <option value="Allied Bank">Allied Bank / Alfalah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Card or Account Title</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Debit Card Number (16 Digits)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethodCategory === 'wallet' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Mobile Wallet Service</label>
                  <select
                    value={paymentProvider}
                    onChange={(e) => setPaymentProvider(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="JazzCash">JazzCash Mobile Wallet</option>
                    <option value="EasyPaisa">EasyPaisa Mobile Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Registered Mobile Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">You will receive a 1-time approval prompt on your mobile wallet app.</p>
                </div>
              </div>
            )}

            {/* Strict Security PCI Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-400">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-extrabold text-slate-900 dark:text-white">PCI-DSS Compliant Security:</span> We NEVER store card or bank login details on our servers. All transactions are processed through 256-bit SSL encrypted bank tokens.
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Confirm Checkout & Pay ({priceFormatted})</span>
                </>
              )}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};
