import { Environment, Paddle } from '@paddle/paddle-node-sdk';

function getSanitizedPaddleApiKey(): string {
  let key = (process.env.PADDLE_API_KEY || '').trim();
  if (!key || key === 'MY_PADDLE_API_KEY') return '';
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  if (key.toLowerCase().startsWith('bearer ')) {
    key = key.slice(7).trim();
  }
  key = key.replace(/[\r\n\t]/g, '').trim();
  return key;
}

function isPaddleSandbox(): boolean {
  return (process.env.PADDLE_ENVIRONMENT || '').trim().toLowerCase() === 'sandbox';
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  // Support transaction ID via query parameter, url path, or body
  let transactionId = req.query?.transactionId || '';
  if (!transactionId && req.body) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
    transactionId = body.transactionId || '';
  }
  if (!transactionId && req.url) {
    const match = req.url.match(/verify-transaction\/([^/?]+)/);
    if (match) {
      transactionId = match[1];
    }
  }

  if (!transactionId) {
    return res.status(400).json({
      verified: false,
      error: 'Transaction ID is required for verification.',
    });
  }

  console.log(`[PADDLE] Verifying transaction ID: ${transactionId}`);

  const apiKey = getSanitizedPaddleApiKey();
  const isSandbox = isPaddleSandbox();

  if (!apiKey) {
    console.error('[PADDLE] API key missing for verification');
    return res.status(500).json({
      verified: false,
      error: 'Paddle API key is not configured on the server.',
    });
  }

  try {
    const env = isSandbox ? Environment.sandbox : Environment.production;
    const paddle = new Paddle(apiKey, { environment: env });

    const transaction = await paddle.transactions.get(transactionId);
    const isPaid = transaction.status === 'completed' || transaction.status === 'paid';
    
    // Determine plan from transaction customData or price ID match
    const intermediatePrice = (process.env.PADDLE_PRICE_INTERMEDIATE || '').trim();
    const advancedPrice = (process.env.PADDLE_PRICE_ADVANCED || '').trim();
    
    let resolvedPlan = (transaction.customData as any)?.plan;
    if (!resolvedPlan && transaction.items && transaction.items.length > 0) {
      const priceId = (transaction.items[0] as any)?.price?.id || (transaction.items[0] as any)?.priceId;
      if (priceId && advancedPrice && priceId === advancedPrice) {
        resolvedPlan = 'advanced_premium';
      } else if (priceId && intermediatePrice && priceId === intermediatePrice) {
        resolvedPlan = 'intermediate_premium';
      }
    }
    if (!resolvedPlan) {
      resolvedPlan = 'intermediate_premium';
    }

    console.log(`[PADDLE] Verification result for ${transactionId}: status=${transaction.status}, verified=${isPaid}, plan=${resolvedPlan}`);

    return res.status(200).json({
      status: transaction.status,
      verified: isPaid,
      plan: resolvedPlan,
      transactionId: transaction.id,
      customerEmail: (transaction as any).customer?.email || (transaction.customData as any)?.userEmail || null,
      subscriptionId: (transaction as any).subscriptionId || null,
    });
  } catch (sdkErr: any) {
    console.warn('[PADDLE] SDK verify error:', sdkErr.message);

    return res.status(400).json({
      verified: false,
      error: sdkErr.message || 'Transaction verification failed.',
    });
  }
}
