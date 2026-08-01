import React, { useState } from 'react';
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
  Brain
} from 'lucide-react';

interface VocabVaultViewProps {
  onNavigate: (view: string) => void;
}

export const VocabVaultView: React.FC<VocabVaultViewProps> = ({ onNavigate }) => {
  const { savedVocabList, addVocabWord, toggleSaveVocab } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newExample, setNewExample] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredVocab = savedVocabList.filter((item) => {
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || item.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handlePlayAudio = (word: string) => {
    audioService.speak(word, { rate: 0.9 });
  };

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newDefinition.trim()) return;

    const customItem: VocabularyItem = {
      id: `v_${Date.now()}`,
      word: newWord.trim(),
      phonetic: '/custom/',
      definition: newDefinition.trim(),
      example: newExample.trim() || `I used the word ${newWord.trim()} in conversation.`,
      level: 'Intermediate',
      category: 'User Added',
      masteryLevel: 1,
      isSaved: true,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    addVocabWord(customItem);
    setNewWord('');
    setNewDefinition('');
    setNewExample('');
    setShowAddModal(false);
  };

  return (
    <div id="vocab-vault-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2.5 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-[#134E4A]">Vocabulary Vault</h1>
          </div>
          <p className="text-sm text-teal-900/80 font-medium mt-1">
            Review, listen to, and master your saved words from AI speaking sessions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setFlashcardMode(!flashcardMode)}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
              flashcardMode
                ? 'bg-[#F59E0B] text-slate-950 shadow-md'
                : 'bg-[#E6F1EF] border border-[#CBDED9] text-[#134E4A] hover:bg-teal-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{flashcardMode ? 'Grid View' : 'Flashcards Mode'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl font-extrabold text-xs text-white bg-ai-gradient hover:opacity-95 shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Word</span>
          </button>
        </div>
      </div>

      {/* Search & Level Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved words, definitions, or categories..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#E6F1EF] text-[#134E4A] font-medium text-sm focus:ring-2 focus:ring-[#0F766E] outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-teal-800/60 absolute left-3.5 top-3.5" />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-colors whitespace-nowrap cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-[#E6F1EF] text-[#134E4A] border border-[#CBDED9] hover:bg-teal-100'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Flashcards Mode */}
      {flashcardMode ? (
        <div className="max-w-xl mx-auto space-y-6">
          {filteredVocab.length > 0 ? (
            <div className="space-y-6">
              
              {/* Flashcard Box */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative min-h-[260px] rounded-3xl bg-gradient-to-br from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white p-8 shadow-2xl border border-[#14B8A6]/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform hover:scale-[1.01]"
              >
                <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider text-[#14B8A6]">
                  Card {currentFlashcardIdx + 1} of {filteredVocab.length}
                </span>

                {!isFlipped ? (
                  <div className="space-y-3">
                    <h2 className="text-3xl font-black">{filteredVocab[currentFlashcardIdx].word}</h2>
                    <p className="text-sm text-teal-200 font-mono">{filteredVocab[currentFlashcardIdx].phonetic}</p>
                    <p className="text-xs text-teal-100/70 pt-4 font-medium">Click card to reveal definition & example</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-base font-bold text-white">{filteredVocab[currentFlashcardIdx].definition}</p>
                    <p className="text-xs text-teal-100 italic font-medium">"{filteredVocab[currentFlashcardIdx].example}"</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIdx((prev) => (prev > 0 ? prev - 1 : filteredVocab.length - 1));
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#DCEDE9] font-extrabold text-xs text-[#134E4A] hover:bg-teal-100 border border-[#CBDED9]"
                >
                  Previous Card
                </button>

                <button
                  onClick={() => handlePlayAudio(filteredVocab[currentFlashcardIdx].word)}
                  className="p-3 rounded-2xl bg-[#0F766E] text-white font-extrabold hover:bg-[#0D9488]"
                  title="Play Audio Pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentFlashcardIdx((prev) => (prev < filteredVocab.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#0F766E] font-extrabold text-xs text-white hover:bg-[#0D9488]"
                >
                  Next Card
                </button>
              </div>

            </div>
          ) : (
            <p className="text-center py-12 text-teal-800/70 font-medium">No vocabulary words found for this filter.</p>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVocab.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#E6F1EF] p-6 border border-[#CBDED9] shadow-sm hover:shadow-md transition-all space-y-4 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-extrabold text-[#134E4A]">{item.word}</h3>
                    <button
                      onClick={() => handlePlayAudio(item.word)}
                      className="p-1.5 rounded-xl text-[#0F766E] hover:bg-teal-200/60 transition-colors"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#0F766E] font-mono font-bold mt-0.5">{item.phonetic}</p>
                </div>

                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
                  {item.level}
                </span>
              </div>

              <p className="text-xs text-teal-900/80 font-medium leading-relaxed">
                {item.definition}
              </p>

              <div className="p-3 rounded-2xl bg-[#DCEDE9] text-xs italic text-[#134E4A] font-medium border border-[#CBDED9]">
                "{item.example}"
              </div>

              <div className="flex items-center justify-between text-[11px] text-teal-800/60 font-semibold pt-2 border-t border-[#CBDED9]">
                <span>Category: {item.category}</span>
                <span>Added: {item.dateAdded}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#E6F1EF] rounded-3xl p-6 shadow-2xl border border-[#CBDED9] space-y-4">
            <h3 className="text-lg font-extrabold text-[#134E4A]">Add Custom Vocabulary</h3>
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
                <label className="block text-xs font-bold uppercase text-teal-800/70 mb-1">Definition</label>
                <textarea
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="e.g. The ability to recover quickly from difficulties."
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
                  placeholder="e.g. She demonstrated resilience during hard times."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-sm outline-none font-medium"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#CBDED9] text-xs font-extrabold text-[#134E4A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0F766E] text-white font-extrabold text-xs"
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
