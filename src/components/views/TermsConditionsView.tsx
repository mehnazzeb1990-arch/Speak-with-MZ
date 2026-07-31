import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TermsConditionsView: React.FC = () => {
  return (
    <div id="terms-conditions-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-800 dark:text-slate-200">
      <div className="flex items-center space-x-3">
        <ShieldCheck className="w-8 h-8 text-teal-500" />
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms & Conditions</h1>
      </div>
      <p className="text-xs text-slate-400">Effective Date: January 15, 2026</p>

      <div className="space-y-4 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
        <p>By creating an account or accessing Speak with MZ, you agree to comply with these terms of service and all applicable laws and regulations.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Subscription & Billing</h2>
        <p>Premium plans renew automatically each month or year depending on your selected billing cycle. You may cancel at any time through your Account Settings.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">3. User Conduct</h2>
        <p>Users must not transmit abusive, illegal, or harmful content during AI speaking practice sessions.</p>
      </div>
    </div>
  );
};
