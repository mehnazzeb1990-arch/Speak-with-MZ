import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StripeCheckoutModal } from '../common/StripeCheckoutModal';
import { PaddleCheckoutModal } from '../common/PaddleCheckoutModal';
import { ReceiptModal } from '../common/ReceiptModal';
import { RefundPolicyModal } from '../common/RefundPolicyModal';

import {
  Crown,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Printer,
  RefreshCw,
  AlertTriangle,
  X,
  HelpCircle,
  Lock,
  UserCheck,
  Search,
  Filter,
  DollarSign,
  Settings,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import { SubscriptionPlan, PaymentRecord } from '../../types';

export const SubscriptionView: React.FC = () => {
  const {
    user,
    currency,
    setCurrency,
    payments,
    cancelSubscription,
    toggleAutoRenew,
    upgradePlan,
    adminRefundPayment,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'my_billing' | 'admin_management'>('my_billing');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] =
    useState<SubscriptionPlan>('intermediate_premium');

  const [receiptPayment, setReceiptPayment] = useState<PaymentRecord | null>(null);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
// Admin section filters
const [adminSearch, setAdminSearch] = useState('');
const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');

const isPKR = currency === 'PKR';

// My payments
const myPayments = payments.filter(
  (p) => p.userEmail === user?.email || p.userId === user?.id
);

// Admin stats calculation
const totalRevenueUSD = payments
  .filter((p) => p.status === 'paid')
  .reduce((acc, curr) => acc + curr.amountUSD, 0);

const totalRevenuePKR = payments
  .filter((p) => p.status === 'paid')
  .reduce((acc, curr) => acc + curr.amountPKR, 0);

const totalRefundedCount = payments.filter(
  (p) => p.status === 'refunded'
).length;

const filteredAdminPayments = payments.filter((p) => {
  const matchesSearch =
    p.userName.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.userEmail.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.invoiceId.toLowerCase().includes(adminSearch.toLowerCase());

  const matchesStatus =
    adminStatusFilter === 'all' || p.status === adminStatusFilter;

  return matchesSearch && matchesStatus;
});

const handleCancelClick = () => {
  cancelSubscription();
  setCancelConfirmOpen(false);
};
return (

      {/* Top Banner & Title */}

            Subscriptions & Global Payments

            Manage your plan, auto-renewal, payment history, receipts, or administrative transactions.

      {/* Currency Switcher & View Tabs */}

            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-xl transition-all ${currency === 'USD' ? 'bg-[#0F766E] text-white shadow-sm' : 'text-teal-900/80 font-medium'}`}
            >
              USD ($)

            <button
              onClick={() => setCurrency('PKR')}
              className={`px-3 py-1.5 rounded-xl transition-all ${currency === 'PKR' ? 'bg-[#0F766E] text-white shadow-sm' : 'text-teal-900/80 font-medium'}`}
            >
              PKR (Rs.)

            <button
              onClick={() => setActiveTab('my_billing')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'my_billing' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              My Billing

            <button
              onClick={() => setActiveTab('admin_management')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1 ${activeTab === 'admin_management' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >

              Admin Portal
{activeTab === 'my_billing' ? (

  {/* Current Subscription Card */}

  Current Subscription Plan

  {user?.subscriptionPlan.replace('_', ' ')}

  <span
    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
      user?.subscriptionStatus === 'active'
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
    }`}
  >
    {user?.subscriptionStatus || 'Active'}
  </span>

  {user?.subscriptionPlan === 'free'
    ? '200 Beginner Topics, Basic Feedback, Ads Placement enabled.'
    : `Full access to structured curriculum, 24/7 unlimited AI coaching, and ad-free environment. Next billing: ${user?.renewalDate || 'August 30, 2026'}.`}
<div className="flex flex-wrap items-center gap-2">
  {user?.subscriptionPlan !== 'free' && (
    <button
      onClick={toggleAutoRenew}
      className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
    >
      Auto-Renew: {user?.autoRenew !== false ? 'ENABLED' : 'DISABLED'}
    </button>
  )}

  <button
    onClick={() => {
      setSelectedPlanToUpgrade('intermediate_premium');
      setCheckoutModalOpen(true);
    }}
    className="px-5 py-2.5 rounded-2xl bg-ai-gradient hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-teal-900/20 transition-all flex items-center space-x-1.5 cursor-pointer"
  >
    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
    <span>
      {user?.subscriptionPlan === 'free'
        ? 'Upgrade Plan ($10/mo)'
        : 'Change / Upgrade Plan'}
    </span>
  </button>
</div>

</div>

{/* Plan Details Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
    <span className="text-slate-400 font-semibold block mb-1">
      Billing Amount
    </span>

    <span className="font-extrabold text-slate-900 dark:text-white text-base">
      {user?.subscriptionPlan === 'free'
        ? (isPKR ? 'PKR 0' : '$0')
        : (isPKR ? 'Rs. 2,800 / month' : '$10.00 / month')}
    </span>
  </div> <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
  <span className="text-slate-400 font-semibold block mb-1">
    PCI Payment Protection
  </span>

  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
    <ShieldCheck className="w-4 h-4" />
    <span>Card Tokenized & Secure</span>
  </span>
</div>

<div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center justify-between">
  <div>
    <span className="text-[#134E4A] font-semibold block text-xs">
      14-Day Refund Guarantee
    </span>

    <span className="text-[11px] text-teal-800/70 font-medium">
      Full 100% money-back guarantee
    </span>
  </div>

  <button
    onClick={() => setRefundModalOpen(true)}
    className="px-3 py-1.5 rounded-xl bg-[#0F766E] text-white font-bold text-[11px] hover:bg-[#115E59] transition-colors shadow-sm cursor-pointer"
  >
    Refund Policy
  </button>
</div>

</div>

{/* Cancel Subscription Footer link */}
{user?.subscriptionPlan !== 'free' &&
  user?.subscriptionStatus === 'active' && (
    <div className="pt-2 flex justify-end">
      <button
        onClick={() => setCancelConfirmOpen(true)}
        className="text-xs text-rose-500 hover:text-rose-600 font-bold underline"
      >
        Cancel Subscription
      </button>
    </div>
)}
{/* Payment History Table Section */}
<div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
        Payment History & Receipts
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        View your itemized invoices, receipts, and payment logs.
      </p>
    </div>
  </div>

  {myPayments.length > 0 ? (
    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
      <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="p-3.5">Invoice ID</th>
            <th className="p-3.5">Date</th>
            <th className="p-3.5">Plan</th>
            <th className="p-3.5">Amount</th>
            <th className="p-3.5">Payment Method</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 text-right">Receipt</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {myPayments.map((payment) => (
            <tr
              key={payment.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                {payment.invoiceId}
              </td>

              <td className="p-3.5 text-slate-500">{payment.date}</td>

              <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                {payment.planName}
              </td>

              <td className="p-3.5 font-bold font-mono">
                {isPKR
                  ? `PKR ${payment.amountPKR.toLocaleString()}`
                  : `$${payment.amountUSD.toFixed(2)}`}
              </td>

              <td className="p-3.5 text-slate-600 dark:text-slate-400">
                {payment.paymentMethod}{' '}
                {payment.cardLast4 ? `(•• ${payment.cardLast4})` : ''}
              </td>

              <td className="p-3.5">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                    payment.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {payment.status}
                </span>
              </td>

              <td className="p-3.5 text-right">
                <button
                  onClick={() => setReceiptPayment(payment)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-bold text-[11px] inline-flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Receipt</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
      No billing history records found for your account.
  )}
