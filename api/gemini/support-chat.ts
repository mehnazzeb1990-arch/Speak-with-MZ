import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { message, category = 'all' } = body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    let replyText = '';

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
        const systemInstruction = `
You are the official 24/7 AI Customer Support Assistant for "Speak with MZ", a premier AI-powered English speaking partner application.
Your role is to help users with:
1. Account setup (Registration, Login, Password Reset, Profile Settings)
2. Speaking practice (Speaking Studio, Scenarios, Speech Analysis, Fluency Scoring)
3. AI features (Gemini AI partner, ElevenLabs TTS voice synthesis, Grammar feedback, Vocabulary Vault)
4. Subscription plans & Billing (Free Beginner 200 min/mo, Intermediate Plan $10/mo or PKR 2,800/mo, Advanced Plan $15/mo or PKR 4,200/mo, 14-day 100% refund policy, Payment methods: Visa, Mastercard, Debit Cards, Credit Cards)
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
        console.warn('Gemini support chat error in serverless, using fallback');
      }
    }

    if (!replyText) {
      replyText = `Thank you for your question about Speak with MZ! I am your AI Support Assistant. Speak with MZ offers AI-powered English speaking practice, real-time grammar feedback, and custom vocabulary modules. For specific billing or account issues, you can also leave a message for our support team who respond within 2 hours!`;
    }

    return res.status(200).json({ reply: replyText, timestamp: new Date().toISOString() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
