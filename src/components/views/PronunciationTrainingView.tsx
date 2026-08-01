import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Award,
  AudioWaveform,
  Bot
} from 'lucide-react';

interface PronunciationTrainingViewProps {
  onNavigate: (view: string) => void;
}

export const PronunciationTrainingView: React.FC<PronunciationTrainingViewProps> = ({ onNavigate }) => {
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number | null>(null);

  const LESSONS = [
    {
      title: '1. Word Stress & Syllables',
      desc: 'In English, stressing the wrong syllable changes word meaning (e.g., RECORD vs reCORD).',
      examples: [
        { word: 'PHO-to-graph', stress: 'First syllable stressed' },
        { word: 'pho-TOG-ra-phy', stress: 'Second syllable stressed' },
        { word: 'pho-to-GRAPH-ic', stress: 'Third syllable stressed' }
      ]
    },
    {
      title: '2. Sentence Stress & Rhythm',
      desc: 'English is a stress-timed language. Nouns, main verbs, and adjectives receive emphasis while prepositions compress.',
      examples: [
        { word: '"CATS CHASE MICE"', stress: '3 key content beats' },
        { word: '"The CATS have been CHASING the MICE"', stress: 'Same 3 key beats taking equal time!' }
      ]
    },
    {
      title: '3. Intonation & Pitch Contours',
      desc: 'Rising intonation signals questions or non-final statements. Falling intonation signals certainty and finality.',
      examples: [
        { word: 'Are you ready? ↗', stress: 'Rising pitch at sentence end' },
        { word: 'Yes, I am completely ready. ↘', stress: 'Falling pitch signals completion' }
      ]
    },
    {
      title: '4. Connected Speech & Assimilation',
      desc: 'Words link together seamlessly in natural speech (e.g., "pick it up" sounds like "pi-ki-tup").',
      examples: [
        { word: 'What do you want? → "Whaddya want?"', stress: 'Natural casual linkage' },
        { word: 'Out of time → "Ou-ta-time"', stress: 'Smooth consonant transition' }
      ]
    }
  ];

  const handleSpeak = (text: string, idx: number) => {
    setActiveSpeechIndex(idx);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.onend = () => setActiveSpeechIndex(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setActiveSpeechIndex(null), 1500);
    }
  };

  return (
    <div id="pronunciation-training-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBDED9] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] text-xs font-black border border-[#CBDED9] mb-2">
            <Volume2 className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>VOICE PHONETICS STUDIO</span>
          </div>
          <h1 className="text-3xl font-black text-[#134E4A]">Pronunciation & Phonetics Training</h1>
          <p className="text-xs sm:text-sm text-teal-800/80 font-medium mt-1">
            Master English word stress, intonation contours, connected speech, and native accent clarity.
          </p>
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="px-6 py-3 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-md hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Mic className="w-4 h-4 text-white animate-pulse" />
          <span>Practice Pronunciation with AI</span>
        </button>
      </div>

      {/* Grid of 4 Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LESSONS.map((l, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-4">
            <h3 className="text-base font-black text-[#134E4A]">{l.title}</h3>
            <p className="text-xs text-teal-900/80 font-medium leading-relaxed">{l.desc}</p>
            
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-black uppercase text-[#0F766E] block">Audio Examples:</span>
              {l.examples.map((ex, i) => {
                const globalIdx = idx * 10 + i;
                return (
                  <div key={i} className="p-3 rounded-2xl bg-white border border-[#CBDED9] flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-xs text-[#134E4A]">{ex.word}</p>
                      <p className="text-[10px] text-teal-800/70 font-medium">{ex.stress}</p>
                    </div>
                    <button
                      onClick={() => handleSpeak(ex.word, globalIdx)}
                      className="px-3 py-1.5 rounded-xl bg-[#DCEDE9] hover:bg-[#CBDED9] text-[#0F766E] font-bold text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${activeSpeechIndex === globalIdx ? 'animate-bounce text-[#0F766E]' : ''}`} />
                      <span>Listen</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-[#042F2C] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#14B8A6]/30 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#14B8A6]/20 text-teal-200 text-xs font-bold">
            <Bot className="w-4 h-4 text-[#F59E0B]" />
            <span>AI Voice Accent Doctor</span>
          </div>
          <h3 className="text-xl font-black text-white">Get real-time speech evaluation from MZ AI</h3>
          <p className="text-xs text-teal-100/80 font-medium">Record yourself in Speaking Studio to receive syllable stress & clarity scores.</p>
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="px-8 py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-xl hover:opacity-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Mic className="w-4 h-4 text-white animate-pulse" />
          <span>Launch AI Phonetics Coach</span>
        </button>
      </div>

    </div>
  );
};
