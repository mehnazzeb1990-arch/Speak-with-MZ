import React from 'react';
import { Globe, Shield, Twitter, Github, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="app-footer" className="bg-[#DCEDE9] text-[#134E4A] pt-16 pb-12 border-t border-[#CBDED9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#CBDED9]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-[#0F766E] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md">
                MZ
              </div>
              <span className="font-bold text-2xl text-[#134E4A] tracking-tight">
                Speak with <span className="text-[#0F766E]">MZ</span>
              </span>
            </div>

            <p className="text-[#4B6B68] text-sm leading-relaxed max-w-sm font-medium">
              Speak with MZ is an AI-powered English speaking partner designed for non-native speakers worldwide. Gain speaking confidence, natural pronunciation, and vocabulary through realistic real-time conversation practice.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-[#E6F1EF] hover:bg-[#0F766E] text-[#134E4A] hover:text-white border border-[#CBDED9] flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#E6F1EF] hover:bg-[#0F766E] text-[#134E4A] hover:text-white border border-[#CBDED9] flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#E6F1EF] hover:bg-[#0F766E] text-[#134E4A] hover:text-white border border-[#CBDED9] flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-black text-[#134E4A] uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button onClick={() => onNavigate('speaking')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  Speaking Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vocab')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  Vocabulary Vault
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  AI Features
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('achievements')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  Achievements & XP
                </button>
              </li>
            </ul>
          </div>

          {/* Learning Levels */}
          <div>
            <h4 className="text-xs font-black text-[#134E4A] uppercase tracking-wider mb-4">Learning Tiers</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <span className="text-[#0F766E] font-bold">Beginner</span> (Free Everyday)
              </li>
              <li>
                <span className="text-[#14B8A6] font-bold">Intermediate</span> (Premium Fluency)
              </li>
              <li>
                <span className="text-[#0F766E] font-bold">Advanced</span> (Master Class)
              </li>
              <li>
                <button onClick={() => onNavigate('help')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  Help & Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faqs')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-black text-[#134E4A] uppercase tracking-wider mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button onClick={() => onNavigate('about')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  About Speak with MZ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-[#4B6B68] hover:text-[#0F766E] transition-colors cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B8C88] font-medium">
          <p>© {new Date().getFullYear()} Speak with MZ. All rights reserved. Built for learners worldwide.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1 text-[#4B6B68]">
              <Globe className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>English (US)</span>
            </span>
            <span className="flex items-center space-x-1 text-[#0F766E] font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>GDPR Compliant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
