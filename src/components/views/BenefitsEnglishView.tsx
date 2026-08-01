import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  Bot,
  Mic
} from 'lucide-react';

interface BenefitsEnglishViewProps {
  onNavigate: (view: string) => void;
}

export const BenefitsEnglishView: React.FC<BenefitsEnglishViewProps> = ({ onNavigate }) => {
  const BENEFITS = [
    {
      id: 'career',
      title: 'Career Advancement & Higher Earnings',
      icon: Briefcase,
      badge: 'Professional',
      description: 'English fluency is the #1 requested skill by multinational employers, opening doors to promotions, international assignments, and up to 30-50% higher salaries.',
    },
    {
      id: 'education',
      title: 'International Education Access',
      icon: GraduationCap,
      badge: 'Academic',
      description: 'Gain access to top-tier universities worldwide, research papers, global journals, and international scholarship programs.',
    },
    {
      id: 'global-comm',
      title: 'Global Communication Network',
      icon: Globe,
      badge: 'Connection',
      description: 'Over 1.5 billion people speak English worldwide. Communicate effortlessly across cultures, borders, and continents.',
    },
    {
      id: 'networking',
      title: 'Professional Networking',
      icon: Users,
      badge: 'Relationships',
      description: 'Build meaningful connections with industry leaders, international peers, mentors, and global business partners.',
    },
    {
      id: 'business',
      title: 'Global Business Opportunities',
      icon: TrendingUp,
      badge: 'Growth',
      description: 'Expand your startup or freelance services to international clients, conduct cross-border negotiations, and close global deals.',
    },
    {
      id: 'confidence',
      title: 'Personal Confidence & Self-Esteem',
      icon: ShieldCheck,
      badge: 'Mindset',
      description: 'Overcome self-doubt, express your unique identity, and feel empowered in any social or professional setting.',
    },
    {
      id: 'leadership',
      title: 'Executive Leadership Skills',
      icon: Award,
      badge: 'Executive',
      description: 'Lead diverse international teams, present strategic visions, and influence global decision-making.',
    },
    {
      id: 'lifelong',
      title: 'Lifelong Cognitive & Cultural Growth',
      icon: BookOpen,
      badge: 'Enrichment',
      description: 'Enhance cognitive flexibility, memory retention, and cultural understanding by mastering a global language.',
    },
  ];

  return (
    <div id="benefits-english-view-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#0F766E] px-3.5 py-1 rounded-full bg-[#DCEDE9] border border-[#CBDED9] inline-block">
          Global Horizon
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#134E4A] tracking-tight">
          Benefits of Learning English
        </h1>
        <p className="text-teal-900/80 text-sm sm:text-base font-medium leading-relaxed">
          English is the universal language of science, technology, aviation, business, and diplomacy. Unlock your full potential with Speak with MZ.
        </p>
      </div>

      {/* Hero Infographic Banner */}
      <div className="card-ai-luxury p-8 border border-[#CBDED9] bg-[#DCEDE9] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E] text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Did You Know?</span>
            </div>
            <h2 className="text-2xl font-black text-[#134E4A]">
              55% of World Internet Content is in English
            </h2>
            <p className="text-xs sm:text-sm text-teal-900/80 font-medium leading-relaxed">
              Learning English gives you direct access to global information, cutting-edge AI developments, research papers, and entertainment without translation delays.
            </p>
          </div>
          <div className="lg:col-span-5 bg-[#E6F1EF] p-5 rounded-2xl border border-[#CBDED9] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#134E4A]">
              <span>Career Potential Boost</span>
              <span className="text-[#0F766E] font-black">+85%</span>
            </div>
            <div className="w-full bg-[#CBDED9] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#0F766E] h-full w-[85%]" />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#134E4A]">
              <span>Global Opportunity Access</span>
              <span className="text-[#0F766E] font-black">1.5 Billion People</span>
            </div>
            <div className="w-full bg-[#CBDED9] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#14B8A6] h-full w-[95%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BENEFITS.map((b) => {
          const IconComponent = b.icon;
          return (
            <div
              key={b.id}
              className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <IconComponent className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                    {b.badge}
                  </span>
                </div>
                <h3 className="text-base font-black text-[#134E4A] leading-snug">{b.title}</h3>
                <p className="text-xs text-teal-900/80 font-medium leading-relaxed">{b.description}</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('speaking')}
                  className="w-full py-2.5 rounded-xl bg-[#DCEDE9] hover:bg-[#CBDED9] text-[#0F766E] font-extrabold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Practice with AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-[#042F2C] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#14B8A6]/30 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black text-white">Start Unlocking Global Benefits Today</h3>
          <p className="text-xs text-teal-100/80 font-medium">Practice speaking real-world topics with your 24/7 AI Coach.</p>
        </div>
        <button
          onClick={() => onNavigate('speaking')}
          className="px-6 py-3.5 rounded-2xl bg-ai-gradient text-white font-extrabold text-sm shadow-lg hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Bot className="w-4 h-4 text-[#F59E0B]" />
          <span>Launch Speaking Studio</span>
        </button>
      </div>

    </div>
  );
};
