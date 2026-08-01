import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Crown, X, ArrowRight } from 'lucide-react';

interface AdBannerProps {
  onNavigate?: (view: string) => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Only show ads for users on the free plan
  if (!user || user.subscriptionPlan !== 'free' || dismissed) {
    return null;
  }

  return (
    <div id="free-plan-ad-banner" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#042F2C] via-[#0F766E] to-[#115E59] text-white p-4 border border-[#14B8A6]/40 shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <Crown className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/30">
                Sponsored Ad
              </span>
              <span className="font-bold text-white">Upgrade to Intermediate or Advanced Premium!</span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Remove ads, unlock 200+ extra structured topics, unlimited AI partner conversations & idioms drills for just $10/month (Rs. 2,800/mo).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('pricing')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-extrabold text-slate-950 text-xs transition-all flex items-center space-x-1 shadow-md"
          >
            <span>Upgrade ($10/mo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss Ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
