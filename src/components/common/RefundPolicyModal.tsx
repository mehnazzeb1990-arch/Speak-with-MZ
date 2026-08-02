import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({ isOpen, onClose }) => {
  const { payments, requestRefund } = useAuth();
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');
  const [reason, setReason] = useState<string>('Changed my mind');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const eligiblePayments = payments.filter((p) => p.status === 'paid');

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    const paymentIdToRefund = selectedPaymentId || eligiblePayments[0]?.id;
    if (!paymentIdToRefund) return;

    setSubmitting(true);
    await requestRefund(paymentIdToRefund, reason);
    setSubmitting(false);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#042F2C]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#E6F1EF] rounded-3xl shadow-2xl border border-[#CBDED9] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#14B8A6]" />
            <h3 className="text-lg font-black">14-Day 100% Refund Policy</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-teal-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#DCEDE9] text-[#0F766E] rounded-full flex items-center justify-center mx-auto border border-[#CBDED9] animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-[#134E4A]">Refund Request Processed!</h4>
            <p className="text-xs text-teal-900/80 font-medium max-w-sm mx-auto">
              Your refund of 100% of your subscription fee has been initiated. Funds will return to your original payment card / account within 3–5 business days.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-ai-gradient text-white font-black text-xs cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6 text-[#134E4A]">
            {/* Policy Summary */}
            <div className="space-y-3 text-xs leading-relaxed border-b border-[#CBDED9] pb-5">
              <div className="flex items-start space-x-2.5 p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] text-[#134E4A]">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span className="font-medium">
                  <strong className="font-black text-[#134E4A]">No-Questions-Asked Guarantee:</strong> If you are not completely satisfied with your Speak with MZ Intermediate or Advanced plan within 14 days of purchase, you get a full 100% refund.
                </span>
              </div>
              <ul className="space-y-1 text-teal-900/80 font-medium text-[11px] list-disc list-inside">
                <li>Instant processing to Visa, Mastercard, Debit Cards, and Credit Cards.</li>
                <li>Your subscription reverts back to the 200 Beginner Free Plan upon refund.</li>
                <li>PCI-compliant safe processing guarantee.</li>
              </ul>
            </div>

            {/* Request Refund Form */}
            {eligiblePayments.length > 0 ? (
              <form onSubmit={handleSubmitRefund} className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-teal-800/80">Request 1-Click Refund</h4>
                
                <div>
                  <label className="block text-xs font-bold text-[#134E4A] mb-1">
                    Select Eligible Purchase
                  </label>
                  <select
                    value={selectedPaymentId || eligiblePayments[0].id}
                    onChange={(e) => setSelectedPaymentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs font-medium"
                  >
                    {eligiblePayments.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.invoiceId} - {p.planName} ({p.currencyUsed === 'PKR' ? `PKR ${p.amountPKR}` : `$${p.amountUSD}`}) on {p.date}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#134E4A] mb-1">
                    Reason for Refund (Optional)
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs font-medium"
                  >
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Did not use feature enough">Did not use feature enough</option>
                    <option value="Technical difficulty">Technical difficulty</option>
                    <option value="Purchased by mistake">Purchased by mistake</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Submit Instant Refund Request</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-[#DCEDE9] text-center text-xs text-teal-900/80 font-medium border border-[#CBDED9]">
                <AlertCircle className="w-6 h-6 text-teal-700/60 mx-auto mb-1" />
                No active paid transactions eligible for refund.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
