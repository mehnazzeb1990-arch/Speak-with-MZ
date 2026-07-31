import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div id="forgot-password-page" className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center">Reset Password</h2>
        <p className="text-xs text-slate-500 text-center">Enter your account email to receive reset instructions.</p>

        {sent ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Email Sent!</h3>
            <p className="text-xs text-slate-500">Check your inbox for password reset link.</p>
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-bold text-emerald-600 hover:underline pt-2 block mx-auto"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
