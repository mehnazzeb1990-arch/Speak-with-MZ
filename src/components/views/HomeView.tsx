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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-500/15 via-sky-500/10 to-cyan-500/10 blur-3xl rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-sky-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Next-Gen Conversational English AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Speak English with <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-500 dark:from-indigo-400 dark:via-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Natural Human Confidence
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Meet <strong className="text-slate-900 dark:text-white">Speak with MZ</strong> — your 24/7 AI Speaking Partner. Practice real everyday scenarios, receive instant grammar corrections, and expand your vocabulary without fear or judgment.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-cta-start-speaking"
                  onClick={() => onNavigate('speaking')}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
                >
                  <Mic className="w-5 h-5 animate-pulse text-white" />
                  <span>Start Speaking Free</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>

                <button
                  id="hero-cta-pricing"
                  onClick={() => onNavigate('pricing')}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-sm transition-all flex items-center justify-center space-x-2"
                >
                  <Award className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
                  <span>View Subscriptions</span>
                </button>
              </div>

              {/* Key Highlights */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>No Chatbot Stubs</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>Real Voice Audio Output</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>Live Grammar Doctor</span>
                </span>
              </div>
            </div>

            {/* Right Interactive AI Partner Card Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900 text-white p-6 shadow-2xl border border-slate-800 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl" />
                
                {/* AI Persona Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={AI_PERSONAS[0].avatarUrl}
                        alt="MZ Coach"
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-white">{AI_PERSONAS[0].name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-sky-300 border border-indigo-500/30">
                          AI Lead Partner
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{AI_PERSONAS[0].accent} Accent</p>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 animate-bounce" />
                  </div>
                </div>

                {/* Simulated Conversation Waveform */}
                <div className="py-6 space-y-4">
                  <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60">
                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1 flex items-center justify-between">
                      <span>AI Speaking...</span>
                      <span className="text-sky-400">0.9x Speed</span>
                    </p>
                    <p className="text-sm text-slate-100 font-medium">
                      "Good afternoon! I'm MZ. Let's practice speaking about your career goals. What is one skill you'd like to improve today?"
                    </p>
                    
                    {/* Audio Waveform Animation */}
                    <div className="mt-3 flex items-center space-x-1 h-6">
                      {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30, 85, 60, 100, 40, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-indigo-500 to-sky-400 rounded-full transition-all duration-300"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Grammar Doctor Feedback Sample */}
                  <div className="bg-indigo-950/60 border border-indigo-800/60 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live Grammar Doctor Tip</span>
                    </div>
                    <p className="text-slate-300">
                      <span className="line-through text-rose-400">"I am practice speaking"</span> →{' '}
                      <strong className="text-sky-300">"I am practicing speaking"</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Use the present continuous verb form (-ing) after "am".
                    </p>
                  </div>
                </div>

                {/* Quick Interactive Button */}
                <button
                  onClick={() => onNavigate('speaking')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 font-bold text-white text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-indigo-500/25"
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
      <section className="bg-slate-50 dark:bg-slate-900/60 py-10 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-sky-400">250,000+</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">Practice Minutes Logged</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-sky-400">98%</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">Speaking Confidence Boost</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-sky-400">4.9 / 5</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">Learner Rating</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-sky-400">24 / 7</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">Available AI Partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Personas Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-sky-400">
            Versatile Voice Personalities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Choose Your AI Speaking Partner
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Practice with specialized AI coaches tailored to your goals — from everyday casual talk to corporate business negotiations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AI_PERSONAS.map((persona) => (
            <div
              key={persona.id}
              onClick={() => onNavigate('speaking')}
              className="group relative rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-sky-500 shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4"
            >
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src={persona.avatarUrl}
                  alt={persona.name}
                  className="w-full h-full rounded-2xl object-cover ring-4 ring-indigo-500/20 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-600 to-sky-600 text-white text-[10px] font-extrabold shadow-sm">
                  {persona.tag}
                </span>
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                  {persona.name}
                </h3>
                <p className="text-xs font-semibold text-indigo-600 dark:text-sky-400">{persona.role}</p>
                <p className="text-[11px] text-slate-400">{persona.accent} Accent</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 text-center line-clamp-2">
                {persona.description}
              </p>

              <button className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center space-x-1">
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
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-sky-400">
            Tailored Difficulty Progression
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Designed for Every Stage of Fluency
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Whether starting from basic greetings or refining advanced corporate diplomacy, Speak with MZ adapts in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Beginner Level */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-sky-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Beginner Level</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-sky-300">
                  Free
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For building essential vocabulary & initial confidence</p>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indigo-500" />
                <span>Simple everyday conversations & greetings</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indigo-500" />
                <span>Adjustable speaking pace (0.8x slow audio)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indigo-500" />
                <span>Basic grammar & spelling corrections</span>
              </li>
            </ul>
          </div>

          {/* Intermediate Level */}
          <div className="relative rounded-3xl bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white p-8 border-2 border-sky-400 shadow-xl space-y-6">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
              Most Popular
            </span>
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Intermediate Level</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/30 text-sky-200">
                  Premium
                </span>
              </div>
              <p className="text-xs text-sky-100/80 mt-1">For natural spontaneous discourse & active vocabulary</p>
            </div>
            <ul className="space-y-3 text-xs text-sky-100">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-sky-400" />
                <span>Job interview simulations & travel scenarios</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-sky-400" />
                <span>Live Grammar Doctor with clear explanations</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-sky-400" />
                <span>Instant Vocabulary Vault & audio flashcards</span>
              </li>
            </ul>
          </div>

          {/* Advanced Level */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Advanced Level</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                  Premium
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For native-level nuance, debate & exam preparation</p>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-cyan-500" />
                <span>Nuanced idiom & phrase suggestions</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-cyan-500" />
                <span>Phonetic pronunciation accuracy drills</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-cyan-500" />
                <span>All AI Personas including Exam Coach</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Final Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-700 text-white p-10 lg:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to Speak English Without Hesitation?
          </h2>
          <p className="text-indigo-100 text-base sm:text-lg max-w-xl mx-auto">
            Join thousands of learners building real fluency today. Start your first AI conversation in under 30 seconds.
          </p>
          <div className="pt-2">
            <button
              id="bottom-cta-start-speaking"
              onClick={() => onNavigate('speaking')}
              className="px-8 py-4 rounded-2xl font-extrabold text-base text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Start Free Practice Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
