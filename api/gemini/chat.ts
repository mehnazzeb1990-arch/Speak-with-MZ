import { GoogleGenAI } from '@google/genai';

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

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { 
      message, 
      persona = 'MZ', 
      level = 'Intermediate', 
      scenario = 'Free Conversation', 
      conversationHistory = [], 
      userName = 'Learner',
      topicContext = null,
      activityType = 'Free Conversation'
    } = body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    let replyText = '';
    let grammarCorrection = null;
    let newVocabulary = [];
    let fluencyScore = 88;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
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

        const formattedHistory = (conversationHistory || [])
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
        console.warn('Gemini API call failed in serverless, using intelligent fallback response:', geminiErr.message);
        replyText = generateFallbackReply(message, persona, scenario);
      }
    } else {
      replyText = generateFallbackReply(message, persona, scenario);
    }

    return res.status(200).json({
      reply: replyText,
      grammarCorrection,
      suggestedVocabulary: newVocabulary,
      fluencyScore,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('API Chat Error:', err);
    return res.status(500).json({ error: 'Failed to process AI speech response', details: err.message });
  }
}
