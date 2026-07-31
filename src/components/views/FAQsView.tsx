import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

export const FAQsView: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: 'Is Speak with MZ suitable for absolute beginners?',
      a: 'Yes! Our Beginner level includes slow speech audio (0.8x), simple everyday scenario prompts, and immediate text guidance to build confidence step-by-step.'
    },
    {
      q: 'How does the AI Grammar Doctor work?',
      a: 'As you speak or type sentences, our Google Gemini AI backend analyzes your grammar, prepositions, and verb tenses in real-time, providing constructive corrections without disrupting your natural speech flow.'
    },
    {
      q: 'Do I need a special microphone?',
      a: 'No special hardware is required. Any built-in laptop, smartphone, or tablet microphone works seamlessly directly inside your browser.'
    },
    {
      q: 'Can I cancel my subscription anytime?',
      a: 'Absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your Account Settings.'
    },
    {
      q: 'Is this an IELTS test preparation app?',
      a: 'Speak with MZ is designed primarily for everyday real-world communication, job interviews, and conversational fluency. However, we do include an Exam Coach persona (David Miller) for formal discourse practice.'
    }
  ];

  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div id="faqs-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Knowledge Base & Support
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h1>
      </div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
      </div>

      <div className="space-y-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-6 text-left font-bold text-base text-slate-900 dark:text-white flex items-center justify-between"
            >
              <span>{item.q}</span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === idx && (
              <div className="px-6 pb-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
