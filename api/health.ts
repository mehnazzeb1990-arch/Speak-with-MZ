export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    appName: 'Speak with MZ',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== ''),
    paddleConfigured: Boolean(process.env.PADDLE_API_KEY && process.env.PADDLE_API_KEY !== 'MY_PADDLE_API_KEY'),
  });
}
