import { CurriculumTopic, EnglishLevel, SpeakingScenario } from '../types';
import { BEGINNER_TOPICS, INTERMEDIATE_TOPICS, ADVANCED_TOPICS } from '../data/curriculumData';
import { SPEAKING_SCENARIOS } from '../data/mockData';

export type SpeakingActivityType =
  | 'Free Conversation'
  | 'Role Play'
  | 'Question & Answer'
  | 'Storytelling'
  | 'Picture Description'
  | 'Debate'
  | 'Opinion Sharing'
  | 'Problem Solving'
  | 'Interview Practice'
  | 'Daily Conversation'
  | 'Fluency Practice';

export interface TopicEngineContext {
  id: string;
  title: string;
  level: EnglishLevel;
  category: string;
  description: string;
  learningObjective: string;
  suggestedVocabulary: { word: string; definition: string; example: string }[];
  commonGrammarFocus: string;
  initialGreeting: string;
  conversationPrompts: string[];
  followUpPromptTemplates: string[];
  supportedActivities: SpeakingActivityType[];
  estimatedMinutes: number;
  pictureUrl?: string;
  pictureKeywords?: string[];
}

// Master topic catalog lookup index
const catalogTopics: CurriculumTopic[] = [
  ...BEGINNER_TOPICS,
  ...INTERMEDIATE_TOPICS,
  ...ADVANCED_TOPICS,
];

/**
 * Generate a dynamic context-aware opening greeting for any topic and learner level.
 */
export function generateInitialGreeting(
  title: string,
  category: string,
  level: EnglishLevel,
  userName: string = 'Learner',
  activity: SpeakingActivityType = 'Free Conversation'
): string {
  const name = userName ? userName.split(' ')[0] : 'there';
  const cleanTitle = title.toLowerCase();

  if (cleanTitle.includes('introduc') || cleanTitle.includes('greetings')) {
    return `Hello ${name}! Let's practice introducing yourself today. Tell me your name, what you do, and a little about yourself!`;
  }
  if (cleanTitle.includes('travel') || cleanTitle.includes('vacation') || cleanTitle.includes('trip') || cleanTitle.includes('airport')) {
    return `Hello ${name}! Imagine you're planning your dream vacation. Where would you like to go and why?`;
  }
  if (cleanTitle.includes('job') || cleanTitle.includes('interview') || cleanTitle.includes('career') || cleanTitle.includes('workplace')) {
    return `Welcome to your interview and career practice session, ${name}! Tell me about yourself and your professional background.`;
  }
  if (cleanTitle.includes('shopping') || cleanTitle.includes('mall') || cleanTitle.includes('store') || cleanTitle.includes('buy')) {
    return `Hi ${name}! Let's pretend we're at a vibrant shopping mall. What would you like to buy today?`;
  }
  if (cleanTitle.includes('health') || cleanTitle.includes('fitness') || cleanTitle.includes('doctor') || cleanTitle.includes('wellness')) {
    return `Hello ${name}! Today we'll talk about healthy lifestyles. What do you usually do to stay healthy and active?`;
  }
  if (cleanTitle.includes('food') || cleanTitle.includes('restaurant') || cleanTitle.includes('cook') || cleanTitle.includes('dining')) {
    return `Hi ${name}! Welcome to our food and dining conversation. What is your absolute favorite dish or restaurant experience?`;
  }
  if (cleanTitle.includes('tech') || cleanTitle.includes('ai') || cleanTitle.includes('digital') || cleanTitle.includes('internet')) {
    return `Hello ${name}! Today we're exploring technology and innovation. How has modern tech changed your daily life?`;
  }
  if (cleanTitle.includes('family') || cleanTitle.includes('friend') || cleanTitle.includes('relationship')) {
    return `Hi ${name}! Today's focus is on friends and family. How do you usually like to spend quality time with loved ones?`;
  }
  if (activity === 'Fluency Practice') {
    return `Welcome to your Fluency Practice session, ${name}! I'm Coach MZ, your speaking coach today. Let's begin by discussing your daily routine and interests!`;
  }
  if (activity === 'Role Play') {
    return `Hi ${name}! Welcome to our role-play simulation for "${title}". I'll play the host or partner, and you play yourself. Ready to get started?`;
  }
  if (activity === 'Debate') {
    return `Welcome to our debate session on "${title}", ${name}! I'll present key arguments on both sides. Which perspective do you lean toward?`;
  }

  // General natural fallback
  return `Hello ${name}! I'm Coach MZ. Today we're mastering "${title}" (${level} level). To kick off our discussion: what comes to mind first when you think about ${title.toLowerCase()}?`;
}

/**
 * Extract or build a full TopicEngineContext object for any topic or scenario.
 */
export function buildTopicEngineContext(
  topicOrScenario: CurriculumTopic | SpeakingScenario | string,
  userLevel: EnglishLevel = 'Intermediate'
): TopicEngineContext {
  let matchedTopic: CurriculumTopic | undefined;

  if (typeof topicOrScenario === 'string') {
    matchedTopic = catalogTopics.find(
      (t) => t.id === topicOrScenario || t.title.toLowerCase() === topicOrScenario.toLowerCase()
    );
  } else if ('topicNumber' in topicOrScenario) {
    matchedTopic = topicOrScenario;
  }

  if (matchedTopic) {
    const vocabList: { word: string; definition: string; example: string }[] = [];

    // Extract verbs & adjectives for beginner
    if (matchedTopic.content.verbs) {
      matchedTopic.content.verbs.slice(0, 5).forEach((v) => {
        vocabList.push({ word: v.word, definition: v.meaning, example: v.example });
      });
    }
    if (matchedTopic.content.adjectives) {
      matchedTopic.content.adjectives.slice(0, 5).forEach((a) => {
        vocabList.push({ word: a.word, definition: a.meaning, example: a.example });
      });
    }
    // Extract academic or advanced vocab
    if (matchedTopic.content.academicVocab) {
      matchedTopic.content.academicVocab.forEach((v) => {
        vocabList.push({ word: v.word, definition: v.meaning, example: v.example });
      });
    }
    if (matchedTopic.content.advancedVocab) {
      matchedTopic.content.advancedVocab.forEach((v) => {
        vocabList.push({ word: v.word, definition: v.meaning, example: v.example });
      });
    }

    // Default vocabulary if list empty
    if (vocabList.length === 0) {
      vocabList.push(
        { word: 'Express', definition: 'To convey thoughts or feelings in spoken words', example: 'Practice helps express complex ideas clearly.' },
        { word: 'Articulate', definition: 'Able to speak fluently and coherently', example: 'She delivered an articulate speech.' },
        { word: 'Perspective', definition: 'A particular attitude toward or way of regarding something', example: 'Sharing your perspective enriches the debate.' }
      );
    }

    const activities: SpeakingActivityType[] = [
      'Free Conversation',
      'Role Play',
      'Question & Answer',
      'Daily Conversation',
    ];

    if (matchedTopic.content.pictureDescription) {
      activities.push('Picture Description');
    }
    if (matchedTopic.content.debate) {
      activities.push('Debate', 'Opinion Sharing');
    }
    if (matchedTopic.content.caseStudy) {
      activities.push('Problem Solving');
    }
    if (matchedTopic.content.presentationPractice) {
      activities.push('Storytelling');
    }
    if (matchedTopic.level === 'Intermediate' || matchedTopic.level === 'Advanced') {
      activities.push('Fluency Practice', 'Interview Practice');
    }

    const initialGreeting = generateInitialGreeting(
      matchedTopic.title,
      matchedTopic.category,
      matchedTopic.level
    );

    const grammarFocus = matchedTopic.level === 'Beginner'
      ? 'Present Simple Tense, Subject Pronouns & Basic Prepositions'
      : matchedTopic.level === 'Intermediate'
      ? 'Past Continuous, Conditionals (If-clauses) & Phrasal Verbs'
      : 'Complex Subordinate Clauses, Passive Voice & Academic Nuances';

    return {
      id: matchedTopic.id,
      title: matchedTopic.title,
      level: matchedTopic.level,
      category: matchedTopic.category,
      description: matchedTopic.description,
      learningObjective: `Master spontaneous spoken communication, vocabulary usage, and natural grammatical structure for ${matchedTopic.title}.`,
      suggestedVocabulary: vocabList,
      commonGrammarFocus: grammarFocus,
      initialGreeting,
      conversationPrompts: matchedTopic.content.discussionQuestions || [
        `What experience do you have with ${matchedTopic.title.toLowerCase()}?`,
        `How would you describe the main challenge when speaking about ${matchedTopic.title.toLowerCase()}?`,
        `Can you share a personal story or opinion related to this topic?`,
      ],
      followUpPromptTemplates: [
        `Could you elaborate more on why you feel that way?`,
        `How would you handle that situation differently next time?`,
        `What is the most important takeaway for you in this scenario?`,
      ],
      supportedActivities: activities,
      estimatedMinutes: matchedTopic.estimatedMinutes || 20,
      pictureUrl: matchedTopic.content.pictureDescription?.imageUrl,
      pictureKeywords: matchedTopic.content.pictureDescription?.keywords,
    };
  }

  // Fallback for SpeakingScenario object or string title
  const rawTitle = typeof topicOrScenario === 'object' && 'title' in topicOrScenario
    ? topicOrScenario.title
    : (typeof topicOrScenario === 'string' ? topicOrScenario : 'General English Conversation');

  const rawDesc = typeof topicOrScenario === 'object' && 'description' in topicOrScenario
    ? topicOrScenario.description
    : `Spontaneous speaking practice focusing on ${rawTitle}.`;

  const rawCategory = typeof topicOrScenario === 'object' && 'category' in topicOrScenario
    ? topicOrScenario.category
    : 'General Conversation';

  return {
    id: `custom_${Date.now()}`,
    title: rawTitle,
    level: userLevel,
    category: rawCategory,
    description: rawDesc,
    learningObjective: `Build natural fluency and active vocabulary for ${rawTitle}.`,
    suggestedVocabulary: [
      { word: 'Fluency', definition: 'The ability to express oneself easily and articulately', example: 'Daily practice builds natural speaking fluency.' },
      { word: 'Confidence', definition: 'Self-assurance arising from one’s appreciation of abilities', example: 'Speaking without fear increases confidence.' },
      { word: 'Vocabulary', definition: 'The body of words used in a particular language', example: 'Expanding vocabulary elevates sentence complexity.' },
    ],
    commonGrammarFocus: 'Natural Sentence Structure, Word Order & Connected Speech',
    initialGreeting: generateInitialGreeting(rawTitle, rawCategory, userLevel),
    conversationPrompts: [
      `What are your thoughts on ${rawTitle.toLowerCase()}?`,
      `How often do you encounter this topic in your daily life?`,
    ],
    followUpPromptTemplates: [
      `That is an insightful observation! What lead you to that conclusion?`,
      `Could you give me a concrete example from your experience?`,
    ],
    supportedActivities: [
      'Free Conversation',
      'Role Play',
      'Question & Answer',
      'Daily Conversation',
      'Interview Practice',
      'Fluency Practice',
    ],
    estimatedMinutes: 15,
  };
}

export const topicConversationEngine = {
  getAllTopics: () => catalogTopics,
  buildTopicEngineContext,
  generateInitialGreeting,
};
