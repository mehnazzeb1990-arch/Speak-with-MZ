import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StripeCheckoutModal } from '../common/StripeCheckoutModal';
import { Crown, Check, CreditCard, ShieldCheck } from 'lucide-react';
import { SubscriptionPlan } from '../../types';

export const SubscriptionView: React.FC = () => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('intermediate_premium');

  return (
    <div id="subscription-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Subscription & Billing</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your subscription plan, view payment receipts, or upgrade.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Current Active Plan</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize mt-1">
              {user?.subscriptionPlan.replace('_', ' ')}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Status: Active (Auto-renews)</p>
          </div>

          <button
            onClick={() => {
              setSelectedPlan('intermediate_premium');
              setModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md"
          >
            Upgrade Plan
          </button>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Billing History</h4>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <span>Jan 15, 2026 - Intermediate Premium</span>
              <span className="font-mono font-bold">$12.00</span>
            </div>
          </div>
        </div>
      </div>

      <StripeCheckoutModal
        plan={selectedPlan}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
