import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { audioService } from '../../services/audio';
import { elevenLabsService } from '../../services/elevenlabs';
import { DEFAULT_AI_VOICE } from '../../config/voice';
import { ConversationMessage, GrammarCorrection, AIPersona, SpeakingScenario } from '../../types';
import { AI_PERSONAS, SPEAKING_SCENARIOS } from '../../data/mockData';
import { AdBanner } from '../common/AdBanner';
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
  Plus,
  Search,
  Copy,
  Download,
  Trash2,
  RefreshCw,
  X,
  FileText,
  BarChart2,
  CheckCircle2,
  Sliders,
  HelpCircle
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fluencyScore: 92,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [latestGrammar, setLatestGrammar] = useState<GrammarCorrection | null>(null);
  const [latestVocab, setLatestVocab] = useState<{ word: string; definition: string; example: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transcript controls
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Post Session Evaluation Modal
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evalData, setEvalData] = useState<any | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [activeEvalTab, setActiveEvalTab] = useState<'metrics' | 'grammar' | 'vocab' | 'pronunciation' | 'summary'>('metrics');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer effect
  useEffect(() => {
    let timer: any = null;
    if (isSessionActive && !showEvaluationModal) {
      timer = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive, showEvaluationModal]);

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
      volume: volume,
      voiceId: elevenLabsService.getVoiceId() || DEFAULT_AI_VOICE.voice,
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
          userName: user?.name || 'Learner',
        }),
      });

      const data = await response.json();

      const aiMessage: ConversationMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I couldn't quite catch that. Could you repeat?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grammarCorrection: data.grammarCorrection,
        fluencyScore: data.fluencyScore || 88,
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

  // Replay Last AI Message
  const handleReplayLastAiMessage = () => {
    const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');
    if (lastAiMsg) {
      handlePlayAiSpeech(lastAiMsg.text);
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

  // End session and trigger full AI performance evaluation report
  const handleEndSession = async () => {
    if (isListening) audioService.stopListening();
    audioService.stopSpeaking();

    const minutes = Math.max(1, Math.round(sessionSeconds / 60));
    recordSpeakingMinutes(minutes);
    setIsSessionActive(false);

    setShowEvaluationModal(true);
    setEvalLoading(true);

    try {
      const response = await fetch('/api/gemini/evaluate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          persona: activePersona.name,
          scenario: activeScenario.title,
          durationSeconds: sessionSeconds,
          level: user?.level || 'Intermediate',
        }),
      });

      const data = await response.json();
      setEvalData(data);
    } catch (err) {
      console.error('Failed to evaluate session:', err);
    } finally {
      setEvalLoading(false);
    }
  };

  // Transcript utilities
  const handleCopyTranscript = () => {
    const text = messages.map((m) => `[${m.timestamp}] ${m.sender === 'user' ? 'You' : activePersona.name}: ${m.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleDownloadTranscript = (format: 'txt' | 'json') => {
    let content = '';
    let fileName = `Speak_With_MZ_Transcript_${activeScenario.title.replace(/\s+/g, '_')}_${Date.now()}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify({ scenario: activeScenario.title, persona: activePersona.name, date: new Date().toISOString(), messages }, null, 2);
      fileName += '.json';
      mimeType = 'application/json';
    } else {
      content = `SPEAK WITH MZ - TRANSCRIPT REPORT\nScenario: ${activeScenario.title}\nPartner: ${activePersona.name}\nDate: ${new Date().toLocaleString()}\nDuration: ${formatTime(sessionSeconds)}\n\n` +
        messages.map((m) => `[${m.timestamp}] ${m.sender === 'user' ? 'Learner' : activePersona.name}: ${m.text}`).join('\n\n');
      fileName += '.txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearTranscript = () => {
    if (window.confirm('Are you sure you want to clear the transcript for this active session?')) {
      setMessages([
        {
          id: `msg_welcome_${Date.now()}`,
          sender: 'ai',
          text: `Transcript cleared. Ready when you are!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const filteredMessages = messages.filter((m) =>
    searchTerm.trim() === '' ? true : m.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="speaking-studio-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Free Plan Advertisement Placement */}
      <AdBanner onNavigate={onNavigate} />

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
                    activePersona.id === p.id ? 'bg-[#DCEDE9] text-[#0F766E] font-bold' : 'hover:bg-teal-50 text-[#134E4A]'
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
            <button className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] text-[#0F766E] font-extrabold text-xs transition-colors">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-extrabold text-xs">{activeScenario.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#0F766E]" />
            </button>

            {/* Scenario Select Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#E6F1EF] rounded-2xl shadow-xl border border-[#CBDED9] p-2 hidden group-hover:block z-30">
              <p className="text-[11px] font-bold text-teal-800/60 uppercase px-2 py-1">Choose Scenario</p>
              {SPEAKING_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveScenario(s)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    activeScenario.id === s.id ? 'bg-[#DCEDE9] text-[#0F766E] font-bold' : 'hover:bg-teal-100 text-[#134E4A]'
                  }`}
                >
                  <div>
                    <p className="font-bold">{s.title}</p>
                    <p className="text-[10px] text-teal-800/70">{s.category}</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100/80 font-medium text-[#0F766E]">
                    {s.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Session Timer */}
          <div className="flex items-center space-x-1.5 text-xs font-mono font-extrabold text-[#134E4A] bg-[#DCEDE9] px-3 py-2 rounded-2xl border border-[#CBDED9]">
            <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{formatTime(sessionSeconds)}</span>
          </div>
        </div>

        {/* Voice Toolbar Controls & End Session */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Replay Last AI Response */}
          <button
            onClick={handleReplayLastAiMessage}
            className="p-2.5 rounded-2xl bg-[#DCEDE9] text-[#134E4A] hover:bg-teal-100 transition-colors flex items-center space-x-1 text-xs font-bold border border-[#CBDED9]"
            title="Replay Last AI Voice Response"
          >
            <RotateCcw className="w-4 h-4 text-[#0F766E]" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center space-x-1 text-xs font-bold text-[#134E4A] bg-[#DCEDE9] p-1 rounded-2xl border border-[#CBDED9]">
            {[0.75, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => setAudioSpeed(s)}
                className={`px-2 py-1 rounded-xl transition-colors ${
                  audioSpeed === s ? 'bg-[#0F766E] text-white shadow-sm' : 'hover:text-[#0F766E]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-2xl bg-[#DCEDE9] text-[#134E4A] hover:bg-teal-100 transition-colors border border-[#CBDED9]"
            title={soundEnabled ? 'Audio Output Enabled' : 'Audio Output Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0F766E]" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
          </button>

          {/* End Session Button */}
          <button
            onClick={handleEndSession}
            className="px-4 py-2.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:opacity-95 transition-all shadow-md shadow-teal-700/20 active:scale-95"
          >
            Finish & Get AI Report
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Partner Avatar Stage & Live Transcript */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* AI Visual Stage */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white p-6 shadow-xl border border-[#14B8A6]/40 overflow-hidden min-h-[160px] flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={activePersona.avatarUrl}
                  alt={activePersona.name}
                  className={`w-16 h-16 rounded-2xl object-cover ring-4 transition-all duration-300 ${
                    isAiSpeaking ? 'ring-[#14B8A6] scale-105 shadow-lg shadow-teal-400/40' : 'ring-teal-700'
                  }`}
                />
                {isAiSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#14B8A6] rounded-full ring-2 ring-[#042F2C] animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-lg text-white">{activePersona.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-teal-100 border border-white/20 font-bold">
                    ElevenLabs AI Voice
                  </span>
                </div>
                <p className="text-xs text-teal-200 font-bold">{activePersona.role}</p>
                <p className="text-[11px] text-teal-100/70 font-medium">{activePersona.personality}</p>
              </div>
            </div>

            {/* Audio Waveform Indicator */}
            <div className="flex items-center space-x-1.5 h-10">
              {[30, 60, 90, 40, 80, 50, 100, 70, 40, 90, 60, 30].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isAiSpeaking ? 'bg-[#14B8A6] animate-pulse shadow-sm' : 'bg-teal-900/60 h-2'
                  }`}
                  style={{ height: isAiSpeaking ? `${h}%` : '8px' }}
                />
              ))}
            </div>
          </div>

          {/* Transcript Control Toolbar & Search */}
          <div className="p-3 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Live Search */}
            <div className="flex items-center space-x-2 bg-[#DCEDE9] px-3 py-1.5 rounded-xl flex-1 max-w-xs border border-[#CBDED9]">
              <Search className="w-3.5 h-3.5 text-teal-800/60 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transcript history..."
                className="bg-transparent border-none outline-none text-[#134E4A] font-medium text-xs w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyTranscript}
                className="px-2.5 py-1.5 rounded-xl bg-[#DCEDE9] hover:bg-teal-100 text-[#134E4A] font-bold flex items-center space-x-1 border border-[#CBDED9]"
                title="Copy Transcript"
              >
                <Copy className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>{copiedNotification ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={() => handleDownloadTranscript('txt')}
                className="px-2.5 py-1.5 rounded-xl bg-[#DCEDE9] hover:bg-teal-100 text-[#134E4A] font-bold flex items-center space-x-1 border border-[#CBDED9]"
                title="Download TXT Transcript"
              >
                <Download className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Export TXT</span>
              </button>

              <button
                onClick={handleClearTranscript}
                className="p-1.5 rounded-xl hover:bg-rose-100 text-teal-800/60 hover:text-rose-600 transition-colors"
                title="Clear Transcript"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Transcript Message List */}
          <div className="rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] p-6 shadow-sm min-h-[380px] max-h-[480px] overflow-y-auto space-y-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 mb-1 text-[11px] text-teal-800/70 font-bold">
                  <span>{msg.sender === 'user' ? (user?.name || 'You') : activePersona.name}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.fluencyScore && (
                    <span className="px-2 py-0.5 rounded bg-[#DCEDE9] text-[#0F766E] font-extrabold text-[10px] border border-[#CBDED9]">
                      Fluency {msg.fluencyScore}%
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed font-medium ${
                    msg.sender === 'user'
                      ? 'bg-[#0F766E] text-white rounded-tr-none shadow-sm'
                      : 'bg-[#DCEDE9] text-[#134E4A] rounded-tl-none border border-[#CBDED9]'
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {msg.sender === 'ai' && soundEnabled && (
                    <button
                      onClick={() => handlePlayAiSpeech(msg.text)}
                      className="mt-2 text-[11px] font-extrabold text-[#0F766E] flex items-center space-x-1 hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Again</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isSubmitting && (
              <div className="flex items-center space-x-2 text-xs text-[#0F766E] font-bold italic">
                <div className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-ping" />
                <span>{activePersona.name} is thinking & analyzing grammar...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Speech Error Notice */}
          {speechError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{speechError}</span>
              </div>
              <button onClick={() => setSpeechError(null)} className="text-rose-500 hover:text-rose-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Interactive Speech Input & Microphone Control */}
          <div className="relative rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] p-3 shadow-md">
            
            {/* Interim Microphone Transcript Display */}
            {isListening && (
              <div className="px-4 py-2 mb-2 rounded-xl bg-[#DCEDE9] text-[#0F766E] text-xs font-bold animate-pulse flex items-center justify-between border border-[#CBDED9]">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Listening to your speech... Speak naturally in English.</span>
                </span>
                <button onClick={toggleListening} className="text-rose-600 font-extrabold underline text-[11px]">
                  Pause Mic
                </button>
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
                className={`p-3.5 rounded-2xl text-white font-extrabold transition-all shadow-md flex items-center justify-center shrink-0 ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 animate-pulse ring-4 ring-rose-300'
                    : 'bg-ai-gradient hover:opacity-95 shadow-teal-700/25'
                }`}
                title={isListening ? 'Click to Stop Recording' : 'Click to Start Speaking (🎤 Microphone)'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? 'Listening to voice input...' : 'Type your sentence or press 🎤 to speak...'}
                className="flex-1 bg-[#DCEDE9] text-[#134E4A] px-4 py-3.5 rounded-2xl border border-[#CBDED9] text-sm focus:ring-2 focus:ring-[#0F766E] outline-none font-medium"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isSubmitting}
                className="p-3.5 rounded-2xl bg-[#0F766E] text-white hover:bg-[#0D9488] disabled:opacity-40 transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Live Grammar Doctor & Vocab Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Grammar Doctor Card */}
          <div className="rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#DCEDE9] text-[#0F766E]">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <h4 className="font-extrabold text-sm text-[#134E4A]">Grammar Feedback</h4>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                Real-Time AI
              </span>
            </div>

            {latestGrammar ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <p className="text-rose-600 font-extrabold uppercase text-[10px]">Original</p>
                  <p className="text-rose-800 line-through font-medium">{latestGrammar.original}</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9]">
                  <p className="text-[#0F766E] font-extrabold uppercase text-[10px]">Corrected</p>
                  <p className="text-[#134E4A] font-black">{latestGrammar.corrected}</p>
                </div>
                <p className="text-teal-900/80 font-medium leading-relaxed text-[11px] bg-[#F3F7F6] p-3 rounded-xl border border-[#CBDED9]">
                  {latestGrammar.explanation}
                </p>
              </div>
            ) : (
              <p className="text-xs text-teal-800/70 font-medium italic py-4 text-center">
                Speak a sentence! The AI will analyze your grammar and provide instant friendly feedback here.
              </p>
            )}
          </div>

          {/* AI Suggested Vocabulary */}
          <div className="rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#DCEDE9] text-[#0F766E]">
                  <BookMarked className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-[#134E4A]">Pronunciation & Vocab</h4>
              </div>
            </div>

            {latestVocab.length > 0 ? (
              <div className="space-y-3">
                {latestVocab.map((v, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#134E4A] text-sm">{v.word}</span>
                      <button
                        onClick={() => handleSaveVocabItem(v)}
                        className="p-1 rounded-lg text-[#0F766E] hover:bg-teal-200/60 transition-colors"
                        title="Save to Vocab Vault"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-teal-900/80 font-medium">{v.definition}</p>
                    <p className="text-[11px] text-teal-700 italic">"{v.example}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-teal-800/70 font-medium italic py-4 text-center">
                Keywords and advanced terms extracted during conversation will appear here.
              </p>
            )}
          </div>

          {/* Suggested Phrases Guide */}
          <div className="rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] p-5 shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-teal-800/70">
              Suggested Hints ({activeScenario.title})
            </h4>
            <div className="space-y-2">
              {activeScenario.suggestedPhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(phrase)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#DCEDE9] hover:bg-teal-100 text-xs text-[#134E4A] font-semibold hover:text-[#0F766E] transition-colors border border-[#CBDED9]"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Detailed Post-Session Feedback & Evaluation Modal */}
      {showEvaluationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#CBDED9] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-ai-gradient text-white shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#134E4A]">Session Speaking Performance Report</h2>
                  <p className="text-xs text-teal-800/70 font-medium">
                    Scenario: <strong className="text-[#0F766E]">{activeScenario.title}</strong> • Partner: <strong>{activePersona.name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowEvaluationModal(false);
                  onNavigate('dashboard');
                }}
                className="p-2 rounded-xl text-teal-800 hover:bg-teal-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {evalLoading ? (
              <div className="py-16 text-center space-y-4">
                <RefreshCw className="w-10 h-10 text-[#0F766E] animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-[#134E4A]">Analyzing Your Speech & Grammar Performance...</h3>
                <p className="text-xs text-teal-800/70 max-w-md mx-auto">
                  Gemini AI is evaluating your fluency, vocabulary richness, pronunciation clarity, and grammatical precision.
                </p>
              </div>
            ) : evalData ? (
              <div className="space-y-6">
                
                {/* Top Score Scorecard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#042F2C] via-[#0F766E] to-[#115E59] text-white shadow-lg border border-[#14B8A6]/30">
                  <div className="text-center md:border-r border-teal-700/60 p-2">
                    <p className="text-[11px] font-bold text-teal-200 uppercase tracking-wider">Overall Score</p>
                    <p className="text-4xl font-extrabold text-[#F59E0B] mt-1">{evalData.overallScore}/100</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      Grade A
                    </span>
                  </div>

                  <div className="text-center md:border-r border-teal-700/60 p-2">
                    <p className="text-[11px] font-bold text-teal-200 uppercase tracking-wider">Fluency</p>
                    <p className="text-3xl font-bold text-white mt-1">{evalData.scores?.fluency || 88}%</p>
                    <p className="text-[10px] text-teal-200/70 mt-1">Natural flow</p>
                  </div>

                  <div className="text-center md:border-r border-teal-700/60 p-2">
                    <p className="text-[11px] font-bold text-teal-200 uppercase tracking-wider">Grammar</p>
                    <p className="text-3xl font-bold text-white mt-1">{evalData.scores?.grammar || 85}%</p>
                    <p className="text-[10px] text-teal-200/70 mt-1">Structural accuracy</p>
                  </div>

                  <div className="text-center p-2">
                    <p className="text-[11px] font-bold text-teal-200 uppercase tracking-wider">Vocabulary</p>
                    <p className="text-3xl font-bold text-white mt-1">{evalData.scores?.vocabulary || 88}%</p>
                    <p className="text-[10px] text-teal-200/70 mt-1">Word variety</p>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap border-b border-[#CBDED9] gap-2">
                  {[
                    { id: 'metrics', label: '📊 Metrics Breakdown' },
                    { id: 'grammar', label: '📝 Grammar Doctor' },
                    { id: 'vocab', label: '📚 Vocabulary' },
                    { id: 'pronunciation', label: '🗣️ Pronunciation' },
                    { id: 'summary', label: '🚀 Summary Plan' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveEvalTab(tab.id as any)}
                      className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-colors cursor-pointer ${
                        activeEvalTab === tab.id
                          ? 'bg-[#0F766E] text-white shadow-sm'
                          : 'bg-[#DCEDE9] text-[#134E4A] hover:bg-teal-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab 1: Metrics */}
                {activeEvalTab === 'metrics' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {[
                      { name: 'Fluency & Flow', val: evalData.scores?.fluency },
                      { name: 'Grammar Accuracy', val: evalData.scores?.grammar },
                      { name: 'Vocabulary Diversity', val: evalData.scores?.vocabulary },
                      { name: 'Pronunciation Clarity', val: evalData.scores?.pronunciation },
                      { name: 'Confidence Score', val: evalData.scores?.confidence },
                      { name: 'Sentence Variety', val: evalData.scores?.sentenceVariety },
                      { name: 'Naturalness', val: evalData.scores?.naturalness },
                      { name: 'Speaking Speed', val: evalData.scores?.speakingSpeed },
                    ].map((m, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-[#134E4A]">{m.name}</span>
                          <span className="text-[#0F766E]">{m.val || 88}%</span>
                        </div>
                        <div className="w-full bg-[#CBDED9] h-2 rounded-full overflow-hidden">
                          <div className="bg-ai-gradient h-full rounded-full" style={{ width: `${m.val || 88}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 2: Grammar Doctor */}
                {activeEvalTab === 'grammar' && (
                  <div className="space-y-3 text-xs">
                    {evalData.grammarAnalysis && evalData.grammarAnalysis.length > 0 ? (
                      evalData.grammarAnalysis.map((g: any, i: number) => (
                        <div key={i} className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#0F766E] uppercase text-[10px] px-2 py-0.5 rounded bg-[#DCEDE9] border border-[#CBDED9]">
                              {g.type}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-rose-600 line-through">❌ {g.original}</p>
                            <p className="text-[#0F766E] font-bold">✅ {g.corrected}</p>
                          </div>
                          <p className="text-[#134E4A] text-[11px] italic bg-[#F3F7F6] p-2.5 rounded-xl border border-[#CBDED9]">
                            💡 {g.explanation}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-teal-800/70 italic text-center py-6 font-medium">No major grammar errors detected. Great job speaking!</p>
                    )}
                  </div>
                )}

                {/* Tab 3: Vocabulary */}
                {activeEvalTab === 'vocab' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-2">
                      <h4 className="font-bold text-[#134E4A]">Suggested Vocabulary Enhancements</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {evalData.vocabularyFeedback?.advancedSuggestions?.map((item: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[#F3F7F6] rounded-xl border border-[#CBDED9] space-y-1">
                            <p className="text-teal-800/60 text-[10px]">Instead of <strong className="text-[#134E4A]">"{item.original}"</strong>, try:</p>
                            <p className="font-bold text-[#0F766E] text-sm">{item.suggested}</p>
                            <p className="text-[11px] text-teal-800/70">{item.definition}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Pronunciation */}
                {activeEvalTab === 'pronunciation' && (
                  <div className="space-y-3 text-xs">
                    {evalData.pronunciationTips?.map((tip: string, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-start space-x-3 text-[#134E4A]">
                        <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                        <p className="leading-relaxed font-medium">{tip}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 5: Summary */}
                {activeEvalTab === 'summary' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-2">
                      <h4 className="font-bold text-[#134E4A] text-sm">Personalized Next Steps</h4>
                      <p className="text-[#134E4A] leading-relaxed font-medium">{evalData.sessionSummary?.improvementPlan}</p>
                      <div className="pt-2">
                        <p className="text-[11px] text-teal-800/70 font-medium">Recommended Next Practice Topic:</p>
                        <p className="font-bold text-[#0F766E] text-sm">{evalData.sessionSummary?.suggestedNextTopic}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Modal Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#CBDED9]">
                  <button
                    onClick={() => handleDownloadTranscript('txt')}
                    className="px-4 py-2.5 rounded-xl bg-[#DCEDE9] text-[#134E4A] font-bold text-xs hover:bg-teal-100 flex items-center space-x-2 cursor-pointer border border-[#CBDED9]"
                  >
                    <Download className="w-4 h-4 text-[#0F766E]" />
                    <span>Download Report</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowEvaluationModal(false);
                      onNavigate('dashboard');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-ai-gradient hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>

              </div>
            ) : null}

          </div>
        </div>
      )}

    </div>
  );
};
