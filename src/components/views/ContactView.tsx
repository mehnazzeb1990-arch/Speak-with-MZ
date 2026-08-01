import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Bot, 
  Sparkles, 
  MessageSquare, 
  Key, 
  Mic, 
  CreditCard, 
  Wrench, 
  Clock,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { SupportChatModal } from '../common/SupportChatModal';

interface ContactViewProps {
  onNavigate?: (view: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleOpenChat = (topic?: string) => {
    if (topic) setSelectedTopic(topic);
    setIsChatOpen(true);
  };

  const FAQS = [
    {
      q: 'How does the 24/7 AI Speaking Coach work?',
      a: 'Speak with MZ connects you with advanced AI voice personas that respond naturally to your voice input, analyze your grammar in real time, and provide instant pronunciation suggestions.',
    },
    {
      q: 'How do I request help with my account or subscription?',
      a: 'You can use the 24/7 AI Support Chatbot directly on this page or send an email to support@speakmz.com. Our support team responds within 2 hours.',
    },
    {
      q: 'Is my microphone audio private and secure?',
      a: 'Yes, all speech recognition audio streams are encrypted end-to-end and processed solely for your real-time feedback and session analysis.',
    },
    {
      q: 'Can I cancel or manage my subscription at any time?',
      a: 'Absolutely! You can upgrade, downgrade, or cancel your subscription at any time from the Settings or Premium Plans page with zero lock-in.',
    },
  ];

  return (
    <div id="contact-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#0F766E] px-3.5 py-1 rounded-full bg-[#DCEDE9] border border-[#CBDED9] inline-block">
          Online Support Only
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#134E4A] tracking-tight">
          Contact & Online Support
        </h1>
        <p className="text-teal-900/80 text-sm font-medium">
          Have questions about account setup, AI voice features, subscriptions, or speaking practice? We provide 24/7 online support to learners worldwide.
        </p>
      </div>

      {/* Main Feature: Customer Support Chatbot Banner */}
      <div className="card-ai-luxury p-8 sm:p-10 border border-[#CBDED9] relative overflow-hidden bg-gradient-to-br from-[#DCEDE9] via-[#E6F1EF] to-[#F3F7F6]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E] text-white text-xs font-black shadow-sm">
              <Bot className="w-4 h-4 text-[#F59E0B]" />
              <span>24/7 INSTANT AI SUPPORT CHATBOT</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#134E4A]">
                Instant AI Support Assistance
              </h2>
              <p className="text-xs sm:text-sm text-teal-900/80 font-semibold">
                Get immediate help with:
              </p>
            </div>

            {/* Supported Topics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div 
                onClick={() => handleOpenChat('account')}
                className="p-3 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] transition-all cursor-pointer flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Key className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#134E4A]">Account Setup</h4>
                  <p className="text-[10px] text-teal-800/70 font-medium">Login & Profile settings</p>
                </div>
              </div>

              <div 
                onClick={() => handleOpenChat('practice')}
                className="p-3 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] transition-all cursor-pointer flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mic className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#134E4A]">Speaking Practice</h4>
                  <p className="text-[10px] text-teal-800/70 font-medium">AI Coach audio & guides</p>
                </div>
              </div>

              <div 
                onClick={() => handleOpenChat('pricing')}
                className="p-3 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] transition-all cursor-pointer flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#134E4A]">Subscriptions</h4>
                  <p className="text-[10px] text-teal-800/70 font-medium">Billing & Premium Plans</p>
                </div>
              </div>

              <div 
                onClick={() => handleOpenChat('technical')}
                className="p-3 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] transition-all cursor-pointer flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Wrench className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#134E4A]">Technical Help</h4>
                  <p className="text-[10px] text-teal-800/70 font-medium">Microphone permissions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Callout Box */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#042F2C] text-white space-y-5 border border-[#14B8A6]/30 shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Bot className="w-6 h-6 text-[#F59E0B]" />
                  <h3 className="text-xl font-black text-white">Chat with AI Support Bot</h3>
                </div>
                <p className="text-xs text-teal-100/90 font-medium leading-relaxed">
                  Get instant answers 24/7 or send a direct inquiry to our online support desk.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleOpenChat()}
                  className="w-full py-4 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
                >
                  <MessageSquare className="w-5 h-5 text-[#F59E0B] group-hover:scale-110 transition-transform" />
                  <span>Launch 24/7 AI Chatbot</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-teal-200/80 pt-1 border-t border-teal-800/60 font-bold">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>24/7 Online Support</span>
                </span>
                <span>Response &lt; 1 sec</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Online Support Info & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-ai-luxury p-6 space-y-4 border border-[#CBDED9] bg-[#E6F1EF]">
            <h3 className="font-black text-lg text-[#134E4A]">Online Contact Channels</h3>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
              We provide dedicated online support. No physical office or phone line required — communicate directly via email or our 24/7 support assistant.
            </p>
            <div className="space-y-3 pt-2 text-xs text-[#134E4A] font-bold">
              <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9]">
                <Mail className="w-4 h-4 text-[#0F766E]" />
                <div>
                  <span className="block text-[10px] font-black uppercase text-teal-800/70">Support Email</span>
                  <span>support@speakmz.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9]">
                <Mail className="w-4 h-4 text-[#0F766E]" />
                <div>
                  <span className="block text-[10px] font-black uppercase text-teal-800/70">Billing & Subscriptions</span>
                  <span>billing@speakmz.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9]">
                <Clock className="w-4 h-4 text-[#0F766E]" />
                <div>
                  <span className="block text-[10px] font-black uppercase text-teal-800/70">Support Hours</span>
                  <span>Monday – Sunday: 24/7 Online Availability</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback & Inquiries Form */}
        <div className="lg:col-span-7">
          <div className="card-ai-luxury p-8 space-y-6 border border-[#CBDED9] bg-[#E6F1EF]">
            <div>
              <h3 className="text-lg font-black text-[#134E4A]">Send Support Message</h3>
              <p className="text-xs text-teal-900/80 font-medium">Fill out the online feedback form and our support team will respond to your email.</p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#0F766E] mx-auto animate-bounce" />
                <h3 className="text-xl font-black text-[#134E4A]">Message Received!</h3>
                <p className="text-xs text-teal-900/80 font-medium">Your support inquiry has been logged. Our online support staff will email you at {email} within 2 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F766E] text-white font-black text-xs cursor-pointer shadow-md mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Alex Smith"
                    className="w-full px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#F3F7F6] text-[#134E4A] text-sm outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#F3F7F6] text-[#134E4A] text-sm outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Message / Inquiry</label>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe how we can assist you..."
                    className="w-full px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#F3F7F6] text-[#134E4A] text-sm outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-lg hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-[#0F766E]" />
          <h3 className="text-xl font-black text-[#134E4A]">Frequently Asked Questions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-2">
              <h4 className="font-extrabold text-xs text-[#134E4A]">{faq.q}</h4>
              <p className="text-xs text-teal-900/80 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Chat Modal */}
      <SupportChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialTopic={selectedTopic}
      />

    </div>
  );
};
