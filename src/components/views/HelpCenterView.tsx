import React from 'react';
import { HelpCircle, Video, MessageSquare, BookOpen, Send } from 'lucide-react';

export const HelpCenterView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  return (
    <div id="help-center-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Help & Support Center</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Guides, video tutorials, and technical assistance for Speak with MZ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => onNavigate('faqs')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 cursor-pointer space-y-3 transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Knowledge Base FAQs</h3>
          <p className="text-xs text-slate-500">Read step-by-step answers to common user questions.</p>
        </div>

        <div
          onClick={() => onNavigate('contact')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 cursor-pointer space-y-3 transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Submit a Support Ticket</h3>
          <p className="text-xs text-slate-500">Contact our 24/7 technical customer assistance team.</p>
        </div>
      </div>
    </div>
  );
};
