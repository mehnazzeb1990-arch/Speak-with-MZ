import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  FileText,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Crown,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  ChevronRight,
  Receipt,
  UserCheck,
  Lock,
  RotateCcw,
  Sliders,
  Check,
  X,
  Zap,
  Globe
} from 'lucide-react';

import PaddleCheckoutModal from '../common/PaddleCheckoutModal';
import ReceiptModal from '../common/ReceiptModal';
import RefundPolicyModal from '../common/RefundPolicyModal';
import { useAuth, PaymentTransaction } from '../../hooks/useAuth';

export default function SubscriptionView() {
  const {
    user,
    currency,
    setCurrency,
    payments,
    cancelSubscription,
    toggleAutoRenew,
    adminRefundPayment,
  } = useAuth();

  // Tab State: 'subscription' | 'history' | 'admin'
  const [activeTab, setActiveTab] = useState<'subscription' | 'history' | 'admin'>('subscription');

  // Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundPolicyOpen, setIsRefundPolicyOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  // Admin Refund Action State
  const [refundConfirmPayment, setRefundConfirmPayment] = useState<PaymentTransaction | null>(null);

  // Admin Filters
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<'all' | 'completed' | 'refunded'>('all');

  // Toast / Feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // User Plan Detection
  const currentPlan = user?.subscription?.plan || 'free';
  const isPremium = currentPlan === 'intermediate_premium';
  const isCanceled = user?.subscription?.status === 'canceled';
  const autoRenew = user?.subscription?.autoRenew ?? true;

  // Pricing Strings
  const premiumPriceDisplay = currency === 'USD' ? '$10/month' : 'Rs. 2800/month';
  const freePriceDisplay = currency === 'USD' ? '$0' : 'Rs. 0';

  // Admin Metrics Calculation
  const adminMetrics = useMemo(() => {
    const totalTransactions = payments.length;
    const completedPayments = payments.filter((p) => p.status === 'completed');
    const refundedPayments = payments.filter((p) => p.status === 'refunded');

    const totalUsdRevenue = completedPayments
      .filter((p) => p.currency === 'USD')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPkrRevenue = completedPayments
      .filter((p) => p.currency === 'PKR')
      .reduce((sum, p) => sum + p.amount, 0);

    const refundCount = refundedPayments.length;
    const refundRate = totalTransactions > 0 ? ((refundCount / totalTransactions) * 100).toFixed(1) : '0';

    return {
      totalTransactions,
      completedCount: completedPayments.length,
      refundCount,
      refundRate,
      totalUsdRevenue,
      totalPkrRevenue,
    };
  }, [payments]);

  // Filtered Payments for Admin Table
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.userEmail.toLowerCase().includes(adminSearch.toLowerCase()) ||
        payment.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
        payment.paddleTransactionId.toLowerCase().includes(adminSearch.toLowerCase()) ||
        (payment.userName && payment.userName.toLowerCase().includes(adminSearch.toLowerCase()));

      const matchesStatus =
        adminStatusFilter === 'all' || payment.status === adminStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, adminSearch, adminStatusFilter]);

  const handleConfirmCancel = () => {
    cancelSubscription();
    setIsCancelModalOpen(false);
    showToast('Your subscription auto-renewal has been canceled. You retain Premium access until period end.');
  };

  const handleToggleAutoRenew = () => {
    toggleAutoRenew();
    showToast(`Auto-renewal turned ${!autoRenew ? 'ON' : 'OFF'}.`);
  };

  const handleExecuteRefund = () => {
    if (refundConfirmPayment) {
      adminRefundPayment(refundConfirmPayment.id);
      showToast(`Refund processed for ${refundConfirmPayment.userEmail}`);
      setRefundConfirmPayment(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F7F6] text-[#134E4A] font-sans antialiased pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-[#0F766E] px-4 py-3 text-white shadow-xl transition-all animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-[#14B8A6]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Banner */}
      <header className="border-b border-teal-800/10 bg-gradient-to-r from-[#0F766E] via-[#0F766E] to-[#134E4A] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#14B8A6]/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#14B8A6]">
                  Speak with MZ
                </span>
                <span className="flex items-center gap-1 rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Payments securely processed by Paddle
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Subscription & Billing
              </h1>
              <p className="mt-1 text-sm text-teal-100">
                Manage your AI English speaking coach membership, billing currency, and history.
              </p>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-teal-100">
                <Globe className="h-4 w-4 text-[#14B8A6]" />
                <span>Currency:</span>
              </div>
              <button
                onClick={() => setCurrency('USD')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-white text-[#0F766E] shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('PKR')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  currency === 'PKR'
                    ? 'bg-[#F59E0B] text-slate-950 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                PKR (Rs.)
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex gap-2 border-b border-teal-700/50">
            <button
              onClick={() => setActiveTab('subscription')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === 'subscription'
                  ? 'border-[#14B8A6] text-white bg-white/10 rounded-t-xl'
                  : 'border-transparent text-teal-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Crown className="h-4 w-4 text-[#F59E0B]" />
              My Plan & Upgrade
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'border-[#14B8A6] text-white bg-white/10 rounded-t-xl'
                  : 'border-transparent text-teal-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Receipt className="h-4 w-4 text-[#14B8A6]" />
              Payment History
            </button>
            {user?.isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'border-[#F59E0B] text-amber-300 bg-white/10 rounded-t-xl'
                    : 'border-transparent text-amber-200/80 hover:text-amber-200 hover:bg-white/5'
                }`}
              >
                <Sliders className="h-4 w-4 text-[#F59E0B]" />
                Admin Dashboard
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TAB 1: MY SUBSCRIPTION & PLAN COMPARISON */}
        {activeTab === 'subscription' && (
          <div className="space-y-8">
            {/* Current Active Plan Status Banner */}
            <div className="rounded-2xl bg-[#E6F1EF] p-6 shadow-sm border border-teal-800/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F766E] text-white shadow-md">
                    {isPremium ? <Crown className="h-6 w-6 text-[#F59E0B]" /> : <Zap className="h-6 w-6 text-[#14B8A6]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-[#134E4A]">
                        Current Plan: {isPremium ? 'Premium Coaching' : 'Free Learner'}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                          isPremium
                            ? isCanceled
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isPremium ? (isCanceled ? 'Canceled (Active till end)' : 'Active') : 'Free Tier'}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[#134E4A]/80">
                      {isPremium
                        ? `Renews/Expires on ${user?.subscription?.currentPeriodEnd || 'Next Billing Cycle'} via Paddle`
                        : 'Access to 200 Beginner Topics with standard AI feedback.'}
                    </p>
                  </div>
                </div>

                {/* Dashboard Action Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {!isPremium ? (
                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#134E4A] transition-all transform hover:-translate-y-0.5"
                    >
                      <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                      Upgrade to Premium ({premiumPriceDisplay})
                    </button>
                  ) : (
                    <>
                      {/* Auto Renew Toggle */}
                      <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 border border-teal-800/10 shadow-xs">
                        <span className="text-xs font-semibold text-[#134E4A]">Auto-Renew</span>
                        <button
                          onClick={handleToggleAutoRenew}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            autoRenew ? 'bg-[#0F766E]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              autoRenew ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Cancel Button */}
                      {!isCanceled && (
                        <button
                          onClick={() => setIsCancelModalOpen(true)}
                          className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-all"
                        >
                          Cancel Subscription
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => setIsRefundPolicyOpen(true)}
                    className="rounded-xl border border-teal-800/20 bg-white px-3.5 py-2 text-xs font-semibold text-[#0F766E] hover:bg-teal-50 transition-all"
                  >
                    Refund Policy
                  </button>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* FREE PLAN CARD */}
              <div className="flex flex-col justify-between rounded-3xl border border-teal-800/10 bg-white p-8 shadow-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                      Starter
                    </span>
                    {!isPremium && (
                      <span className="flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-[#0F766E]">
                        <UserCheck className="h-3.5 w-3.5" /> Current Plan
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-[#134E4A]">Free Plan</h3>
                  <p className="mt-1 text-sm text-gray-500">Perfect for exploring basic AI speech coaching.</p>

                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-[#134E4A]">
                      {freePriceDisplay}
                    </span>
                    <span className="text-sm font-medium text-gray-500"> / forever</span>
                  </div>

                  <hr className="my-6 border-gray-100" />

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 text-sm">
                    <li className="flex items-center gap-3 text-[#134E4A]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[#0F766E]">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span><strong>200</strong> Beginner Topics</span>
                    </li>
                    <li className="flex items-center gap-3 text-[#134E4A]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[#0F766E]">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>Basic AI feedback on speech</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-400">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <X className="h-3.5 w-3.5" />
                      </div>
                      <span className="line-through">Intermediate & Advanced Topics</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-400">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <X className="h-3.5 w-3.5" />
                      </div>
                      <span className="line-through">Pronunciation & Grammar analysis</span>
                    </li>
                    <li className="flex items-center gap-3 text-[#134E4A]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-gray-500">Supported by ads</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    disabled
                    className="w-full rounded-2xl bg-gray-100 py-3.5 text-sm font-semibold text-gray-400 cursor-not-allowed"
                  >
                    {!isPremium ? 'Active Default Plan' : 'Free Tier'}
                  </button>
                </div>
              </div>

              {/* PREMIUM PLAN CARD */}
              <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#0F766E] bg-white p-8 shadow-xl">
                {/* Popular Badge */}
                <div className="absolute -top-4 right-8 rounded-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  Recommended Coaching
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <Crown className="h-3.5 w-3.5 text-[#F59E0B]" /> Premium
                    </span>
                    {isPremium && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active Plan
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-[#134E4A]">Premium Plan</h3>
                  <p className="mt-1 text-sm text-gray-500">Accelerate fluency with deep AI analytics and unlimited practice.</p>

                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-[#0F766E]">
                      {premiumPriceDisplay}
                    </span>
                    <span className="text-sm font-medium text-gray-500"> / month</span>
                  </div>

                  <hr className="my-6 border-teal-100" />

                  {/* Feature List */}
                  <ul className="space-y-3.5 text-sm">
                    <li className="flex items-center gap-3 text-[#134E4A]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span><strong>Intermediate Topics</strong> & <strong>Advanced Topics</strong></span>
                    </li>
                    <li className="flex items-center gap-3 text-[#134E4A]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span><strong>Unlimited AI coaching</strong> sessions</span>
                    </li>
                    <li className="flex items-center gap-3 text-[#134E4A]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>Real-time <strong>Pronunciation feedback</strong></span>
                    </li>
                    <li className="flex items-center gap-3 text-[#134E4A]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>Detailed <strong>Grammar feedback</strong> & corrections</span>
                    </li>
                    <li className="flex items-center gap-3 text-[#134E4A]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>Smart <strong>Vocabulary improvement</strong> tips</span>
                    </li>
                    <li className="flex items-center gap-3 text-[#134E4A]">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span><strong>100% Ad-free experience</strong></span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] py-4 text-base font-bold text-white shadow-lg hover:bg-[#134E4A] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Sparkles className="h-5 w-5 text-[#F59E0B]" />
                    {isPremium ? 'Extend Subscription via Paddle' : `Upgrade Now (${premiumPriceDisplay})`}
                  </button>
                  <p className="mt-2 text-center text-xs text-gray-400">
                    Cancel anytime in 1-click. Payments securely processed by Paddle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENT HISTORY TABLE */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-6 shadow-sm border border-teal-800/10">
              <div>
                <h2 className="text-xl font-bold text-[#134E4A]">Payment & Receipt History</h2>
                <p className="text-sm text-gray-500">
                  All past transactions, invoices, and receipts processed via Paddle.
                </p>
              </div>

              <button
                onClick={() => setIsRefundPolicyOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-teal-800/20 bg-[#E6F1EF] px-4 py-2.5 text-xs font-bold text-[#0F766E] hover:bg-teal-100 transition-all"
              >
                <HelpCircle className="h-4 w-4" />
                View Refund Policy
              </button>
            </div>

            {/* Payments Table */}
            <div className="overflow-hidden rounded-2xl border border-teal-800/10 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#E6F1EF] text-xs font-bold uppercase tracking-wider text-[#134E4A]">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Plan</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No payment history found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-teal-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-semibold text-[#0F766E]">
                            {payment.paddleTransactionId || payment.id}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-600">{payment.date}</td>
                          <td className="px-6 py-4 font-semibold text-[#134E4A]">{payment.planName}</td>
                          <td className="px-6 py-4 font-bold text-[#134E4A]">
                            {payment.currency === 'USD' ? `$${payment.amount}.00` : `Rs. ${payment.amount}`}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                                payment.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : payment.status === 'refunded'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {payment.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                              {payment.status === 'refunded' && <RotateCcw className="h-3 w-3" />}
                              {payment.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedReceipt(payment)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-800/20 bg-white px-3 py-1.5 text-xs font-bold text-[#0F766E] hover:bg-[#E6F1EF] transition-all"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              View Receipt
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN MANAGEMENT DASHBOARD */}
        {activeTab === 'admin' && user?.isAdmin && (
          <div className="space-y-8">
            {/* Admin Header */}
            <div className="rounded-2xl bg-gradient-to-r from-[#134E4A] to-[#0F766E] p-6 text-white shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="rounded-md bg-amber-400/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-300">
                    Administrator Workspace
                  </span>
                  <h2 className="mt-2 text-2xl font-bold">Revenue & Payment Control Panel</h2>
                  <p className="text-xs text-teal-100">
                    Monitor transaction counts, revenue statistics, and execute refunds via Paddle.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4 text-[#F59E0B]" />
                  Paddle Merchant Integration
                </div>
              </div>
            </div>

            {/* Revenue & Stat Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white p-5 border border-teal-800/10 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Total USD Revenue
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-[#134E4A]">
                  ${adminMetrics.totalUsdRevenue}.00
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-1">Processed securely</p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-teal-800/10 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Total PKR Revenue
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-[#0F766E]">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-[#134E4A]">
                  Rs. {adminMetrics.totalPkrRevenue}
                </p>
                <p className="text-xs text-teal-600 font-medium mt-1">Local currency volume</p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-teal-800/10 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Transactions
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-[#134E4A]">
                  {adminMetrics.totalTransactions}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {adminMetrics.completedCount} Successful
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-teal-800/10 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Refund Count
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                    <RotateCcw className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-[#134E4A]">
                  {adminMetrics.refundCount}
                </p>
                <p className="text-xs text-amber-700 font-medium mt-1">
                  {adminMetrics.refundRate}% Refund Rate
                </p>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-4 shadow-sm border border-teal-800/10">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Search by user email, payment ID, or transaction..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={adminStatusFilter}
                  onChange={(e) => setAdminStatusFilter(e.target.value as 'all' | 'completed' | 'refunded')}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-[#134E4A] focus:border-[#0F766E] focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed Only</option>
                  <option value="refunded">Refunded Only</option>
                </select>
              </div>
            </div>

            {/* Admin Payments Table */}
            <div className="overflow-hidden rounded-2xl border border-teal-800/10 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#E6F1EF] text-xs font-bold uppercase tracking-wider text-[#134E4A]">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Transaction Ref</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Process Refund</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No matching payments found.
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-teal-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-[#134E4A]">{payment.userName || 'Learner'}</p>
                            <p className="text-xs text-gray-500">{payment.userEmail}</p>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs font-semibold text-[#0F766E]">
                            {payment.paddleTransactionId}
                          </td>
                          <td className="px-6 py-4 font-bold text-[#134E4A]">
                            {payment.currency === 'USD' ? `$${payment.amount}.00` : `Rs. ${payment.amount}`}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-gray-600">{payment.date}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                                payment.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {payment.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {payment.status === 'completed' ? (
                              <button
                                onClick={() => setRefundConfirmPayment(payment)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Refund Payment
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400 font-medium italic">
                                Refunded on {payment.refundDate || 'Record'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER SECURITY & REASSURANCE */}
      <footer className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-teal-800/10 bg-[#E6F1EF] p-6 text-center text-[#134E4A]">
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#0F766E]" />
              <span className="text-sm font-bold">Payments securely processed by Paddle</span>
            </div>
            <span className="hidden text-gray-300 sm:inline">•</span>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Lock className="h-4 w-4 text-[#14B8A6]" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
            <span className="hidden text-gray-300 sm:inline">•</span>
            <button
              onClick={() => setIsRefundPolicyOpen(true)}
              className="text-xs font-bold text-[#0F766E] underline hover:text-[#134E4A]"
            >
              14-Day Refund Guarantee
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: PADDLE CHECKOUT MODAL */}
      <PaddleCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan="intermediate_premium"
      />

      {/* MODAL 2: RECEIPT MODAL */}
      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
      />

      {/* MODAL 3: REFUND POLICY MODAL */}
      <RefundPolicyModal
        isOpen={isRefundPolicyOpen}
        onClose={() => setIsRefundPolicyOpen(false)}
      />

      {/* MODAL 4: CANCEL SUBSCRIPTION CONFIRMATION MODAL */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#134E4A]">Cancel Subscription?</h3>
            </div>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Are you sure you want to cancel your Premium AI Coaching subscription?
              You will lose access to unlimited intermediate & advanced topics, pronunciation analysis, and ad-free learning at the end of your billing cycle.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 shadow-sm"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADMIN PROCESS REFUND CONFIRMATION MODAL */}
      {refundConfirmPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <RotateCcw className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#134E4A]">Confirm Admin Refund</h3>
            </div>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              You are about to process a full refund for{' '}
              <strong>{refundConfirmPayment.userEmail}</strong>.
            </p>

            <div className="my-4 rounded-xl bg-[#E6F1EF] p-4 text-sm text-[#134E4A]">
              <p><strong>Transaction:</strong> {refundConfirmPayment.paddleTransactionId}</p>
              <p><strong>Refund Amount:</strong> {refundConfirmPayment.currency === 'USD' ? `$${refundConfirmPayment.amount}.00` : `Rs. ${refundConfirmPayment.amount}`}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setRefundConfirmPayment(null)}
                className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRefund}
                className="flex-1 rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 shadow-sm"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
