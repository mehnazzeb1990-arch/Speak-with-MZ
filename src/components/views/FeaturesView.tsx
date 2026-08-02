import React from 'react';
import { 
  Mic, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Award, 
  Volume2, 
  BarChart3, 
  BookMarked, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  Globe,
  Crown
} from 'lucide-react';

export const FeaturesView: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const featureCards = [
    {
      id: 'voice-ai',
      icon: <Mic className="w-6 h-6 text-[#0F766E]" />,
      title: 'Real-Time AI Voice Partner',
      badge: 'Core Feature',
      target: 'speaking',
      btnText: 'Launch Voice Partner',
      description: 'Practice 24/7 spoken English with Coach MZ using Web Speech recognition and optional ElevenLabs neural voice synthesis with adjustable speaking speeds.'
    },
    {
      id: 'grammar-doctor',
      icon: <Sparkles className="w-6 h-6 text-[#0F766E]" />,
      title: 'Live Grammar Doctor',
      badge: 'AI Diagnostic',
      target: 'grammar-improvement',
      btnText: 'Open Grammar Doctor',
      description: 'Instant structural analysis pointing out verb tense corrections, preposition fixes, alternative phrasings, and clear grammatical rule explanations.'
    },
    {
      id: 'vocab-vault',
      icon: <BookMarked className="w-6 h-6 text-[#0F766E]" />,
      title: 'Vocabulary Vault & Flashcards',
      badge: 'Spaced Repetition',
      target: 'vocab',
      btnText: 'Open Vocabulary Vault',
      description: 'Save new words from conversations with 1-click. Master them through interactive flashcards, CEFR level tags, definitions, and native audio.'
    },
    {
      id: 'pronunciation',
      icon: <Volume2 className="w-6 h-6 text-[#0F766E]" />,
      title: 'Pronunciation & Intonation Training',
      badge: 'Phonetic Feedback',
      target: 'pronunciation-training',
      btnText: 'Start Pronunciation Drill',
      description: 'Interactive audio comparison tool with syllable stress highlights, pitch contours, and sentence linking tips to achieve natural rhythm.'
    },
    {
      id: 'curriculum',
      icon: <GraduationCap className="w-6 h-6 text-[#0F766E]" />,
      title: '400+ English Topics & Roleplays',
      badge: 'Structured Learning',
      target: 'curriculum',
      btnText: 'Explore Topic Catalog',
      description: 'Comprehensive topic library covering Job Interviews, Travel, Topic Presentations, Business English, Social Chat, and Daily Life Scenarios.'
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="w-6 h-6 text-[#0F766E]" />,
      title: 'Fluency Analytics & Speaking Progress',
      badge: 'Performance Tracker',
      target: 'progress',
      btnText: 'View Fluency Metrics',
      description: 'Track speaking speed (WPM), pause frequency, vocabulary diversity index, confidence rating, and estimated speaking fluency progression.'
    },
    {
      id: 'achievements',
      icon: <Flame className="w-6 h-6 text-[#F59E0B]" />,
      title: 'Daily Streak & XP Milestones',
      badge: 'Gamification',
      target: 'achievements',
      btnText: 'View Badges & Level',
      description: 'Stay motivated with daily practice minutes targets, streak freezes, experience points (XP), and unlockable accomplishment badges.'
    },
    {
      id: 'level-guides',
      icon: <BookOpen className="w-6 h-6 text-[#0F766E]" />,
      title: 'Level-Specific Skill Guides',
      badge: 'A1 - C2 Framework',
      target: 'guide-beginner',
      btnText: 'Read Level Guides',
      description: 'Tailored roadmaps for Beginner, Intermediate, and Advanced learners with targeted strategies to overcome mental hesitation.'
    },
    {
      id: 'pricing',
      icon: <Crown className="w-6 h-6 text-[#F59E0B]" />,
      title: 'Unlimited Premium & Global Payments',
      badge: 'Stripe & Regional',
      target: 'pricing',
      btnText: 'View Membership Plans',
      description: 'Secure online checkout supporting Visa, Mastercard, Debit Cards, and Credit Cards in USD & PKR with a 14-day 100% money-back guarantee.'
    }
  ];

  return (
    <div id="features-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-[#0F766E] bg-[#DCEDE9] px-3.5 py-1 rounded-full border border-[#CBDED9] inline-block">
          Complete Feature Ecosystem
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#134E4A] tracking-tight">
          Everything You Need for Spoken English Mastery
        </h1>
        <p className="text-sm text-teal-900/80 font-medium leading-relaxed">
          Click any feature card below to immediately jump into that learning module or tool within Speak with MZ.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onNavigate(card.target)}
            className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm hover:shadow-xl hover:border-[#0F766E] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 group relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center justify-center group-hover:bg-[#0F766E] group-hover:text-white transition-colors">
                  {React.cloneElement(card.icon as React.ReactElement, {
                    className: "w-6 h-6 text-[#0F766E] group-hover:text-white transition-colors"
                  })}
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9] group-hover:border-[#0F766E]">
                  {card.badge}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-[#134E4A] group-hover:text-[#0F766E] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#CBDED9] flex items-center justify-between text-xs font-bold text-[#0F766E] group-hover:text-[#134E4A]">
              <span>{card.btnText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-[#14B8A6]/40">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-black text-white">Ready to Practice Your English Speaking?</h3>
          <p className="text-xs text-teal-100/90 font-medium max-w-xl">
            Start a natural voice conversation with Coach MZ right now. Receive real-time feedback on every sentence.
          </p>
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="px-8 py-4 rounded-2xl bg-[#F59E0B] hover:bg-amber-400 text-[#042F2C] font-black text-sm shadow-lg shadow-amber-900/30 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Mic className="w-5 h-5" />
          <span>Start Speaking Now</span>
        </button>
      </div>

    </div>
  );
};

