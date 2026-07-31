import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types';
import { StripeCheckoutModal } from '../common/StripeCheckoutModal';
import { Check, Crown, Sparkles, ShieldCheck } from 'lucide-react';

export const PricingView: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div id="pricing-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Transparent SaaS Subscriptions
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Simple Pricing for Unlimited English Speaking
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          Choose the level that fits your goals. Upgrade or cancel anytime with our 14-day money-back guarantee.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1 ${billingCycle === 'annual' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-md font-extrabold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Free Plan */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Beginner Free</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Essential speaking practice to get started</p>
            <div>
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-400 font-medium"> / forever</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>10 minutes daily AI speaking practice</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>MZ Standard Coach access</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Basic Vocabulary Vault (Up to 20 words)</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setSelectedPlan('free')}
            className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-bold text-xs transition-colors"
          >
            Current Plan
          </button>
        </div>

        {/* Intermediate Premium */}
        <div className="relative rounded-3xl bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white p-8 border-2 border-emerald-500 shadow-2xl space-y-6 flex flex-col justify-between">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
            Most Popular
          </span>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Intermediate Premium</h3>
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-xs text-teal-200/80">Unlimited natural speaking + Grammar Doctor</p>
            <div>
              <span className="text-4xl font-extrabold text-white">
                {billingCycle === 'monthly' ? '$12' : '$9.60'}
              </span>
              <span className="text-xs text-teal-300 font-medium"> / month</span>
            </div>
            <ul className="space-y-3 text-xs text-teal-100">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Unlimited 24/7 AI speaking sessions</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Live Grammar Doctor feedback & tips</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>All 4 AI Personas (Corporate, Travel, Exam)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Unlimited Vocabulary Vault & audio player</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setSelectedPlan('intermediate_premium')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 font-extrabold text-slate-950 text-xs transition-all shadow-lg"
          >
            Upgrade to Intermediate Premium
          </button>
        </div>

        {/* Advanced Master */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Advanced Master</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Complete mastery, native accent & exam drills</p>
            <div>
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {billingCycle === 'monthly' ? '$24' : '$19.20'}
              </span>
              <span className="text-xs text-slate-400 font-medium"> / month</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-500" />
                <span>Everything in Intermediate Premium</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-500" />
                <span>ElevenLabs ultra-realistic neural voice model</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-500" />
                <span>Personalized 1-on-1 fluency progress reports</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setSelectedPlan('advanced_premium')}
            className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Upgrade to Advanced Master
          </button>
        </div>

      </div>

      <StripeCheckoutModal
        plan={selectedPlan || 'intermediate_premium'}
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
      />
    </div>
  );
};
