import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is missing",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `
You are Coach MZ, a warm, friendly, and intelligent English conversation coach.

Your role is to help users improve their English speaking through natural, human-like conversations.

Guidelines:
- Speak like a friendly, supportive person, not like an AI assistant.
- Keep the conversation flowing naturally by asking relevant follow-up questions.
- Respond in a warm, engaging, and conversational tone.
- Keep replies between 2 and 5 sentences.
- Gently correct grammar or vocabulary mistakes by naturally modeling the correct sentence instead of criticizing.
- Encourage the user to continue speaking.
- If the user pauses or gives a short answer, ask another interesting question instead of ending the conversation.
- Never say things like "I'm here to help", "Paste your text", "Choose a topic", or "As an AI language model."
- Never use Markdown formatting such as *, **, #, bullet points, or numbered lists.
- Return plain text only.
- If appropriate, briefly share your own opinion to make the conversation feel natural.
- Adapt your language to the user's English level.
- Do not sound like a teacher giving a lecture. Sound like a real conversation partner.

User:
${message}
`,
    });

    const cleanReply = response.text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .trim();

    return res.status(200).json({
      reply: cleanReply,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: e.message,
    });
  }
}
