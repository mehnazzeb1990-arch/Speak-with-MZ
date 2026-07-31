import { CurriculumTopic, VocabWordDetail, IdiomDetail } from '../types';

// Helper generators to ensure complete 200 Beginner, 100 Intermediate, and 100 Advanced topic catalog listings

const BEGINNER_TOPICS_CATALOG: CurriculumTopic[] = [
  {
    id: 'beg_top_01',
    topicNumber: 1,
    title: 'Greetings & Self-Introductions',
    level: 'Beginner',
    isPremium: false,
    category: 'Everyday Conversation',
    description: 'Learn how to introduce yourself, state your profession, and ask friendly icebreaker questions.',
    estimatedMinutes: 15,
    content: {
      verbs: [
        { word: 'Greet', partOfSpeech: 'verb', meaning: 'To welcome someone with words or actions', phonetic: '/ɡriːt/', example: 'I greet my colleagues every morning with a smile.' },
        { word: 'Introduce', partOfSpeech: 'verb', meaning: 'To tell someone another person’s name when they meet', phonetic: '/ˌɪn.trəˈdjuːs/', example: 'Let me introduce you to my manager.' },
        { word: 'Meet', partOfSpeech: 'verb', meaning: 'To see and speak to someone for the first time', phonetic: '/miːt/', example: 'Nice to meet you, Mehnaz!' },
        { word: 'Share', partOfSpeech: 'verb', meaning: 'To give a part of something to others or state personal details', phonetic: '/ʃeər/', example: 'I will share my contact information.' },
        { word: 'Listen', partOfSpeech: 'verb', meaning: 'To pay attention to sound or speech', phonetic: '/ˈlɪs.ən/', example: 'Listen carefully when someone introduces themselves.' },
        { word: 'Smile', partOfSpeech: 'verb', meaning: 'To form a pleased facial expression', phonetic: '/smaɪl/', example: 'A polite smile makes introductions warmer.' },
        { word: 'Answer', partOfSpeech: 'verb', meaning: 'To reply to a question or greeting', phonetic: '/ˈɑːn.sər/', example: 'She answered the greeting cheerfully.' },
        { word: 'Ask', partOfSpeech: 'verb', meaning: 'To inquire or request information', phonetic: '/ɑːsk/', example: 'You can ask where someone is from.' },
        { word: 'Welcome', partOfSpeech: 'verb', meaning: 'To greet someone cordially upon arrival', phonetic: '/ˈwel.kəm/', example: 'We welcome new members to our study group.' },
        { word: 'Enjoy', partOfSpeech: 'verb', meaning: 'To take pleasure in an interaction or event', phonetic: '/ɪnˈdʒɔɪ/', example: 'I enjoy meeting people from different countries.' },
      ],
      adjectives: [
        { word: 'Friendly', partOfSpeech: 'adjective', meaning: 'Kind, pleasant, and easy to talk to', phonetic: '/ˈfrend.li/', example: 'The team members are very friendly.' },
        { word: 'Polite', partOfSpeech: 'adjective', meaning: 'Showing good manners and respect', phonetic: '/pəˈlaɪt/', example: 'Always use a polite tone in introductions.' },
        { word: 'Confident', partOfSpeech: 'adjective', meaning: 'Feeling sure of oneself and one’s abilities', phonetic: '/ˈkɒn.fɪ.dənt/', example: 'Speak with a confident voice.' },
        { word: 'Cheerful', partOfSpeech: 'adjective', meaning: 'Noticeably happy and optimistic', phonetic: '/ˈtʃɪə.fəl/', example: 'He gave a cheerful hello.' },
        { word: 'Welcoming', partOfSpeech: 'adjective', meaning: 'Making someone feel accepted and comfortable', phonetic: '/ˈwel.kəm.ɪŋ/', example: 'The host created a welcoming atmosphere.' },
        { word: 'Calm', partOfSpeech: 'adjective', meaning: 'Relaxed and free from agitation', phonetic: '/kɑːm/', example: 'Stay calm when speaking to new partners.' },
        { word: 'Clear', partOfSpeech: 'adjective', meaning: 'Easy to hear and understand', phonetic: '/klɪər/', example: 'State your name in a clear voice.' },
        { word: 'Warm', partOfSpeech: 'adjective', meaning: 'Affectionate, friendly, and kind', phonetic: '/wɔːm/', example: 'She gave a warm hand shake.' },
        { word: 'Pleased', partOfSpeech: 'adjective', meaning: 'Feeling happy or satisfied', phonetic: '/pliːzd/', example: 'I am pleased to meet you.' },
        { word: 'Curious', partOfSpeech: 'adjective', meaning: 'Eager to learn or know more about someone', phonetic: '/ˈkjʊə.ri.əs/', example: 'Be curious about where your partner lives.' },
      ],
      usefulExpressions: [
        'Pleased to meet you!',
        'How do you do?',
        'Where are you originally from?',
        'What brings you here today?',
        'It’s a pleasure connecting with you.'
      ],
      conversation: [
        { speaker: 'MZ (AI Partner)', text: "Hello! Welcome to our speaking practice. My name is MZ. What's your name?" },
        { speaker: 'Learner', text: "Hi MZ! My name is Mehnaz. It's nice to meet you." },
        { speaker: 'MZ (AI Partner)', text: "Nice to meet you too, Mehnaz! Where are you joining us from today?" },
        { speaker: 'Learner', text: "I am joining from my home office. I am eager to improve my English speaking confidence." },
        { speaker: 'MZ (AI Partner)', text: "Wonderful! What line of work or study are you currently in?" }
      ],
      pronunciationSentences: [
        'It is a pleasure to make your acquaintance.',
        'I am looking forward to our practice session.',
        'Hello, my name is Alex and I am an software enthusiast.'
      ],
      pictureDescription: {
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
        promptText: 'Describe this scene of two professional colleagues shaking hands and greeting each other in a modern office hallway.',
        sampleDescription: 'In this photograph, two diverse professionals are standing in a brightly lit office setting. They are smiling warmly and exchanging a firm handshake during an introduction.',
        keywords: ['handshake', 'colleagues', 'office setting', 'smiling', 'introduction']
      },
      miniGames: [
        { title: 'Greeting Matcher', type: 'matching', prompt: 'Match "Pleased to meet you" with its best context:', options: ['When saying goodbye at night', 'When meeting someone for the first time', 'When ordering food in a diner'], answer: 'When meeting someone for the first time' },
        { title: 'Unscramble Sentence', type: 'sentence_builder', prompt: 'Unscramble: [you / meet / to / Nice]', options: ['Nice to meet you', 'Meet to nice you', 'To meet nice you'], answer: 'Nice to meet you' }
      ],
      rolePlayScript: {
        title: 'Meeting a New Colleague at the Coffee Machine',
        prompt: 'You are starting your first day at a new company. Approach the person near the coffee station and introduce yourself politely.',
        turns: [
          { speaker: 'Colleague', text: 'Oh hello! I haven’t seen you around here before. Are you new?' },
          { speaker: 'Learner', text: 'Hi! Yes, today is my first day in the marketing team. My name is Sam.' },
          { speaker: 'Colleague', text: 'Welcome aboard Sam! I am Sarah from design. Let me know if you need help finding anything.' }
        ]
      },
      speakingActivity: {
        prompt: 'Record a 30-second video or audio intro: State your name, where you live, and two fun hobbies you enjoy.',
        tips: ['Smile while speaking', 'Speak at a moderate pace', 'Emphasize key words like your name and city']
      },
      exercises: [
        {
          id: 'ex_1',
          type: 'mcq',
          question: 'Which phrase is the most natural formal response to "How do you do?"',
          options: ['How do you do?', 'I am fine thanks', 'Nothing much', 'Bye bye'],
          correctAnswer: 'How do you do?',
          explanation: 'In traditional formal English, the standard reply to "How do you do?" is repeating "How do you do?"'
        },
        {
          id: 'ex_2',
          type: 'fill_blank',
          question: 'Fill in the blank: "It is a pleasure to _____ you."',
          options: ['meet', 'see', 'listen', 'greet'],
          correctAnswer: 'meet',
          explanation: '"It is a pleasure to meet you" is the standard phrase when introduced to someone.'
        }
      ]
    }
  },
  {
    id: 'beg_top_02',
    topicNumber: 2,
    title: 'Ordering Coffee & Food in a Cafe',
    level: 'Beginner',
    isPremium: false,
    category: 'Food & Dining',
    description: 'Master polite requests, asking about menu ingredients, and specifying beverage customizations.',
    estimatedMinutes: 15,
    content: {
      verbs: [
        { word: 'Order', partOfSpeech: 'verb', meaning: 'To ask for food or drink in a restaurant', phonetic: '/ˈɔː.dər/', example: 'I would like to order a cappuccino.' },
        { word: 'Prefer', partOfSpeech: 'verb', meaning: 'To like one thing more than another', phonetic: '/prɪˈfɜːr/', example: 'I prefer oat milk over dairy milk.' },
        { word: 'Recommend', partOfSpeech: 'verb', meaning: 'To suggest something as good or suitable', phonetic: '/ˌrek.əˈmend/', example: 'Can you recommend a fresh pastry?' },
        { word: 'Pay', partOfSpeech: 'verb', meaning: 'To give money for goods or services', phonetic: '/peɪ/', example: 'Can I pay with credit card?' },
        { word: 'Serve', partOfSpeech: 'verb', meaning: 'To provide food or drink to customers', phonetic: '/sɜːv/', example: 'They serve warm croissants all day.' },
        { word: 'Sip', partOfSpeech: 'verb', meaning: 'To drink small quantities', phonetic: '/sɪp/', example: 'She likes to sip hot herbal tea.' },
        { word: 'Taste', partOfSpeech: 'verb', meaning: 'To sample the flavor of something', phonetic: '/teɪst/', example: 'Taste this delicious caramel latte.' },
        { word: 'Bake', partOfSpeech: 'verb', meaning: 'To cook food using dry heat in an oven', phonetic: '/beɪk/', example: 'They bake fresh bagels daily.' },
        { word: 'Choose', partOfSpeech: 'verb', meaning: 'To select from several possibilities', phonetic: '/tʃuːz/', example: 'You can choose between indoor or outdoor seating.' },
        { word: 'Enjoy', partOfSpeech: 'verb', meaning: 'To relish food or beverage', phonetic: '/ɪnˈdʒɔɪ/', example: 'Enjoy your breakfast!' }
      ],
      adjectives: [
        { word: 'Fresh', partOfSpeech: 'adjective', meaning: 'Recently made or harvested', phonetic: '/freʃ/', example: 'The café serves fresh orange juice.' },
        { word: 'Hot', partOfSpeech: 'adjective', meaning: 'Having a high temperature', phonetic: '/hɒt/', example: 'I like my Americano piping hot.' },
        { word: 'Iced', partOfSpeech: 'adjective', meaning: 'Chilled or served with ice cubes', phonetic: '/aɪst/', example: 'An iced matcha latte is refreshing.' },
        { word: 'Delicious', partOfSpeech: 'adjective', meaning: 'Having a highly pleasant taste', phonetic: '/dɪˈlɪʃ.əs/', example: 'This blueberry muffin is delicious.' },
        { word: 'Decaf', partOfSpeech: 'adjective', meaning: 'Free of caffeine', phonetic: '/ˈdiː.kæf/', example: 'Do you have decaf espresso?' },
        { word: 'Sweet', partOfSpeech: 'adjective', meaning: 'Containing sugar or sweet flavor', phonetic: '/swiːt/', example: 'I don’t like my tea too sweet.' },
        { word: 'Warm', partOfSpeech: 'adjective', meaning: 'Comfortably hot', phonetic: '/wɔːm/', example: 'A warm croissant is perfect in the morning.' },
        { word: 'Crispy', partOfSpeech: 'adjective', meaning: 'Firm and pleasantly crunchy', phonetic: '/ˈkrɪs.pi/', example: 'The toast is nice and crispy.' },
        { word: 'Creamy', partOfSpeech: 'adjective', meaning: 'Smooth and rich like cream', phonetic: '/ˈkriː.mi/', example: 'Oat milk makes coffee very creamy.' },
        { word: 'Quick', partOfSpeech: 'adjective', meaning: 'Prompt and fast', phonetic: '/kwɪk/', example: 'The barista offered quick service.' }
      ],
      usefulExpressions: [
        'Could I please get an iced latte?',
        'Do you have any vegan options?',
        'Is this available to go?',
        'Can I get that with extra espresso?',
        'Keep the change, thank you!'
      ],
      conversation: [
        { speaker: 'Barista', text: 'Good morning! What can I get started for you today?' },
        { speaker: 'Learner', text: 'Hi! Could I please get a medium iced almond milk latte?' },
        { speaker: 'Barista', text: 'Sure thing! Would you like any syrup added, like vanilla or hazelnut?' },
        { speaker: 'Learner', text: 'Just one pump of sugar-free vanilla syrup please. And a toasted bagel.' },
        { speaker: 'Barista', text: 'Sounds great! Will that be for here or to go?' }
      ],
      pronunciationSentences: [
        'Could I get a large cappuccino with oat milk to go?',
        'Would you like your sourdough toast buttered?',
        'The total comes to five dollars and fifty cents.'
      ],
      pictureDescription: {
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600',
        promptText: 'Describe this cozy coffee shop interior with baristas brewing coffee behind a wooden counter.',
        sampleDescription: 'This picture shows a warm, rustic café with pendant lighting. A skilled barista is steaming milk behind a marble counter while fresh croissants sit in a glass display case.',
        keywords: ['coffee shop', 'barista', 'espresso machine', 'counter', 'pastries']
      },
      miniGames: [
        { title: 'Café Order Formatter', type: 'fill_blank', prompt: 'Polite request starter: "_____ I have a coffee, please?"', options: ['Could', 'Must', 'Should'], answer: 'Could' }
      ],
      exercises: [
        {
          id: 'ex_c1',
          type: 'mcq',
          question: 'What is the most polite way to ask for coffee in English?',
          options: ['Give me a coffee.', 'Could I please get a coffee?', 'I want coffee now.', 'Coffee please hurry.'],
          correctAnswer: 'Could I please get a coffee?',
          explanation: '"Could I please get..." uses modal verb polite phrasing essential for natural café interactions.'
        }
      ]
    }
  }
];

// Generate standard 200 Beginner topics structure
export const BEGINNER_TOPICS: CurriculumTopic[] = Array.from({ length: 200 }, (_, index) => {
  const topicNumber = index + 1;
  if (index < BEGINNER_TOPICS_CATALOG.length) {
    return BEGINNER_TOPICS_CATALOG[index];
  }
  
  const categories = ['Everyday Conversation', 'Food & Dining', 'Travel & Transport', 'Hobbies & Sports', 'Shopping & Money', 'Family & Friends', 'Home & Neighborhood', 'Weather & Seasons', 'Health & Fitness', 'Daily Routines'];
  const category = categories[index % categories.length];
  
  return {
    id: `beg_top_${topicNumber.toString().padStart(2, '0')}`,
    topicNumber,
    title: `Beginner Topic ${topicNumber}: Essential ${category}`,
    level: 'Beginner',
    isPremium: false,
    category,
    description: `Practice foundational English speaking skills, key verbs, adjectives, picture descriptions, and real-life dialogues for ${category.toLowerCase()}.`,
    estimatedMinutes: 15,
    content: {
      verbs: [
        { word: 'Speak', partOfSpeech: 'verb', meaning: 'To say words out loud', phonetic: '/spiːk/', example: 'I speak English every day.' },
        { word: 'Practice', partOfSpeech: 'verb', meaning: 'To do something repeatedly to improve', phonetic: '/ˈpræk.tɪs/', example: 'Practice makes perfect.' },
        { word: 'Learn', partOfSpeech: 'verb', meaning: 'To gain knowledge', phonetic: '/lɜːn/', example: 'I learn new vocabulary words.' },
        { word: 'Understand', partOfSpeech: 'verb', meaning: 'To comprehend meaning', phonetic: '/ˌʌn.dəˈstænd/', example: 'I understand the AI partner.' },
        { word: 'Repeat', partOfSpeech: 'verb', meaning: 'To say again', phonetic: '/rɪˈpiːt/', example: 'Please repeat the sentence.' },
        { word: 'Express', partOfSpeech: 'verb', meaning: 'To convey thoughts or feelings', phonetic: '/ɪkˈspres/', example: 'Express your opinion clearly.' },
        { word: 'Improve', partOfSpeech: 'verb', meaning: 'To make or become better', phonetic: '/ɪmˈpruːv/', example: 'Daily practice improves fluency.' },
        { word: 'Listen', partOfSpeech: 'verb', meaning: 'To pay attention to audio', phonetic: '/ˈlɪs.ən/', example: 'Listen to native pronunciation.' },
        { word: 'Remember', partOfSpeech: 'verb', meaning: 'To recall information', phonetic: '/rɪˈmem.bər/', example: 'Remember useful phrases.' },
        { word: 'Succeed', partOfSpeech: 'verb', meaning: 'To achieve a desired goal', phonetic: '/səkˈsiːd/', example: 'You will succeed in speaking English fluently.' }
      ],
      adjectives: [
        { word: 'Active', partOfSpeech: 'adjective', meaning: 'Engaged in action', phonetic: '/ˈæk.tɪv/', example: 'Be an active learner.' },
        { word: 'Clear', partOfSpeech: 'adjective', meaning: 'Easy to understand', phonetic: '/klɪər/', example: 'Your pronunciation is clear.' },
        { word: 'Fluent', partOfSpeech: 'adjective', meaning: 'Able to speak smoothly', phonetic: '/ˈfluː.ənt/', example: 'Aim for fluent communication.' },
        { word: 'Simple', partOfSpeech: 'adjective', meaning: 'Easy and uncomplicated', phonetic: '/ˈsɪm.pəl/', example: 'Start with simple sentences.' },
        { word: 'Useful', partOfSpeech: 'adjective', meaning: 'Helpful for a purpose', phonetic: '/ˈjuːs.fəl/', example: 'These expressions are very useful.' },
        { word: 'Positive', partOfSpeech: 'adjective', meaning: 'Constructive and optimistic', phonetic: '/ˈpɒz.ə.tɪv/', example: 'Keep a positive attitude.' },
        { word: 'Consistent', partOfSpeech: 'adjective', meaning: 'Regular and dependable', phonetic: '/kənˈsɪs.tənt/', example: 'Consistent effort brings results.' },
        { word: 'Calm', partOfSpeech: 'adjective', meaning: 'Peaceful and untroubled', phonetic: '/kɑːm/', example: 'Stay calm while recording audio.' },
        { word: 'Eager', partOfSpeech: 'adjective', meaning: 'Keen and excited', phonetic: '/ˈiː.ɡər/', example: 'I am eager to learn.' },
        { word: 'Bright', partOfSpeech: 'adjective', meaning: 'Promising and intelligent', phonetic: '/braɪt/', example: 'You have a bright future in English.' }
      ],
      usefulExpressions: [
        'Could you please slow down a bit?',
        'How do you say this in English?',
        'That makes total sense to me!',
        'Thank you for your helpful feedback.',
        'Let’s practice this sentence again.'
      ],
      conversation: [
        { speaker: 'MZ (AI Partner)', text: `Welcome to Topic ${topicNumber}! Today we are discussing key topics in ${category}. Ready to start?` },
        { speaker: 'Learner', text: 'Yes, I am ready! I look forward to practicing new vocabulary.' },
        { speaker: 'MZ (AI Partner)', text: 'Great! Let’s describe a common situation and practice natural expressions together.' }
      ],
      pronunciationSentences: [
        `Topic ${topicNumber} focuses on building clear pronunciation in ${category}.`,
        'Repeat after me: Practicing every day increases confidence rapidly.',
        'Fluency develops through step-by-step interactive exercises.'
      ],
      pictureDescription: {
        imageUrl: `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600`,
        promptText: `Describe what you see in this picture related to ${category.toLowerCase()}.`,
        sampleDescription: `This vibrant photo showcases individuals actively communicating in an inviting environment, emphasizing collaboration and active learning.`,
        keywords: ['communication', 'learning', 'people', 'interactive', 'fluency']
      },
      miniGames: [
        { title: 'Word-Meaning Match', type: 'matching', prompt: 'Select the definition for "Fluent":', options: ['Speaking smoothly without long pauses', 'Speaking very loudly', 'Writing slow notes'], answer: 'Speaking smoothly without long pauses' }
      ],
      exercises: [
        {
          id: `ex_gen_${topicNumber}_1`,
          type: 'mcq',
          question: `Which word best fits: "I want to _____ my English speaking skills daily."`,
          options: ['improve', 'sleep', 'break', 'forget'],
          correctAnswer: 'improve',
          explanation: '"Improve" means to make something better through effort.'
        }
      ]
    }
  };
});

// INTERMEDIATE TOPICS (100 Premium Topics with 5 Advanced Vocab + Collocations + Synonyms, 5 Idioms, Case Studies, Debates)
const INTERMEDIATE_SAMPLE_TOPICS: CurriculumTopic[] = [
  {
    id: 'int_top_01',
    topicNumber: 1,
    title: 'Navigating Cross-Cultural Workplace Differences',
    level: 'Intermediate',
    isPremium: true,
    category: 'Business & Global Work',
    description: 'Explore cultural nuances in global remote teams, indirect communication styles, and workplace etiquette.',
    estimatedMinutes: 20,
    content: {
      advancedVocab: [
        {
          word: 'Nuance',
          partOfSpeech: 'noun',
          phonetic: '/ˈnjuː.ɑːns/',
          meaning: 'A subtle difference in meaning, opinion, or tone',
          example: 'Understanding cultural nuances is vital for global leaders.',
          collocations: ['cultural nuance', 'subtle nuance', 'capture nuances'],
          synonyms: ['subtlety', 'shade', 'refinement']
        },
        {
          word: 'Ambiguity',
          partOfSpeech: 'noun',
          phonetic: '/ˌæm.bɪˈɡjuː.ə.ti/',
          meaning: 'The quality of being open to more than one interpretation',
          example: 'We must reduce ambiguity when assigning cross-border tasks.',
          collocations: ['reduce ambiguity', 'inherent ambiguity', 'moral ambiguity'],
          synonyms: ['vagueness', 'uncertainty', 'obscurity']
        },
        {
          word: 'Diplomatic',
          partOfSpeech: 'adjective',
          phonetic: '/ˌdɪp.ləˈmæt.ɪk/',
          meaning: 'Tactful and sensitive when dealing with others',
          example: 'She used a diplomatic approach when critiquing the proposal.',
          collocations: ['diplomatic tone', 'diplomatic solution', 'remain diplomatic'],
          synonyms: ['tactful', 'discreet', 'polite']
        },
        {
          word: 'Adaptability',
          partOfSpeech: 'noun',
          phonetic: '/əˌdæp.təˈbɪl.ə.ti/',
          meaning: 'The ability to adjust readily to new conditions',
          example: 'Adaptability is the top skill needed in modern remote work environments.',
          collocations: ['high adaptability', 'demonstrate adaptability', 'foster adaptability'],
          synonyms: ['flexibility', 'versatility', 'resilience']
        },
        {
          word: 'Collaborative',
          partOfSpeech: 'adjective',
          phonetic: '/kəˈlæb.ər.ə.tɪv/',
          meaning: 'Produced or conducted by two or more parties working together',
          example: 'Our team built a collaborative workspace for global brainstorming.',
          collocations: ['collaborative effort', 'collaborative spirit', 'collaborative tool'],
          synonyms: ['cooperative', 'joint', 'collective']
        }
      ],
      idioms: [
        {
          idiom: 'Read between the lines',
          meaning: 'To understand the hidden or implied meaning behind words',
          example: 'When working with international clients, you often need to read between the lines.',
          practiceQuestion: 'What does it mean if a manager says "We should rethink this" and you "read between the lines"?',
          practiceAnswer: 'It means you understand they dislike the idea without them saying it explicitly.'
        },
        {
          idiom: 'Touch base',
          meaning: 'Briefly make contact or check in with someone',
          example: 'Let’s touch base on Thursday to review the project milestones.',
          practiceQuestion: 'Complete the sentence: "I will _____ base with the design team tomorrow."',
          practiceAnswer: 'touch'
        },
        {
          idiom: 'Break the ice',
          meaning: 'To make people feel more comfortable in a social or professional setting',
          example: 'The team lead shared a funny anecdote to break the ice at the start of the meeting.',
          practiceQuestion: 'What is a good way to break the ice in a new virtual team?',
          practiceAnswer: 'Asking a fun icebreaker question or sharing a light personal hobby.'
        },
        {
          idiom: 'See eye to eye',
          meaning: 'To agree completely with someone',
          example: 'While we don’t always see eye to eye on design details, we share the same overall goal.',
          practiceQuestion: 'If two directors "see eye to eye", do they agree or disagree?',
          practiceAnswer: 'They agree completely.'
        },
        {
          idiom: 'Hit the ground running',
          meaning: 'To start a new project or job with immediate enthusiasm and speed',
          example: 'With your background in project management, you will hit the ground running.',
          practiceQuestion: 'What does "hitting the ground running" require from a new hire?',
          practiceAnswer: 'Quick onboarding and proactive immediate action without delay.'
        }
      ],
      discussionQuestions: [
        'How do direct vs. indirect feedback cultures impact project timelines?',
        'What strategies can remote teams use to foster trust across different time zones?',
        'Share an experience where you had to adapt your communication style for a diverse audience.'
      ],
      caseStudy: {
        title: 'The Delayed Product Launch Controversy',
        scenario: 'A Tokyo engineering squad prefers thorough testing before reporting status, while a Silicon Valley product manager demands rapid weekly feature releases. Tensions escalate over perceived delays.',
        keyQuestions: [
          'What is the root misunderstanding between the two teams?',
          'How can a manager mediate this conflict diplomatically?'
        ]
      },
      debate: {
        topic: 'Should companies enforce mandatory camera-on rules for all global video meetings?',
        proPoints: ['Increases visual engagement and empathy', 'Helps pick up non-verbal cues across cultures'],
        conPoints: ['Causes video fatigue and privacy concerns', 'Favors high-bandwidth internet connections over remote equity']
      },
      conversation: [
        { speaker: 'Alex (Business Coach)', text: 'Welcome to Intermediate Topic 1! Today we evaluate cultural communication styles in multinational teams. Have you ever worked with international colleagues?' },
        { speaker: 'Learner', text: 'Yes, I work daily with team members from Europe and North America. Sometimes feedback styles differ greatly.' },
        { speaker: 'Alex (Business Coach)', text: 'Precisely. Direct feedback can sound harsh to indirect communicators, while indirect feedback might be missed by direct speakers. How do you handle that balance?' }
      ],
      pronunciationSentences: [
        'Diplomatic phrasing helps navigate cultural ambiguity smoothly.',
        'We must read between the lines to appreciate subtle differences.',
        'Collaborative partnerships thrive on open touch-base sessions.'
      ],
      exercises: [
        {
          id: 'int_ex_1',
          type: 'mcq',
          question: 'Which word means "tactful and sensitive when dealing with people"?',
          options: ['Diplomatic', 'Ambiguous', 'Rigid', 'Casual'],
          correctAnswer: 'Diplomatic',
          explanation: 'Diplomatic describes someone who expresses opinions delicately without causing offense.'
        }
      ]
    }
  }
];

export const INTERMEDIATE_TOPICS: CurriculumTopic[] = Array.from({ length: 100 }, (_, index) => {
  const topicNumber = index + 1;
  if (index < INTERMEDIATE_SAMPLE_TOPICS.length) {
    return INTERMEDIATE_SAMPLE_TOPICS[index];
  }
  
  const categories = ['Discussion & Opinions', 'Case Studies', 'Debates & Arguments', 'Role Play', 'Real-Life Conversations', 'Social Issues', 'Workplace Culture', 'Media & Technology', 'Personal Growth', 'Environmental Policy'];
  const category = categories[index % categories.length];

  return {
    id: `int_top_${topicNumber.toString().padStart(2, '0')}`,
    topicNumber,
    title: `Intermediate Topic ${topicNumber}: Master ${category}`,
    level: 'Intermediate',
    isPremium: true,
    category,
    description: `Deepen fluency with 5 Advanced Vocab words (with collocations & synonyms), 5 Idioms, case study debates, and natural opinion discourse.`,
    estimatedMinutes: 20,
    content: {
      advancedVocab: [
        { word: 'Perspective', partOfSpeech: 'noun', meaning: 'A particular attitude toward or way of regarding something', phonetic: '/pəˈspek.tɪv/', example: 'Viewing the issue from a fresh perspective yielded new solutions.', collocations: ['broad perspective', 'gain perspective'], synonyms: ['viewpoint', 'outlook'] },
        { word: 'Substantial', partOfSpeech: 'adjective', meaning: 'Of considerable importance, size, or worth', phonetic: '/səbˈstæn.ʃəl/', example: 'The team made substantial progress this quarter.', collocations: ['substantial growth', 'substantial evidence'], synonyms: ['significant', 'considerable'] },
        { word: 'Constraint', partOfSpeech: 'noun', meaning: 'A limitation or restriction', phonetic: '/kənˈstreɪnt/', example: 'Budget constraints forced us to streamline priorities.', collocations: ['financial constraint', 'time constraint'], synonyms: ['limitation', 'restriction'] },
        { word: 'Strategy', partOfSpeech: 'noun', meaning: 'A plan of action designed to achieve a long-term goal', phonetic: '/ˈstræt.ə.dʒi/', example: 'We need a clear strategy for global rollout.', collocations: ['growth strategy', 'effective strategy'], synonyms: ['plan', 'masterplan'] },
        { word: 'Cohesive', partOfSpeech: 'adjective', meaning: 'Forming a united whole', phonetic: '/kəʊˈhiː.sɪv/', example: 'They built a cohesive team dynamic.', collocations: ['cohesive unit', 'cohesive argument'], synonyms: ['unified', 'connected'] }
      ],
      idioms: [
        { idiom: 'Bite the bullet', meaning: 'To face a difficult situation with courage', example: 'We decided to bite the bullet and invest in new software.', practiceQuestion: 'What does it mean to bite the bullet?', practiceAnswer: 'To accept and endure a hard situation courageously.' },
        { idiom: 'Back to the drawing board', meaning: 'To start over after a plan fails', example: 'The proposal was rejected, so it is back to the drawing board.', practiceQuestion: 'When do you go back to the drawing board?', practiceAnswer: 'When your initial plan does not work out.' },
        { idiom: 'Cut corners', meaning: 'To do something in the easiest, cheapest, or quickest way', example: 'Don’t cut corners when it comes to product safety.', practiceQuestion: 'Why should companies avoid cutting corners on quality?', practiceAnswer: 'Because it harms reputation and customer trust.' },
        { idiom: 'On the fence', meaning: 'Undecided about a choice', example: 'I am still on the fence about moving to a new city.', practiceQuestion: 'If you are on the fence, have you made a decision?', practiceAnswer: 'No, you are still contemplating.' },
        { idiom: 'Spill the beans', meaning: 'To reveal secret information', example: 'He accidentally spilled the beans about the surprise party.', practiceQuestion: 'What does spilling the beans mean?', practiceAnswer: 'Disclosing a secret.' }
      ],
      discussionQuestions: [
        `What key factors influence successful execution in ${category.toLowerCase()}?`,
        'How can professionals balance speed of decision-making with thorough analytical rigor?',
        'In your experience, what makes a communication strategy genuinely effective?'
      ],
      caseStudy: {
        title: `Strategic Challenge in ${category}`,
        scenario: `A organization faces conflicting stakeholder opinions regarding modernizing their operational model in ${category.toLowerCase()}.`,
        keyQuestions: ['Identify the core conflict.', 'Propose an action plan with clear metrics.']
      },
      debate: {
        topic: `Should organizations prioritize rapid expansion over strict internal stability in ${category.toLowerCase()}?`,
        proPoints: ['Captures first-mover market advantage', 'Fosters continuous innovation and energy'],
        conPoints: ['Risks employee burnout and quality control failure', 'Can lead to expensive missteps']
      },
      conversation: [
        { speaker: 'MZ (AI Partner)', text: `Welcome to Topic ${topicNumber}! Today we explore ${category}. What is your perspective on this area?` },
        { speaker: 'Learner', text: 'I think it requires balancing strategic vision with day-to-day practical constraints.' },
        { speaker: 'MZ (AI Partner)', text: 'Extremely well articulated! Let’s unpack the 5 idioms and advanced vocabulary for this topic.' }
      ],
      pronunciationSentences: [
        'A cohesive strategy allows teams to overcome budget constraints.',
        'Going back to the drawing board often unlocks substantial breakthroughs.',
        'We must examine the case study from multiple perspectives.'
      ],
      exercises: [
        {
          id: `int_ex_${topicNumber}_1`,
          type: 'mcq',
          question: 'What idiom means "to face a hard situation bravely"?',
          options: ['Bite the bullet', 'Spill the beans', 'Cut corners', 'On the fence'],
          correctAnswer: 'Bite the bullet',
          explanation: 'Bite the bullet comes from military history, meaning facing pain or hardship courageously.'
        }
      ]
    }
  };
});

// ADVANCED TOPICS (100 Premium Topics: Business, Academic, Tech, Leadership, AI, Ethics + 5 Academic Vocab, 5 Idioms, Presentation Practice, Critical Analysis)
const ADVANCED_SAMPLE_TOPICS: CurriculumTopic[] = [
  {
    id: 'adv_top_01',
    topicNumber: 1,
    title: 'Ethical Frontiers of Generative Artificial Intelligence',
    level: 'Advanced',
    isPremium: true,
    category: 'AI & Ethics',
    description: 'Critically analyze algorithmic bias, intellectual property in synthetic media, governance frameworks, and technological singularity.',
    estimatedMinutes: 25,
    content: {
      academicVocab: [
        {
          word: 'Paradigm',
          partOfSpeech: 'academic',
          phonetic: '/ˈpær.ə.daɪm/',
          meaning: 'A typical pattern, model, or conceptual framework of something',
          example: 'Generative AI introduces a paradigm shift in digital content creation.',
          collocations: ['paradigm shift', 'dominant paradigm', 'shift paradigms'],
          synonyms: ['framework', 'archetype', 'model']
        },
        {
          word: 'Algorithmic',
          partOfSpeech: 'academic',
          phonetic: '/ˌæl.ɡəˈrɪð.mɪk/',
          meaning: 'Relating to or using a process or set of rules in problem-solving operations',
          example: 'Algorithmic accountability ensures models remain transparent and non-discriminatory.',
          collocations: ['algorithmic bias', 'algorithmic efficiency', 'algorithmic transparency'],
          synonyms: ['computational', 'systematic', 'procedural']
        },
        {
          word: 'Dissemination',
          partOfSpeech: 'academic',
          phonetic: '/dɪˌsem.ɪˈneɪ.ʃən/',
          meaning: 'The act of spreading something, especially information, widely',
          example: 'Rapid dissemination of synthetic news demands robust verification protocols.',
          collocations: ['widespread dissemination', 'dissemination of research', 'facilitate dissemination'],
          synonyms: ['distribution', 'propagation', 'circulation']
        },
        {
          word: 'Discourse',
          partOfSpeech: 'academic',
          phonetic: '/ˈdɪs.kɔːs/',
          meaning: 'Written or spoken communication or debate within a discipline',
          example: 'Academic discourse surrounding machine learning ethics has intensified.',
          collocations: ['public discourse', 'scholarly discourse', 'shape discourse'],
          synonyms: ['dialogue', 'debate', 'discussion']
        },
        {
          word: 'Juxtaposition',
          partOfSpeech: 'academic',
          phonetic: '/ˌdʒʌk.stə.pəˈzɪʃ.ən/',
          meaning: 'The fact of two things being seen or placed close together with contrasting effect',
          example: 'The juxtaposition of massive computational power and environmental footprint raises sustainability concerns.',
          collocations: ['stark juxtaposition', 'interesting juxtaposition', 'juxtaposition of ideas'],
          synonyms: ['contrast', 'comparison', 'apposition']
        }
      ],
      advancedIdioms: [
        {
          idiom: 'Double-edged sword',
          meaning: 'Something that offers advantages but also significant drawbacks',
          example: 'AI automation is a double-edged sword: it boosts productivity but creates workforce displacement risks.',
          practiceQuestion: 'Why is rapid AI adoption considered a double-edged sword for creative industries?',
          practiceAnswer: 'Because it accelerates design speed while threatening traditional copyright protections.'
        },
        {
          idiom: 'Pave the way',
          meaning: 'To create conditions that make it easier for something to happen or develop',
          example: 'Pioneering research in neural networks paved the way for modern transformer models.',
          practiceQuestion: 'Complete the thought: Ethical AI regulations will pave the way for _____',
          practiceAnswer: 'trustworthy and sustainable technological adoption.'
        },
        {
          idiom: 'At the cutting edge',
          meaning: 'At the forefront or most advanced stage of development',
          example: 'Our research team works at the cutting edge of quantum natural language processing.',
          practiceQuestion: 'What does working at the cutting edge demand from engineers?',
          practiceAnswer: 'Continuous learning, rigorous experimentation, and high adaptability.'
        },
        {
          idiom: 'Ahead of the curve',
          meaning: 'To be knowledgeable or advanced relative to current trends',
          example: 'By implementing governance policies early, the institution stayed ahead of the curve.',
          practiceQuestion: 'How can an executive stay ahead of the curve in AI policy?',
          practiceAnswer: 'By closely monitoring global regulatory developments and academic literature.'
        },
        {
          idiom: 'The tip of the iceberg',
          meaning: 'A small visible part of a much larger, hidden problem or phenomenon',
          example: 'Deepfake detection is only the tip of the iceberg when addressing digital misinformation.',
          practiceQuestion: 'If copyright lawsuits are the tip of the iceberg, what lies beneath?',
          practiceAnswer: 'Fundamental questions of ownership, data consent, and fair use doctrines.'
        }
      ],
      presentationPractice: {
        topic: 'Deliver a 90-second executive pitch on implementing trustworthy AI safeguards in enterprise software.',
        duration: '90 Seconds',
        outlinePoints: [
          'State the thesis: Innovation requires ethical boundaries to maintain consumer trust.',
          'Highlight key challenges: Algorithmic bias and data privacy risks.',
          'Propose the solution: Independent auditing and human-in-the-loop oversight.'
        ]
      },
      criticalAnalysis: {
        title: 'Evaluating Autonomous Agent Delegation vs Human Oversight',
        articleExcerpt: 'As autonomous AI agents acquire the agency to execute financial transactions and API invocations independently, traditional audit trails become insufficient. Scholars argue that without verifiable cryptographic logs, accountability degrades.',
        analysisQuestions: [
          'Analyze the tension between operational efficiency and cryptographic accountability.',
          'Formulate a counter-argument to absolute human-in-the-loop mandates.'
        ]
      },
      conversation: [
        { speaker: 'David (Exam & Academic Evaluator)', text: 'Welcome to Advanced Topic 1. Today we examine the ethical discourse surrounding Generative AI. How would you articulate the core paradigm shift occurring in synthetic media?' },
        { speaker: 'Learner', text: 'The paradigm shift stems from moving from passive computational tools to proactive creative agents capable of synthesizing human-level discourse.' },
        { speaker: 'David (Exam & Academic Evaluator)', text: 'Exceptional usage of "paradigm shift" and "discourse"! Now let’s analyze whether current governance frameworks are ahead of the curve or lagging behind.' }
      ],
      pronunciationSentences: [
        'The juxtaposition of algorithmic power and ethical responsibility demands scholarly discourse.',
        'Working at the cutting edge paves the way for transformative technological governance.',
        'Current regulations represent merely the tip of the iceberg in AI ethics.'
      ],
      exercises: [
        {
          id: 'adv_ex_1',
          type: 'mcq',
          question: 'Which academic word means "a fundamental conceptual framework or model"?',
          options: ['Paradigm', 'Dissemination', 'Constraint', 'Nuance'],
          correctAnswer: 'Paradigm',
          explanation: 'Paradigm refers to an overarching framework or standard mindset within a scientific or academic field.'
        }
      ]
    }
  }
];

export const ADVANCED_TOPICS: CurriculumTopic[] = Array.from({ length: 100 }, (_, index) => {
  const topicNumber = index + 1;
  if (index < ADVANCED_SAMPLE_TOPICS.length) {
    return ADVANCED_SAMPLE_TOPICS[index];
  }

  const categories = [
    'Business English', 'Academic English', 'Technology', 'Leadership',
    'Global Issues', 'Research & Data', 'AI & Automation', 'Economics & Finance',
    'Politics & Policy', 'Ethics & Morality', 'Critical Thinking', 'Professional Communication'
  ];
  const category = categories[index % categories.length];

  return {
    id: `adv_top_${topicNumber.toString().padStart(2, '0')}`,
    topicNumber,
    title: `Advanced Topic ${topicNumber}: Master ${category}`,
    level: 'Advanced',
    isPremium: true,
    category,
    description: `Master high-level academic vocabulary, complex idioms, presentation practice, critical analysis, and executive discourse in ${category}.`,
    estimatedMinutes: 25,
    content: {
      academicVocab: [
        { word: 'Empirical', partOfSpeech: 'academic', meaning: 'Based on observation or experience rather than theory', phonetic: '/ɪmˈpɪr.ɪ.kəl/', example: 'The hypothesis is supported by robust empirical evidence.', collocations: ['empirical research', 'empirical proof'], synonyms: ['observational', 'experimental'] },
        { word: 'Systemic', partOfSpeech: 'academic', meaning: 'Relating to or affecting an entire system rather than individual parts', phonetic: '/sɪˈstem.ɪk/', example: 'We must address systemic inefficiencies across global supply chains.', collocations: ['systemic risk', 'systemic reform'], synonyms: ['pervasive', 'structural'] },
        { word: 'Pragmatic', partOfSpeech: 'academic', meaning: 'Dealing with things sensibly and realistically based on practical considerations', phonetic: '/præɡˈmæt.ɪk/', example: 'A pragmatic compromise was negotiated between international delegates.', collocations: ['pragmatic approach', 'pragmatic solution'], synonyms: ['practical', 'realistic'] },
        { word: 'Synthesis', partOfSpeech: 'academic', meaning: 'The combination of ideas to form a theory or system', phonetic: '/ˈsɪn.θə.sɪs/', example: 'Her research provides a brilliant synthesis of economics and behavioral psychology.', collocations: ['synthesis of data', 'creative synthesis'], synonyms: ['fusion', 'amalgamation'] },
        { word: 'Intrinsic', partOfSpeech: 'academic', meaning: 'Belonging naturally; essential', phonetic: '/ɪnˈtrɪn.zɪk/', example: 'Curiosity is intrinsic to academic achievement.', collocations: ['intrinsic value', 'intrinsic motivation'], synonyms: ['inherent', 'essential'] }
      ],
      advancedIdioms: [
        { idiom: 'Raise the bar', meaning: 'To elevate standards or expectations', example: 'Their research paper raised the bar for methodological rigor.', practiceQuestion: 'What does raising the bar imply?', practiceAnswer: 'Setting a higher standard for quality or performance.' },
        { idiom: 'Think outside the box', meaning: 'To think creatively from new perspectives', example: 'Solving climate challenges demands thinking outside the box.', practiceQuestion: 'Why is thinking outside the box vital in leadership?', practiceAnswer: 'It generates innovative solutions to complex problems.' },
        { idiom: 'In a nutshell', meaning: 'To express something in very few words', example: 'In a nutshell, the proposed policy accelerates economic growth.', practiceQuestion: 'What does "in a nutshell" signal?', practiceAnswer: 'A concise executive summary.' },
        { idiom: 'Boil down to', meaning: 'To be the main or fundamental point of something', example: 'The negotiation boils down to mutual trust and asset valuation.', practiceQuestion: 'What does a complex issue boil down to?', practiceAnswer: 'Its core essential element.' },
        { idiom: 'Cross that bridge when we come to it', meaning: 'To deal with a problem only if and when it happens', example: 'We will cross that bridge when we come to it regarding secondary licensing.', practiceQuestion: 'When do you use this idiom?', practiceAnswer: 'When avoiding unnecessary premature worry about future uncertainties.' }
      ],
      presentationPractice: {
        topic: `Deliver a 2-minute executive brief on strategic innovations in ${category}.`,
        duration: '2 Minutes',
        outlinePoints: [
          'Introduction: Define the current landscape and systemic challenges.',
          'Core Analysis: Present empirical data and synthesis of perspectives.',
          'Conclusion & Call to Action: Outline pragmatic next steps.'
        ]
      },
      criticalAnalysis: {
        title: `Evaluating Policy Frameworks in ${category}`,
        articleExcerpt: `Scholars argue that rapid developments in ${category.toLowerCase()} necessitate an intrinsic re-evaluation of classic regulatory paradigms. Empirical models demonstrate both risks and unprecedented potential.`,
        analysisQuestions: [
          'What are the primary assumptions underlying this excerpt?',
          'Formulate a pragmatic recommendation for industry stakeholders.'
        ]
      },
      conversation: [
        { speaker: 'Alex (Corporate Lead)', text: `Welcome to Advanced Topic ${topicNumber}. Today we delve into strategic frameworks in ${category}. What empirical trends have you observed?` },
        { speaker: 'Learner', text: 'Recent data suggests a systemic shift toward pragmatic, evidence-based decision making.' },
        { speaker: 'Alex (Corporate Lead)', text: 'Magnificent synthesis of academic terms! Let’s proceed to your 2-minute executive presentation practice.' }
      ],
      pronunciationSentences: [
        'Pragmatic solutions based on empirical data raise the bar for excellence.',
        'In a nutshell, systemic reform requires a creative synthesis of ideas.',
        'We will cross that bridge when we come to it, focusing on intrinsic priorities.'
      ],
      exercises: [
        {
          id: `adv_ex_${topicNumber}_1`,
          type: 'mcq',
          question: 'Which word means "based on observation or experience rather than pure theory"?',
          options: ['Empirical', 'Systemic', 'Pragmatic', 'Intrinsic'],
          correctAnswer: 'Empirical',
          explanation: 'Empirical evidence is gathered through direct observation, experiment, and measurement.'
        }
      ]
    }
  };
});
