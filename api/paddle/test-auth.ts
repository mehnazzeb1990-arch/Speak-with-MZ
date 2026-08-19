export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  const rawApiKey = (process.env.PADDLE_API_KEY || '').trim();

  try {
    const response = await fetch('https://api.paddle.com/event-types', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${rawApiKey}`,
        'Paddle-Version': '1',
      },
    });

    let parsedResponse: any = null;
    try {
      parsedResponse = await response.json();
    } catch {
      parsedResponse = { error: 'Failed to parse JSON response from Paddle' };
    }

    return res.status(response.status).json({
      ok: response.ok,
      paddleStatus: response.status,
      paddleResponse: parsedResponse,
      hasApiKey: Boolean(rawApiKey),
      keyStartsCorrectly: rawApiKey.startsWith('pdl_live_apikey_'),
      keyLength: rawApiKey.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'Diagnostic request failed',
      hasApiKey: Boolean(rawApiKey),
      keyStartsCorrectly: rawApiKey.startsWith('pdl_live_apikey_'),
      keyLength: rawApiKey.length,
    });
  }
}
