import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForgotPasswordView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div id="forgot-password-page" className="max-w-md mx-auto px-4 py-16">
      <div className="card-ai-luxury p-8 space-y-6">
        <h2 className="text-2xl font-black text-[#134E4A] text-center">Reset Password</h2>
        <p className="text-xs text-teal-900/80 font-medium text-center">Enter your account email to receive security reset instructions.</p>

        {sent ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#0F766E] mx-auto animate-bounce" />
            <h3 className="font-extrabold text-base text-[#134E4A]">Reset Link Sent!</h3>
            <p className="text-xs text-teal-900/80 font-medium">Check your email inbox for instructions to reset your password.</p>
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-black text-[#0F766E] hover:underline pt-2 block mx-auto cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-teal-700/60 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none focus:ring-2 focus:ring-[#0F766E] transition-all font-medium"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-lg shadow-teal-900/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
