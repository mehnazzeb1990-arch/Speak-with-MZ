import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Check, Sparkles } from 'lucide-react';

interface PaddleCheckoutModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaddleCheckoutModal = CheckoutModal: React.FC<PaddleCheckoutModalProps> = ({ plan, isOpen, onClose, onSuccess, onCancel }) => {
  const { upgradePlan, currency, setCurrency } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('Visa');

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expDate, setExpDate] = useState('12/28');
  const [cvc, setCvc] = useState('987');
  const [name, setName] = useState('MZ User');
  const [success, setSuccess] = useState(false);

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
      name: 'Premium Plan',
      priceUSD: '$10/mo',
      pricePKR: 'Rs. 2,800/mo',
      description: 'Unlimited AI speaking practice, AI voice conversation, Pronunciation & Grammar feedback',
    },
    advanced_premium: {
      name: 'Advanced Premium',
      priceUSD: '$10/mo',
      pricePKR: 'Rs. 2,800/mo',
      description: 'Unlimited AI speaking practice, Voice conversation, Pronunciation, Grammar & Coaching',
    },
  }[plan] || {
    name: 'Premium Plan',
    priceUSD: '$10/mo',
    pricePKR: 'Rs. 2,800/mo',
    description: 'Unlimited AI speaking practice & voice conversation',
  };

  const priceFormatted = isPKR ? planDetails.pricePKR : planDetails.priceUSD;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Process payment through modular payment service layer
    const result = await paymentService.processCardPayment({
      plan,
      currency,
      paymentMethod: selectedMethod,
      cardNumber,
      cardholderName: name,
      expDate,
      cvc,
    });

    if (result.success) {
      upgradePlan(plan, selectedMethod, result.last4);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } else {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
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
              <h3 className="text-lg font-black">Secure Online Payment</h3>
              <p className="text-[11px] text-teal-200">Pay securely using your Visa or Mastercard.</p>
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
            <div className="w-16 h-16 bg-[#DCEDE9] text-[#0F766E] rounded-full flex items-center justify-center mx-auto border border-[#CBDED9] animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-[#134E4A]">Plan Activated Successfully!</h4>
            <p className="text-sm text-teal-900/80 font-medium">
              You are now subscribed to <span className="font-extrabold text-[#0F766E]">{planDetails.name}</span>.
            </p>
            <p className="text-xs text-teal-800/70 font-medium">
              Receipt with invoice details has been added to your Payment History.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5 text-[#134E4A]">
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

            {/* Accepted Payment Methods */}
            <div>
              <label className="block text-xs font-bold uppercase text-teal-800/80 mb-2">
                Accepted Payment Methods
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Visa', 'Mastercard', 'Debit Card', 'Credit Card'] as PaymentMethodType[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                      selectedMethod === method
                        ? 'border-[#0F766E] bg-[#DCEDE9] text-[#0F766E] font-black'
                        : 'border-[#CBDED9] text-[#134E4A] hover:bg-teal-100/60'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-center">{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-teal-800/80">
                <span>Supported Cards:</span>
                <span className="font-extrabold text-[#134E4A]">Visa, Mastercard, Debit Cards, Credit Cards</span>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase text-teal-800/80 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs focus:ring-2 focus:ring-[#0F766E] outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-teal-800/80 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs focus:ring-2 focus:ring-[#0F766E] outline-none font-mono"
                    required
                  />
                  <CreditCard className="w-4 h-4 text-teal-700/60 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-teal-800/80 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs focus:ring-2 focus:ring-[#0F766E] outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-teal-800/80 mb-1">CVC Code</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs focus:ring-2 focus:ring-[#0F766E] outline-none font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Provider Notice */}
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-start space-x-2.5 text-xs text-[#134E4A]">
              <Lock className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed font-medium">
                <span className="font-extrabold text-[#134E4A]">Secure online payment:</span> Your payment is processed through our secure payment provider using PCI-DSS 256-bit SSL encryption.
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-white bg-ai-gradient hover:opacity-95 shadow-lg shadow-teal-900/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
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
