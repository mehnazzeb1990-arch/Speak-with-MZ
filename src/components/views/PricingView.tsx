import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StripeCheckoutModal } from '../common/StripeCheckoutModal';
import { RefundPolicyModal } from '../common/RefundPolicyModal';
import { Check, Crown, Sparkles, ShieldCheck, Lock, HelpCircle, ArrowRight } from 'lucide-react';

export const PricingView: React.FC = () => {
  const { user, currency, setCurrency } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const isPKR = currency === 'PKR';

  return (
    <div id="pricing-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-sky-400">
          Transparent Subscriptions & Global Payments
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Simple Pricing for Unlimited English Speaking
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Master English with structured topics, live AI voice coaching, and personalized feedback. Upgrade or cancel anytime with our 14-day money-back guarantee.
        </p>

        {/* Currency & Billing Switchers Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          
          {/* Currency Toggle (USD vs PKR) */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 text-xs font-bold border border-slate-300 dark:border-slate-700">
            <span className="px-3 text-slate-500 text-[11px]">Currency:</span>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-xl transition-all ${currency === 'USD' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('PKR')}
              className={`px-3 py-1.5 rounded-xl transition-all ${currency === 'PKR' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              PKR (Rs.)
            </button>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 text-xs font-bold border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-xl transition-all flex items-center space-x-1 ${billingCycle === 'annual' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-md font-extrabold">Save 20%</span>
            </button>
          </div>

        </div>
      </div>

      {/* PCI Security Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 max-w-5xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">PCI-DSS Level 1 Secure Checkout</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">We NEVER store card or bank login information on our servers. Visa, Mastercard, Pakistani Debit Cards & International Cards supported.</p>
          </div>
        </div>
        <button
          onClick={() => setRefundModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-sky-300 font-bold text-xs hover:bg-slate-50 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center space-x-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>14-Day Refund Policy</span>
        </button>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Plan 1: Beginner Free Access */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Beginner Free Access</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md">
                Starter
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Essential foundation for beginners starting out</p>
            <div>
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {isPKR ? 'Rs. 0' : '$0'}
              </span>
              <span className="text-xs text-slate-400 font-medium"> / forever</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>200 Beginner Topics</strong> with picture descriptions & mini-games</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Basic Feedback</strong> on vocabulary and general clarity</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>MZ Standard AI Coach access</span>
              </li>
              <li className="flex items-start space-x-2 text-amber-600 dark:text-amber-400 font-medium">
                <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Advertisements (In-app ad placement)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setSelectedPlan('free')}
            disabled={user?.subscriptionPlan === 'free'}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-colors ${
              user?.subscriptionPlan === 'free'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
            }`}
          >
            {user?.subscriptionPlan === 'free' ? 'Current Active Plan' : 'Select Free Plan'}
          </button>
        </div>

        {/* Plan 2: Intermediate Premium */}
        <div className="relative rounded-3xl bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white p-8 border-2 border-indigo-500 shadow-2xl space-y-6 flex flex-col justify-between">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
            Most Popular
          </span>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-white">Intermediate Premium</h3>
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-xs text-indigo-200">Fluency builder for conversational confidence</p>
            <div>
              <span className="text-4xl font-extrabold text-white">
                {isPKR 
                  ? (billingCycle === 'monthly' ? 'Rs. 2,800' : 'Rs. 2,240') 
                  : (billingCycle === 'monthly' ? '$10' : '$8')}
              </span>
              <span className="text-xs text-indigo-300 font-medium"> / month</span>
            </div>
            <ul className="space-y-3 text-xs text-indigo-100 pt-2">
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Unlock 100 Intermediate Topics</strong> with debates & case studies</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Unlimited Conversations</strong> 24/7 with all 4 AI Personas</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Advanced Feedback</strong> with live Grammar Doctor fixes</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Vocabulary Builder & Idioms Vault</strong> with native audio</span>
              </li>
              <li className="flex items-start space-x-2 font-bold text-sky-300">
                <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>No Ads</strong> (100% Ad-Free Clean Experience)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setSelectedPlan('intermediate_premium')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 hover:from-indigo-600 hover:to-sky-600 font-black text-white text-xs transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2"
          >
            <span>Upgrade to Intermediate ($10/mo)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Plan 3: Advanced Premium */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Advanced Premium</h3>
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Mastery level for academic & career leadership</p>
            <div>
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {isPKR 
                  ? (billingCycle === 'monthly' ? 'Rs. 2,800' : 'Rs. 2,240') 
                  : (billingCycle === 'monthly' ? '$10' : '$8')}
              </span>
              <span className="text-xs text-slate-400 font-medium"> / month</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Unlock 100 Advanced Topics</strong> (Business & Academic)</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Unlimited Conversations</strong> & ElevenLabs neural audio</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Academic Feedback</strong> & rhetorical structure analysis</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-indigo-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Presentation Practice & Critical Thinking</strong> drills</span>
              </li>
              <li className="flex items-start space-x-2 font-bold text-sky-600 dark:text-sky-400">
                <Check className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <span><strong>No Ads</strong> (100% Ad-Free Clean Experience)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setSelectedPlan('advanced_premium')}
            className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Upgrade to Advanced ($10/mo)
          </button>
        </div>

      </div>

      {/* Payment Methods Footer Badge */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accepted Secure Payment Methods</p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">Visa</span>
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">Mastercard</span>
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">Pakistani Debit Cards (1Link/PayPak)</span>
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">HBL / Meezan Bank</span>
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">JazzCash / EasyPaisa</span>
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">International Cards</span>
        </div>
      </div>

      <StripeCheckoutModal
        plan={selectedPlan || 'intermediate_premium'}
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
      />

      <RefundPolicyModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
      />
    </div>
  );
};
