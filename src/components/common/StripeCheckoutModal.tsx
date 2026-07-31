import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Check, ShieldCheck, CreditCard, Lock, Sparkles } from 'lucide-react';

interface StripeCheckoutModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({ plan, isOpen, onClose }) => {
  const { upgradePlan } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expDate, setExpDate] = useState('12/28');
  const [cvc, setCvc] = useState('987');
  const [name, setName] = useState('Learner Name');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const planDetails = {
    free: { name: 'Free Starter', price: '$0/mo', description: 'Basic daily practice' },
    intermediate_premium: { name: 'Intermediate Premium', price: '$12/mo', description: 'Unlimited speaking + Grammar Doctor' },
    advanced_premium: { name: 'Advanced Master', price: '$24/mo', description: 'All AI Personas + IELTS drills & custom audio' },
  }[plan];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    upgradePlan(plan);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-teal-500 to-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg font-bold">Secure Checkout</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Plan Upgraded Successfully!</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Welcome to <span className="font-bold text-emerald-600">{planDetails.name}</span>. Your unlimited speaking access is now active.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base">{planDetails.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{planDetails.description}</p>
              </div>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {planDetails.price}
              </span>
            </div>

            {/* Payment Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                  <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    CVC Code
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Encrypted with 256-bit SSL technology. Powered by Stripe.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm & Upgrade ({planDetails.price})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
