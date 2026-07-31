import React from 'react';
import { PaymentRecord } from '../../types';
import { X, Printer, ShieldCheck, Download, CheckCircle, Building2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold">Official Payment Receipt</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Body */}
        <div className="p-8 space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* Top Brand Header */}
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                  MZ
                </div>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">Speak with MZ</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI English Partner Platform</p>
              <p className="text-[11px] text-slate-400">Support: billing@speakmz.com</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                payment.status === 'paid' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="capitalize">{payment.status}</span>
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-2">{payment.invoiceId}</p>
              <p className="text-xs text-slate-500">{payment.date}</p>
            </div>
          </div>

          {/* Billed To Information */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Customer Details</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{payment.userName}</p>
              <p className="text-slate-500">{payment.userEmail}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Payment Method</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{payment.paymentMethod}</p>
              {payment.cardLast4 && <p className="text-slate-500 font-mono">Ending in •••• {payment.cardLast4}</p>}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border rounded-2xl border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3">Cycle</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{payment.planName}</p>
                    <p className="text-[11px] text-slate-500">Full access to speaking practice & structured lessons</p>
                  </td>
                  <td className="p-3 text-slate-500">1 Month</td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">{displayAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-56 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-mono">{displayAmount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (0%):</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{displayAmount}</span>
              </div>
            </div>
          </div>

          {/* PCI Compliance Stamp */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center space-x-3 text-[11px] text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300">PCI-DSS Level 1 Compliant Transaction</p>
              <p>Card data is strictly processed via encrypted bank tokens. Never stored on Speak with MZ servers.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">14-Day Money-Back Guarantee</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity flex items-center space-x-1.5"
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
