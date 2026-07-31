import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div id="privacy-policy-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-800 dark:text-slate-200">
      <div className="flex items-center space-x-3">
        <Shield className="w-8 h-8 text-emerald-500" />
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
      </div>
      <p className="text-xs text-slate-400">Effective Date: January 15, 2026</p>

      <div className="space-y-4 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
        <p>Speak with MZ collects minimal personal data required to deliver our AI speaking services, including user profile details, recorded session audio transcripts for real-time grammar feedback, and user learning preferences.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">2. How Audio & Voice Data Is Handled</h2>
        <p>Voice audio captured during speaking sessions is processed in real time by browser APIs or encrypted server proxy endpoints solely to perform speech-to-text transcription and AI conversation response generation. Voice data is never sold to third parties.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Data Security & Storage</h2>
        <p>All transmitted user data is encrypted in transit using SSL/TLS protocols and stored securely in Firestore cloud database infrastructure.</p>
      </div>
    </div>
  );
};
