import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Bot, Sparkles, MessageSquare, Key, Mic, CreditCard, Wrench, ShieldCheck } from 'lucide-react';
import { SupportChatModal } from '../common/SupportChatModal';

export const ContactView: React.FC = () => {
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

  return (
    <div id="contact-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#0F766E] px-3.5 py-1 rounded-full bg-[#DCEDE9] border border-[#CBDED9] inline-block">
          Customer Support & Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#134E4A] tracking-tight">
          Get in Touch with Speak with MZ
        </h1>
        <p className="text-teal-900/80 text-sm font-medium">
          Have questions about account setup, speaking practice, AI features, subscription plans, or technical issues? Our AI Assistant & human support team are here 24/7.
        </p>
      </div>

      {/* Main Feature: Customer Support & Assistance Banner Card */}
      <div className="card-ai-luxury p-8 sm:p-10 border border-[#CBDED9] relative overflow-hidden bg-gradient-to-br from-[#DCEDE9] via-[#E6F1EF] to-[#F3F7F6]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E] text-white text-xs font-black shadow-sm">
              <Bot className="w-4 h-4 text-[#F59E0B]" />
              <span>AI-POWERED ASSISTANCE</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#134E4A]">
                Need help with Speak with MZ?
              </h2>
              <p className="text-xs sm:text-sm text-teal-900/80 font-semibold">
                Our AI Support Assistant is available to answer questions about:
              </p>
            </div>

            {/* Supported Topics Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div 
                onClick={() => handleOpenChat('account')}
                className="p-3 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] transition-all cursor-pointer flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Key className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#134E4A]">Account setup</h4>
                  <p className="text-[10px] text-teal-800/70 font-medium">Login, passwords, profiles</p>
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
                  <h4 className="text-xs font-black text-[#134E4A]">Speaking practice</h4>
                  <p className="text-[10px] text-teal-800/70 font-medium">Studio modes, speech analysis</p>
                </div>
              </div>

              <div 
                onClick={() => handleOpenChat('features')}
                className="p-3 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] transition-all cursor-pointer flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#134E4A]">AI features</h4>
                  <p className="text-[10px] text-teal-800/70 font-medium">Voices, Gemini, grammar</p>
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
                  <h4 className="text-xs font-black text-[#134E4A]">Subscription plans</h4>
                  <p className="text-[10px] text-teal-800/70 font-medium">Pricing & 14-day refund</p>
                </div>
              </div>

              <div 
                onClick={() => handleOpenChat('technical')}
                className="p-3 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] transition-all cursor-pointer flex items-center space-x-3 group sm:col-span-2"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Wrench className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#134E4A]">Technical issues</h4>
                  <p className="text-[10px] text-teal-800/70 font-medium">Microphone permissions & audio troubleshooting</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Callout Box */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#042F2C] text-white space-y-5 border border-[#14B8A6]/30 shadow-xl relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Bot className="w-6 h-6 text-[#F59E0B]" />
                  <h3 className="text-xl font-black text-white">Chat with MZ Support Assistant</h3>
                </div>
                <p className="text-xs text-teal-100/90 font-medium leading-relaxed">
                  Get instant answers or leave a message for our support team.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleOpenChat()}
                  className="w-full py-4 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-xl shadow-teal-900/40 hover:opacity-95 transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
                >
                  <MessageSquare className="w-5 h-5 text-[#F59E0B] group-hover:scale-110 transition-transform" />
                  <span>Start Chat</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-teal-200/80 pt-1 border-t border-teal-800/60 font-bold">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>24/7 AI Instant Bot</span>
                </span>
                <span>Response in &lt; 1 sec</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Direct Contact Inquiries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-ai-luxury p-6 space-y-4">
            <h3 className="font-black text-lg text-[#134E4A]">Direct Contact Channels</h3>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
              Prefer email or direct phone inquiries? Our human support staff monitors all incoming messages continuously.
            </p>
            <div className="space-y-3 pt-2 text-xs text-[#134E4A] font-bold">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9]">
                <Mail className="w-4 h-4 text-[#0F766E]" />
                <span>support@speakmz.com</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9]">
                <Phone className="w-4 h-4 text-[#0F766E]" />
                <span>+1 (800) 555-SPEAK</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9]">
                <MapPin className="w-4 h-4 text-[#0F766E]" />
                <span>San Francisco, CA & London, UK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="card-ai-luxury p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#134E4A]">Send Direct Message</h3>
              <p className="text-xs text-teal-900/80 font-medium">Leave a message directly for our management and support representatives.</p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#0F766E] mx-auto animate-bounce" />
                <h3 className="text-xl font-black text-[#134E4A]">Message Received!</h3>
                <p className="text-xs text-teal-900/80 font-medium">Your inquiry has been submitted. Our team will contact you at {email} within 2 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-ai-gradient text-white font-black text-xs cursor-pointer shadow-md mt-2"
                >
                  Send Another Message
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
                    className="w-full px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
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
                    className="w-full px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Message</label>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    required
                    rows={4}
                    placeholder="How can we help you today?"
                    className="w-full px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-lg shadow-teal-900/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
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

