import { Environment, Paddle } from '@paddle/paddle-node-sdk';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['paddle-signature'] || '';
    const secretKey = (process.env.PADDLE_WEBHOOK_SECRET_KEY || process.env.PADDLE_WEBHOOK_SECRET || '').trim();
    const apiKey = (process.env.PADDLE_API_KEY || '').trim();
    const isSandbox = (process.env.PADDLE_ENVIRONMENT || '').trim().toLowerCase() === 'sandbox';

    if (apiKey && secretKey && signature) {
      try {
        const env = isSandbox ? Environment.sandbox : Environment.production;
        const paddle = new Paddle(apiKey, { environment: env });
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        const event: any = await paddle.webhooks.unmarshal(rawBody, secretKey, signature as string);
        console.log('[PADDLE WEBHOOK] Verified event:', event?.eventType || event?.event_type);
        return res.status(200).json({ success: true, eventType: event?.eventType || event?.event_type });
      } catch (unmarshalErr: any) {
        console.warn('[PADDLE WEBHOOK] Signature validation warning:', unmarshalErr.message);
      }
    }

    console.log('[PADDLE WEBHOOK] Received webhook event payload');
    return res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (err: any) {
    console.error('[PADDLE WEBHOOK] Error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
