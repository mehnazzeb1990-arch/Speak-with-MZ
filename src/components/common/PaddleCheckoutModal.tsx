import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Check, ShieldCheck, Lock, Sparkles, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

interface PaddleCheckoutModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaddleCheckoutModal: React.FC<PaddleCheckoutModalProps> = ({ plan, isOpen, onClose, onSuccess, onCancel }) => {
  const { user, upgradePlan, currency, setCurrency } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paddleInstance, setPaddleInstance] = useState<Paddle | null>(null);
  const [paddleInitialized, setPaddleInitialized] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage(null);

    // Initialize Paddle Client SDK if client token is provided in environment
    const clientToken = 
      (import.meta as any).env?.VITE_PADDLE_CLIENT_TOKEN || 
      (import.meta as any).env?.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';

    if (clientToken && clientToken !== '') {
      const env = (import.meta as any).env?.VITE_PADDLE_ENVIRONMENT || (import.meta as any).env?.PADDLE_ENVIRONMENT || 'sandbox';
      initializePaddle({
        token: clientToken,
        environment: env as any,
        eventCallback: async (event) => {
          if (event.name === 'checkout.completed') {
            const txnId = (event.data as any)?.id;
            if (txnId) {
              await verifyAndActivate(txnId);
            }
          } else if (event.name === 'checkout.closed') {
            setLoading(false);
          }
        },
      }).then((instance) => {
        if (instance) {
          setPaddleInstance(instance);
          setPaddleInitialized(true);
        }
      }).catch((e) => {
        console.warn('Paddle JS initialization notice:', e);
      });
    } else {
      setPaddleInitialized(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isPKR = currency === 'PKR';

  const planDetails = {
    free: {
      name: 'Free Plan',
      priceUSD: '$0',
      pricePKR: 'PKR 0',
      description: 'Limited AI speaking practice, Basic feedback, Access to learning resources',
    },
    intermediate_premium: {
      name: 'Intermediate Premium',
      priceUSD: '$10/mo',
      pricePKR: 'Rs. 2,800/mo',
      description: 'Unlimited AI speaking practice, AI voice conversation, Pronunciation & Grammar feedback',
    },
    advanced_premium: {
      name: 'Advanced Premium',
      priceUSD: '$15/mo',
      pricePKR: 'Rs. 4,200/mo',
      description: 'Advanced Business & Academic topics, Accent analysis, Native idioms & Priority AI Coach',
    },
  }[plan] || {
    name: 'Premium Plan',
    priceUSD: '$10/mo',
    pricePKR: 'Rs. 2,800/mo',
    description: 'Unlimited AI speaking practice & voice conversation',
  };

  const priceFormatted = isPKR ? planDetails.pricePKR : planDetails.priceUSD;

  const verifyAndActivate = async (txnId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/paddle/verify-transaction/${txnId}`);
      const data = await res.json();

      if (data.verified) {
        upgradePlan(plan, 'Paddle Secure Gateway', txnId.slice(-4));
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          setSuccess(false);
          onSuccess?.();
          onClose();
        }, 1500);
        return true;
      } else {
        setErrorMessage(data.error || 'Paddle transaction verification incomplete. Subscription was not activated.');
        setLoading(false);
        return false;
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Verification network error. Please contact support if payment went through.');
      setLoading(false);
      return false;
    }
  };

  const handleStartPaddleCheckout = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/paddle/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          currency,
          userId: user?.id,
          userEmail: user?.email,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.error || 'Unable to create Paddle checkout session. Please check server configuration.');
        setLoading(false);
        return;
      }

      // If Paddle Checkout URL is present, redirect to official hosted page
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // If transactionId and Paddle.js overlay instance are available
      if (data.transactionId && paddleInstance) {
        paddleInstance.Checkout.open({
          transactionId: data.transactionId,
          settings: {
            displayMode: 'overlay',
            theme: 'light',
            locale: 'en',
            successUrl: `${window.location.origin}/?paddle_txn=${data.transactionId}`,
          },
        });
        setLoading(false);
        return;
      }

      // Fallback redirect URL format if transactionId returned
      if (data.transactionId) {
        const env = data.environment === 'production' ? '' : 'sandbox-';
        window.location.href = `https://${env}checkout.paddle.com/checkout/custom/${data.transactionId}`;
        return;
      }

      setErrorMessage('Paddle Checkout initialization failed. Please try again.');
      setLoading(false);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error connecting to Paddle servers.');
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (loading) return;
    onCancel?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#042F2C]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#E6F1EF] rounded-3xl shadow-2xl border border-[#CBDED9] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            <div>
              <h3 className="text-lg font-black">Paddle Secure Payment</h3>
              <p className="text-[11px] text-teal-200">Merchant of Record transaction processed by Paddle.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Currency Selector Toggle */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-[#042F2C] border border-[#14B8A6]/40 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${currency === 'USD' ? 'bg-[#0F766E] text-white font-black' : 'text-teal-200'}`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('PKR')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${currency === 'PKR' ? 'bg-[#0F766E] text-white font-black' : 'text-teal-200'}`}
              >
                PKR (Rs.)
              </button>
            </div>

            <button onClick={handleModalClose} className="p-1 rounded-full hover:bg-white/10 text-teal-200 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {success ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-[#DCEDE9] text-[#0F766E] rounded-full flex items-center justify-center mx-auto border border-[#CBDED9]">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-[#134E4A]">Paddle Payment Confirmed!</h4>
            <p className="text-sm text-teal-900/80 font-medium">
              You are now subscribed to <span className="font-extrabold text-[#0F766E]">{planDetails.name}</span>.
            </p>
            <p className="text-xs text-teal-800/70 font-medium">
              Your transaction has been verified server-side with Paddle.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 text-[#134E4A]">
            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center justify-between">
              <div>
                <p className="font-black text-[#134E4A] text-base">{planDetails.name}</p>
                <p className="text-xs text-teal-800/80 font-medium max-w-xs">{planDetails.description}</p>
              </div>
              <span className="text-xl font-black text-[#0F766E] shrink-0">
                {priceFormatted}
              </span>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Provider Features */}
            <div className="space-y-2 text-xs font-medium text-teal-900/80">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                <span>PCI-DSS Compliant 256-bit encrypted Paddle Checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0F766E]" />
                <span>Supports Credit Cards, Debit Cards, Visa, Mastercard, PayPal & Apple Pay</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#0F766E]" />
                <span>Subscription activates strictly after real Paddle payment verification</span>
              </div>
            </div>

            {/* Provider Notice */}
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-start space-x-2.5 text-xs text-[#134E4A]">
              <Lock className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed font-medium">
                <span className="font-extrabold text-[#134E4A]">Paddle Billing:</span> Official Merchant of Record. Payments are securely processed on Paddle's servers and confirmed via server webhook.
              </div>
            </div>

            {/* Main Action Button */}
            <button
              type="button"
              onClick={handleStartPaddleCheckout}
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-white bg-ai-gradient hover:opacity-95 shadow-lg shadow-teal-900/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 text-white animate-spin" />
                  <span>Initializing Paddle Checkout...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5 text-[#F59E0B]" />
                  <span>Proceed to Paddle Checkout ({priceFormatted})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

