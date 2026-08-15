export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { text, voiceId = 'nDJIICjR9zfJExIFeSCN', modelId = 'eleven_turbo_v2_5' } = body;
    const apiKey = (process.env.ELEVENLABS_API_KEY || '').trim();

    if (!text || typeof text !== 'string') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Text string is required for TTS' });
    }

    if (!apiKey || apiKey === '' || apiKey === 'MY_ELEVENLABS_API_KEY') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ fallback: true, message: 'ElevenLabs API key not set, using browser Web Speech API fallback' });
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
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ fallback: true, message: 'ElevenLabs request failed' });
    }

    const audioBuffer = await elevenLabsRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (err: any) {
    console.error('ElevenLabs TTS Error:', err.message);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ fallback: true, message: err.message });
  }
}
