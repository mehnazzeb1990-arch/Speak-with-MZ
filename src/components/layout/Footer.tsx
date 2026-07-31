import React from 'react';
import { Mic, Globe, Shield, Heart, Sparkles, Mail, Github, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-sky-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                MZ
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">
                Speak with <span className="text-sky-400">MZ</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Speak with MZ is an AI-powered English speaking partner designed for non-native speakers worldwide. Gain speaking confidence, natural pronunciation, and vocabulary through realistic real-time conversation practice.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('speaking')} className="hover:text-sky-400 transition-colors">
                  Speaking Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vocab')} className="hover:text-sky-400 transition-colors">
                  Vocabulary Vault
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-sky-400 transition-colors">
                  AI Features
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-sky-400 transition-colors">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('achievements')} className="hover:text-sky-400 transition-colors">
                  Achievements & XP
                </button>
              </li>
            </ul>
          </div>

          {/* Learning Levels */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Learning Tiers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-indigo-400 font-semibold">Beginner</span> (Free Everyday)
              </li>
              <li>
                <span className="text-sky-400 font-semibold">Intermediate</span> (Premium Fluency)
              </li>
              <li>
                <span className="text-cyan-400 font-semibold">Advanced</span> (Master Class)
              </li>
              <li>
                <button onClick={() => onNavigate('help')} className="hover:text-sky-400 transition-colors">
                  Help & Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faqs')} className="hover:text-sky-400 transition-colors">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-sky-400 transition-colors">
                  About Speak with MZ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-sky-400 transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-sky-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-sky-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Speak with MZ. All rights reserved. Built for learners worldwide.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1 text-slate-400">
              <Globe className="w-3.5 h-3.5" />
              <span>English (US)</span>
            </span>
            <span className="flex items-center space-x-1 text-sky-400">
              <Shield className="w-3.5 h-3.5" />
              <span>GDPR Compliant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
