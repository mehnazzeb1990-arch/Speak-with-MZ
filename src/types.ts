export type EnglishLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SubscriptionPlan = 'free' | 'intermediate_premium' | 'advanced_premium';
export type Currency = 'USD' | 'PKR';

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: SubscriptionPlan;
  planName: string;
  amountUSD: number;
  amountPKR: number;
  currencyUsed: Currency;
  paymentMethod: 'Visa' | 'Mastercard' | 'Pakistani Debit Card (1Link/PayPak)' | 'HBL Bank' | 'Meezan Bank' | 'JazzCash' | 'EasyPaisa' | 'International Card';
  cardLast4?: string;
  date: string;
  status: 'paid' | 'refunded' | 'pending' | 'failed';
  receiptUrl?: string;
}

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
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'canceled';
  autoRenew?: boolean;
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

export interface VocabWordDetail {
  word: string;
  partOfSpeech?: 'verb' | 'adjective' | 'noun' | 'general' | 'academic';
  meaning: string;
  phonetic: string;
  example: string;
  collocations?: string[];
  synonyms?: string[];
}

export interface IdiomDetail {
  idiom: string;
  meaning: string;
  example: string;
  practiceQuestion: string;
  practiceAnswer: string;
}

export interface ConversationTurn {
  speaker: string;
  text: string;
}

export interface PictureDescriptionTask {
  imageUrl: string;
  promptText: string;
  sampleDescription: string;
  keywords: string[];
}

export interface ExerciseQuestion {
  id: string;
  type: 'mcq' | 'matching' | 'fill_blank' | 'sentence_builder';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface TopicContent {
  conversation: ConversationTurn[];
  pronunciationSentences: string[];
  rolePlayScript?: { title: string; prompt: string; turns: ConversationTurn[] };
  speakingActivity?: { prompt: string; tips: string[] };
  exercises: ExerciseQuestion[];
  
  // Beginner specific (10 verbs, 10 adjectives, Useful expressions, Picture description, Mini games)
  verbs?: VocabWordDetail[];
  adjectives?: VocabWordDetail[];
  usefulExpressions?: string[];
  pictureDescription?: PictureDescriptionTask;
  miniGames?: { title: string; type: string; prompt: string; options: string[]; answer: string }[];
  
  // Intermediate specific (5 Advanced Vocab with Collocations/Synonyms, 5 Idioms, Discussion, Debates, Case studies)
  advancedVocab?: VocabWordDetail[];
  idioms?: IdiomDetail[];
  discussionQuestions?: string[];
  opinionsPrompt?: string;
  caseStudy?: { title: string; scenario: string; keyQuestions: string[] };
  debate?: { topic: string; proPoints: string[]; conPoints: string[] };

  // Advanced specific (Business/Academic, 5 Academic Vocab, 5 Idioms, Presentation, Critical Analysis)
  academicVocab?: VocabWordDetail[];
  advancedIdioms?: IdiomDetail[];
  presentationPractice?: { topic: string; duration: string; outlinePoints: string[] };
  criticalAnalysis?: { title: string; articleExcerpt: string; analysisQuestions: string[] };
}

export interface CurriculumTopic {
  id: string;
  topicNumber: number;
  title: string;
  level: EnglishLevel;
  isPremium: boolean;
  category: string;
  description: string;
  estimatedMinutes: number;
  content: TopicContent;
}

