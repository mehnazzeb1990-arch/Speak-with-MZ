import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PaddleCheckoutModal } from '../common/PaddleCheckoutModal';
import { RefundPolicyModal } from '../common/RefundPolicyModal';
import { SupportChatModal } from '../common/SupportChatModal';
import { 
  Check, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  HelpCircle, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  Zap,
  Star,
  Loader2,
  X
} from 'lucide-react';

interface PricingViewProps {
  onNavigate?: (v: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigate }) => {
  const { user, currency, setCurrency, upgradePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<'pricing' | 'success' | 'cancelled'>('pricing');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isPKR = currency === 'PKR';

  // Handle URL redirect query parameters from Stripe Hosted Checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (payment === 'success') {
      upgradePlan('intermediate_premium');
      setPaymentState('success');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (payment === 'cancelled') {
      setPaymentState('cancelled');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleCheckoutSuccess = () => {
    upgradePlan('intermediate_premium');
    setPaymentState('success');
  };

  const handleCheckoutCancel = () => {
    setPaymentState('cancelled');
  };

  const handleRetry = () => {
    setPaymentState('pricing');
    handleUpgradeToPremium('intermediate_premium');
  };

  const handleUpgradeToPremium = async (plan: SubscriptionPlan) => {
    setIsRedirecting(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          currency,
          userId: user?.id,
          userEmail: user?.email,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (err) {
      console.error('Failed to create Stripe checkout session:', err);
    } finally {
      setIsRedirecting(false);
    }
    // Fallback to interactive modal checkout
    setSelectedPlan(plan);
  };

  return (
    <div id="pricing-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. PAYMENT SUCCESS SCREEN */}
      {paymentState === 'success' && (
        <div className="max-w-2xl mx-auto my-8 p-8 sm:p-12 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#DCEDE9] text-[#0F766E] rounded-full flex items-center justify-center mx-auto border border-[#CBDED9] animate-bounce shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#134E4A]">Payment Successful 🎉</h2>
            <p className="text-sm font-semibold text-teal-900/80 max-w-md mx-auto">
              Welcome to Speak with MZ Premium. Your AI speaking coach is now unlocked.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] text-xs text-[#134E4A] font-medium max-w-md mx-auto space-y-1">
            <p className="flex items-center justify-center space-x-1.5 font-bold text-[#0F766E]">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
              <span>Unlimited Access Activated</span>
            </p>
            <p className="text-teal-800/80">You can now enjoy unlimited conversations with all AI coach personas, real-time grammar feedback, and custom vocabulary drills.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('speaking');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-xl shadow-teal-900/30 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
              <span>Start Speaking Practice</span>
            </button>
            
            <button
              onClick={() => setPaymentState('pricing')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#DCEDE9] text-[#134E4A] font-bold text-xs hover:bg-teal-200/70 border border-[#CBDED9] transition-all cursor-pointer"
            >
              View Plan Details
            </button>
          </div>
        </div>
      )}

      {/* 2. PAYMENT CANCELLED SCREEN */}
      {paymentState === 'cancelled' && (
        <div className="max-w-2xl mx-auto my-8 p-8 sm:p-12 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100/80 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200 shadow-md">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#134E4A]">Payment Not Completed</h2>
            <p className="text-sm font-semibold text-teal-900/80 max-w-md mx-auto">
              Your payment was cancelled. You can try again anytime.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] text-xs text-[#134E4A] font-medium max-w-md mx-auto">
            No charges were made to your account. If you experienced technical issues or have billing questions, our support assistant is available 24/7.
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-xl shadow-teal-900/30 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              onClick={() => setSupportModalOpen(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#DCEDE9] text-[#134E4A] font-bold text-xs hover:bg-teal-200/70 border border-[#CBDED9] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#0F766E]" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN PRICING CONTENT */}
      {paymentState === 'pricing' && (
        <>
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#0F766E] px-3.5 py-1 rounded-full bg-[#DCEDE9] border border-[#CBDED9] inline-block">
              Flexible AI Coaching Subscriptions
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#134E4A] tracking-tight">
              Choose Your Learning Plan
            </h1>
            <p className="text-teal-900/80 font-medium text-base sm:text-lg max-w-2xl mx-auto">
              Unlock your full English speaking potential with AI-powered practice.
            </p>

            {/* Currency & Billing Switchers Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              
              {/* Currency Toggle (USD vs PKR) */}
              <div className="inline-flex items-center p-1 rounded-2xl bg-[#DCEDE9] text-xs font-bold border border-[#CBDED9]">
                <span className="px-3 text-teal-800/70 text-[11px] font-bold">Currency:</span>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${currency === 'USD' ? 'bg-[#0F766E] text-white shadow-sm font-extrabold' : 'text-[#134E4A]'}`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('PKR')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${currency === 'PKR' ? 'bg-[#0F766E] text-white shadow-sm font-extrabold' : 'text-[#134E4A]'}`}
                >
                  PKR (Rs.)
                </button>
              </div>

              {/* Monthly / Annual Toggle */}
              <div className="inline-flex items-center p-1 rounded-2xl bg-[#DCEDE9] text-xs font-bold border border-[#CBDED9]">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${billingCycle === 'monthly' ? 'bg-[#0F766E] text-white shadow-sm font-extrabold' : 'text-[#134E4A]'}`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${billingCycle === 'annual' ? 'bg-[#0F766E] text-white shadow-sm font-extrabold' : 'text-[#134E4A]'}`}
                >
                  <span>Annual Billing</span>
                  <span className="text-[10px] bg-[#F59E0B] text-slate-950 px-2 py-0.5 rounded-md font-black">Save 20%</span>
                </button>
              </div>

            </div>
          </div>

          {/* PCI Security Guarantee Banner */}
          <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#134E4A] max-w-5xl mx-auto shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-[#0F766E] text-white shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="font-extrabold text-[#134E4A]">Secure payments powered by Stripe</p>
                <p className="text-teal-800/70 text-[11px] font-medium">100% PCI-DSS Compliant. Instant activation & 14-day money-back guarantee.</p>
              </div>
            </div>
            <button
              onClick={() => setRefundModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#E6F1EF] text-[#0F766E] font-extrabold text-xs hover:bg-teal-100 border border-[#CBDED9] shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>14-Day Refund Guarantee</span>
            </button>
          </div>

          {/* TWO MAIN PLAN CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* 1. FREE PLAN */}
            <div className="rounded-3xl bg-[#E6F1EF] p-8 sm:p-10 border border-[#CBDED9] shadow-sm space-y-6 flex flex-col justify-between hover:border-[#0F766E]/40 transition-all">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-[#134E4A]">Free Plan</h3>
                    <p className="text-xs text-teal-800/70 font-medium">Basic AI practice for beginners</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9] px-3 py-1.5 rounded-xl">
                    Free Tier
                  </span>
                </div>

                <div>
                  <span className="text-4xl sm:text-5xl font-black text-[#134E4A]">
                    {isPKR ? 'Rs. 0' : '$0'}
                  </span>
                  <span className="text-xs text-teal-800/70 font-medium"> / forever</span>
                </div>

                <div className="border-t border-[#CBDED9] pt-5 space-y-3.5">
                  <p className="text-xs font-black uppercase text-teal-900/80 tracking-wider">Plan Highlights:</p>
                  <ul className="space-y-3 text-xs text-[#134E4A] font-semibold">
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#DCEDE9] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CBDED9]">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Limited AI speaking practice</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#DCEDE9] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CBDED9]">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Basic feedback</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#DCEDE9] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CBDED9]">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Access to learning resources</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    if (user?.subscriptionPlan === 'free') return;
                    setSelectedPlan('free');
                  }}
                  disabled={user?.subscriptionPlan === 'free'}
                  className={`w-full py-4 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                    user?.subscriptionPlan === 'free'
                      ? 'bg-[#DCEDE9] text-teal-800/60 border border-[#CBDED9] cursor-default'
                      : 'bg-[#134E4A] text-white hover:bg-[#0F766E] shadow-md'
                  }`}
                >
                  {user?.subscriptionPlan === 'free' ? 'Current Active Plan' : 'Continue Free'}
                </button>
              </div>
            </div>

            {/* 2. PREMIUM PLAN (HIGHLIGHTED) */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white p-8 sm:p-10 border-2 border-[#14B8A6] shadow-2xl space-y-6 flex flex-col justify-between scale-102">
              
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F59E0B] text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                <span>Most Popular — Best Value</span>
              </span>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white">Premium Plan</h3>
                    <p className="text-xs text-teal-200 font-medium">Complete AI coach unlock</p>
                  </div>
                  <Crown className="w-7 h-7 text-[#F59E0B]" />
                </div>

                <div>
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    {isPKR 
                      ? (billingCycle === 'monthly' ? 'Rs. 2,800' : 'Rs. 2,240') 
                      : (billingCycle === 'monthly' ? '$10' : '$8')}
                  </span>
                  <span className="text-xs text-teal-200 font-medium"> / month</span>
                  {billingCycle === 'annual' && (
                    <span className="block text-[11px] text-[#F59E0B] font-bold mt-1">Billed annually ($96/yr)</span>
                  )}
                </div>

                <div className="border-t border-teal-500/30 pt-5 space-y-3.5">
                  <p className="text-xs font-black uppercase text-teal-200 tracking-wider">Everything in Free, plus:</p>
                  <ul className="space-y-3 text-xs text-teal-50 font-medium">
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#14B8A6] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white">Unlimited AI speaking practice</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#14B8A6] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>AI voice conversation (ElevenLabs & Gemini)</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#14B8A6] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Pronunciation feedback & sound analysis</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#14B8A6] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Grammar correction & sentence fixes</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#14B8A6] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Vocabulary improvement & Idioms vault</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#14B8A6] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Speaking progress tracking & history</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#F59E0B] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-[#F59E0B]">Personalized AI coaching & 100% Ad-Free</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleUpgradeToPremium('intermediate_premium')}
                  disabled={isRedirecting}
                  className="w-full py-4 rounded-2xl bg-ai-gradient hover:opacity-95 font-black text-white text-sm transition-all shadow-xl shadow-teal-900/50 flex items-center justify-center space-x-2 cursor-pointer group disabled:opacity-75"
                >
                  {isRedirecting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span>Connecting to Stripe...</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade to Premium</span>
                      <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* FEATURE COMPARISON TABLE */}
          <div className="max-w-5xl mx-auto space-y-6 pt-6">
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black text-[#134E4A]">Plan Feature Comparison</h3>
              <p className="text-xs text-teal-900/80 font-medium">Compare capabilities across Free vs Premium tiers</p>
            </div>

            <div className="card-ai-luxury overflow-hidden border border-[#CBDED9]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DCEDE9] text-[#134E4A] font-black uppercase text-[11px] border-b border-[#CBDED9]">
                    <tr>
                      <th className="p-4 sm:p-5">Feature</th>
                      <th className="p-4 sm:p-5 text-center w-36">Free Plan</th>
                      <th className="p-4 sm:p-5 text-center w-44 bg-[#0F766E] text-white">Premium ($10/mo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBDED9] text-[#134E4A] font-medium">
                    <tr>
                      <td className="p-4 font-bold">AI Speaking Practice Time</td>
                      <td className="p-4 text-center text-teal-800">Limited (200 min/mo)</td>
                      <td className="p-4 text-center font-black text-[#0F766E] bg-teal-50/50">Unlimited 24/7</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">AI Voice Conversations</td>
                      <td className="p-4 text-center text-teal-800">Basic Web Voice</td>
                      <td className="p-4 text-center font-black text-[#0F766E] bg-teal-50/50">Neural ElevenLabs + Gemini</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">Pronunciation Feedback</td>
                      <td className="p-4 text-center text-teal-800">Basic score</td>
                      <td className="p-4 text-center font-black text-[#0F766E] bg-teal-50/50">Sound & Accent Analysis</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">Grammar Correction</td>
                      <td className="p-4 text-center text-teal-800">General tips</td>
                      <td className="p-4 text-center font-black text-[#0F766E] bg-teal-50/50">Real-Time Sentence Fixes</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">Vocabulary Improvement</td>
                      <td className="p-4 text-center text-teal-800">Standard word cards</td>
                      <td className="p-4 text-center font-black text-[#0F766E] bg-teal-50/50">Idioms & Vocab Vault</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">Speaking Progress Tracking</td>
                      <td className="p-4 text-center text-teal-800">Basic streak</td>
                      <td className="p-4 text-center font-black text-[#0F766E] bg-teal-50/50">Full Analytics & History</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">Personalized AI Coaching</td>
                      <td className="p-4 text-center text-teal-800">Standard Coach MZ</td>
                      <td className="p-4 text-center font-black text-[#0F766E] bg-teal-50/50">Unlimited Coach MZ AI Sessions</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">Ad-Free Experience</td>
                      <td className="p-4 text-center text-amber-800 font-bold">Ad Supported</td>
                      <td className="p-4 text-center font-black text-[#0F766E] bg-teal-50/50">100% Ad-Free Clean UI</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* BILLING SECTION */}
          <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#DCEDE9] border border-[#CBDED9] space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#CBDED9] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#0F766E] text-white">
                  <CreditCard className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#134E4A]">Secure payments powered by Stripe.</h3>
                  <p className="text-xs text-teal-800/80 font-medium">Global payment processing with PCI-DSS 256-bit encryption.</p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#E6F1EF] text-[#0F766E] border border-[#CBDED9] text-xs font-black">
                🔒 256-Bit SSL Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#134E4A]">
              <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-1.5">
                <h4 className="font-extrabold text-[#134E4A] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                  <span>Payments are securely processed</span>
                </h4>
                <p className="text-teal-800/80 font-medium">All financial transactions are handled directly through Stripe's certified banking infrastructure.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-1.5">
                <h4 className="font-extrabold text-[#134E4A] flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-[#0F766E]" />
                  <span>Instant Activation</span>
                </h4>
                <p className="text-teal-800/80 font-medium">Premium access activates immediately after successful payment confirmation.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-1.5">
                <h4 className="font-extrabold text-[#134E4A] flex items-center space-x-1.5">
                  <RefreshCw className="w-4 h-4 text-[#0F766E]" />
                  <span>Cancel Anytime</span>
                </h4>
                <p className="text-teal-800/80 font-medium">Users can manage or cancel subscriptions anytime with 1-click from account settings.</p>
              </div>
            </div>
          </div>

          {/* PAYMENT FAQ SECTION */}
          <div className="max-w-3xl mx-auto space-y-6 pt-4">
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black text-[#134E4A]">Payment & Subscription FAQs</h3>
              <p className="text-xs text-teal-900/80 font-medium">Common questions about billing and security</p>
            </div>

            <div className="space-y-3">
              
              {/* FAQ 1 */}
              <div className="card-ai-luxury border border-[#CBDED9] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-black text-xs sm:text-sm text-[#134E4A] cursor-pointer"
                >
                  <span>Is my payment secure?</span>
                  {openFaq === 1 ? <ChevronUp className="w-4 h-4 text-[#0F766E]" /> : <ChevronDown className="w-4 h-4 text-[#0F766E]" />}
                </button>
                {openFaq === 1 && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-teal-900/80 font-medium border-t border-[#CBDED9] pt-3 bg-[#E6F1EF]">
                    Yes, payments are securely processed through Stripe. We follow PCI-DSS Level 1 compliance standards and never store credit card or banking login credentials on our servers.
                  </div>
                )}
              </div>

              {/* FAQ 2 */}
              <div className="card-ai-luxury border border-[#CBDED9] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-black text-xs sm:text-sm text-[#134E4A] cursor-pointer"
                >
                  <span>When will premium features activate?</span>
                  {openFaq === 2 ? <ChevronUp className="w-4 h-4 text-[#0F766E]" /> : <ChevronDown className="w-4 h-4 text-[#0F766E]" />}
                </button>
                {openFaq === 2 && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-teal-900/80 font-medium border-t border-[#CBDED9] pt-3 bg-[#E6F1EF]">
                    Premium features activate immediately after successful payment. You will gain instant access to unlimited AI speaking conversations, real-time grammar doctor corrections, and custom vocabulary modules.
                  </div>
                )}
              </div>

              {/* FAQ 3 */}
              <div className="card-ai-luxury border border-[#CBDED9] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-black text-xs sm:text-sm text-[#134E4A] cursor-pointer"
                >
                  <span>Can I cancel my subscription?</span>
                  {openFaq === 3 ? <ChevronUp className="w-4 h-4 text-[#0F766E]" /> : <ChevronDown className="w-4 h-4 text-[#0F766E]" />}
                </button>
                {openFaq === 3 && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-teal-900/80 font-medium border-t border-[#CBDED9] pt-3 bg-[#E6F1EF]">
                    Yes, you can manage your subscription anytime from your account settings. If you cancel, you will maintain full premium access until the end of your current billing period. We also offer a 14-day 100% money-back guarantee.
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* PAYMENT SUPPORT SECTION (No fake address or phone!) */}
          <div className="max-w-3xl mx-auto pt-6 text-center">
            <div className="p-6 rounded-3xl bg-[#042F2C] text-white border border-[#14B8A6]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Bot className="w-5 h-5 text-[#F59E0B]" />
                  <h4 className="font-black text-base text-white">Need help with payments?</h4>
                </div>
                <p className="text-xs text-teal-100 font-medium">Chat with MZ Support Assistant for instant payment guidance or support tickets.</p>
              </div>

              <button
                onClick={() => setSupportModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-lg shadow-teal-900/40 hover:opacity-95 transition-all flex items-center space-x-2 cursor-pointer shrink-0"
              >
                <Bot className="w-4 h-4 text-[#F59E0B]" />
                <span>Chat with MZ Support Assistant</span>
              </button>
            </div>
          </div>
        </>
      )}

     {/* PADDLE CHECKOUT MODAL */}
<PaddleCheckoutModal
        plan={selectedPlan || 'intermediate_premium'}
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        onSuccess={handleCheckoutSuccess}
        onCancel={handleCheckoutCancel}
      />

      {/* REFUND POLICY MODAL */}
      <RefundPolicyModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
      />

      {/* SUPPORT CHAT MODAL */}
      <SupportChatModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        initialTopic="pricing"
      />

    </div>
  );
};
