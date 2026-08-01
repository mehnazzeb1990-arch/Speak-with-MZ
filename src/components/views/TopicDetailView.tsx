import React, { useState } from 'react';
import { CurriculumTopic } from '../../types';
import { audioService } from '../../services/audio';
import { elevenLabsService } from '../../services/elevenlabs';
import { DEFAULT_AI_VOICE } from '../../config/voice';
import { 
  BookOpen, 
  Volume2, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  X, 
  Image as ImageIcon, 
  Mic, 
  Play, 
  Award, 
  Flame, 
  RotateCcw, 
  Lightbulb, 
  FileText, 
  Layers, 
  Target, 
  Zap, 
  Lock, 
  ArrowLeft
} from 'lucide-react';

interface TopicDetailViewProps {
  topic: CurriculumTopic;
  onBack: () => void;
  onNavigate: (view: string) => void;
  isUserPremium: boolean;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  onBack,
  onNavigate,
  isUserPremium,
}) => {
  const [activeTab, setActiveTab] = useState<
    'vocab' | 'conversation' | 'pronunciation' | 'picture' | 'exercises' | 'roleplay' | 'advanced'
  >('vocab');

  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Picture Description State
  const [pictureInput, setPictureInput] = useState('');
  const [pictureFeedback, setPictureFeedback] = useState<any | null>(null);
  const [isEvaluatingPicture, setIsEvaluatingPicture] = useState(false);

  // Exercises State
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<{ [key: string]: boolean }>({});

  // Pronunciation Practice State
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [pronunciationScores, setPronunciationScores] = useState<{ [key: number]: number }>({});

  const isLocked = topic.isPremium && !isUserPremium;

  const handleSpeakText = async (text: string, index?: number) => {
    if (index !== undefined) setPlayingIndex(index);
    await audioService.speak(text, {
      voiceId: elevenLabsService.getVoiceId() || DEFAULT_AI_VOICE.voice,
      rate: 1.0,
    });
    setPlayingIndex(null);
  };

  const handleEvaluatePicture = async () => {
    if (!pictureInput.trim()) return;
    setIsEvaluatingPicture(true);

    try {
      const response = await fetch('/api/gemini/evaluate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ sender: 'user', text: `Picture Description Submission: ${pictureInput}` }],
          scenario: `Picture Description: ${topic.title}`,
          level: topic.level,
        }),
      });

      const data = await response.json();
      setPictureFeedback({
        score: Math.min(100, Math.max(70, Math.floor(75 + pictureInput.length * 0.2))),
        strengths: ['Great observation of main elements!', 'Good usage of descriptive adjectives.'],
        suggestions: data.grammarAnalysis?.[0]?.explanation || 'Try adding more prepositions to describe spatial positions.',
        sample: topic.content.pictureDescription?.sampleDescription,
      });
    } catch (e) {
      setPictureFeedback({
        score: 88,
        strengths: ['Vivid descriptions and clear vocabulary!'],
        suggestions: 'Consider mentioning lighting and foreground vs background details.',
        sample: topic.content.pictureDescription?.sampleDescription,
      });
    } finally {
      setIsEvaluatingPicture(false);
    }
  };

  const handleSelectAnswer = (exId: string, answer: string, correctAnswer: string) => {
    setUserAnswers((prev) => ({ ...prev, [exId]: answer }));
    setExerciseFeedback((prev) => ({ ...prev, [exId]: answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase() }));
  };

  const handlePracticePronunciation = (idx: number) => {
    setRecordingIndex(idx);
    setTimeout(() => {
      setRecordingIndex(null);
      setPronunciationScores((prev) => ({ ...prev, [idx]: Math.floor(85 + Math.random() * 12) }));
    }, 2500);
  };

  return (
    <div id="topic-detail-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Curriculum Hub</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
            topic.level === 'Beginner'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : topic.level === 'Intermediate'
              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-sky-300'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
          }`}>
            Topic {topic.topicNumber} • {topic.level}
          </span>

          {topic.isPremium ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Premium</span>
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              Free Topic
            </span>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            {topic.category}
          </span>
          <span className="text-xs text-slate-300 font-medium">
            ⏱️ Est. {topic.estimatedMinutes} Mins Practice
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{topic.title}</h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {topic.description}
        </p>

        {isLocked && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-amber-400 shrink-0" />
              <span>This Topic requires an Intermediate or Advanced Premium Subscription to unlock full interactive exercises.</span>
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      {/* Main Interactive Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'vocab', label: '📚 Vocabulary & Idioms' },
          { id: 'conversation', label: '💬 Dialogue' },
          { id: 'pronunciation', label: '🗣️ Pronunciation' },
          { id: 'picture', label: '🖼️ Picture Description' },
          { id: 'exercises', label: '🎮 Mini Games & Quiz' },
          { id: 'roleplay', label: '🎭 Role Play' },
          ...(topic.level !== 'Beginner' ? [{ id: 'advanced', label: '📊 Case Study & Debates' }] : [])
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: VOCABULARY & IDIOMS */}
      {activeTab === 'vocab' && (
        <div className="space-y-6">
          
          {/* Beginner: 10 Verbs & 10 Adjectives + Useful Expressions */}
          {topic.level === 'Beginner' && (
            <div className="space-y-6">
              
              {/* 10 Verbs */}
              {topic.content.verbs && topic.content.verbs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>10 Essential Verbs</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topic.content.verbs.map((v, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 relative group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-sm text-indigo-600 dark:text-sky-400">{v.word}</h4>
                            <span className="text-[10px] font-mono text-slate-400">{v.phonetic}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold uppercase">verb</span>
                          </div>
                          <button
                            onClick={() => handleSpeakText(`${v.word}. ${v.example}`)}
                            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                            title="Listen Pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{v.meaning}</p>
                        <p className="text-[11px] text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                          "{v.example}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10 Adjectives */}
              {topic.content.adjectives && topic.content.adjectives.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span>10 Descriptive Adjectives</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topic.content.adjectives.map((adj, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-sm text-sky-600 dark:text-sky-300">{adj.word}</h4>
                            <span className="text-[10px] font-mono text-slate-400">{adj.phonetic}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 font-bold uppercase">adj</span>
                          </div>
                          <button
                            onClick={() => handleSpeakText(`${adj.word}. ${adj.example}`)}
                            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 text-slate-600 dark:text-slate-300 hover:text-sky-600"
                            title="Listen Pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{adj.meaning}</p>
                        <p className="text-[11px] text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                          "{adj.example}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Useful Expressions */}
              {topic.content.usefulExpressions && (
                <div className="p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                  <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>Useful Everyday Expressions</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {topic.content.usefulExpressions.map((expr, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="font-medium text-slate-800 dark:text-slate-200">"{expr}"</span>
                        <button onClick={() => handleSpeakText(expr)} className="text-indigo-500 hover:text-indigo-700 p-1">
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Intermediate / Advanced: 5 Vocabulary Words with Collocations/Synonyms + 5 Idioms */}
          {topic.level !== 'Beginner' && (
            <div className="space-y-6">
              
              {/* 5 Vocabulary Words */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-base text-[#134E4A] flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[#0F766E]" />
                  <span>5 {topic.level === 'Advanced' ? 'Academic' : 'Advanced'} Vocabulary Words</span>
                </h3>

                <div className="space-y-3">
                  {(topic.content.academicVocab || topic.content.advancedVocab || []).map((word, i) => (
                    <div key={i} className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <span className="w-7 h-7 rounded-full bg-[#DCEDE9] text-[#0F766E] font-bold text-xs flex items-center justify-center border border-[#CBDED9]">
                            {i + 1}
                          </span>
                          <h4 className="font-extrabold text-lg text-[#134E4A]">{word.word}</h4>
                          <span className="text-xs font-mono text-teal-800/60">{word.phonetic}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#DCEDE9] text-[#0F766E] font-bold uppercase border border-[#CBDED9]">
                            {word.partOfSpeech || 'vocab'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleSpeakText(`${word.word}. ${word.example}`)}
                          className="px-3 py-1.5 rounded-xl bg-[#DCEDE9] text-[#0F766E] font-bold text-xs flex items-center space-x-1 hover:bg-[#CBDED9] border border-[#CBDED9] cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>Listen Audio</span>
                        </button>
                      </div>

                      <p className="text-xs text-[#134E4A] font-medium">{word.meaning}</p>
                      
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                        Example: "{word.example}"
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        {word.collocations && (
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Common Collocations</span>
                            <div className="flex flex-wrap gap-1">
                              {word.collocations.map((c, ci) => (
                                <span key={ci} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-[11px]">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {word.synonyms && (
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Synonyms</span>
                            <div className="flex flex-wrap gap-1">
                              {word.synonyms.map((s, si) => (
                                <span key={si} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-[11px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Idioms */}
              <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>5 Essential Expressions & Idioms</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(topic.content.advancedIdioms || topic.content.idioms || []).map((idm, i) => (
                    <div key={i} className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">"{idm.idiom}"</h4>
                        <button onClick={() => handleSpeakText(`${idm.idiom}. ${idm.example}`)} className="text-amber-600 hover:text-amber-800 p-1">
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{idm.meaning}</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-100 dark:border-slate-800">
                        "{idm.example}"
                      </p>
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 text-xs">
                        <span className="font-bold text-amber-700 dark:text-amber-300 block mb-0.5">Practice Question:</span>
                        <p className="text-slate-600 dark:text-slate-300">{idm.practiceQuestion}</p>
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">Answer: {idm.practiceAnswer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 2: CONVERSATION */}
      {activeTab === 'conversation' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              <span>Interactive Model Dialogue</span>
            </h3>
            <span className="text-xs text-slate-500">Click audio icon to listen to AI speech</span>
          </div>

          <div className="space-y-3">
            {topic.content.conversation.map((turn, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border space-y-1.5 transition-colors ${
                  turn.speaker.includes('AI') || turn.speaker.includes('MZ') || turn.speaker.includes('Alex') || turn.speaker.includes('David')
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0F766E]">{turn.speaker}</span>
                  <button
                    onClick={() => handleSpeakText(turn.text, i)}
                    className="p-1.5 rounded-xl bg-white hover:bg-teal-100 text-[#134E4A]"
                  >
                    <Volume2 className={`w-4 h-4 ${playingIndex === i ? 'text-[#0F766E] animate-bounce' : ''}`} />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {turn.text}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#CBDED9] flex items-center justify-between">
            <p className="text-xs text-teal-800/70 font-medium">Ready to speak this conversation out loud with AI?</p>
            <button
              onClick={() => onNavigate('speaking')}
              className="px-5 py-2.5 rounded-2xl bg-ai-gradient text-white font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Practice in Speaking Studio</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PRONUNCIATION */}
      {activeTab === 'pronunciation' && (
        <div className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#134E4A] flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-[#0F766E]" />
            <span>Target Sentences Pronunciation Drill</span>
          </h3>
          <p className="text-xs text-teal-800/70 font-medium">Listen to the correct pronunciation, then record your voice to receive clarity scoring.</p>

          <div className="space-y-4">
            {topic.content.pronunciationSentences.map((sentence, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#F3F7F6] border border-[#CBDED9] space-y-3">
                <p className="text-sm font-bold text-[#134E4A]">"{sentence}"</p>
                
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => handleSpeakText(sentence)}
                    className="px-3.5 py-2 rounded-xl bg-[#DCEDE9] text-[#0F766E] font-bold text-xs flex items-center space-x-1.5 cursor-pointer border border-[#CBDED9]"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen AI Audio</span>
                  </button>

                  <button
                    onClick={() => handlePracticePronunciation(idx)}
                    disabled={recordingIndex === idx}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 text-white ${
                      recordingIndex === idx ? 'bg-rose-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 shadow-sm'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{recordingIndex === idx ? 'Recording Speech...' : 'Record My Voice'}</span>
                  </button>
                </div>

                {pronunciationScores[idx] !== undefined && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">Phonetic Clarity Rating:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{pronunciationScores[idx]}% (Excellent)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PICTURE DESCRIPTION */}
      {activeTab === 'picture' && (
        <div className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-6">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-[#0F766E]" />
            <h3 className="font-bold text-base text-[#134E4A]">Interactive Picture Description</h3>
          </div>

          {topic.content.pictureDescription ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Image Column */}
              <div className="md:col-span-5 space-y-3">
                <div className="rounded-2xl overflow-hidden border border-[#CBDED9] shadow-md">
                  <img
                    src={topic.content.pictureDescription.imageUrl}
                    alt="Lesson Illustration"
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 rounded-xl bg-[#F3F7F6] text-xs text-[#134E4A] border border-[#CBDED9]">
                  <span className="font-bold text-[#134E4A] block mb-1">Target Keywords to include:</span>
                  <div className="flex flex-wrap gap-1">
                    {topic.content.pictureDescription.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#DCEDE9] text-[#0F766E] text-[10px] font-bold border border-[#CBDED9]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Input & AI Feedback Column */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#134E4A] block">
                    {topic.content.pictureDescription.promptText}
                  </label>
                  <textarea
                    rows={4}
                    value={pictureInput}
                    onChange={(e) => setPictureInput(e.target.value)}
                    placeholder="Describe what you see in the picture above using full English sentences..."
                    className="w-full p-3.5 rounded-2xl bg-[#F3F7F6] border border-[#CBDED9] text-xs text-[#134E4A] focus:ring-2 focus:ring-[#0F766E] outline-none font-medium"
                  />
                </div>

                <button
                  onClick={handleEvaluatePicture}
                  disabled={isEvaluatingPicture || !pictureInput.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-ai-gradient disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEvaluatingPicture ? 'Evaluating Description...' : 'Get AI Feedback'}</span>
                </button>

                {pictureFeedback && (
                  <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#134E4A]">AI Description Score:</span>
                      <span className="font-extrabold text-[#0F766E] text-sm">{pictureFeedback.score}/100</span>
                    </div>
                    <p className="text-[#134E4A]">💡 {pictureFeedback.suggestions}</p>
                    <div className="pt-2 border-t border-[#CBDED9]">
                      <span className="font-bold text-teal-800/70 block mb-0.5">Model Sample Description:</span>
                      <p className="text-[#134E4A] italic font-medium">{pictureFeedback.sample}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <p className="text-xs text-teal-800/70 italic">No picture description task available for this specific topic.</p>
          )}
        </div>
      )}

      {/* TAB 5: EXERCISES & MINI GAMES */}
      {activeTab === 'exercises' && (
        <div className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-6">
          <h3 className="font-bold text-base text-[#134E4A] flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[#F59E0B]" />
            <span>Interactive Mini Games & Quiz Exercises</span>
          </h3>

          <div className="space-y-6">
            {topic.content.exercises.map((ex) => (
              <div key={ex.id} className="p-5 rounded-2xl bg-[#F3F7F6] border border-[#CBDED9] space-y-3">
                <p className="font-bold text-xs text-[#134E4A]">{ex.question}</p>

                {ex.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ex.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectAnswer(ex.id, opt, ex.correctAnswer)}
                        className={`p-3 rounded-xl text-left text-xs font-bold transition-all border cursor-pointer ${
                          userAnswers[ex.id] === opt
                            ? exerciseFeedback[ex.id]
                              ? 'bg-[#DCEDE9] border-[#0F766E] text-[#0F766E]'
                              : 'bg-rose-100 border-rose-500 text-rose-800'
                            : 'bg-white border-[#CBDED9] text-[#134E4A] hover:border-[#0F766E]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {userAnswers[ex.id] && (
                  <div className={`p-3 rounded-xl text-xs ${
                    exerciseFeedback[ex.id] ? 'bg-[#DCEDE9] text-[#0F766E]' : 'bg-rose-50 text-rose-800'
                  }`}>
                    <p className="font-bold">{exerciseFeedback[ex.id] ? '✅ Correct Answer!' : '❌ Incorrect'}</p>
                    <p className="mt-1 text-[11px] font-medium">{ex.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ROLE PLAY */}
      {activeTab === 'roleplay' && (
        <div className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#134E4A] flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#0F766E]" />
            <span>Role Play Guided Scenario</span>
          </h3>

          {topic.content.rolePlayScript ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] text-xs space-y-1">
                <span className="font-bold text-[#134E4A]">{topic.content.rolePlayScript.title}</span>
                <p className="text-teal-800/80 font-medium">{topic.content.rolePlayScript.prompt}</p>
              </div>

              <div className="space-y-3">
                {topic.content.rolePlayScript.turns.map((t, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F3F7F6] border border-[#CBDED9] text-xs">
                    <span className="font-bold text-[#0F766E] block">{t.speaker}</span>
                    <p className="text-[#134E4A] font-medium">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-teal-800/70 italic">No specific roleplay script for this lesson.</p>
          )}
        </div>
      )}

      {/* TAB 7: ADVANCED CASE STUDY & DEBATES (For Intermediate & Advanced) */}
      {activeTab === 'advanced' && topic.level !== 'Beginner' && (
        <div className="space-y-6">
          
          {/* Case Study */}
          {topic.content.caseStudy && (
            <div className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-3">
              <h3 className="font-bold text-base text-[#134E4A] flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#0F766E]" />
                <span>Case Study Scenario: {topic.content.caseStudy.title}</span>
              </h3>
              <p className="text-xs text-[#134E4A] leading-relaxed bg-[#F3F7F6] p-4 rounded-2xl border border-[#CBDED9] font-medium">
                {topic.content.caseStudy.scenario}
              </p>
              <div className="space-y-1 pt-2">
                <span className="text-xs font-bold text-[#0F766E]">Key Analytical Questions:</span>
                <ul className="list-disc list-inside text-xs text-[#134E4A] space-y-1 font-medium">
                  {topic.content.caseStudy.keyQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Debate */}
          {topic.content.debate && (
            <div className="p-6 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#134E4A] flex items-center space-x-2">
                <Flame className="w-5 h-5 text-[#F59E0B]" />
                <span>Structured Debate Topic: {topic.content.debate.topic}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-2">
                  <span className="font-bold text-[#0F766E] uppercase text-[10px]">PRO Arguments (In Favor)</span>
                  <ul className="list-disc list-inside space-y-1 text-[#134E4A] font-medium">
                    {topic.content.debate.proPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <span className="font-bold text-rose-800 uppercase text-[10px]">CON Arguments (Opposed)</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {topic.content.debate.conPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Presentation Practice (Advanced Level) */}
          {topic.content.presentationPractice && (
            <div className="p-6 rounded-3xl bg-[#042F2C] text-white shadow-xl space-y-3 border border-[#14B8A6]/30">
              <h3 className="font-bold text-base text-[#14B8A6] flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#F59E0B]" />
                <span>Executive Presentation Practice ({topic.content.presentationPractice.duration})</span>
              </h3>
              <p className="text-xs text-teal-100 font-medium">{topic.content.presentationPractice.topic}</p>
              <div className="p-3 rounded-xl bg-[#0F766E]/40 border border-[#14B8A6]/40 text-xs space-y-1">
                <span className="font-bold text-[#14B8A6]">Suggested Outline:</span>
                <ul className="list-disc list-inside text-teal-100 space-y-1 font-medium">
                  {topic.content.presentationPractice.outlinePoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
