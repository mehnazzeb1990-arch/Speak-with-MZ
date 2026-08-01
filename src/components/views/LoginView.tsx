import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mic, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const LoginView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const { login, loginWithGoogle, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      onNavigate('dashboard');
    }
  };

  const handleGoogle = async () => {
    clearAuthError();
    setLoading(true);
    const success = await loginWithGoogle();
    setLoading(false);
    if (success) {
      onNavigate('dashboard');
    }
  };

  return (
    <div id="login-page" className="max-w-md mx-auto px-4 py-16">
      <div className="card-ai-luxury p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-ai-gradient flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-900/20">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-[#134E4A]">Sign In to Speak with MZ</h2>
          <p className="text-xs text-teal-900/80 font-medium">Access your personalized AI voice coach and curriculum</p>
        </div>

        {authError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{authError}</div>
          </div>
        )}

        {/* Google Sign-in */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          type="button"
          className="w-full py-3.5 rounded-2xl bg-[#DCEDE9] hover:bg-teal-100/80 border border-[#CBDED9] font-extrabold text-xs text-[#134E4A] flex items-center justify-center space-x-2.5 transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12s.45 3.8 1.26 5.42l4.01-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center space-x-2 text-[10px] text-teal-800/60 uppercase font-black text-center">
          <div className="flex-1 h-px bg-[#CBDED9]" />
          <span>Or Email & Password</span>
          <div className="flex-1 h-px bg-[#CBDED9]" />
        </div>

        <form onSubmit={handleFormLogin} className="space-y-4">
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-teal-800/80">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs font-extrabold text-[#0F766E] hover:text-[#0D9488] hover:underline transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-teal-700/60 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none focus:ring-2 focus:ring-[#0F766E] transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-lg shadow-teal-900/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-teal-900/80 font-medium">
          Don't have an account yet?{' '}
          <button 
            type="button"
            onClick={() => onNavigate('register')} 
            className="font-black text-[#0F766E] hover:underline cursor-pointer"
          >
            Create Account Free
          </button>
        </div>

      </div>
    </div>
  );
};
