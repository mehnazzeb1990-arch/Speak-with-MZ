import React from 'react';
import { 
  Mic, 
  Sparkles, 
  Globe, 
  ArrowRight, 
  Award, 
  Volume2, 
  BookOpen, 
  Bot, 
  Rocket, 
  BookMarked, 
  GraduationCap, 
  Lightbulb, 
  Book, 
  PenTool, 
  TrendingUp, 
  Crown,
  MessageSquare,
  Zap,
  CheckCircle2,
  Headphones,
  Trophy,
  BarChart3,
  Layers,
  ShieldCheck,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div id="home-view-page" className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 select-none">
      
      {/* 1. HERO SECTION: Welcome Card introducing Coach MZ */}
      <section id="hero-section" className="card-ai-luxury p-8 sm:p-10 border border-[#CBDED9] bg-gradient-to-r from-[#DCEDE9] via-[#E6F1EF] to-[#DCEDE9] relative overflow-hidden shadow-sm rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E] text-white text-xs font-black shadow-sm">
              <Bot className="w-4 h-4 text-[#F59E0B]" />
              <span>YOUR PERSONAL AI ENGLISH SPEAKING COACH</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black text-[#134E4A] tracking-tight">
                Coach MZ
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#0F766E]">
                Your Personal AI English Speaking Coach
              </p>
            </div>

            <p className="text-sm sm:text-base text-teal-900/80 font-medium max-w-2xl leading-relaxed">
              Practice English naturally with Coach MZ—your AI-powered speaking partner designed to help you improve fluency, pronunciation, vocabulary, grammar, confidence, interview skills, and real-world communication through personalized conversations and intelligent feedback.
            </p>

            <div className="pt-2">
              <button
                id="hero-start-speaking-btn"
                onClick={() => onNavigate('speaking')}
                className="px-6 py-4 rounded-2xl bg-ai-gradient text-white font-black text-sm shadow-lg shadow-teal-700/25 hover:opacity-95 transition-all flex items-center space-x-2.5 cursor-pointer group"
              >
                <Mic className="w-5 h-5 text-white animate-pulse" />
                <span>🎤 Start Speaking with Coach MZ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Coach MZ Feature Box */}
          <div 
            onClick={() => onNavigate('speaking')}
            className="lg:col-span-4 bg-[#042F2C] text-white p-7 rounded-3xl border border-[#14B8A6]/30 shadow-xl space-y-5 cursor-pointer hover:border-[#14B8A6] hover:scale-[1.02] transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center font-black text-[#F59E0B] text-2xl shadow-md border border-[#14B8A6]/40 shrink-0">
                  MZ
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Coach MZ</h3>
                  <p className="text-xs text-teal-200/90 font-medium">Personal AI English Coach</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#14B8A6] group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="space-y-2 text-xs text-teal-100/90 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0" />
                <span>24/7 Unlimited Vocal Practice</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0" />
                <span>Real-Time Live Grammar Doctor</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0" />
                <span>Instant Phonetic Feedback</span>
              </div>
            </div>

            <div className="bg-[#0F766E]/50 p-3.5 rounded-2xl border border-[#14B8A6]/30 text-xs text-teal-100 font-medium group-hover:bg-[#0F766E] transition-colors flex items-center justify-between">
              <span>"Ready to build confidence and refine your pronunciation today?"</span>
              <Mic className="w-4 h-4 text-[#F59E0B] ml-2 shrink-0 animate-pulse" />
            </div>
          </div>

        </div>
      </section>

      {/* 2. WHY ENGLISH SPEAKING SKILLS MATTER */}
      <section id="why-speaking-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Core Foundation</span>
            <h2 className="text-2xl font-black text-[#134E4A]">Why English Speaking Skills Matter</h2>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('why-speaking')}
          className="p-8 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer space-y-4 group"
        >
          <p className="text-sm text-teal-900/80 font-medium leading-relaxed">
            Active vocal practice is the fastest key to unlocking English fluency. Memorizing grammar rules alone doesn't build conversational confidence—speaking regularly with an encouraging AI partner trains your brain to express complex thoughts without hesitation or mental translation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-1 group-hover:bg-teal-200/50 transition-colors">
              <h4 className="font-extrabold text-sm text-[#134E4A]">🚀 Career Mobility</h4>
              <p className="text-xs text-teal-800/80">Command higher international salaries and unlock global remote positions.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-1 group-hover:bg-teal-200/50 transition-colors">
              <h4 className="font-extrabold text-sm text-[#134E4A]">🎓 Fluency & Expression</h4>
              <p className="text-xs text-teal-800/80">Master spontaneous storytelling, public speaking, and presentation skills.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-1 group-hover:bg-teal-200/50 transition-colors">
              <h4 className="font-extrabold text-sm text-[#134E4A]">🌟 Social & Travel Confidence</h4>
              <p className="text-xs text-teal-800/80">Speak naturally with international friends, travelers, and colleagues.</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="px-5 py-2.5 rounded-2xl bg-[#0F766E] text-white font-extrabold text-xs group-hover:bg-[#115E59] transition-all flex items-center space-x-1.5 shadow-sm">
              <span>Explore Why Speaking Skills Matter</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </section>

      {/* 3. BENEFITS OF IMPROVING SPEAKING SKILLS */}
      <section id="benefits-section" className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Transformation</span>
          <h2 className="text-2xl font-black text-[#134E4A]">Benefits of Improving Speaking Skills</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => onNavigate('benefits-english')}
            className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-md">
              <Globe className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#134E4A]">Global Networking & Mobility</h3>
              <ArrowRight className="w-4 h-4 text-[#0F766E] group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
              Connect effortlessly with professionals across borders, present at international conferences, and expand your global personal network.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('benefits-english')}
            className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#134E4A]">Fast Cognitive Reaction Time</h3>
              <ArrowRight className="w-4 h-4 text-[#0F766E] group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
              Eliminate awkward pauses and word searching. Speak fluidly using idiomatic expressions and natural rhythm.
            </p>
          </div>
        </div>
      </section>

      {/* 4. BEGINNER LEARNING TIPS */}
      <section id="beginner-section" className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#0F766E] tracking-wider block">Level 1 • Foundation</span>
            <h2 className="text-2xl font-black text-[#134E4A]">Beginner Learning Tips</h2>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('guide-beginner')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer space-y-4 group"
        >
          <p className="text-xs sm:text-sm text-teal-900/80 font-medium">
            Start small! Focus on short everyday sentences, master essential greetings, shadow basic audio recordings, and don't worry about perfection.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] group-hover:bg-teal-200/50 transition-colors">
              <h5 className="font-bold text-xs text-[#134E4A]">1. Everyday Greetings</h5>
              <p className="text-[11px] text-teal-800/80 mt-1">Master "How's it going?" and natural replies.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] group-hover:bg-teal-200/50 transition-colors">
              <h5 className="font-bold text-xs text-[#134E4A]">2. Sentence Framing</h5>
              <p className="text-[11px] text-teal-800/80 mt-1">Practice Subject + Verb + Object structures.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] group-hover:bg-teal-200/50 transition-colors">
              <h5 className="font-bold text-xs text-[#134E4A]">3. Daily 5-Min Drills</h5>
              <p className="text-[11px] text-teal-800/80 mt-1">Consistency matters more than marathon sessions.</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="px-5 py-2.5 rounded-2xl bg-[#0F766E] text-white font-extrabold text-xs group-hover:bg-[#115E59] transition-all flex items-center space-x-1.5 shadow-sm">
              <Rocket className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Open Beginner Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-1" />
            </span>
          </div>
        </div>
      </section>

      {/* 5. INTERMEDIATE LEARNING TIPS */}
      <section id="intermediate-section" className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#0F766E] tracking-wider block">Level 2 • Fluency</span>
            <h2 className="text-2xl font-black text-[#134E4A]">Intermediate Learning Tips</h2>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('guide-intermediate')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer space-y-4 group"
        >
          <p className="text-xs sm:text-sm text-teal-900/80 font-medium">
            Bridge the gap between translating in your head and spontaneous speech. Learn connected speech, phrasal verbs, and the PREP structuring framework.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] group-hover:bg-teal-200/50 transition-colors">
              <h5 className="font-bold text-xs text-[#134E4A]">1. The PREP Method</h5>
              <p className="text-[11px] text-teal-800/80 mt-1">Point, Reason, Example, Point framework for clear answers.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] group-hover:bg-teal-200/50 transition-colors">
              <h5 className="font-bold text-xs text-[#134E4A]">2. Phrasal Verbs</h5>
              <p className="text-[11px] text-teal-800/80 mt-1">Replace formal verbs with natural conversational alternatives.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] group-hover:bg-teal-200/50 transition-colors">
              <h5 className="font-bold text-xs text-[#134E4A]">3. Spontaneous Speaking</h5>
              <p className="text-[11px] text-teal-800/80 mt-1">Structure topic presentations with smooth transitional phrases.</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="px-5 py-2.5 rounded-2xl bg-[#0F766E] text-white font-extrabold text-xs group-hover:bg-[#115E59] transition-all flex items-center space-x-1.5 shadow-sm">
              <BookMarked className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Open Intermediate Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-1" />
            </span>
          </div>
        </div>
      </section>

      {/* 6. ADVANCED LEARNING TIPS */}
      <section id="advanced-section" className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#0F766E] tracking-wider block">Level 3 • Executive</span>
            <h2 className="text-2xl font-black text-[#134E4A]">Advanced Learning Tips</h2>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('guide-advanced')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer space-y-4 group"
        >
          <p className="text-xs sm:text-sm text-teal-900/80 font-medium">
            Master boardroom negotiations, quarterly metric defenses, rhetorical hooks, nuanced vocabulary, and executive-level public speaking.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] group-hover:bg-teal-200/50 transition-colors">
              <h5 className="font-bold text-xs text-[#134E4A]">1. Executive Hooks</h5>
              <p className="text-[11px] text-teal-800/80 mt-1">Capture boardroom attention with impactful opening statements.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] group-hover:bg-teal-200/50 transition-colors">
              <h5 className="font-bold text-xs text-[#134E4A]">2. Boardroom Debates</h5>
              <p className="text-[11px] text-teal-800/80 mt-1">Defend complex proposals tactfully and persuasively.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] group-hover:bg-teal-200/50 transition-colors">
              <h5 className="font-bold text-xs text-[#134E4A]">3. Nuanced Rhetoric</h5>
              <p className="text-[11px] text-teal-800/80 mt-1">Leverage sophisticated idioms and subtle emotional tone.</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="px-5 py-2.5 rounded-2xl bg-[#0F766E] text-white font-extrabold text-xs group-hover:bg-[#115E59] transition-all flex items-center space-x-1.5 shadow-sm">
              <GraduationCap className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Open Advanced Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-1" />
            </span>
          </div>
        </div>
      </section>

      {/* 7. GRAMMAR IMPROVEMENT */}
      <section id="grammar-section" className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Live Correction</span>
          <h2 className="text-2xl font-black text-[#134E4A]">Grammar Improvement</h2>
        </div>

        <div 
          onClick={() => onNavigate('grammar-improvement')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#134E4A] flex items-center space-x-2">
              <PenTool className="w-5 h-5 text-[#0F766E]" />
              <span>Real-Time Grammar Doctor Engine</span>
            </h3>
            <p className="text-xs text-teal-900/80 font-medium">
              Receive immediate gentle corrections, tense fixes, and syntax upgrades as you speak with Coach MZ.
            </p>
          </div>

          <span className="px-5 py-3 rounded-2xl bg-[#0F766E] text-white font-black text-xs group-hover:bg-[#115E59] transition-all shrink-0 shadow-sm flex items-center space-x-1.5">
            <span>Launch Grammar Doctor</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </section>

      {/* 8. VOCABULARY BUILDING */}
      <section id="vocabulary-section" className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Word Bank</span>
          <h2 className="text-2xl font-black text-[#134E4A]">Vocabulary Building</h2>
        </div>

        <div 
          onClick={() => onNavigate('vocab')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#134E4A] flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#0F766E]" />
              <span>Personalized Vocabulary Vault & Flashcards</span>
            </h3>
            <p className="text-xs text-teal-900/80 font-medium">
              Save new expressions, practice flashcards, take quizzes, and track vocabulary mastery.
            </p>
          </div>

          <span className="px-5 py-3 rounded-2xl bg-[#0F766E] text-white font-black text-xs group-hover:bg-[#115E59] transition-all shrink-0 shadow-sm flex items-center space-x-1.5">
            <span>Open Vocabulary Vault</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </section>

      {/* 9. PRONUNCIATION TRAINING */}
      <section id="pronunciation-section" className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Phonetics</span>
          <h2 className="text-2xl font-black text-[#134E4A]">Pronunciation Training</h2>
        </div>

        <div 
          onClick={() => onNavigate('pronunciation-training')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#134E4A] flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#0F766E]" />
              <span>Interactive Phonetic Audio Practice</span>
            </h3>
            <p className="text-xs text-teal-900/80 font-medium">
              Refine your intonation, word stress, vowel clarity, and accent naturalness with crystal-clear AI voice models.
            </p>
          </div>

          <span className="px-5 py-3 rounded-2xl bg-[#0F766E] text-white font-black text-xs group-hover:bg-[#115E59] transition-all shrink-0 shadow-sm flex items-center space-x-1.5">
            <span>Start Pronunciation Training</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </section>

      {/* 10. AI SPEAKING PRACTICE */}
      <section id="speaking-practice-section" className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Interactive Studio</span>
          <h2 className="text-2xl font-black text-[#134E4A]">AI Speaking Practice</h2>
        </div>

        <div className="p-8 rounded-3xl bg-[#042F2C] text-white border border-[#14B8A6]/30 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">Choose Your Roleplay Scenario & Start Practicing</h3>
            <p className="text-xs text-teal-200/90 font-medium">
              Practice 400+ real-world topics, job interviews, free discussions, and spontaneous speaking drills with Coach MZ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => onNavigate('speaking')}
              className="p-4 rounded-2xl bg-[#0F766E]/50 border border-[#14B8A6]/30 hover:bg-[#0F766E] hover:scale-105 transition-all cursor-pointer space-y-1 group"
            >
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>💼 Job Interview</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#14B8A6] group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-[11px] text-teal-200/80">Behavioral & technical drills.</p>
            </div>
            <div 
              onClick={() => onNavigate('speaking')}
              className="p-4 rounded-2xl bg-[#0F766E]/50 border border-[#14B8A6]/30 hover:bg-[#0F766E] hover:scale-105 transition-all cursor-pointer space-y-1 group"
            >
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>✈️ Travel & Hotel</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#14B8A6] group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-[11px] text-teal-200/80">Real-world situational roleplay.</p>
            </div>
            <div 
              onClick={() => onNavigate('speaking')}
              className="p-4 rounded-2xl bg-[#0F766E]/50 border border-[#14B8A6]/30 hover:bg-[#0F766E] hover:scale-105 transition-all cursor-pointer space-y-1 group"
            >
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>🎤 Topic Presentation</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#14B8A6] group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-[11px] text-teal-200/80">Spontaneous 2-min speaking drill.</p>
            </div>
            <div 
              onClick={() => onNavigate('speaking')}
              className="p-4 rounded-2xl bg-[#0F766E]/50 border border-[#14B8A6]/30 hover:bg-[#0F766E] hover:scale-105 transition-all cursor-pointer space-y-1 group"
            >
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>🗣 Free Discussion</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#14B8A6] group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-[11px] text-teal-200/80">Casual natural conversation.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('speaking')}
            className="w-full py-3.5 rounded-2xl bg-[#14B8A6] hover:bg-[#0D9488] text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
          >
            <Mic className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Launch Speaking Studio Now</span>
          </button>
        </div>
      </section>

      {/* 11. PROGRESS TRACKING */}
      <section id="progress-tracking-section" className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Analytics</span>
          <h2 className="text-2xl font-black text-[#134E4A]">Progress Tracking</h2>
        </div>

        <div 
          onClick={() => onNavigate('progress')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#134E4A] flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#0F766E]" />
              <span>Track Speaking Minutes & Fluency Growth</span>
            </h3>
            <p className="text-xs text-teal-900/80 font-medium">
              Monitor daily speaking practice time, fluency scores, vocabulary mastery, and streak milestones.
            </p>
          </div>

          <span className="px-5 py-3 rounded-2xl bg-[#0F766E] text-white font-black text-xs group-hover:bg-[#115E59] transition-all shrink-0 shadow-sm flex items-center space-x-1.5">
            <span>View My Progress</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </section>

      {/* 12. PREMIUM PLANS */}
      <section id="premium-plans-section" className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Upgrade</span>
          <h2 className="text-2xl font-black text-[#134E4A]">Premium Plans</h2>
        </div>

        <div 
          onClick={() => onNavigate('pricing')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#134E4A] flex items-center space-x-2">
              <Crown className="w-5 h-5 text-[#F59E0B]" />
              <span>Unlock Unlimited AI Speaking Practice</span>
            </h3>
            <p className="text-xs text-teal-900/80 font-medium">
              Enjoy 100% ad-free speaking practice, priority Gemini AI processing, full voice synthesis, and downloadable transcript reports.
            </p>
          </div>

          <span className="px-5 py-3 rounded-2xl bg-ai-gradient text-white font-black text-xs group-hover:opacity-95 transition-all shrink-0 shadow-md flex items-center space-x-1.5">
            <span>Explore Premium Plans</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </section>

      {/* 13. ACHIEVEMENTS */}
      <section id="achievements-section" className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Milestones</span>
          <h2 className="text-2xl font-black text-[#134E4A]">Achievements & Streaks</h2>
        </div>

        <div 
          onClick={() => onNavigate('achievements')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#134E4A] flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-[#F59E0B]" />
              <span>Earn Badges & Maintain Daily Speaking Streaks</span>
            </h3>
            <p className="text-xs text-teal-900/80 font-medium">
              Stay motivated with daily streaks, fluency badges, and continuous practice rewards.
            </p>
          </div>

          <span className="px-5 py-3 rounded-2xl bg-[#0F766E] text-white font-black text-xs group-hover:bg-[#115E59] transition-all shrink-0 shadow-sm flex items-center space-x-1.5">
            <span>View Achievements</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </section>

      {/* 14. CONTACT & SUPPORT */}
      <section id="contact-section" className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-[#0F766E] tracking-wider block">Help Center</span>
          <h2 className="text-2xl font-black text-[#134E4A]">Contact & Support</h2>
        </div>

        <div 
          onClick={() => onNavigate('contact')}
          className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] hover:shadow-xl hover:-translate-y-1 hover:border-[#0F766E] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#134E4A] flex items-center space-x-2">
              <Headphones className="w-5 h-5 text-[#0F766E]" />
              <span>24/7 Dedicated Support & AI Assistant</span>
            </h3>
            <p className="text-xs text-teal-900/80 font-medium">
              Need assistance or have feedback? Reach out to our team or chat with our automated support bot.
            </p>
          </div>

          <span className="px-5 py-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] text-[#0F766E] font-extrabold text-xs group-hover:bg-[#CBDED9] transition-all shrink-0 flex items-center space-x-1.5">
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </section>

    </div>
  );
};
