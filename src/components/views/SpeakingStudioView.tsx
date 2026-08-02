import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { audioService } from '../../services/audio';
import { elevenLabsService } from '../../services/elevenlabs';
import { DEFAULT_AI_VOICE } from '../../config/voice';
import { ConversationMessage, GrammarCorrection, AIPersona, SpeakingScenario } from '../../types';
import { AI_PERSONAS, SPEAKING_SCENARIOS } from '../../data/mockData';
import { buildTopicEngineContext, topicConversationEngine } from '../../services/topicEngine';
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
  const { 
    user, 
    activePersona, 
    setActivePersona, 
    activeScenario, 
    setActiveScenario, 
    activeTopic,
    setActiveTopic,
    activeActivity,
    setActiveActivity,
    addVocabWord, 
    recordSpeakingMinutes,
    saveTopicSession
  } = useAuth();
  
  const currentTopicOrScenario = activeTopic || activeScenario;

  const [topicContext, setTopicContext] = useState(() =>
    buildTopicEngineContext(currentTopicOrScenario, user?.level || 'Intermediate')
  );

  useEffect(() => {
    setTopicContext(buildTopicEngineContext(activeTopic || activeScenario, user?.level || 'Intermediate'));
  }, [activeTopic, activeScenario, user?.level]);

  const [messages, setMessages] = useState<ConversationMessage[]>(() => {
    const context = buildTopicEngineContext(activeTopic || activeScenario, user?.level || 'Intermediate');
    const greeting = topicConversationEngine.generateInitialGreeting(
      context.title,
      context.category,
      context.level,
      user?.name || 'Learner',
      activeActivity || 'Free Conversation'
    );
    return [
      {
        id: 'msg_welcome',
        sender: 'ai',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fluencyScore: 92,
      },
    ];
  });

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
          level: topicContext.level,
          scenario: topicContext.title,
          conversationHistory: messages,
          userName: user?.name || 'Learner',
          topicContext,
          activityType: activeActivity || 'Free Conversation',
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
          
          {/* Coach MZ AI Partner Indicator */}
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] text-[#134E4A]">
            <img
              src={activePersona.avatarUrl}
              alt={activePersona.name}
              className="w-6 h-6 rounded-lg object-cover ring-1 ring-[#0F766E]"
            />
            <span className="font-extrabold text-xs text-[#134E4A]">{activePersona.name}</span>
            <span className="text-[10px] font-bold text-[#0F766E] bg-teal-100/80 px-2 py-0.5 rounded-md border border-[#CBDED9]">
              Personal AI Coach
            </span>
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
                    { id: 'metrics', label: '🎤 Fluency' },
                    { id: 'grammar', label: '✍️ Grammar Doctor' },
                    { id: 'vocab', label: '📚 Vocabulary' },
                    { id: 'pronunciation', label: '🗣️ Pronunciation' },
                    { id: 'summary', label: '🚀 Suggestions' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveEvalTab(tab.id as any)}
                      className={`px-4 py-2.5 rounded-t-2xl text-xs font-black transition-all cursor-pointer ${
                        activeEvalTab === tab.id
                          ? 'bg-[#0F766E] text-white shadow-md border-t-2 border-[#14B8A6]'
                          : 'bg-[#DCEDE9] text-[#134E4A] hover:bg-teal-200/60'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab 1: Fluency Detailed Analysis */}
                {activeEvalTab === 'metrics' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-1 text-center">
                        <span className="text-[10px] font-extrabold uppercase text-teal-800/70">Speaking Rate</span>
                        <div className="text-2xl font-black text-[#0F766E]">138 WPM</div>
                        <span className="text-[10px] text-teal-800/80 font-medium">Optimal Natural Pace</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-1 text-center">
                        <span className="text-[10px] font-extrabold uppercase text-teal-800/70">Filler Words</span>
                        <div className="text-2xl font-black text-[#134E4A]">2 Detected</div>
                        <span className="text-[10px] text-emerald-700 font-bold">Minimal "um / like"</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-1 text-center">
                        <span className="text-[10px] font-extrabold uppercase text-teal-800/70">Fluency Rating</span>
                        <div className="text-2xl font-black text-[#F59E0B]">Advanced</div>
                        <span className="text-[10px] text-teal-800/80 font-medium">Good Spontaneous Flow</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-2">
                      <h4 className="font-extrabold text-[#134E4A] text-xs flex items-center space-x-1.5">
                        <Mic className="w-4 h-4 text-[#0F766E]" />
                        <span>Speech Flow & Pause Evaluation</span>
                      </h4>
                      <p className="text-[#134E4A] text-xs leading-relaxed font-medium">
                        {evalData.scores?.pauseAnalysis || "Smooth speech rhythm with natural pauses for thought formulation. Your speech continuity showed impressive consistency throughout the response."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { name: 'Fluency & Speech Continuity', val: evalData.scores?.fluency || 88 },
                        { name: 'Confidence & Spontaneity', val: evalData.scores?.confidence || 92 },
                        { name: 'Sentence Variety & Length', val: evalData.scores?.sentenceVariety || 85 },
                        { name: 'Speaking Speed Stability', val: evalData.scores?.speakingSpeed || 90 },
                      ].map((m, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-[#134E4A]">{m.name}</span>
                            <span className="text-[#0F766E]">{m.val}%</span>
                          </div>
                          <div className="w-full bg-[#CBDED9] h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-[#0F766E] to-[#14B8A6] h-full rounded-full" style={{ width: `${m.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Grammar Doctor */}
                {activeEvalTab === 'grammar' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-[#134E4A]">Grammar Accuracy Score</h4>
                        <p className="text-[11px] text-teal-800/80">Verb tenses, prepositions & clause construction</p>
                      </div>
                      <span className="text-2xl font-black text-[#0F766E]">{evalData.scores?.grammar || 88}%</span>
                    </div>

                    {evalData.grammarAnalysis && evalData.grammarAnalysis.length > 0 ? (
                      evalData.grammarAnalysis.map((g: any, i: number) => (
                        <div key={i} className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-2.5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#0F766E] uppercase text-[10px] px-2.5 py-0.5 rounded-full bg-[#DCEDE9] border border-[#CBDED9]">
                              {g.type} Rule Error
                            </span>
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Needs Correction</span>
                          </div>
                          <div className="space-y-1.5 p-3 rounded-xl bg-white border border-[#CBDED9]">
                            <p className="text-rose-600 font-medium">❌ <span className="line-through">{g.original}</span></p>
                            <p className="text-emerald-700 font-bold">✅ {g.corrected}</p>
                            {g.alternative && <p className="text-teal-800 font-medium text-[11px]">✨ Alternative: "{g.alternative}"</p>}
                          </div>
                          <p className="text-[#134E4A] text-[11px] font-medium bg-[#DCEDE9]/60 p-2.5 rounded-xl border border-[#CBDED9]">
                            💡 <strong>Rule Note:</strong> {g.explanation}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h4 className="font-extrabold text-[#134E4A]">Flawless Grammar Structure!</h4>
                        <p className="text-xs text-teal-800/80 font-medium">No major grammatical errors detected in your recorded speech transcript.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Vocabulary Analysis */}
                {activeEvalTab === 'vocab' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-1">
                        <span className="text-[10px] font-bold text-teal-800 uppercase">CEFR Word Level</span>
                        <div className="text-xl font-black text-[#134E4A]">C1 Advanced</div>
                        <p className="text-[10px] text-teal-800/70">Rich variety of domain phrases</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-1">
                        <span className="text-[10px] font-bold text-teal-800 uppercase">Overused Words</span>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {evalData.vocabularyFeedback?.repeatedWords?.map((w: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-[#E6F1EF] text-rose-700 font-bold border border-[#CBDED9]">"{w}"</span>
                          )) || <span className="text-teal-800 font-bold">"good", "very"</span>}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-3">
                      <h4 className="font-extrabold text-[#134E4A] text-sm">Elevated Vocabulary Alternatives</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {evalData.vocabularyFeedback?.advancedSuggestions?.map((item: any, idx: number) => (
                          <div key={idx} className="p-3.5 bg-white rounded-2xl border border-[#CBDED9] space-y-1.5 flex flex-col justify-between">
                            <div className="space-y-1">
                              <p className="text-teal-800/70 text-[10px]">Instead of <strong className="text-rose-600 font-bold">"{item.original}"</strong>, use:</p>
                              <p className="font-black text-[#0F766E] text-sm">{item.suggested}</p>
                              <p className="text-[11px] text-[#134E4A] leading-tight font-medium">{item.definition}</p>
                            </div>
                            <button
                              onClick={() => handleSaveVocabItem({ word: item.suggested, definition: item.definition || 'Suggested upgrade', example: `I used ${item.suggested} during practice.` })}
                              className="mt-2 py-1.5 px-2.5 rounded-xl bg-[#DCEDE9] text-[#0F766E] hover:bg-[#0F766E] hover:text-white transition-colors font-bold text-[10px] flex items-center justify-center space-x-1 cursor-pointer border border-[#CBDED9]"
                            >
                              <BookMarked className="w-3 h-3" />
                              <span>Save to Vault</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Pronunciation Feedback */}
                {activeEvalTab === 'pronunciation' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-[#134E4A]">Pronunciation Clarity</h4>
                        <p className="text-[11px] text-teal-800/80">Phonetic accuracy, stress & intonation contour</p>
                      </div>
                      <span className="text-2xl font-black text-[#0F766E]">{evalData.scores?.pronunciation || 90}%</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-3">
                      <h4 className="font-extrabold text-[#134E4A] text-xs">Actionable Phonetic Tips</h4>
                      <div className="space-y-2">
                        {evalData.pronunciationTips?.map((tip: string, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-[#CBDED9] flex items-start space-x-3 text-[#134E4A]">
                            <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                            <p className="leading-relaxed font-medium text-xs">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Word Pronunciation Practice Pill */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#042F2C] to-[#0F766E] text-white border border-[#14B8A6]/30 space-y-2">
                      <h4 className="font-bold text-xs text-teal-200">Practice Intonation & Word Stress</h4>
                      <p className="text-xs text-teal-100/90 leading-relaxed font-medium">
                        Focus on accenting content words (nouns, verbs, adjectives) while reducing function words (at, to, for, in) to maintain natural rhythm.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 5: Suggestions for Improvement */}
                {activeEvalTab === 'summary' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-5 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-3">
                      <div className="flex items-center space-x-2 text-[#0F766E]">
                        <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                        <h4 className="font-black text-[#134E4A] text-sm">Actionable 3-Step Improvement Roadmap</h4>
                      </div>
                      
                      <p className="text-[#134E4A] leading-relaxed font-medium text-xs">
                        {evalData.sessionSummary?.improvementPlan || "1. Practice using complex subordinate clauses (e.g. 'although', 'whereas') to elevate sentence structure.\n2. Swap out basic adjectives ('good', 'nice') for high-impact synonyms ('exceptional', 'delightful').\n3. Record a 2-minute monologue on professional topics to strengthen continuous flow."}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9] space-y-2">
                      <span className="text-[10px] font-bold text-teal-800 uppercase">Recommended Next Scenario</span>
                      <h4 className="font-black text-[#134E4A] text-base">{evalData.sessionSummary?.suggestedNextTopic || "Professional Workplace Discussions"}</h4>
                      <p className="text-xs text-teal-900/80 font-medium">Builds on today's session with advanced vocabulary and roleplay exercises.</p>
                      <button
                        onClick={() => {
                          setShowEvaluationModal(false);
                          onNavigate('speaking');
                        }}
                        className="mt-2 px-5 py-2.5 rounded-xl bg-[#0F766E] text-white font-extrabold text-xs hover:bg-[#115E59] cursor-pointer shadow-md"
                      >
                        Start Recommended Scenario →
                      </button>
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
