import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

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
  });
});

// Gemini Speaking Partner endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, persona = 'MZ', level = 'Intermediate', scenario = 'Free Conversation', conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const ai = getGeminiClient();

    let replyText = '';
    let grammarCorrection = null;
    let newVocabulary = [];
    let fluencyScore = 85;

    if (ai) {
      try {
        const systemInstruction = `
You are "${persona}", an encouraging, friendly, human-like English Speaking Partner on the platform "Speak with MZ".
The user's English level is "${level}". The context is "${scenario}".
Your goals:
1. Respond to the user's input naturally, warmly, and concisely (2 to 4 sentences). Keep the conversation engaging by asking a relevant open question.
2. Analyze the user's input for any grammar, vocabulary, or natural phrasing mistakes.
3. Provide constructive feedback in JSON output format.

You MUST respond strictly with valid JSON with the following structure:
{
  "reply": "Your conversational response as the AI partner",
  "grammarCorrection": {
    "original": "User sentence if it had an error, or null if correct",
    "corrected": "Corrected sentence",
    "explanation": "Short, friendly explanation of why"
  },
  "suggestedVocabulary": [
    { "word": "advanced/useful word related to conversation", "definition": "simple clear definition", "example": "usage example" }
  ],
  "fluencyScore": 88
}
        `;

        const formattedHistory = conversationHistory
          .slice(-6)
          .map((item: any) => `${item.sender === 'user' ? 'User' : persona}: ${item.text}`)
          .join('\n');

        const prompt = `Conversation history:\n${formattedHistory}\nUser says: "${message}"`;

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
        fluencyScore = parsed.fluencyScore || Math.floor(Math.random() * 15) + 80;
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

// Boot server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await import('vite');
    const viteDevServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(viteDevServer.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Speak with MZ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
