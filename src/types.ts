export type EnglishLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SubscriptionPlan = 'free' | 'intermediate_premium' | 'advanced_premium';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  country: string;
  nativeLanguage: string;
  level: EnglishLevel;
  learningGoals: string[];
  dailyGoalMinutes: number;
  currentStreak: number;
  totalMinutesPracticed: number;
  vocabularyLearned: number;
  conversationsCompleted: number;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  renewalDate?: string;
  createdAt: string;
}

export interface AIPersona {
  id: string;
  name: string;
  role: string;
  accent: string;
  avatarUrl: string;
  description: string;
  personality: string;
  tag: string;
  color: string;
  voiceGender: 'female' | 'male';
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  grammarCorrection?: GrammarCorrection | null;
  fluencyScore?: number;
  suggestedVocab?: { word: string; definition: string; example: string }[];
}

export interface ConversationSession {
  id: string;
  personaId: string;
  scenarioTitle: string;
  startTime: string;
  durationSeconds: number;
  messages: ConversationMessage[];
  averageFluencyScore: number;
  grammarCorrectionsCount: number;
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  definition: string;
  example: string;
  level: EnglishLevel;
  category: string;
  masteryLevel: number; // 0 to 5
  isSaved: boolean;
  dateAdded: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'Streak' | 'Speaking' | 'Vocabulary' | 'Fluency';
  currentProgress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'streak' | 'achievement' | 'lesson' | 'system';
}

export interface SpeakingScenario {
  id: string;
  title: string;
  description: string;
  category: 'Everyday' | 'Business' | 'Travel' | 'Social' | 'Academic';
  difficulty: EnglishLevel;
  iconName: string;
  suggestedPhrases: string[];
}
