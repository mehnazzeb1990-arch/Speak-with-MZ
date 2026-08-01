import React from 'react';
import { PaymentRecord } from '../../types';
import { X, Printer, ShieldCheck, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
  payment: PaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, isOpen, onClose }) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPKR = payment.currencyUsed === 'PKR';
  const displayAmount = isPKR ? `PKR ${payment.amountPKR.toLocaleString()}` : `$${payment.amountUSD.toFixed(2)} USD`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#042F2C]/60 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-[#E6F1EF] rounded-3xl shadow-2xl border border-[#CBDED9] overflow-hidden print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#042F2C] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-[#14B8A6]" />
            <h3 className="text-lg font-bold">Official Payment Receipt</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-teal-200 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Body */}
        <div className="p-8 space-y-6 text-[#134E4A]">
          
          {/* Top Brand Header */}
          <div className="flex items-start justify-between border-b border-[#CBDED9] pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#0F766E] text-white font-black flex items-center justify-center text-sm">
                  MZ
                </div>
                <span className="text-xl font-extrabold text-[#134E4A]">Speak with MZ</span>
              </div>
              <p className="text-xs text-teal-800/70 mt-1 font-medium">AI English Partner Platform</p>
              <p className="text-[11px] text-teal-800/60 font-medium">Support: billing@speakmz.com</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                payment.status === 'paid' 
                  ? 'bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                <CheckCircle className="w-3.5 h-3.5 text-[#0F766E]" />
                <span className="capitalize">{payment.status}</span>
              </span>
              <p className="text-xs font-mono font-bold text-[#134E4A] mt-2">{payment.invoiceId}</p>
              <p className="text-xs text-teal-800/70 font-medium">{payment.date}</p>
            </div>
          </div>

          {/* Billed To Information */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-teal-800/60 font-semibold uppercase tracking-wider text-[10px]">Customer Details</span>
              <p className="font-bold text-[#134E4A] text-sm mt-0.5">{payment.userName}</p>
              <p className="text-teal-800/70 font-medium">{payment.userEmail}</p>
            </div>
            <div>
              <span className="text-teal-800/60 font-semibold uppercase tracking-wider text-[10px]">Payment Method</span>
              <p className="font-bold text-[#134E4A] text-sm mt-0.5">{payment.paymentMethod}</p>
              {payment.cardLast4 && <p className="text-teal-800/70 font-mono">Ending in •••• {payment.cardLast4}</p>}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border rounded-2xl border-[#CBDED9] overflow-hidden bg-[#F3F7F6]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#DCEDE9] text-[#134E4A] font-bold border-b border-[#CBDED9]">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3">Cycle</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBDED9]">
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-[#134E4A]">{payment.planName}</p>
                    <p className="text-[11px] text-teal-800/70 font-medium">Full access to speaking practice & structured lessons</p>
                  </td>
                  <td className="p-3 text-teal-800/70 font-medium">1 Month</td>
                  <td className="p-3 text-right font-bold text-[#134E4A]">{displayAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-56 space-y-1.5 text-xs">
              <div className="flex justify-between text-teal-800/70 font-medium">
                <span>Subtotal:</span>
                <span className="font-mono">{displayAmount}</span>
              </div>
              <div className="flex justify-between text-teal-800/70 font-medium">
                <span>Tax (0%):</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#134E4A] pt-2 border-t border-[#CBDED9]">
                <span>Total Paid:</span>
                <span className="text-[#0F766E] font-mono">{displayAmount}</span>
              </div>
            </div>
          </div>

          {/* PCI Compliance Stamp */}
          <div className="p-3.5 rounded-xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center space-x-3 text-[11px] text-[#134E4A]">
            <ShieldCheck className="w-5 h-5 text-[#0F766E] shrink-0" />
            <div>
              <p className="font-bold text-[#134E4A]">PCI-DSS Level 1 Compliant Transaction</p>
              <p className="text-teal-800/70 font-medium">Card data is strictly processed via encrypted bank tokens. Never stored on Speak with MZ servers.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#DCEDE9] border-t border-[#CBDED9] flex items-center justify-between print:hidden">
          <span className="text-xs text-teal-800/70 font-medium">14-Day Money-Back Guarantee</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#0F766E] text-white font-bold text-xs hover:bg-[#115E59] transition-opacity flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
