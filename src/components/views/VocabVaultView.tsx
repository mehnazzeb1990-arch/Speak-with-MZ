import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { audioService } from '../../services/audio';
import { VocabularyItem, EnglishLevel } from '../../types';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  Plus, 
  Bookmark, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Trash2,
  Brain,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Award,
  HelpCircle,
  Mic,
  CheckCircle2,
  XCircle,
  Filter,
  BarChart2,
  BookmarkCheck,
  RefreshCw,
  Play,
  Trophy
} from 'lucide-react';

interface VocabVaultViewProps {
  onNavigate: (view: string) => void;
}

type ActivityTab = 'flashcards' | 'grid' | 'practice' | 'personal';
type PracticeMode = 'quiz' | 'fill_blank' | 'match' | 'listen' | 'pronounce';

export const VocabVaultView: React.FC<VocabVaultViewProps> = ({ onNavigate }) => {
  const { savedVocabList, addVocabWord, toggleSaveVocab } = useAuth();
  
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActivityTab>('flashcards');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('quiz');
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [personalFilter, setPersonalFilter] = useState<'all' | 'favorites' | 'learned' | 'review'>('all');

  // Flashcards state
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledVocab, setShuffledVocab] = useState<VocabularyItem[] | null>(null);

  // Practice state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Matching game state
  const [selectedWordMatch, setSelectedWordMatch] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Pronunciation simulator state
  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<{ score: number; feedback: string } | null>(null);

  // Custom Word Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCategory, setNewCategory] = useState('Daily Conversation');
  const [newLevel, setNewLevel] = useState<EnglishLevel>('Intermediate');
  const [newSynonyms, setNewSynonyms] = useState('');

  // Local state for interactive word toggles (Learned & Review Later)
  const [learnedIds, setLearnedIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    savedVocabList.forEach(v => {
      if (v.isLearned) s.add(v.id);
    });
    return s;
  });

  const [reviewLaterIds, setReviewLaterIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    savedVocabList.forEach(v => {
      if (v.isReviewLater) s.add(v.id);
    });
    return s;
  });

  // Filtered list
  const filteredVocab = useMemo(() => {
    const list = shuffledVocab || savedVocabList;
    return list.filter((item) => {
      const matchesSearch = 
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.synonyms && item.synonyms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesLevel = selectedLevel === 'All' || item.level === selectedLevel;
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      
      let matchesPersonal = true;
      if (personalFilter === 'favorites') matchesPersonal = item.isSaved;
      if (personalFilter === 'learned') matchesPersonal = learnedIds.has(item.id);
      if (personalFilter === 'review') matchesPersonal = reviewLaterIds.has(item.id);

      return matchesSearch && matchesLevel && matchesCategory && matchesPersonal;
    });
  }, [savedVocabList, shuffledVocab, searchTerm, selectedLevel, selectedCategory, personalFilter, learnedIds, reviewLaterIds]);

  // Categories list
  const categories = ['All', 'IELTS', 'Daily Conversation', 'Business English', 'Academic English', 'Travel', 'Technology'];

  // Handlers
  const handlePlayAudio = (word: string) => {
    audioService.speak(word, { rate: 0.9 });
  };

  const toggleLearned = (id: string) => {
    setLearnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleReviewLater = (id: string) => {
    setReviewLaterIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShuffle = () => {
    const copy = [...savedVocabList].sort(() => Math.random() - 0.5);
    setShuffledVocab(copy);
    setCurrentFlashcardIdx(0);
    setIsFlipped(false);
  };

  const resetShuffle = () => {
    setShuffledVocab(null);
    setCurrentFlashcardIdx(0);
    setIsFlipped(false);
  };

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newDefinition.trim()) return;

    const customItem: VocabularyItem = {
      id: `v_${Date.now()}`,
      word: newWord.trim(),
      phonetic: newPhonetic.trim() || `/${newWord.toLowerCase()}/`,
      definition: newDefinition.trim(),
      example: newExample.trim() || `I practiced using the word "${newWord.trim()}" in my speaking session.`,
      level: newLevel,
      category: newCategory,
      masteryLevel: 1,
      isSaved: true,
      dateAdded: new Date().toISOString().split('T')[0],
      synonyms: newSynonyms ? newSynonyms.split(',').map(s => s.trim()) : undefined,
      isLearned: false,
      isReviewLater: false,
    };

    addVocabWord(customItem);
    setNewWord('');
    setNewPhonetic('');
    setNewDefinition('');
    setNewExample('');
    setNewSynonyms('');
    setShowAddModal(false);
  };

  // Practice Quiz Generator
  const currentQuizItem = filteredVocab[quizIndex % Math.max(1, filteredVocab.length)];
  const quizOptions = useMemo(() => {
    if (!currentQuizItem) return [];
    const wrong = savedVocabList.filter(v => v.id !== currentQuizItem.id).map(v => v.definition);
    const shuffledWrong = wrong.sort(() => Math.random() - 0.5).slice(0, 3);
    return [currentQuizItem.definition, ...shuffledWrong].sort(() => Math.random() - 0.5);
  }, [currentQuizItem, savedVocabList]);

  const handleAnswerQuiz = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option === currentQuizItem.definition) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    setSelectedAnswer(null);
    if (quizIndex + 1 >= Math.min(10, filteredVocab.length)) {
      setQuizFinished(true);
    } else {
      setQuizIndex(prev => prev + 1);
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizFinished(false);
  };

  // Pronunciation feedback simulator
  const handleSimulatePronounce = (word: string) => {
    setIsListening(true);
    setSpeechFeedback(null);
    handlePlayAudio(word);
    setTimeout(() => {
      setIsListening(false);
      setSpeechFeedback({
        score: Math.floor(Math.random() * 12) + 88, // 88-100 score
        feedback: 'Excellent phonetic stress, pitch contour, and clear vowel articulation!'
      });
    }, 1500);
  };

  // Stats calculation
  const totalCount = savedVocabList.length;
  const learnedCount = learnedIds.size;
  const reviewCount = reviewLaterIds.size;
  const learnedPercentage = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  return (
    <div id="vocab-vault-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9] shadow-sm">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#134E4A] tracking-tight">Vocabulary Vault & Flashcards</h1>
              <p className="text-xs sm:text-sm text-teal-900/80 font-medium mt-0.5">
                Master high-impact vocabulary, practice interactive flashcards, take quizzes, and track fluency progress.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-3 rounded-2xl font-black text-xs text-white bg-ai-gradient hover:opacity-95 shadow-md shadow-teal-700/20 flex items-center space-x-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Word</span>
          </button>
        </div>
      </div>

      {/* Progress & Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-teal-800">
            <span>Total Vault</span>
            <BookOpen className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="text-2xl font-black text-[#134E4A]">{totalCount} <span className="text-xs font-bold text-teal-700">words</span></div>
          <div className="text-[11px] text-teal-800/70 font-medium">Saved from AI sessions</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-teal-800">
            <span>Learned Mastery</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#134E4A]">{learnedCount} <span className="text-xs font-bold text-emerald-700">({learnedPercentage}%)</span></div>
          <div className="w-full bg-[#CBDED9] h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-[#0F766E] h-full transition-all duration-500" style={{ width: `${learnedPercentage}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-teal-800">
            <span>Review Queue</span>
            <BookmarkCheck className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-black text-[#134E4A]">{reviewCount} <span className="text-xs font-bold text-amber-600">words</span></div>
          <div className="text-[11px] text-teal-800/70 font-medium">Marked for repetition</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-teal-800">
            <span>Fluency Level</span>
            <Award className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-black text-[#134E4A]">Level 3</div>
          <div className="text-[11px] text-teal-800/70 font-medium">IELTS & Business Ready</div>
        </div>
      </div>

      {/* Word of the Day Section */}
      <div id="word-of-the-day-card" className="p-6 rounded-3xl bg-gradient-to-r from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white border border-[#14B8A6]/40 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-[#14B8A6]/30 text-[#F59E0B] border border-[#14B8A6]/40">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-teal-200">Word of the Day • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#14B8A6]/30 text-teal-100 text-[10px] font-black uppercase border border-[#14B8A6]/30">
            IELTS 8.0 & Executive Ready
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-black text-white tracking-tight">Eloquent</h2>
              <span className="text-sm font-mono text-teal-200 bg-[#042F2C]/60 px-3 py-1 rounded-full border border-[#14B8A6]/30">
                /ˈɛləkwənt/
              </span>
              <button
                onClick={() => handlePlayAudio('Eloquent')}
                className="p-2 rounded-full bg-[#F59E0B] text-slate-950 hover:scale-110 transition-transform shadow-md cursor-pointer"
                title="Listen Pronunciation"
              >
                <Volume2 className="w-4 h-4 fill-slate-950" />
              </button>
            </div>

            <p className="text-sm font-semibold text-teal-100 leading-relaxed">
              <strong className="text-white">Definition:</strong> Fluent or persuasive in speaking or writing; expressing yourself clearly and expressively.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#042F2C]/50 border border-[#14B8A6]/20 text-xs italic text-teal-100/90 font-medium">
              "Her eloquent response during the Q&A session impressed the entire executive board."
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#042F2C]/60 p-5 rounded-2xl border border-[#14B8A6]/30 space-y-3">
            <div className="text-xs font-bold text-teal-200">High-Impact Synonyms:</div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-[#14B8A6]/20 text-teal-100 font-semibold text-xs border border-[#14B8A6]/30">Articulate</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#14B8A6]/20 text-teal-100 font-semibold text-xs border border-[#14B8A6]/30">Fluent</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#14B8A6]/20 text-teal-100 font-semibold text-xs border border-[#14B8A6]/30">Expressive</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#14B8A6]/20 text-teal-100 font-semibold text-xs border border-[#14B8A6]/30">Persuasive</span>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => {
                  const item: VocabularyItem = {
                    id: `v_word_of_day_${Date.now()}`,
                    word: 'Eloquent',
                    phonetic: '/ˈɛləkwənt/',
                    definition: 'Fluent or persuasive in speaking or writing.',
                    example: 'Her eloquent response during the Q&A impressed the executive board.',
                    level: 'Advanced',
                    category: 'Academic English',
                    masteryLevel: 1,
                    isSaved: true,
                    dateAdded: new Date().toISOString().split('T')[0],
                    synonyms: ['Articulate', 'Fluent', 'Expressive', 'Persuasive'],
                    isLearned: false,
                    isReviewLater: false,
                  };
                  addVocabWord(item);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#0F766E] text-white font-black text-xs hover:opacity-95 shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save to Vault</span>
              </button>

              <button
                onClick={() => onNavigate('speaking')}
                className="py-2.5 px-3 rounded-xl bg-[#F59E0B] text-slate-950 font-black text-xs hover:bg-amber-400 shadow-md flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Practice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 border-b border-[#CBDED9] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'flashcards'
              ? 'bg-[#0F766E] text-white shadow-md'
              : 'bg-[#E6F1EF] text-[#134E4A] border border-[#CBDED9] hover:bg-teal-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>🎴 Flashcards Mode</span>
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'grid'
              ? 'bg-[#0F766E] text-white shadow-md'
              : 'bg-[#E6F1EF] text-[#134E4A] border border-[#CBDED9] hover:bg-teal-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📖 Vocabulary Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'practice'
              ? 'bg-[#0F766E] text-white shadow-md'
              : 'bg-[#E6F1EF] text-[#134E4A] border border-[#CBDED9] hover:bg-teal-100'
          }`}
        >
          <Brain className="w-4 h-4 text-[#F59E0B]" />
          <span>⚡ Interactive Practice Quizzes</span>
        </button>

        <button
          onClick={() => setActiveTab('personal')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'personal'
              ? 'bg-[#0F766E] text-white shadow-md'
              : 'bg-[#E6F1EF] text-[#134E4A] border border-[#CBDED9] hover:bg-teal-100'
          }`}
        >
          <Star className="w-4 h-4 text-[#F59E0B]" />
          <span>⭐ Personal Collection</span>
        </button>
      </div>

      {/* Search & Comprehensive Filters */}
      <div className="p-5 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search words, definitions, phonetics, or synonyms..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] font-medium text-sm focus:ring-2 focus:ring-[#0F766E] outline-none shadow-inner"
            />
            <Search className="w-4 h-4 text-teal-800/60 absolute left-3.5 top-3.5" />
          </div>

          {/* Level Filter Dropdown */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] font-extrabold text-xs outline-none cursor-pointer"
          >
            <option value="All">All Difficulty Levels</option>
            <option value="Beginner">Beginner Level</option>
            <option value="Intermediate">Intermediate Level</option>
            <option value="Advanced">Advanced Level</option>
          </select>

          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] font-extrabold text-xs outline-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-teal-800/70 shrink-0 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-[#DCEDE9] text-[#134E4A] hover:bg-teal-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: FLASHCARDS MODE */}
      {activeTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {filteredVocab.length > 0 ? (
            <div className="space-y-6">
              
              {/* Flashcard Header Controls */}
              <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                <span>Card {currentFlashcardIdx + 1} of {filteredVocab.length}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={shuffledVocab ? resetShuffle : handleShuffle}
                    className="px-3 py-1.5 rounded-xl bg-[#DCEDE9] border border-[#CBDED9] text-[#134E4A] hover:bg-teal-100 flex items-center space-x-1 cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{shuffledVocab ? 'Reset Order' : 'Shuffle'}</span>
                  </button>
                </div>
              </div>

              {/* 3D Flip Flashcard */}
              {(() => {
                const item = filteredVocab[currentFlashcardIdx % filteredVocab.length];
                const isItemLearned = learnedIds.has(item.id);
                const isItemReview = reviewLaterIds.has(item.id);

                return (
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="relative min-h-[320px] rounded-3xl bg-gradient-to-br from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white p-8 shadow-2xl border border-[#14B8A6]/40 flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:scale-[1.01] group select-none"
                  >
                    {/* Card Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#14B8A6]/30 text-teal-100 text-[10px] font-black uppercase tracking-wider border border-[#14B8A6]/40">
                        {item.category} • {item.level}
                      </span>

                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleReviewLater(item.id)}
                          className={`p-2 rounded-xl transition-all ${
                            isItemReview ? 'bg-[#F59E0B] text-slate-950' : 'bg-[#0F766E]/60 text-teal-200 hover:bg-[#0F766E]'
                          }`}
                          title="Review Later"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => toggleLearned(item.id)}
                          className={`p-2 rounded-xl transition-all ${
                            isItemLearned ? 'bg-emerald-500 text-white' : 'bg-[#0F766E]/60 text-teal-200 hover:bg-[#0F766E]'
                          }`}
                          title="Mark as Learned"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    {!isFlipped ? (
                      <div className="space-y-4 text-center py-6">
                        <h2 className="text-4xl font-black text-white tracking-tight">{item.word}</h2>
                        
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#042F2C]/60 text-teal-200 font-mono text-sm border border-[#14B8A6]/30">
                          <span>{item.phonetic}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayAudio(item.word);
                            }}
                            className="p-1 text-[#F59E0B] hover:scale-110 transition-transform"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-teal-100/70 pt-4 font-medium animate-pulse">
                          👆 Click card to reveal definition, example & synonyms
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 py-4 text-left">
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#14B8A6] block">Definition</span>
                          <p className="text-lg font-bold text-white mt-0.5">{item.definition}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-black uppercase text-[#14B8A6] block">Example Sentence</span>
                          <p className="text-xs text-teal-100 italic font-medium mt-0.5 bg-[#042F2C]/40 p-3 rounded-xl border border-[#14B8A6]/20">
                            "{item.example}"
                          </p>
                        </div>

                        {item.synonyms && item.synonyms.length > 0 && (
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-teal-200 font-bold">Synonyms:</span>
                            <div className="flex flex-wrap gap-1">
                              {item.synonyms.map(s => (
                                <span key={s} className="px-2 py-0.5 rounded-md bg-[#14B8A6]/20 text-teal-100 font-semibold text-[11px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="flex items-center justify-between text-[11px] text-teal-200/80 font-medium pt-2 border-t border-[#14B8A6]/20">
                      <span>Click to flip</span>
                      <span>Mastery Level: {item.masteryLevel}/5 ⭐</span>
                    </div>
                  </div>
                );
              })()}

              {/* Flashcards Navigation Buttons */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIdx((prev) => (prev > 0 ? prev - 1 : filteredVocab.length - 1));
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#DCEDE9] font-black text-xs text-[#134E4A] hover:bg-teal-100 border border-[#CBDED9] flex items-center space-x-2 cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    const item = filteredVocab[currentFlashcardIdx % filteredVocab.length];
                    handlePlayAudio(item.word);
                  }}
                  className="p-3.5 rounded-2xl bg-[#0F766E] text-white font-black hover:bg-[#0D9488] shadow-md flex items-center space-x-2 cursor-pointer"
                  title="Listen Pronunciation"
                >
                  <Volume2 className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-xs font-bold">Listen</span>
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIdx((prev) => (prev < filteredVocab.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#0F766E] font-black text-xs text-white hover:bg-[#0D9488] flex items-center space-x-2 cursor-pointer shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 bg-[#E6F1EF] rounded-3xl border border-[#CBDED9] space-y-3">
              <BookOpen className="w-10 h-10 text-teal-700/60 mx-auto" />
              <p className="text-sm text-teal-900 font-extrabold">No words match your current filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('All');
                  setSelectedCategory('All');
                  setPersonalFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VOCABULARY GRID MODE */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVocab.map((item) => {
            const isItemLearned = learnedIds.has(item.id);
            const isItemReview = reviewLaterIds.has(item.id);

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-[#E6F1EF] p-6 border border-[#CBDED9] shadow-sm hover:shadow-md transition-all space-y-4 relative group hover:border-[#0F766E]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-extrabold text-[#134E4A]">{item.word}</h3>
                      <button
                        onClick={() => handlePlayAudio(item.word)}
                        className="p-1.5 rounded-xl text-[#0F766E] hover:bg-teal-200/60 transition-colors cursor-pointer"
                        title="Listen Pronunciation"
                      >
                        <Volume2 className="w-4 h-4 text-[#F59E0B]" />
                      </button>
                    </div>
                    <p className="text-xs text-[#0F766E] font-mono font-bold mt-0.5">{item.phonetic}</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleLearned(item.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isItemLearned ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-[#DCEDE9] text-teal-800 border-[#CBDED9]'
                      }`}
                      title={isItemLearned ? 'Learned' : 'Mark as Learned'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleReviewLater(item.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isItemReview ? 'bg-[#F59E0B] text-slate-950 border-amber-500' : 'bg-[#DCEDE9] text-teal-800 border-[#CBDED9]'
                      }`}
                      title={isItemReview ? 'In Review Queue' : 'Review Later'}
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
                  {item.definition}
                </p>

                <div className="p-3 rounded-2xl bg-[#DCEDE9] text-xs italic text-[#134E4A] font-medium border border-[#CBDED9]">
                  "{item.example}"
                </div>

                {item.synonyms && item.synonyms.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-[11px] text-teal-800/80">
                    <span className="font-bold">Synonyms:</span>
                    <span className="font-medium text-teal-900">{item.synonyms.join(', ')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-teal-800/60 font-semibold pt-2 border-t border-[#CBDED9]">
                  <span className="px-2 py-0.5 rounded-md bg-[#DCEDE9] text-[#0F766E] font-bold">
                    {item.category}
                  </span>
                  <span>{item.level}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: INTERACTIVE PRACTICE ACTIVITIES */}
      {activeTab === 'practice' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Sub-mode selector */}
          <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-[#E6F1EF] border border-[#CBDED9]">
            <button
              onClick={() => { setPracticeMode('quiz'); restartQuiz(); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                practiceMode === 'quiz' ? 'bg-[#0F766E] text-white shadow-sm' : 'text-[#134E4A] hover:bg-teal-100'
              }`}
            >
              📝 Multiple Choice Quiz
            </button>
            <button
              onClick={() => { setPracticeMode('fill_blank'); restartQuiz(); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                practiceMode === 'fill_blank' ? 'bg-[#0F766E] text-white shadow-sm' : 'text-[#134E4A] hover:bg-teal-100'
              }`}
            >
              ✍ Fill-in-the-Blank
            </button>
            <button
              onClick={() => { setPracticeMode('listen'); restartQuiz(); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                practiceMode === 'listen' ? 'bg-[#0F766E] text-white shadow-sm' : 'text-[#134E4A] hover:bg-teal-100'
              }`}
            >
              🎧 Listen & Choose
            </button>
            <button
              onClick={() => setPracticeMode('pronounce')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                practiceMode === 'pronounce' ? 'bg-[#0F766E] text-white shadow-sm' : 'text-[#134E4A] hover:bg-teal-100'
              }`}
            >
              🎤 Pronounce & Feedback
            </button>
          </div>

          {/* QUIZ MODE */}
          {practiceMode === 'quiz' && (
            <div className="p-8 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-6 shadow-sm">
              {!quizFinished && currentQuizItem ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                    <span>Question {quizIndex + 1} of {Math.min(10, filteredVocab.length)}</span>
                    <span>Score: {quizScore}</span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0F766E]">Vocabulary Word</span>
                    <h3 className="text-3xl font-black text-[#134E4A]">{currentQuizItem.word}</h3>
                    <p className="text-xs text-[#0F766E] font-mono">{currentQuizItem.phonetic}</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-[#134E4A] uppercase tracking-wider block">
                      Select the correct definition:
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {quizOptions.map((opt, idx) => {
                        let btnStyle = 'bg-[#DCEDE9] text-[#134E4A] border-[#CBDED9] hover:bg-teal-200/60';
                        if (selectedAnswer !== null) {
                          if (opt === currentQuizItem.definition) btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-black';
                          else if (opt === selectedAnswer) btnStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
                        }
                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswerQuiz(opt)}
                            className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {selectedAnswer !== null && opt === currentQuizItem.definition && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedAnswer !== null && (
                    <div className="pt-2">
                      <button
                        onClick={nextQuizQuestion}
                        className="w-full py-3.5 rounded-2xl bg-[#0F766E] text-white font-black text-xs hover:bg-[#115E59] transition-all cursor-pointer shadow-md"
                      >
                        Next Question →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <Trophy className="w-12 h-12 text-[#F59E0B] mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black text-[#134E4A]">Quiz Completed!</h3>
                  <p className="text-sm font-bold text-teal-800">Your Score: {quizScore} / {Math.min(10, filteredVocab.length)}</p>
                  <button
                    onClick={restartQuiz}
                    className="px-6 py-3 rounded-2xl bg-[#0F766E] text-white font-black text-xs hover:bg-[#115E59] cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FILL IN THE BLANK MODE */}
          {practiceMode === 'fill_blank' && (
            <div className="p-8 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-6 shadow-sm">
              {currentQuizItem && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-3">
                    <span className="text-[10px] font-black uppercase text-[#0F766E]">Sentence Exercise</span>
                    <p className="text-base sm:text-lg font-bold text-[#134E4A] leading-relaxed">
                      "{currentQuizItem.example.replace(new RegExp(currentQuizItem.word, 'gi'), '__________')}"
                    </p>
                    <p className="text-xs text-teal-800/80 italic">Hint: Definition is "{currentQuizItem.definition}"</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-[#134E4A] uppercase block">Select the missing word:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[currentQuizItem.word, ...savedVocabList.filter(v => v.id !== currentQuizItem.id).slice(0, 3).map(v => v.word)].sort(() => Math.random() - 0.5).map((w) => (
                        <button
                          key={w}
                          onClick={() => {
                            if (w.toLowerCase() === currentQuizItem.word.toLowerCase()) {
                              alert('Correct! Great vocabulary retention!');
                              nextQuizQuestion();
                            } else {
                              alert(`Incorrect. The correct word is "${currentQuizItem.word}".`);
                            }
                          }}
                          className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] hover:bg-[#0F766E] hover:text-white font-extrabold text-xs text-[#134E4A] transition-all cursor-pointer"
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LISTEN AND CHOOSE MODE */}
          {practiceMode === 'listen' && (
            <div className="p-8 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] space-y-6 shadow-sm text-center">
              {currentQuizItem && (
                <div className="space-y-6 max-w-md mx-auto">
                  <span className="text-[10px] font-black uppercase text-[#0F766E]">Audio Listening Drill</span>
                  
                  <div className="p-6 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-3">
                    <button
                      onClick={() => handlePlayAudio(currentQuizItem.word)}
                      className="p-5 rounded-full bg-[#0F766E] text-white hover:bg-[#0D9488] mx-auto shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                    >
                      <Volume2 className="w-8 h-8 text-[#F59E0B]" />
                    </button>
                    <p className="text-xs font-bold text-[#134E4A]">Click to listen to the target word</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[currentQuizItem.word, ...savedVocabList.filter(v => v.id !== currentQuizItem.id).slice(0, 3).map(v => v.word)].sort(() => Math.random() - 0.5).map((w) => (
                      <button
                        key={w}
                        onClick={() => {
                          if (w.toLowerCase() === currentQuizItem.word.toLowerCase()) {
                            alert('Spot on! Accurate listening comprehension!');
                            nextQuizQuestion();
                          } else {
                            alert(`Not quite. The word spoken was "${currentQuizItem.word}".`);
                          }
                        }}
                        className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] hover:bg-[#0F766E] hover:text-white font-black text-sm text-[#134E4A] transition-all cursor-pointer"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PRONOUNCE AND AI FEEDBACK MODE */}
          {practiceMode === 'pronounce' && (
            <div className="p-8 rounded-3xl bg-[#042F2C] text-white border border-[#14B8A6]/30 space-y-6 shadow-xl text-center">
              {currentQuizItem && (
                <div className="space-y-6 max-w-md mx-auto">
                  <span className="text-[10px] font-black uppercase text-[#14B8A6]">AI Pronunciation Assessor</span>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white">{currentQuizItem.word}</h3>
                    <p className="text-sm font-mono text-teal-200">{currentQuizItem.phonetic}</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0F766E]/50 border border-[#14B8A6]/30 space-y-4">
                    <button
                      onClick={() => handleSimulatePronounce(currentQuizItem.word)}
                      disabled={isListening}
                      className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#0F766E] text-white font-black text-xs hover:opacity-95 shadow-lg flex items-center justify-center space-x-2 mx-auto cursor-pointer"
                    >
                      <Mic className={`w-5 h-5 text-[#F59E0B] ${isListening ? 'animate-bounce' : ''}`} />
                      <span>{isListening ? 'Listening & Analyzing Speech...' : 'Test My Pronunciation'}</span>
                    </button>
                  </div>

                  {speechFeedback && (
                    <div className="p-4 rounded-2xl bg-[#0F766E] border border-[#14B8A6]/40 space-y-2 text-left animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span>Pronunciation Accuracy Score</span>
                        <span className="text-[#F59E0B] text-base">{speechFeedback.score}%</span>
                      </div>
                      <p className="text-xs text-teal-100 font-medium">{speechFeedback.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PERSONAL COLLECTION */}
      {activeTab === 'personal' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPersonalFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${personalFilter === 'all' ? 'bg-[#0F766E] text-white' : 'bg-[#E6F1EF] text-[#134E4A]'}`}
            >
              All Saved ({savedVocabList.length})
            </button>
            <button
              onClick={() => setPersonalFilter('learned')}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${personalFilter === 'learned' ? 'bg-[#0F766E] text-white' : 'bg-[#E6F1EF] text-[#134E4A]'}`}
            >
              ✅ Learned ({learnedIds.size})
            </button>
            <button
              onClick={() => setPersonalFilter('review')}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${personalFilter === 'review' ? 'bg-[#0F766E] text-white' : 'bg-[#E6F1EF] text-[#134E4A]'}`}
            >
              🔖 Review Later ({reviewLaterIds.size})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocab.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-[#E6F1EF] p-6 border border-[#CBDED9] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#134E4A]">{item.word}</h3>
                  <button onClick={() => handlePlayAudio(item.word)} className="p-1 text-[#0F766E]">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#0F766E] font-mono">{item.phonetic}</p>
                <p className="text-xs text-teal-900/80 font-medium">{item.definition}</p>
                <p className="text-xs italic text-teal-800 bg-[#DCEDE9] p-2 rounded-xl">"{item.example}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD CUSTOM WORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#042F2C]/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#E6F1EF] rounded-3xl p-6 shadow-2xl border border-[#CBDED9] space-y-4">
            <h3 className="text-lg font-extrabold text-[#134E4A]">Add Custom Vocabulary Item</h3>
            <form onSubmit={handleAddCustomWord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-teal-800/70 mb-1">Word</label>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Resilience"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-teal-800/70 mb-1">Phonetic IPA (Optional)</label>
                <input
                  type="text"
                  value={newPhonetic}
                  onChange={(e) => setNewPhonetic(e.target.value)}
                  placeholder="e.g. /rɪˈzɪliəns/"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-teal-800/70 mb-1">Definition</label>
                <textarea
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="e.g. The capacity to recover quickly from difficulties."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none font-medium"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-teal-800/70 mb-1">Example Sentence</label>
                <textarea
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="e.g. She showed great resilience in overcoming challenges."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none font-medium"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-teal-800/70 mb-1">Synonyms (Comma separated)</label>
                <input
                  type="text"
                  value={newSynonyms}
                  onChange={(e) => setNewSynonyms(e.target.value)}
                  placeholder="e.g. Toughness, Adaptability, Flexibility"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none font-medium"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#CBDED9] text-xs font-extrabold text-[#134E4A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0F766E] text-white font-extrabold text-xs cursor-pointer"
                >
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
