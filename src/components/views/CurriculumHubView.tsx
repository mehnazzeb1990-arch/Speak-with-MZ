import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CurriculumTopic, EnglishLevel } from '../../types';
import { BEGINNER_TOPICS, INTERMEDIATE_TOPICS, ADVANCED_TOPICS } from '../../data/curriculumData';
import { TopicDetailView } from './TopicDetailView';
import { AdBanner } from '../common/AdBanner';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Lock, 
  Sparkles, 
  Award, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Clock, 
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';

interface CurriculumHubViewProps {
  onNavigate: (view: string) => void;
}

export const CurriculumHubView: React.FC<CurriculumHubViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [activeLevelTab, setActiveLevelTab] = useState<EnglishLevel>('Beginner');
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const isUserPremium = user?.subscriptionPlan === 'intermediate_premium' || user?.subscriptionPlan === 'advanced_premium';

  // Determine current dataset based on level tab
  const rawTopics = activeLevelTab === 'Beginner' 
    ? BEGINNER_TOPICS 
    : activeLevelTab === 'Intermediate' 
    ? INTERMEDIATE_TOPICS 
    : ADVANCED_TOPICS;

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(rawTopics.map((t) => t.category)))];

  // Filter topics based on search and category
  const filteredTopics = rawTopics.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedTopic) {
    return (
      <TopicDetailView
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
        onNavigate={onNavigate}
        isUserPremium={isUserPremium}
      />
    );
  }

  return (
    <div id="curriculum-hub-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Free Plan Advertisement Placement */}
      <AdBanner onNavigate={onNavigate} />

      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-sky-300 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Complete 400-Topic English Curriculum</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Explore Structured Speaking Lessons
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          From beginner everyday conversations with colorful picture descriptions, to intermediate debates and advanced executive business presentation practice.
        </p>

        {/* Level Stats Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-3xl">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs">FREE</span>
            <div>
              <p className="text-xs font-extrabold text-white">200 Beginner Topics</p>
              <p className="text-[10px] text-slate-300">Everyday • Pictures • Mini Games</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-300 font-bold text-xs">PREMIUM</span>
            <div>
              <p className="text-xs font-extrabold text-white">100 Intermediate Topics</p>
              <p className="text-[10px] text-slate-300">Debates • Idioms • Case Studies</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-xs">PREMIUM</span>
            <div>
              <p className="text-xs font-extrabold text-white">100 Advanced Topics</p>
              <p className="text-[10px] text-slate-300">Business • Academic • Ethics • AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Level Selection Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          {(['Beginner', 'Intermediate', 'Advanced'] as EnglishLevel[]).map((level) => {
            const count = level === 'Beginner' ? 200 : 100;
            const isFree = level === 'Beginner';

            return (
              <button
                key={level}
                onClick={() => {
                  setActiveLevelTab(level);
                  setSelectedCategory('All');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
                  activeLevelTab === level
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{level} ({count})</span>
                {isFree ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">FREE</span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold flex items-center space-x-0.5">
                    <Zap className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
                    <span>PRO</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center space-x-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.slice(0, 30).map((topic) => {
          const isLocked = topic.isPremium && !isUserPremium;

          return (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden"
            >
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Topic #{topic.topicNumber}
                  </span>

                  {topic.isPremium ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>Premium</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      Free
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400 block">
                    {topic.category}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-sky-300 transition-colors">
                    {topic.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                {/* Topic Specific Badges */}
                <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
                  {topic.level === 'Beginner' ? (
                    <>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">10 Verbs</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">10 Adjectives</span>
                      <span className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 font-medium">Picture Description</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 font-medium">Mini Games</span>
                    </>
                  ) : (
                    <>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 font-medium">5 {topic.level === 'Advanced' ? 'Academic' : 'Advanced'} Vocab</span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 font-medium">5 Idioms</span>
                      <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 font-medium">Debates & Case Studies</span>
                    </>
                  )}
                </div>

              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-sky-400">
                <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{topic.estimatedMinutes} mins</span>
                </span>

                <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Start Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {filteredTopics.length > 30 && (
        <div className="text-center py-4">
          <p className="text-xs text-slate-500">
            Showing top 30 of {filteredTopics.length} topics for {activeLevelTab} level. Use search to find specific topics.
          </p>
        </div>
      )}

    </div>
  );
};
