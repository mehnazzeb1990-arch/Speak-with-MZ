import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { topic = 'General English', level = 'Intermediate' } = body;
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `Generate 5 key vocabulary words for level "${level}" on topic "${topic}". Return JSON array of objects with keys: word, phonetic, definition, example, level, category.`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const words = JSON.parse(response.text || '[]');
        return res.status(200).json({ words });
      } catch (e) {
        // Fall back to default words
      }
    }

    return res.status(200).json({
      words: [
        { word: 'Articulate', phonetic: '/ɑːrˈtɪk.jə.lət/', definition: 'Able to express thoughts clearly and effectively.', example: 'She was extremely articulate during the presentation.', level: 'Intermediate', category: 'Fluency' },
        { word: 'Coherent', phonetic: '/koʊˈhɪr.ənt/', definition: 'Logical, clear, and well-structured in speech or writing.', example: 'His argument was coherent and easy to follow.', level: 'Intermediate', category: 'Grammar' },
        { word: 'Eloquence', phonetic: '/ˈel.ə.kwəns/', definition: 'Fluent or persuasive speaking or writing.', example: 'The speaker impressed everyone with her eloquence.', level: 'Advanced', category: 'Communication' },
        { word: 'Spontaneous', phonetic: '/spɒnˈteɪ.ni.əs/', definition: 'Done or said naturally without heavy prior planning.', example: 'Spontaneous speech practice improves real-world confidence.', level: 'Intermediate', category: 'Speaking' },
        { word: 'Nuance', phonetic: '/ˈnuː.ɑːns/', definition: 'A subtle difference in shade of meaning, expression, or sound.', example: 'Native speakers pick up on cultural nuances in English.', level: 'Advanced', category: 'Vocabulary' }
      ]
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
