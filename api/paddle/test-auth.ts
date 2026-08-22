export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  try {
    const response = await fetch('https://api.paddle.com/event-types', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
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
      hasApiKey: Boolean(process.env.PADDLE_API_KEY),
      startsWithLiveApiKey: process.env.PADDLE_API_KEY?.startsWith('pdl_live_apikey_'),
      keyLength: process.env.PADDLE_API_KEY?.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'Diagnostic request failed',
      hasApiKey: Boolean(process.env.PADDLE_API_KEY),
      startsWithLiveApiKey: process.env.PADDLE_API_KEY?.startsWith('pdl_live_apikey_'),
      keyLength: process.env.PADDLE_API_KEY?.length,
    });
  }
}
