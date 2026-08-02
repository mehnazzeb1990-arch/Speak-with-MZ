import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CurriculumTopic, SpeakingScenario, ConversationMessage, GrammarCorrection } from '../../types';
import { buildTopicEngineContext, SpeakingActivityType, topicConversationEngine } from '../../services/topicEngine';
import { audioService } from '../../services/audio';
import { elevenLabsService } from '../../services/elevenlabs';
import { DEFAULT_AI_VOICE } from '../../config/voice';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Square, 
  Volume2, 
  Sparkles, 
  BookMarked, 
  CheckCircle2, 
  Award, 
  Clock, 
  Activity, 
  Send, 
  X,
  Flame,
  Lightbulb,
  ArrowRight,
  Layers,
  Zap,
  Check
} from 'lucide-react';

interface TopicSpeakingEngineProps {
  topic: CurriculumTopic | SpeakingScenario;
  onClose?: () => void;
  onNavigate?: (view: string) => void;
  embedded?: boolean;
}

export const TopicSpeakingEngine: React.FC<TopicSpeakingEngineProps> = ({
  topic,
  onClose,
  onNavigate,
  embedded = false,
}) => {
  const { user, activePersona, addVocabWord, saveTopicSession } = useAuth();
  
  const [activityType, setActivityType] = useState<SpeakingActivityType>('Free Conversation');
  const [topicContext, setTopicContext] = useState(() => 
    buildTopicEngineContext(topic, user?.level || 'Intermediate')
  );

  // Re-build topic context if topic or level changes
  useEffect(() => {
    setTopicContext(buildTopicEngineContext(topic, user?.level || 'Intermediate'));
  }, [topic, user?.level]);

  // Initial messages
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  
  // Timer & Session state
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Grammar & Vocab live feedback
  const [latestGrammar, setLatestGrammar] = useState<GrammarCorrection | null>(null);
  const [savedWordsMap, setSavedWordsMap] = useState<{ [key: string]: boolean }>({});

  // Evaluation modal
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalReport, setEvalReport] = useState<any | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial opening AI greeting based on topic & activity
  useEffect(() => {
    const greetingText = topicConversationEngine.generateInitialGreeting(
      topicContext.title,
      topicContext.category,
      topicContext.level,
      user?.name || 'Learner',
      activityType
    );

    const initialMsg: ConversationMessage = {
      id: `msg_init_${Date.now()}`,
      sender: 'ai',
      text: greetingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fluencyScore: 92,
    };

    setMessages([initialMsg]);
  }, [topicContext.id, activityType]);

  // Timer effect
  useEffect(() => {
    let timer: any = null;
    if (isSessionActive && !isPaused && !showEvalModal) {
      timer = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive, isPaused, showEvalModal]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, inputText]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Play AI response voice synthesis
  const handlePlayAiSpeech = async (text: string) => {
    setIsAiSpeaking(true);
    await audioService.speak(text, {
      gender: activePersona.voiceGender,
      rate: 1.0,
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

  // Send message to Gemini backend with topicContext
  const handleSendMessage = async (textToSend?: string) => {
    const finalMsg = textToSend || inputText;
    if (!finalMsg.trim() || isSubmitting) return;

    if (isListening) {
      audioService.stopListening();
      setIsListening(false);
    }

    const userMsg: ConversationMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: finalMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
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
          activityType,
        }),
      });

      const data = await response.json();

      const aiMsg: ConversationMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || "That's a great point! Tell me more about your thoughts on this.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grammarCorrection: data.grammarCorrection,
        fluencyScore: data.fluencyScore || 88,
        suggestedVocab: data.suggestedVocabulary || [],
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.grammarCorrection) {
        setLatestGrammar(data.grammarCorrection);
      }

      // Auto-play speech
      handlePlayAiSpeech(aiMsg.text);
    } catch (err) {
      console.error('Failed to get AI topic reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplayLastAiMessage = () => {
    const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');
    if (lastAiMsg) {
      handlePlayAiSpeech(lastAiMsg.text);
    }
  };

  const handleSaveVocab = (item: { word: string; definition: string; example: string }) => {
    addVocabWord({
      id: `v_${Date.now()}_${item.word}`,
      word: item.word,
      phonetic: '/topic-vault/',
      definition: item.definition,
      example: item.example,
      level: topicContext.level,
      category: topicContext.category,
      masteryLevel: 1,
      isSaved: true,
      dateAdded: new Date().toISOString().split('T')[0],
    });

    setSavedWordsMap((prev) => ({ ...prev, [item.word]: true }));
  };

  // Finish session & trigger performance report
  const handleEndConversation = async () => {
    if (isListening) audioService.stopListening();
    audioService.stopSpeaking();
    setIsSessionActive(false);

    setShowEvalModal(true);
    setEvalLoading(true);

    try {
      const response = await fetch('/api/gemini/evaluate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          persona: activePersona.name,
          scenario: topicContext.title,
          durationSeconds: sessionSeconds,
          level: topicContext.level,
        }),
      });

      const evalData = await response.json();
      setEvalReport(evalData);

      // Save session to AuthContext & Firebase
      await saveTopicSession({
        topicTitle: topicContext.title,
        topicId: topicContext.id,
        activityType,
        durationSeconds: sessionSeconds,
        messagesCount: messages.filter((m) => m.sender === 'user').length,
        fluencyScore: evalData.scores?.fluency || 88,
        grammarScore: evalData.scores?.grammar || 85,
        vocabScore: evalData.scores?.vocabulary || 87,
        pronunciationScore: evalData.scores?.pronunciation || 90,
        confidenceScore: evalData.scores?.confidence || 89,
        newVocabLearned: evalData.sessionSummary?.newVocabularyLearned || [],
      });
    } catch (e) {
      console.error('Session evaluation error:', e);
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <div className={`rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ${embedded ? 'w-full' : 'max-w-4xl mx-auto'}`}>
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600/30 border border-teal-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 uppercase tracking-wider">
                {topicContext.level} Topic
              </span>
              <span className="text-xs text-slate-300 font-medium">
                • Coach {activePersona.name}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-tight text-white">{topicContext.title}</h2>
          </div>
        </div>

        {/* Timer & Session Status Controls */}
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono font-bold flex items-center space-x-1.5 text-teal-300">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{formatTime(sessionSeconds)}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            title={isPaused ? 'Resume Session' : 'Pause Session'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={handleReplayLastAiMessage}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            title="Replay Last AI Response"
          >
            <RotateCcw className="w-4 h-4 text-sky-400" />
          </button>

          <button
            onClick={handleEndConversation}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1 transition-all shadow-md cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>End Session</span>
          </button>

          {onClose && (
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Activity Selector Strip */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
          Speaking Mode:
        </span>

        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {topicContext.supportedActivities.map((act) => (
            <button
              key={act}
              onClick={() => setActivityType(act)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                activityType === act
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left/Main Column: Live Transcript & Interaction */}
        <div className="lg:col-span-8 p-4 sm:p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col h-[480px]">
          
          {/* Transcript Feed */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    MZ
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-teal-700 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700'
                    }`}
                  >
                    <p className="font-medium">{msg.text}</p>
                    <span className="text-[9px] opacity-70 block text-right mt-1">{msg.timestamp}</span>
                  </div>

                  {/* Suggested Vocabulary Items from AI */}
                  {msg.suggestedVocab && msg.suggestedVocab.length > 0 && (
                    <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-1.5 text-xs">
                      <span className="font-extrabold text-[10px] text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                        💡 Key Topic Vocabulary Introduced:
                      </span>
                      <div className="space-y-1">
                        {msg.suggestedVocab.map((v, i) => (
                          <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-teal-100 dark:border-slate-800">
                            <div>
                              <span className="font-bold text-teal-700 dark:text-teal-300">{v.word}</span>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400">{v.definition}</p>
                            </div>
                            <button
                              onClick={() => handleSaveVocab(v)}
                              disabled={savedWordsMap[v.word]}
                              className="px-2 py-1 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-[10px] font-bold flex items-center space-x-1"
                            >
                              {savedWordsMap[v.word] ? <Check className="w-3 h-3 text-emerald-600" /> : <BookMarked className="w-3 h-3" />}
                              <span>{savedWordsMap[v.word] ? 'Saved' : 'Save'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            ))}

            {isSubmitting && (
              <div className="flex items-center space-x-2 text-xs text-teal-600 font-bold p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 w-max">
                <Sparkles className="w-4 h-4 animate-spin text-teal-500" />
                <span>Coach {activePersona.name} is formulating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* AI Voice Indicator */}
          {isAiSpeaking && (
            <div className="p-2.5 rounded-2xl bg-teal-600/10 border border-teal-500/30 flex items-center justify-between text-xs text-teal-800 dark:text-teal-300 font-bold">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-teal-600 animate-bounce" />
                <span>Coach {activePersona.name} is speaking out loud...</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-4 bg-teal-500 rounded-full animate-pulse" />
                <span className="w-1.5 h-6 bg-teal-600 rounded-full animate-pulse delay-75" />
                <span className="w-1.5 h-3 bg-teal-400 rounded-full animate-pulse delay-150" />
              </div>
            </div>
          )}

          {speechError && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
              ⚠️ Speech Recognition Notice: {speechError}
            </div>
          )}

          {/* Input Controls Bar */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <button
              onClick={toggleListening}
              className={`p-3.5 rounded-2xl text-white font-bold transition-all shadow-md shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 animate-pulse ring-4 ring-rose-200 dark:ring-rose-950'
                  : 'bg-teal-700 hover:bg-teal-600'
              }`}
              title={isListening ? 'Stop Recording Voice' : 'Start Speaking Voice'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? 'Listening to your voice...' : `Type or speak your answer for "${topicContext.title}"...`}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isSubmitting}
              className="px-4 py-3 rounded-2xl bg-teal-700 hover:bg-teal-600 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Live Topic Doctor & Target Vocabulary */}
        <div className="lg:col-span-4 p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-900/50 space-y-4 overflow-y-auto max-h-[480px]">
          
          {/* Target Vocabulary Suggestions */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
              <BookMarked className="w-4 h-4 text-teal-600" />
              <span>Target Topic Vocabulary</span>
            </h3>

            <div className="space-y-2">
              {topicContext.suggestedVocabulary.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-700 dark:text-teal-300">{item.word}</span>
                    <button
                      onClick={() => handleSaveVocab(item)}
                      disabled={savedWordsMap[item.word]}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100"
                    >
                      {savedWordsMap[item.word] ? '✓ Saved' : '+ Save'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar Focus Info */}
          <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 space-y-1.5 text-xs">
            <span className="font-extrabold text-teal-900 dark:text-teal-200 block">
              🎯 Grammar Focus:
            </span>
            <p className="text-teal-800 dark:text-teal-300 text-[11px] font-medium leading-relaxed">
              {topicContext.commonGrammarFocus}
            </p>
          </div>

          {/* Real-time Grammar Doctor Card */}
          {latestGrammar && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs">
              <span className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Live Grammar Correction</span>
              </span>
              <div className="space-y-1 text-[11px]">
                <p className="text-rose-700 dark:text-rose-300 line-through">❌ "{latestGrammar.original}"</p>
                <p className="text-emerald-700 dark:text-emerald-300 font-bold">✅ "{latestGrammar.corrected}"</p>
                <p className="text-slate-600 dark:text-slate-400 italic mt-1">{latestGrammar.explanation}</p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Post-Session Comprehensive Evaluation Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
            
            {evalLoading ? (
              <div className="text-center py-12 space-y-4">
                <Sparkles className="w-10 h-10 text-teal-600 animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Generating Topic Performance Analysis...</h3>
                <p className="text-xs text-slate-500">Evaluating fluency, vocabulary choice, grammar corrections, and pronunciation clarity.</p>
              </div>
            ) : evalReport ? (
              <div className="space-y-6">
                
                {/* Modal Title */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-teal-600 uppercase tracking-widest block">Topic Evaluation Report</span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{topicContext.title}</h2>
                  </div>
                  <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black text-xl">
                    {evalReport.overallScore || 88}/100
                  </div>
                </div>

                {/* Performance Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {[
                    { label: 'Fluency', score: evalReport.scores?.fluency || 88 },
                    { label: 'Grammar', score: evalReport.scores?.grammar || 85 },
                    { label: 'Vocabulary', score: evalReport.scores?.vocabulary || 87 },
                    { label: 'Pronunciation', score: evalReport.scores?.pronunciation || 90 },
                    { label: 'Confidence', score: evalReport.scores?.confidence || 89 },
                  ].map((s, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{s.label}</span>
                      <span className="text-lg font-black text-teal-600 dark:text-teal-300">{s.score}%</span>
                    </div>
                  ))}
                </div>

                {/* Session Summary & Tips */}
                {evalReport.sessionSummary && (
                  <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs space-y-2">
                    <span className="font-extrabold text-teal-900 dark:text-teal-200 block">Personalized Improvement Tips:</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {evalReport.sessionSummary.improvementPlan || "Great job practicing this topic! Focus on incorporating more descriptive adjectives in future speaking turns."}
                    </p>
                    {evalReport.sessionSummary.suggestedNextTopic && (
                      <div className="pt-2 border-t border-teal-200 dark:border-teal-800/60 flex items-center justify-between">
                        <span className="font-bold text-teal-800 dark:text-teal-300">Recommended Next Topic:</span>
                        <span className="font-extrabold text-teal-600">{evalReport.sessionSummary.suggestedNextTopic}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Close Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setShowEvalModal(false);
                      if (onClose) onClose();
                    }}
                    className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Done & Save to Profile
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
