import React from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Mic, 
  Volume2, 
  CheckCircle2, 
  Brain, 
  Headphones, 
  Video, 
  ShieldAlert, 
  Calendar,
  Bot,
  Play
} from 'lucide-react';

interface DailySpeakingTipsViewProps {
  onNavigate: (view: string) => void;
}

export const DailySpeakingTipsView: React.FC<DailySpeakingTipsViewProps> = ({ onNavigate }) => {
  const TIPS = [
    {
      num: 1,
      title: 'Practice Daily (10 Mins > 2 Hours Once a Week)',
      icon: Calendar,
      description: 'Consistency builds subconscious muscle memory. Practicing 10 to 15 minutes daily trains your mouth and brain far faster than long, rare sessions.',
      actionStep: 'Set a daily reminder in MZ App to practice 1 lesson before breakfast.',
    },
    {
      num: 2,
      title: 'Think Directly in English (Stop Translating)',
      icon: Brain,
      description: 'Translating from your native language slows down speech. Practice naming objects around you directly in English without native words.',
      actionStep: 'Describe your immediate surroundings out loud in 3 English sentences right now.',
    },
    {
      num: 3,
      title: 'Read Aloud with Vocal Emphasis',
      icon: Volume2,
      description: 'Reading aloud bridges passive reading and active speaking. It trains your jaw, lips, and tongue to produce native phonemes smoothly.',
      actionStep: 'Read 1 short news article or book paragraph out loud every day.',
    },
    {
      num: 4,
      title: 'Record & Analyze Your Voice',
      icon: Mic,
      description: 'Listening to your recorded voice reveals natural pace, pronunciation gaps, and hesitation patterns you never notice while speaking.',
      actionStep: 'Use Speaking Studio to record a 1-minute audio response and review AI feedback.',
    },
    {
      num: 5,
      title: 'Shadow Native Speakers',
      icon: Headphones,
      description: 'Listen to a short native audio sentence, pause it, and immediately imitate the exact rhythm, intonation, and stress patterns.',
      actionStep: 'Shadow MZ Coach voice audio clips in Topic Detail view.',
    },
    {
      num: 6,
      title: 'Engage in 24/7 AI Voice Conversations',
      icon: Bot,
      description: 'AI speaking partners provide continuous practice without scheduling delays, social pressure, or awkward judgment.',
      actionStep: 'Start a 5-minute roleplay scenario with MZ AI Partner today.',
    },
    {
      num: 7,
      title: 'Watch English Videos with Subtitles On/Off',
      icon: Video,
      description: 'Watch short YouTube clips or TED talks. First watch with English subtitles, then rewatch without subtitles to test ear tuning.',
      actionStep: 'Pause after key phrases and repeat them out loud.',
    },
    {
      num: 8,
      title: 'Listen to English Podcasts Daily',
      icon: Headphones,
      description: 'Immersion is key. Listen to conversational podcasts during commutes, workouts, or daily chores to absorb natural rhythm.',
      actionStep: 'Aim for 15 minutes of passive listening daily.',
    },
    {
      num: 9,
      title: 'Embrace Mistakes as Learning Milestones',
      icon: ShieldAlert,
      description: 'Grammar mistakes are signs of active practice. Native speakers make mistakes too! Focus on message transmission first.',
      actionStep: 'Use Live Grammar Doctor corrections to learn on the spot.',
    },
    {
      num: 10,
      title: 'Stay Consistent with Milestone Badges',
      icon: Sparkles,
      description: 'Tracking daily practice streaks keeps motivation high over months. Consistency is the single biggest predictor of C1 fluency.',
      actionStep: 'Maintain your 7-day streak in Achievements & Streaks tab.',
    },
  ];

  return (
    <div id="daily-speaking-tips-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#0F766E] px-3.5 py-1 rounded-full bg-[#DCEDE9] border border-[#CBDED9] inline-block">
          Proven Methodologies
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#134E4A] tracking-tight">
          10 Daily Speaking Tips for Faster Fluency
        </h1>
        <p className="text-teal-900/80 text-sm font-medium leading-relaxed">
          Actionable habit strategies developed by polyglots and ESL speech scientists to transform your spoken English.
        </p>
      </div>

      {/* Grid of 10 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TIPS.map((tip) => {
          const IconComponent = tip.icon;
          return (
            <div
              key={tip.num}
              className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:border-[#0F766E] shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                    #{tip.num}
                  </div>
                  <div className="p-2 rounded-xl bg-[#DCEDE9] text-[#0F766E]">
                    <IconComponent className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                </div>

                <h3 className="text-base font-black text-[#134E4A]">{tip.title}</h3>
                <p className="text-xs text-teal-900/80 font-medium leading-relaxed">{tip.description}</p>
              </div>

              <div className="pt-3 border-t border-[#CBDED9] space-y-2">
                <span className="text-[10px] font-black uppercase text-[#0F766E] tracking-wider block">
                  🚀 Actionable Step
                </span>
                <p className="text-xs text-[#134E4A] font-semibold bg-[#DCEDE9] p-2.5 rounded-xl border border-[#CBDED9]">
                  {tip.actionStep}
                </p>
                <button
                  onClick={() => onNavigate('speaking')}
                  className="w-full py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Practice Tip with AI</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
