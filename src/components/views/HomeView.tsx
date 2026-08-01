import React from 'react';
import { 
  Mic, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Award, 
  Globe, 
  ArrowRight, 
  ShieldCheck, 
  BrainCircuit, 
  Zap, 
  Volume2, 
  Play, 
  MessageSquare,
  Users,
  Check,
  Star
} from 'lucide-react';
import { AI_PERSONAS, SPEAKING_SCENARIOS } from '../../data/mockData';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div id="home-view-page" className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-[#0F766E]/15 via-[#14B8A6]/10 to-[#CBDED9]/10 blur-3xl rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DCEDE9] border border-[#CBDED9] text-[#0F766E] text-xs font-extrabold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Next-Gen Conversational English AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#134E4A] leading-[1.15]">
                Speak English with <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#0F766E] via-[#14B8A6] to-[#D97706] bg-clip-text text-transparent">
                  Natural Human Confidence
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-teal-900/80 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Meet <strong className="text-[#134E4A] font-extrabold">Speak with MZ</strong> — your 24/7 AI Speaking Partner. Practice real everyday scenarios, receive instant grammar corrections, and expand your vocabulary without fear or judgment.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-cta-start-speaking"
                  onClick={() => onNavigate('speaking')}
                  className="w-full sm:w-auto px-8 py-4 bg-ai-gradient hover:opacity-95 text-white font-extrabold rounded-2xl text-sm transition-all shadow-lg shadow-teal-700/25 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Mic className="w-5 h-5 animate-pulse text-white" />
                  <span>Start Speaking Free</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>

                <button
                  id="hero-cta-pricing"
                  onClick={() => onNavigate('pricing')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl font-extrabold text-sm text-[#134E4A] bg-[#E6F1EF] border border-[#CBDED9] hover:bg-teal-100/70 shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Award className="w-5 h-5 text-[#0F766E]" />
                  <span>View Subscriptions</span>
                </button>
              </div>

              {/* Key Highlights */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-teal-900/80 font-medium">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                  <span>No Chatbot Stubs</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                  <span>Real Voice Audio Output</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                  <span>Live Grammar Doctor</span>
                </span>
              </div>
            </div>

            {/* Right Interactive AI Partner Card Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-[#042F2C] text-white p-6 shadow-2xl border border-[#14B8A6]/40 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#14B8A6]/20 rounded-full blur-2xl" />
                
                {/* AI Persona Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#14B8A6]/20">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={AI_PERSONAS[0].avatarUrl}
                        alt="MZ Coach"
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#14B8A6]"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#14B8A6] rounded-full ring-2 ring-[#042F2C]" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-white">{AI_PERSONAS[0].name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#14B8A6]/20 text-teal-200 border border-[#14B8A6]/30">
                          AI Lead Partner
                        </span>
                      </div>
                      <p className="text-xs text-teal-200/70">{AI_PERSONAS[0].accent} Accent</p>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-teal-900/60 text-teal-300 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 animate-bounce" />
                  </div>
                </div>

                {/* Simulated Conversation Waveform */}
                <div className="py-6 space-y-4">
                  <div className="bg-[#0F766E]/40 rounded-2xl p-4 border border-[#14B8A6]/30">
                    <p className="text-xs text-teal-200/80 font-semibold uppercase mb-1 flex items-center justify-between">
                      <span>AI Speaking...</span>
                      <span className="text-teal-300">0.9x Speed</span>
                    </p>
                    <p className="text-sm text-teal-50 font-medium">
                      "Good afternoon! I'm MZ. Let's practice speaking about your career goals. What is one skill you'd like to improve today?"
                    </p>
                    
                    {/* Audio Waveform Animation */}
                    <div className="mt-3 flex items-center space-x-1 h-6">
                      {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30, 85, 60, 100, 40, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-[#0F766E] to-[#14B8A6] rounded-full transition-all duration-300"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Grammar Doctor Feedback Sample */}
                  <div className="bg-[#0F766E]/50 border border-[#14B8A6]/40 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-teal-200 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Live Grammar Doctor Tip</span>
                    </div>
                    <p className="text-teal-100">
                      <span className="line-through text-rose-300">"I am practice speaking"</span> →{' '}
                      <strong className="text-teal-200">"I am practicing speaking"</strong>
                    </p>
                    <p className="text-[11px] text-teal-200/70">
                      Use the present continuous verb form (-ing) after "am".
                    </p>
                  </div>
                </div>

                {/* Quick Interactive Button */}
                <button
                  onClick={() => onNavigate('speaking')}
                  className="w-full py-3 rounded-xl bg-ai-gradient hover:opacity-95 font-bold text-white text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-teal-900/40"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Try Interactive Speaking Studio Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof Stats Banner */}
      <section className="bg-[#DCEDE9] py-10 border-y border-[#CBDED9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#134E4A]">250,000+</p>
              <p className="text-xs sm:text-sm font-semibold text-[#0F766E] mt-1">Practice Minutes Logged</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#134E4A]">98%</p>
              <p className="text-xs sm:text-sm font-semibold text-[#0F766E] mt-1">Speaking Confidence Boost</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#134E4A]">4.9 / 5</p>
              <p className="text-xs sm:text-sm font-semibold text-[#0F766E] mt-1">Learner Rating</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#134E4A]">24 / 7</p>
              <p className="text-xs sm:text-sm font-semibold text-[#0F766E] mt-1">Available AI Partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Personas Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
            Versatile Voice Personalities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#134E4A]">
            Choose Your AI Speaking Partner
          </h2>
          <p className="text-teal-900/80 text-sm sm:text-base font-medium">
            Practice with specialized AI coaches tailored to your goals — from everyday casual talk to corporate business negotiations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AI_PERSONAS.map((persona) => (
            <div
              key={persona.id}
              onClick={() => onNavigate('speaking')}
              className="group relative rounded-3xl bg-[#E6F1EF] p-6 border border-[#CBDED9] hover:border-[#0F766E] shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4"
            >
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src={persona.avatarUrl}
                  alt={persona.name}
                  className="w-full h-full rounded-2xl object-cover ring-4 ring-[#0F766E]/20 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-md bg-ai-gradient text-white text-[10px] font-extrabold shadow-sm">
                  {persona.tag}
                </span>
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-black text-lg text-[#134E4A] group-hover:text-[#0F766E] transition-colors">
                  {persona.name}
                </h3>
                <p className="text-xs font-bold text-[#0F766E]">{persona.role}</p>
                <p className="text-[11px] text-teal-800/70 font-medium">{persona.accent} Accent</p>
              </div>

              <p className="text-xs text-teal-900/80 font-medium text-center line-clamp-2">
                {persona.description}
              </p>

              <button className="w-full py-2.5 rounded-xl bg-[#DCEDE9] group-hover:bg-[#0F766E] group-hover:text-white text-[#134E4A] font-bold text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer">
                <Mic className="w-3.5 h-3.5" />
                <span>Speak with {persona.name.split(' ')[0]}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Learning Levels (Beginner, Intermediate, Advanced) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
            Tailored Difficulty Progression
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#134E4A]">
            Designed for Every Stage of Fluency
          </h2>
          <p className="text-teal-900/80 text-sm sm:text-base font-medium">
            Whether starting from basic greetings or refining advanced corporate diplomacy, Speak with MZ adapts in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Beginner Level */}
          <div className="rounded-3xl bg-[#E6F1EF] p-8 border border-[#CBDED9] shadow-sm hover:shadow-lg transition-all space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#DCEDE9] text-[#0F766E] flex items-center justify-center border border-[#CBDED9]">
              <Sparkles className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-[#134E4A]">Beginner Level</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                  Free
                </span>
              </div>
              <p className="text-xs text-teal-800/70 font-medium mt-1">For building essential vocabulary & initial confidence</p>
            </div>
            <ul className="space-y-3 text-xs text-[#134E4A] font-medium">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0F766E]" />
                <span>Simple everyday conversations & greetings</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0F766E]" />
                <span>Adjustable speaking pace (0.8x slow audio)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0F766E]" />
                <span>Basic grammar & spelling corrections</span>
              </li>
            </ul>
          </div>

          {/* Intermediate Level */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white p-8 border-2 border-[#14B8A6] shadow-xl space-y-6">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F59E0B] text-slate-950 text-xs font-black uppercase tracking-wider">
              Most Popular
            </span>
            <div className="w-12 h-12 rounded-2xl bg-teal-800/60 text-teal-200 flex items-center justify-center border border-teal-600/40">
              <Zap className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">Intermediate Level</h3>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-teal-800/80 text-teal-100">
                  Premium
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-1 font-medium">For natural spontaneous discourse & active vocabulary</p>
            </div>
            <ul className="space-y-3 text-xs text-teal-50 font-medium">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#14B8A6]" />
                <span>Job interview simulations & travel scenarios</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#14B8A6]" />
                <span>Live Grammar Doctor with clear explanations</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#14B8A6]" />
                <span>Instant Vocabulary Vault & audio flashcards</span>
              </li>
            </ul>
          </div>

          {/* Advanced Level */}
          <div className="rounded-3xl bg-[#E6F1EF] p-8 border border-[#CBDED9] shadow-sm hover:shadow-lg transition-all space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#DCEDE9] text-[#0F766E] flex items-center justify-center border border-[#CBDED9]">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-[#134E4A]">Advanced Level</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                  Premium
                </span>
              </div>
              <p className="text-xs text-teal-800/70 font-medium mt-1">For native-level nuance, debate & exam preparation</p>
            </div>
            <ul className="space-y-3 text-xs text-[#134E4A] font-medium">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0F766E]" />
                <span>Nuanced idiom & phrase suggestions</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0F766E]" />
                <span>Phonetic pronunciation accuracy drills</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0F766E]" />
                <span>All AI Personas including Exam Coach</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Final Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#042F2C] via-[#0F766E] to-[#115E59] text-white p-10 lg:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden border border-[#14B8A6]/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight text-white">
            Ready to Speak English Without Hesitation?
          </h2>
          <p className="text-teal-100 text-base sm:text-lg max-w-xl mx-auto font-medium">
            Join thousands of learners building real fluency today. Start your first AI conversation in under 30 seconds.
          </p>
          <div className="pt-2">
            <button
              id="bottom-cta-start-speaking"
              onClick={() => onNavigate('speaking')}
              className="px-8 py-4 rounded-2xl font-black text-base text-[#134E4A] bg-[#E6F1EF] hover:bg-teal-100 shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start Free Practice Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
