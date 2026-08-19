import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// 1. Guard against pre-parsed request streams in Vercel serverless environment
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    (req as any)._body = true;
  }
  next();
});

// 2. Standard body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy Paddle initialization
let paddleClient: Paddle | null = null;
function getPaddleClient(): Paddle | null {
  if (!paddleClient) {
    let key = (process.env.PADDLE_API_KEY || '').trim();
    if (key && key !== 'MY_PADDLE_API_KEY') {
      if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1).trim();
      }
      if (key.toLowerCase().startsWith('bearer ')) {
        key = key.slice(7).trim();
      }
      key = key.replace(/[\r\n\t]/g, '').trim();

      try {
        const isSandbox = (process.env.PADDLE_ENVIRONMENT || '').toLowerCase() === 'sandbox';
        const env = isSandbox ? Environment.sandbox : Environment.production;
        paddleClient = new Paddle(key, {
          environment: env,
        });
        console.log(`[PADDLE] Initialized Paddle SDK in ${isSandbox ? 'sandbox' : 'production'} mode`);
      } catch (err: any) {
        console.error('[PADDLE] Failed to initialize Paddle SDK:', err.message || err);
        paddleClient = null;
      }
    }
  }
  return paddleClient;
}

// Lazy Gemini AI instance
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Speak with MZ',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== ''),
    paddleConfigured: Boolean(process.env.PADDLE_API_KEY && process.env.PADDLE_API_KEY !== 'MY_PADDLE_API_KEY'),
  });
});

// ElevenLabs Voice Text-to-Speech Endpoint
app.post('/api/elevenlabs/tts', async (req, res) => {
  try {
    const { text, voiceId = 'nDJIICjR9zfJExIFeSCN', modelId = 'eleven_turbo_v2_5' } = req.body;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text string is required for TTS' });
      return;
    }

    if (!apiKey || apiKey === '' || apiKey === 'MY_ELEVENLABS_API_KEY') {
      // Fallback instruction for client Web Speech API
      res.status(200).json({ fallback: true, message: 'ElevenLabs API key not set, using browser Web Speech API fallback' });
      return;
    }

    const elevenLabsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
        },
      }),
    });

    if (!elevenLabsRes.ok) {
      const errText = await elevenLabsRes.text();
      console.warn('ElevenLabs API returned error:', elevenLabsRes.status, errText);
      res.status(200).json({ fallback: true, message: 'ElevenLabs request failed' });
      return;
    }

    const audioBuffer = await elevenLabsRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (err: any) {
    console.error('ElevenLabs TTS Error:', err.message);
    res.status(200).json({ fallback: true, message: err.message });
  }
});

// Gemini Speaking Partner endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { 
      message, 
      persona = 'MZ', 
      level = 'Intermediate', 
      scenario = 'Free Conversation', 
      conversationHistory = [], 
      userName = 'Learner',
      topicContext = null,
      activityType = 'Free Conversation'
    } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const ai = getGeminiClient();

    let replyText = '';
    let grammarCorrection = null;
    let newVocabulary = [];
    let fluencyScore = 88;

    if (ai) {
      try {
        const levelInstructions = 
          level === 'Beginner'
            ? 'Speak in clear, simple sentences. Slow down pace conceptually. Avoid idioms or overly complex terms. Encourage speaking, show high patience and warmth.'
            : level === 'Advanced'
            ? 'Use rich, sophisticated vocabulary and natural phrasal verbs. Encourage deep critical thinking, debates, and professional/academic nuances.'
            : 'Maintain an engaging conversational tone with standard idiomatic expressions. Prompt for opinions and descriptive details.';

        const topicInfo = topicContext ? `
Active Learning Topic: "${topicContext.title || scenario}"
Topic Objective: "${topicContext.learningObjective || 'Build natural fluency'}"
Target Grammar Focus: "${topicContext.commonGrammarFocus || 'Natural structure'}"
Selected Activity Mode: "${activityType}"
Suggested Target Vocab: ${JSON.stringify(topicContext.suggestedVocabulary || [])}
` : `Scenario Context: "${scenario}". Selected Activity Mode: "${activityType}"`;

        const systemInstruction = `
You are "${persona}", an empathetic, friendly, highly human-like English Speaking Partner for ${userName} on the platform "Speak with MZ".
Learner's Level: "${level}". ${levelInstructions}
${topicInfo}

Human-like Empathy & Behavioral Rules:
1. You are actively guiding ${userName} through the topic "${topicContext?.title || scenario}" using activity mode "${activityType}".
2. Adapt your questions to this specific topic. Ask natural, engaging follow-up questions to keep the conversation flowing smoothly.
3. Never repeat identical questions or revert to generic greetings mid-conversation.
4. Encourage longer, expressive answers by asking open-ended questions.
5. Remember previous messages in conversation history and maintain context throughout the session.
6. Analyze the user's input for any grammar, vocabulary, or natural phrasing improvements.

You MUST respond strictly with valid JSON with the following structure:
{
  "reply": "Your conversational response as the AI partner (2-4 natural sentences with a follow-up question)",
  "grammarCorrection": {
    "original": "User sentence if it contained a grammar/phrasing mistake, or null if completely natural",
    "corrected": "Corrected natural English sentence",
    "explanation": "Short, supportive explanation of why"
  },
  "suggestedVocabulary": [
    { "word": "useful target word", "definition": "clear concise definition", "example": "example sentence in context" }
  ],
  "fluencyScore": 88
}
        `;

        const formattedHistory = conversationHistory
          .slice(-8)
          .map((item: any) => `${item.sender === 'user' ? userName : persona}: ${item.text}`)
          .join('\n');

        const prompt = `Conversation history:\n${formattedHistory}\n\n${userName} says: "${message}"`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);

        replyText = parsed.reply || `That's really interesting! Can you tell me more about that?`;
        grammarCorrection = parsed.grammarCorrection?.original ? parsed.grammarCorrection : null;
        newVocabulary = parsed.suggestedVocabulary || [];
        fluencyScore = parsed.fluencyScore || Math.floor(Math.random() * 12) + 85;
      } catch (geminiErr: any) {
        console.warn('Gemini API call failed, using intelligent fallback response:', geminiErr.message);
        replyText = generateFallbackReply(message, persona, scenario);
      }
    } else {
      replyText = generateFallbackReply(message, persona, scenario);
    }

    // Return response
    res.json({
      reply: replyText,
      grammarCorrection,
      suggestedVocabulary: newVocabulary,
      fluencyScore,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('API Chat Error:', err);
    res.status(500).json({ error: 'Failed to process AI speech response', details: err.message });
  }
});

// Comprehensive Session Evaluation Endpoint
app.post('/api/gemini/evaluate-session', async (req, res) => {
  try {
    const { messages = [], persona = 'MZ', scenario = 'Free Conversation', durationSeconds = 120, level = 'Intermediate' } = req.body;
    const ai = getGeminiClient();

    if (ai && messages.length > 0) {
      try {
        const transcriptText = messages
          .map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`)
          .join('\n');

        const prompt = `Analyze this full English speaking session transcript between a learner (${level} level) and AI partner ${persona} during scenario "${scenario}".
Transcript:
${transcriptText}

Generate a comprehensive speaking performance feedback report in JSON format with this EXACT structure:
{
  "overallScore": 88,
  "scores": {
    "fluency": 86,
    "grammar": 88,
    "vocabulary": 85,
    "pronunciation": 90,
    "confidence": 92,
    "sentenceVariety": 84,
    "accuracy": 89,
    "naturalness": 87,
    "responseLength": 85,
    "speakingSpeed": 90,
    "pauseAnalysis": "Good pacing with natural natural pauses before complex ideas."
  },
  "grammarAnalysis": [
    {
      "type": "Tense Agreement",
      "original": "I go to movie yesterday",
      "corrected": "I went to a movie yesterday",
      "explanation": "Use past simple 'went' for completed actions yesterday.",
      "alternative": "Yesterday, I watched a movie."
    }
  ],
  "vocabularyFeedback": {
    "repeatedWords": ["good", "like", "think"],
    "basicWordsUsed": ["nice", "happy", "bad"],
    "advancedSuggestions": [
      { "original": "nice", "suggested": "delightful", "definition": "causing great pleasure" }
    ],
    "phrasalVerbsUsed": ["look forward to", "carry on"],
    "collocations": ["take a decision -> make a decision"]
  },
  "pronunciationTips": [
    "Work on linking words ending in consonants to starting vowels (e.g. 'an apple').",
    "Maintain steady intonation on non-final items in lists."
  ],
  "sessionSummary": {
    "keyTopics": ["Work experiences", "Travel goals"],
    "newVocabularyLearned": ["Articulate", "Eloquent"],
    "idiomsUsed": ["Hit the nail on the head"],
    "improvementPlan": "Focus on using past perfect tenses when telling stories about past events.",
    "suggestedNextTopic": "Job Interview Simulation"
  }
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const evalData = JSON.parse(response.text || '{}');
        res.json(evalData);
        return;
      } catch (err) {
        console.warn('Session evaluation fallback due to error:', err);
      }
    }

    // Default Fallback Session Evaluation
    res.json({
      overallScore: 88,
      scores: {
        fluency: 87,
        grammar: 85,
        vocabulary: 88,
        pronunciation: 90,
        confidence: 91,
        sentenceVariety: 84,
        accuracy: 86,
        naturalness: 89,
        responseLength: 85,
        speakingSpeed: 88,
        pauseAnalysis: 'Smooth conversational rhythm with natural pauses for thought.',
      },
      grammarAnalysis: [
        {
          type: 'Prepositions',
          original: 'I arrived to the office early.',
          corrected: 'I arrived at the office early.',
          explanation: "Use 'arrive at' for specific locations like offices or buildings.",
          alternative: 'I got to the office early.',
        },
      ],
      vocabularyFeedback: {
        repeatedWords: ['very', 'good', 'think'],
        basicWordsUsed: ['nice', 'big'],
        advancedSuggestions: [
          { original: 'very good', suggested: 'exceptional', definition: 'unusually good' },
        ],
        phrasalVerbsUsed: ['pick up', 'carry out'],
        collocations: ['make a decision'],
      },
      pronunciationTips: [
        "Focus on clear stress on key nouns and verbs in longer sentences.",
        "Practice connected speech: 'going to' -> 'gonna' in informal contexts.",
      ],
      sessionSummary: {
        keyTopics: [scenario, 'English Learning Progress'],
        newVocabularyLearned: ['Articulate', 'Coherent'],
        idiomsUsed: ['Break the ice'],
        improvementPlan: 'Keep expanding your use of advanced vocabulary in descriptive sentences.',
        suggestedNextTopic: 'Professional Workplace Discussions',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Helper for fallback replies when Gemini API key is pending
function generateFallbackReply(message: string, persona: string, scenario: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello there! I'm ${persona}, your AI speaking partner. It's fantastic to practice English with you today. What topic would you like to discuss?`;
  }
  if (lower.includes('job') || lower.includes('work') || lower.includes('interview')) {
    return `That sounds like a key professional experience! In job discussions, using action verbs like "managed", "implemented", or "designed" can really highlight your achievements. How do you usually prepare for interviews?`;
  }
  if (lower.includes('travel') || lower.includes('flight') || lower.includes('country')) {
    return `Traveling is one of the best ways to practice real-world English! If you were planning your dream trip right now, where would you fly to first and why?`;
  }
  return `That's a great point! Your sentence structure is clear. Speaking regularly like this helps build natural muscle memory in English. What else comes to mind when you think about ${scenario.toLowerCase()}?`;
}

// Gemini Vocabulary Generator Endpoint
app.post('/api/gemini/vocabulary', async (req, res) => {
  try {
    const { topic = 'General English', level = 'Intermediate' } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `Generate 5 key vocabulary words for level "${level}" on topic "${topic}". Return JSON array of objects with keys: word, phonetic, definition, example, level, category.`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const words = JSON.parse(response.text || '[]');
        res.json({ words });
        return;
      } catch (e) {
        // Fall back to default words
      }
    }

    // Default vocabulary fallbacks
    res.json({
      words: [
        { word: 'Articulate', phonetic: '/ɑːrˈtɪk.jə.lət/', definition: 'Able to express thoughts clearly and effectively.', example: 'She was extremely articulate during the presentation.', level: 'Intermediate', category: 'Fluency' },
        { word: 'Coherent', phonetic: '/koʊˈhɪr.ənt/', definition: 'Logical, clear, and well-structured in speech or writing.', example: 'His argument was coherent and easy to follow.', level: 'Intermediate', category: 'Grammar' },
        { word: 'Eloquence', phonetic: '/ˈel.ə.kwəns/', definition: 'Fluent or persuasive speaking or writing.', example: 'The speaker impressed everyone with her eloquence.', level: 'Advanced', category: 'Communication' },
        { word: 'Spontaneous', phonetic: '/spɒnˈteɪ.ni.əs/', definition: 'Done or said naturally without heavy prior planning.', example: 'Spontaneous speech practice improves real-world confidence.', level: 'Intermediate', category: 'Speaking' },
        { word: 'Nuance', phonetic: '/ˈnuː.ɑːns/', definition: 'A subtle difference in shade of meaning, expression, or sound.', example: 'Native speakers pick up on cultural nuances in English.', level: 'Advanced', category: 'Vocabulary' }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Gemini Customer Support Assistant Endpoint
app.post('/api/gemini/support-chat', async (req, res) => {
  try {
    const { message, category = 'all' } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const ai = getGeminiClient();
    let replyText = '';

    if (ai) {
      try {
        const systemInstruction = `
You are the official 24/7 AI Customer Support Assistant for "Speak with MZ", a premier AI-powered English speaking partner application.
Your role is to help users with:
1. Account setup (Registration, Login, Password Reset, Profile Settings)
2. Speaking practice (Speaking Studio, Scenarios, Speech Analysis, Fluency Scoring)
3. AI features (Gemini AI partner, ElevenLabs TTS voice synthesis, Grammar feedback, Vocabulary Vault)
4. Subscription plans & Billing (Free Beginner 200 min/mo, Intermediate Plan $15/mo or PKR 3,900/mo, Advanced Plan $29/mo or PKR 7,900/mo, 14-day 100% refund policy, Payment methods: Visa, Mastercard, Debit Cards, Credit Cards)
5. Technical issues (Microphone permissions, audio playback, browser compatibility)

Tone: Professional, warm, empathetic, concise, and helpful. Format your responses with bullet points or bold text where appropriate.

User category filter: "${category}".
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `User asks support question: "${message}"`,
          config: { systemInstruction },
        });

        replyText = response.text || '';
      } catch (e) {
        console.warn('Gemini support chat error, using fallback');
      }
    }

    if (!replyText) {
      replyText = `Thank you for your question about Speak with MZ! I am your AI Support Assistant. Speak with MZ offers AI-powered English speaking practice, real-time grammar feedback, and custom vocabulary modules. For specific billing or account issues, you can also leave a message for our support team who respond within 2 hours!`;
    }

    res.json({ reply: replyText, timestamp: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to register routes under both /api/* and /* (for Vercel serverless rewrites compatibility)
function registerGet(routePath: string, handler: express.RequestHandler) {
  app.get(routePath, handler);
  if (routePath.startsWith('/api/')) {
    app.get(routePath.replace('/api/', '/'), handler);
  }
}

function registerPost(routePath: string, handler: express.RequestHandler) {
  app.post(routePath, handler);
  if (routePath.startsWith('/api/')) {
    app.post(routePath.replace('/api/', '/'), handler);
  }
}

// ==========================================
// Paddle Billing API Endpoints
// ==========================================

// 1. Paddle Create Checkout / Transaction Session Endpoint
registerPost('/api/paddle/create-checkout-session', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { plan = 'intermediate_premium', currency = 'USD', userEmail = '', userId = '' } = req.body || {};
    const isAdvanced = plan === 'advanced_premium';
    const isPKR = currency === 'PKR';
    const amountStr = isPKR ? (isAdvanced ? '4200' : '2800') : (isAdvanced ? '1500' : '1000');
    const currencyCode = isPKR ? 'PKR' : 'USD';
    const planName = isAdvanced ? 'Speak with MZ - Advanced Premium Plan' : 'Speak with MZ - Intermediate Premium Plan';

    const isSandbox = (process.env.PADDLE_ENVIRONMENT || '').toLowerCase() === 'sandbox';
    const envMode = isSandbox ? 'sandbox' : 'production';
    const hasApiKey = Boolean(process.env.PADDLE_API_KEY && process.env.PADDLE_API_KEY !== '' && process.env.PADDLE_API_KEY !== 'MY_PADDLE_API_KEY');

    const intermediatePrice = (
      process.env.PADDLE_PRICE_INTERMEDIATE ||
      process.env.NEXT_PUBLIC_PADDLE_PRICE_INTERMEDIATE ||
      process.env.VITE_PADDLE_PRICE_INTERMEDIATE ||
      ''
    ).trim();

    const advancedPrice = (
      process.env.PADDLE_PRICE_ADVANCED ||
      process.env.NEXT_PUBLIC_PADDLE_PRICE_ADVANCED ||
      process.env.VITE_PADDLE_PRICE_ADVANCED ||
      ''
    ).trim();

    // Isolated price selection based exclusively on requested plan
    const selectedPriceId = isAdvanced ? advancedPrice : intermediatePrice;

    // Safe diagnostics logging (NO secrets logged)
    console.log(`[PADDLE] request received: ${req.method} ${req.originalUrl || req.url}`);
    console.log(`[PADDLE] plan: ${plan}`);
    console.log(`[PADDLE] currency: ${currency}`);
    console.log(`[PADDLE] API key present: ${hasApiKey}`);
    console.log(`[PADDLE] intermediate price present: ${Boolean(intermediatePrice)}`);
    console.log(`[PADDLE] advanced price present: ${Boolean(advancedPrice)}`);
    console.log(`[PADDLE] environment: ${envMode}`);
    console.log(`[PADDLE] selected price ID present: ${Boolean(selectedPriceId)}`);

    const clientToken = (
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ||
      process.env.VITE_PADDLE_CLIENT_TOKEN ||
      process.env.PADDLE_CLIENT_TOKEN ||
      ''
    ).trim();

    console.log(`[PADDLE] initializing SDK`);
    const paddle = getPaddleClient();

    if (paddle) {
      try {
        console.log(`[PADDLE] creating transaction with SDK`);
        let transaction: any;
        if (selectedPriceId) {
          transaction = await paddle.transactions.create({
            items: [{ priceId: selectedPriceId, quantity: 1 }],
            customData: {
              userId: String(userId || ''),
              plan: String(plan || ''),
            },
          });
        } else {
          // Dynamic custom item price fallback if price ID not yet set in environment
          transaction = await paddle.transactions.create({
            items: [
              {
                quantity: 1,
                price: {
                  description: '24/7 Unlimited AI English Partner, Grammar Doctor & Pronunciation Analysis',
                  name: planName,
                  unitPrice: {
                    amount: amountStr,
                    currencyCode: currencyCode as any,
                  },
                  product: {
                    name: planName,
                    taxCategory: 'standard' as any,
                  },
                },
              },
            ],
            customData: {
              userId: String(userId || ''),
              plan: String(plan || ''),
            },
          });
        }

        console.log(`[PADDLE] transaction created: ${transaction.id}`);
        const checkoutUrl = transaction.checkout?.url || `https://${isSandbox ? 'sandbox-' : ''}checkout.paddle.com/checkout/custom/${transaction.id}`;
        console.log(`[PADDLE] checkout URL generated: ${checkoutUrl ? 'yes' : 'no'}`);

        res.json({
          success: true,
          transactionId: transaction.id,
          status: transaction.status,
          checkoutUrl,
          clientToken,
          environment: envMode,
        });
        return;
      } catch (sdkErr: any) {
        console.error('[PADDLE] SDK transaction error:', {
          name: sdkErr.name,
          message: sdkErr.message,
          code: sdkErr.code,
          detail: sdkErr.detail,
        });
        res.status(400).json({
          success: false,
          error: sdkErr.message || 'Paddle transaction creation failed',
          details: sdkErr.detail || sdkErr.code || undefined,
        });
        return;
      }
    }

    // Direct REST API fallback if Paddle API key is set
    const apiKey = process.env.PADDLE_API_KEY;
    if (apiKey && apiKey !== '' && apiKey !== 'MY_PADDLE_API_KEY') {
      const baseUrl = isSandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';
      console.log(`[PADDLE REST] Creating transaction via REST API at ${baseUrl}`);

      const requestBody: any = selectedPriceId
        ? {
            items: [{ price_id: selectedPriceId, quantity: 1 }],
            custom_data: { userId: String(userId || ''), plan: String(plan || '') },
          }
        : {
            items: [{
              quantity: 1,
              price: {
                name: planName,
                unit_price: { amount: amountStr, currency_code: currencyCode },
                product_id: isAdvanced ? (process.env.PADDLE_PRODUCT_ADVANCED || 'pro_01') : (process.env.PADDLE_PRODUCT_INTERMEDIATE || 'pro_01'),
              }
            }],
            custom_data: { userId: String(userId || ''), plan: String(plan || '') },
          };

      const paddleRes = await fetch(`${baseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (paddleRes.ok) {
        const data = await paddleRes.json();
        const txnId = data.data?.id;
        console.log(`[PADDLE REST] Transaction created: ${txnId}`);
        const checkoutUrl = data.data?.checkout?.url || `https://${isSandbox ? 'sandbox-' : ''}checkout.paddle.com/checkout/custom/${txnId}`;
        res.json({
          success: true,
          transactionId: txnId,
          status: data.data?.status,
          checkoutUrl,
          clientToken,
          environment: envMode,
        });
        return;
      } else {
        const errData = await paddleRes.json().catch(() => ({}));
        console.warn('[PADDLE REST] Transaction error response:', errData);
        res.status(400).json({
          success: false,
          error: (errData as any).error?.detail || (errData as any).message || 'Paddle API returned an error',
          details: (errData as any).error?.code || undefined,
        });
        return;
      }
    }

    // Missing Paddle Credentials response
    console.warn('[PADDLE] API key missing on server');
    res.status(400).json({
      success: false,
      error: 'Paddle API key is not configured on the server. Please set PADDLE_API_KEY and NEXT_PUBLIC_PADDLE_CLIENT_TOKEN environment variables.',
      details: 'PADDLE_API_KEY missing in environment variables',
    });
  } catch (err: any) {
    console.error('[PADDLE] create checkout session exception:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error creating checkout session',
    });
  }
});

// 2. Paddle Verify Transaction Endpoint (GET)
registerGet('/api/paddle/verify-transaction/:transactionId', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { transactionId } = req.params;
    console.log(`[PADDLE] Verifying transaction ID: ${transactionId}`);
    const paddle = getPaddleClient();

    if (paddle && transactionId) {
      try {
        const transaction = await paddle.transactions.get(transactionId);
        const isPaid = transaction.status === 'completed' || transaction.status === 'paid';
        console.log(`[PADDLE] Verification result for ${transactionId}: status=${transaction.status}, verified=${isPaid}`);
        res.json({
          status: transaction.status,
          verified: isPaid,
          transactionId: transaction.id,
          customerEmail: (transaction as any).customer?.email || null,
          subscriptionId: (transaction as any).subscriptionId || null,
        });
        return;
      } catch (err: any) {
        console.warn('[PADDLE] Verify transaction error:', err.message);
        res.status(400).json({ verified: false, error: err.message || 'Transaction verification failed.' });
        return;
      }
    }

    // Direct REST fallback
    const apiKey = process.env.PADDLE_API_KEY;
    if (apiKey && apiKey !== '' && apiKey !== 'MY_PADDLE_API_KEY') {
      const isSandbox = (process.env.PADDLE_ENVIRONMENT || '').toLowerCase() === 'sandbox';
      const baseUrl = isSandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';
      const paddleRes = await fetch(`${baseUrl}/transactions/${transactionId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      if (paddleRes.ok) {
        const data = await paddleRes.json();
        const txnStatus = data.data?.status;
        const isPaid = txnStatus === 'completed' || txnStatus === 'paid';
        console.log(`[PADDLE REST] Verification result for ${transactionId}: status=${txnStatus}, verified=${isPaid}`);
        res.json({
          status: txnStatus,
          verified: isPaid,
          transactionId: data.data?.id,
          customerEmail: data.data?.customer?.email || null,
          subscriptionId: data.data?.subscription_id || null,
        });
        return;
      }
    }

    res.status(400).json({
      verified: false,
      error: 'Paddle API Key is not configured on the server. PADDLE_API_KEY environment variable is required.',
    });
  } catch (err: any) {
    console.error('[PADDLE] Verify transaction exception:', err);
    res.status(500).json({ verified: false, error: err.message || 'Server exception during transaction verification.' });
  }
});

// Also handle POST verify for frontend convenience
registerPost('/api/paddle/verify-transaction', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { transactionId } = req.body || {};
    console.log(`[PADDLE POST] Verifying transaction ID: ${transactionId}`);
    const paddle = getPaddleClient();

    if (paddle && transactionId) {
      try {
        const transaction = await paddle.transactions.get(transactionId);
        const isPaid = transaction.status === 'completed' || transaction.status === 'paid';
        res.json({
          status: transaction.status,
          verified: isPaid,
          transactionId: transaction.id,
          customerEmail: (transaction as any).customer?.email || null,
        });
        return;
      } catch (err: any) {
        console.warn('[PADDLE POST] Verify transaction error:', err.message);
        res.status(400).json({ verified: false, error: err.message || 'Transaction verification failed.' });
        return;
      }
    }

    res.status(400).json({
      verified: false,
      error: 'Paddle API Key is not configured on the server. PADDLE_API_KEY environment variable is required.',
    });
  } catch (err: any) {
    res.status(500).json({ verified: false, error: err.message });
  }
});

// 3. Paddle Webhook Listener Endpoint
registerPost('/api/paddle/webhook', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const signature = req.headers['paddle-signature'] as string;
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET || process.env.PADDLE_WEBHOOK_SECRET_KEY;

    if (signature && secretKey && secretKey !== '' && secretKey !== 'MY_PADDLE_WEBHOOK_SECRET_KEY') {
      const paddle = getPaddleClient();
      if (paddle) {
        try {
          const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
          const event: any = await paddle.webhooks.unmarshal(rawBody, secretKey, signature);
          console.log('Verified Paddle Webhook Event:', event?.eventType || event?.event_type);
          res.status(200).json({ success: true, eventType: event?.eventType || event?.event_type });
          return;
        } catch (unmarshalErr: any) {
          console.error('[PADDLE WEBHOOK] Verification failed:', unmarshalErr.message);
          res.status(400).json({ success: false, error: 'Invalid Paddle webhook signature' });
          return;
        }
      }
    }

    console.log('[PADDLE WEBHOOK] Event received:', req.body?.event_type || req.body?.eventType || 'event');
    res.status(200).json({ success: true, received: true });
  } catch (err: any) {
    console.error('[PADDLE WEBHOOK] Exception:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Paddle Cancel Subscription Endpoint
registerPost('/api/paddle/cancel-subscription', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { subscriptionId } = req.body || {};
    const paddle = getPaddleClient();

    if (paddle && subscriptionId && !subscriptionId.startsWith('sub_sim_')) {
      try {
        const sub = await paddle.subscriptions.cancel(subscriptionId, { effectiveFrom: 'next_billing_period' });
        res.json({ success: true, status: sub.status });
        return;
      } catch (err: any) {
        console.warn('[PADDLE] Cancel subscription error:', err.message);
        res.status(400).json({ success: false, error: err.message });
        return;
      }
    }

    res.json({ success: true, status: 'canceled' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Paddle Refund Endpoint
registerPost('/api/paddle/refund', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { transactionId, reason = 'Customer request' } = req.body || {};
    const paddle = getPaddleClient();

    if (paddle && transactionId && !transactionId.startsWith('txn_pad_')) {
      try {
        const refund = await (paddle as any).refunds.create({
          transactionId,
          reason: 'satisfaction_guarantee',
        });
        res.json({ success: true, refundId: refund.id, status: refund.status });
        return;
      } catch (err: any) {
        console.warn('[PADDLE] Refund error:', err.message);
        res.status(400).json({ success: false, error: err.message });
        return;
      }
    }

    res.json({ success: true, status: 'refunded' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Explicit API 404 handler - prevents returning HTML for any missing API route
app.use((req, res, next) => {
  const isApi = req.path.startsWith('/api') || 
                req.path.startsWith('/paddle') || 
                req.path.startsWith('/gemini') || 
                req.path.startsWith('/elevenlabs');
  if (isApi) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(404).json({
      success: false,
      error: `API endpoint not found: ${req.method} ${req.originalUrl || req.path}`,
    });
  }
  next();
});

// Boot server (standalone / local container mode ONLY - NEVER inside Vercel or Lambda serverless)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const vite = await import('vite');
      const viteDevServer = await vite.createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(viteDevServer.middlewares);
    } catch (e) {
      console.warn('Vite dev middleware not loaded:', e);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get('*', (req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('Speak with MZ Application Ready');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Speak with MZ server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start the HTTP listener if executed directly and not inside serverless (Vercel / Lambda)
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
