import React, { useState } from 'react';
import { HelpCircle, Video, MessageSquare, BookOpen, Send, Bot, Sparkles, Key, Mic, CreditCard, Wrench } from 'lucide-react';
import { SupportChatModal } from '../common/SupportChatModal';

export const HelpCenterView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const handleOpenChat = (topic?: string) => {
    if (topic) setSelectedTopic(topic);
    setIsChatOpen(true);
  };

  return (
    <div id="help-center-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#134E4A]">Help & Support Center</h1>
            <p className="text-xs text-teal-900/80 font-medium mt-0.5">
              Guides, instant AI support assistant, and technical assistance for Speak with MZ.
            </p>
          </div>
        </div>
      </div>

      {/* Main Feature: Customer Support & Assistance Card */}
      <div className="card-ai-luxury p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2 text-[#0F766E]">
          <Bot className="w-6 h-6 text-[#F59E0B]" />
          <h2 className="text-2xl font-black text-[#134E4A]">Customer Support & Assistance</h2>
        </div>

        <p className="text-sm font-semibold text-[#134E4A]">
          Need help with Speak with MZ?
        </p>

        <p className="text-xs text-teal-900/80 font-medium">
          Our AI Support Assistant is available to answer questions about:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div 
            onClick={() => handleOpenChat('account')}
            className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center space-x-2.5 hover:border-[#0F766E] transition-all cursor-pointer"
          >
            <Key className="w-4 h-4 text-[#0F766E]" />
            <span className="text-xs font-bold text-[#134E4A]">Account setup</span>
          </div>

          <div 
            onClick={() => handleOpenChat('practice')}
            className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center space-x-2.5 hover:border-[#0F766E] transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4 text-[#0F766E]" />
            <span className="text-xs font-bold text-[#134E4A]">Speaking practice</span>
          </div>

          <div 
            onClick={() => handleOpenChat('features')}
            className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center space-x-2.5 hover:border-[#0F766E] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#0F766E]" />
            <span className="text-xs font-bold text-[#134E4A]">AI features</span>
          </div>

          <div 
            onClick={() => handleOpenChat('pricing')}
            className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center space-x-2.5 hover:border-[#0F766E] transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#0F766E]" />
            <span className="text-xs font-bold text-[#134E4A]">Subscription plans</span>
          </div>

          <div 
            onClick={() => handleOpenChat('technical')}
            className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center space-x-2.5 hover:border-[#0F766E] transition-all cursor-pointer sm:col-span-2"
          >
            <Wrench className="w-4 h-4 text-[#0F766E]" />
            <span className="text-xs font-bold text-[#134E4A]">Technical issues</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#042F2C] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#14B8A6]/30 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-black text-base text-white">Chat with MZ Support Assistant</h3>
            <p className="text-xs text-teal-100 font-medium">
              Get instant answers or leave a message for our support team.
            </p>
          </div>

          <button
            onClick={() => handleOpenChat()}
            className="px-6 py-3 rounded-xl bg-ai-gradient text-white font-black text-xs shadow-md shadow-teal-900/30 hover:opacity-95 transition-all cursor-pointer shrink-0"
          >
            Start Chat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => onNavigate('faqs')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm hover:border-[#0F766E] cursor-pointer space-y-3 transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-black text-base text-[#134E4A]">Knowledge Base FAQs</h3>
          <p className="text-xs text-teal-900/80 font-medium">Read step-by-step answers to common user questions.</p>
        </div>

        <div
          onClick={() => onNavigate('contact')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm hover:border-[#0F766E] cursor-pointer space-y-3 transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9] flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-black text-base text-[#134E4A]">Submit a Support Ticket</h3>
          <p className="text-xs text-teal-900/80 font-medium">Contact our 24/7 technical customer assistance team.</p>
        </div>
      </div>

      <SupportChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialTopic={selectedTopic}
      />
    </div>
  );
};

