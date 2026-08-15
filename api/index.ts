export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    message: 'Speak with MZ Serverless API is operational',
    endpoints: [
      '/api/paddle/create-checkout-session',
      '/api/paddle/verify-transaction',
      '/api/paddle/webhook',
      '/api/paddle/cancel-subscription',
      '/api/paddle/refund',
      '/api/gemini/chat',
      '/api/gemini/evaluate-session',
      '/api/gemini/vocabulary',
      '/api/gemini/support-chat',
      '/api/elevenlabs/tts',
      '/api/health'
    ],
    timestamp: new Date().toISOString()
  });
}
