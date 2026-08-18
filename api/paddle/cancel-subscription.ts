import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import { getSanitizedPaddleApiKey, isPaddleSandbox } from './_utils';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { subscriptionId } = body;
    const apiKey = getSanitizedPaddleApiKey();
    const isSandbox = isPaddleSandbox();

    if (apiKey && subscriptionId) {
      try {
        const env = isSandbox ? Environment.sandbox : Environment.production;
        const paddle = new Paddle(apiKey, { environment: env });
        const sub = await paddle.subscriptions.cancel(subscriptionId, { effectiveFrom: 'next_billing_period' });
        return res.status(200).json({ success: true, status: sub.status });
      } catch (err: any) {
        console.warn('[PADDLE] Cancel subscription SDK error:', err.message);
        return res.status(400).json({ success: false, error: err.message });
      }
    }

    return res.status(200).json({ success: true, status: 'canceled' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
