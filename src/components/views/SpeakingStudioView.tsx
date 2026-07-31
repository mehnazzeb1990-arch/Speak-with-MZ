import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { audioService } from '../../services/audio';
import { ConversationMessage, GrammarCorrection, AIPersona, SpeakingScenario } from '../../types';
import { AI_PERSONAS, SPEAKING_SCENARIOS } from '../../data/mockData';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookMarked, 
  Check, 
  Clock, 
  Award, 
  RotateCcw, 
  ChevronDown, 
  Settings, 
  Flame, 
  AlertCircle,
  Play,
  Pause,
  Plus
} from 'lucide-react';

interface SpeakingStudioViewProps {
  onNavigate: (view: string) => void;
}

export const SpeakingStudioView: React.FC<SpeakingStudioViewProps> = ({ onNavigate }) => {
  const { user, activePersona, setActivePersona, activeScenario, setActiveScenario, addVocabWord, recordSpeakingMinutes } = useAuth();
  
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm ${activePersona.name}. Welcome to our "${activeScenario.title}" speaking practice session. What would you like to share or ask first?`,
      timestamp: 'Just now',
      fluencyScore: 92,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [latestGrammar, setLatestGrammar] = useState<GrammarCorrection | null>(null);
  const [latestVocab, setLatestVocab] = useState<{ word: string; definition: string; example: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer effect
  useEffect(() => {
    let timer: any = null;
    if (isSessionActive) {
      timer = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive]);

  // Auto scroll transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, inputText]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Speak AI text
  const handlePlayAiSpeech = async (text: string) => {
    if (!soundEnabled) return;
    setIsAiSpeaking(true);
    await audioService.speak(text, {
      gender: activePersona.voiceGender,
      rate: audioSpeed,
    });
    setIsAiSpeaking(false);
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (isListening) {
      audioService.stopListening();
      setIsListening(false);
    } else {
      setSpeechError(null);
      const started = audioService.startListening(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal && transcript.trim()) {
            handleSendMessage(transcript.trim());
          }
        },
        (errorMsg) => {
          setSpeechError(errorMsg);
          setIsListening(false);
        }
      );
      if (started) {
        setIsListening(true);
      }
    }
  };

  // Send user message to Express / Gemini backend
  const handleSendMessage = async (textToSend?: string) => {
    const finalMsg = textToSend || inputText;
    if (!finalMsg.trim() || isSubmitting) return;

    if (isListening) {
      audioService.stopListening();
      setIsListening(false);
    }

    const userMessage: ConversationMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: finalMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: finalMsg.trim(),
          persona: activePersona.name,
          level: user?.level || 'Intermediate',
          scenario: activeScenario.title,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      const aiMessage: ConversationMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I couldn't quite catch that. Could you repeat?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grammarCorrection: data.grammarCorrection,
        fluencyScore: data.fluencyScore || 85,
        suggestedVocab: data.suggestedVocabulary || [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.grammarCorrection) {
        setLatestGrammar(data.grammarCorrection);
      }

      if (data.suggestedVocabulary && data.suggestedVocabulary.length > 0) {
        setLatestVocab(data.suggestedVocabulary);
      }

      // Play audio response
      handlePlayAiSpeech(aiMessage.text);
    } catch (err) {
      console.error('Failed to get AI reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveVocabItem = (item: { word: string; definition: string; example: string }) => {
    addVocabWord({
      id: `v_${Date.now()}`,
      word: item.word,
      phonetic: '/ai-gen/',
      definition: item.definition,
      example: item.example,
      level: user?.level || 'Intermediate',
      category: activeScenario.category,
      masteryLevel: 1,
      isSaved: true,
      dateAdded: new Date().toISOString().split('T')[0],
    });
  };

  const handleEndSession = () => {
    const minutes = Math.max(1, Math.round(sessionSeconds / 60));
    recordSpeakingMinutes(minutes);
    setIsSessionActive(false);
    onNavigate('dashboard');
  };

  return (
    <div id="speaking-studio-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Scenario & Persona Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Persona Picker */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <img
                src={activePersona.avatarUrl}
                alt={activePersona.name}
                className="w-6 h-6 rounded-lg object-cover"
              />
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{activePersona.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Persona Select Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 hidden group-hover:block z-30">
              <p className="text-[11px] font-bold text-slate-400 uppercase px-2 py-1">Select AI Partner</p>
              {AI_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center space-x-2.5 transition-colors ${
                    activePersona.id === p.id ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <img src={p.avatarUrl} alt={p.name} className="w-6 h-6 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Selector */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-sky-300 transition-colors">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-xs">{activeScenario.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
            </button>

            {/* Scenario Select Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 hidden group-hover:block z-30">
              <p className="text-[11px] font-bold text-slate-400 uppercase px-2 py-1">Choose Scenario</p>
              {SPEAKING_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveScenario(s)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    activeScenario.id === s.id ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div>
                    <p className="font-bold">{s.title}</p>
                    <p className="text-[10px] text-slate-400">{s.category}</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                    {s.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Session Timer */}
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{formatTime(sessionSeconds)}</span>
          </div>
        </div>

        {/* Audio Controls & End Session */}
        <div className="flex items-center space-x-3">
          
          {/* Speed Selector */}
          <div className="flex items-center space-x-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {[0.8, 1.0, 1.2].map((s) => (
              <button
                key={s}
                onClick={() => setAudioSpeed(s)}
                className={`px-2 py-1 rounded-xl transition-colors ${
                  audioSpeed === s ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-sky-300 shadow-sm' : 'hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title={soundEnabled ? 'Audio Output Enabled' : 'Audio Output Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
          </button>

          {/* End Session Button */}
          <button
            onClick={handleEndSession}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-colors"
          >
            Finish & Save Session
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Partner Avatar Stage & Transcript */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* AI Visual Stage */}
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 shadow-xl border border-indigo-800/80 overflow-hidden min-h-[160px] flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={activePersona.avatarUrl}
                  alt={activePersona.name}
                  className={`w-16 h-16 rounded-2xl object-cover ring-4 transition-all duration-300 ${
                    isAiSpeaking ? 'ring-sky-400 scale-105 shadow-lg shadow-sky-400/40' : 'ring-indigo-700'
                  }`}
                />
                {isAiSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-sky-400 rounded-full ring-2 ring-indigo-950 animate-ping" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{activePersona.name}</h3>
                <p className="text-xs text-sky-300 font-medium">{activePersona.role}</p>
                <p className="text-[11px] text-indigo-100/70">{activePersona.personality}</p>
              </div>
            </div>

            {/* Audio Waveform Indicator */}
            <div className="flex items-center space-x-1 h-8">
              {[30, 60, 90, 40, 80, 50, 100, 70, 40, 90, 60, 30].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isAiSpeaking ? 'bg-sky-400 animate-pulse' : 'bg-indigo-900 h-2'
                  }`}
                  style={{ height: isAiSpeaking ? `${h}%` : '8px' }}
                />
              ))}
            </div>
          </div>

          {/* Transcript Box */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[380px] max-h-[480px] overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-400 font-medium">
                  <span>{msg.sender === 'user' ? 'You' : activePersona.name}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {msg.sender === 'ai' && soundEnabled && (
                    <button
                      onClick={() => handlePlayAiSpeech(msg.text)}
                      className="mt-2 text-[11px] font-bold text-indigo-600 dark:text-sky-400 flex items-center space-x-1 hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Again</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isSubmitting && (
              <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                <span>{activePersona.name} is thinking & analyzing grammar...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Speech Error Notice */}
          {speechError && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{speechError}</span>
            </div>
          )}

          {/* Interactive Speech Input & Microphone Control */}
          <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 shadow-md">
            
            {/* Interim Microphone Transcript Display */}
            {isListening && (
              <div className="px-4 py-2 mb-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-sky-200 text-xs font-semibold animate-pulse flex items-center justify-between">
                <span>Listening to your voice... Speak naturally.</span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-3"
            >
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3.5 rounded-2xl text-white font-bold transition-all shadow-md flex items-center justify-center shrink-0 ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 animate-pulse shadow-rose-500/30 ring-4 ring-rose-300 dark:ring-rose-900'
                    : 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 shadow-indigo-500/25'
                }`}
                title={isListening ? 'Click to Stop Recording' : 'Click to Speak via Microphone'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Type your sentence or speak via microphone...'}
                className="flex-1 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isSubmitting}
                className="p-3.5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Live Grammar Doctor & Vocab Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Grammar Doctor Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-sky-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Grammar Doctor</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-sky-300">
                Real-Time
              </span>
            </div>

            {latestGrammar ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Original</p>
                  <p className="text-rose-700 dark:text-rose-300 line-through font-medium">{latestGrammar.original}</p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                  <p className="text-indigo-600 dark:text-sky-400 font-bold uppercase text-[10px]">Corrected</p>
                  <p className="text-indigo-900 dark:text-indigo-100 font-bold">{latestGrammar.corrected}</p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px] bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  {latestGrammar.explanation}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic py-4 text-center">
                Speak a sentence! The AI will analyze your grammar and provide instant friendly tips here.
              </p>
            )}
          </div>

          {/* AI Suggested Vocabulary */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                  <BookMarked className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Suggested Vocabulary</h4>
              </div>
            </div>

            {latestVocab.length > 0 ? (
              <div className="space-y-3">
                {latestVocab.map((v, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{v.word}</span>
                      <button
                        onClick={() => handleSaveVocabItem(v)}
                        className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
                        title="Save to Vocab Vault"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{v.definition}</p>
                    <p className="text-[11px] text-slate-400 italic">"{v.example}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic py-4 text-center">
                Keywords and advanced terms extracted during conversation will appear here.
              </p>
            )}
          </div>

          {/* Suggested Phrases Guide */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Suggested Hints ({activeScenario.title})
            </h4>
            <div className="space-y-2">
              {activeScenario.suggestedPhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(phrase)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
