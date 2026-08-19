import { Environment, Paddle } from '@paddle/paddle-node-sdk';

/**
 * Shared Paddle API Key Sanitizer
 * Ensures the API key passed to @paddle/paddle-node-sdk is in clean raw token format.
 * Strips accidental wrapping quotes, redundant "Bearer " prefixes, and non-printable characters.
 */
function getSanitizedPaddleApiKey(): string {
  let key = (process.env.PADDLE_API_KEY || '').trim();

  // If empty or placeholder
  if (!key || key === 'MY_PADDLE_API_KEY') {
    return '';
  }

  // Strip wrapping quotes (single or double) if present in env var
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }

  // Strip redundant "Bearer " prefix if accidentally included in Vercel UI
  if (key.toLowerCase().startsWith('bearer ')) {
    key = key.slice(7).trim();
  }

  // Remove any remaining control characters or newlines
  key = key.replace(/[\r\n\t]/g, '').trim();

  return key;
}

function isPaddleSandbox(): boolean {
  const envStr = (process.env.PADDLE_ENVIRONMENT || '').trim().toLowerCase();
  return envStr === 'sandbox';
}

function parseRequestBody(req: any): any {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(req: any, res: any) {
  // Always respond with JSON and CORS headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed. Please use POST.`,
    });
  }

  console.log('[PADDLE] create-checkout-session START');
  console.log(`[PADDLE] request received: ${req.method} ${req.url || '/api/paddle/create-checkout-session'}`);

  try {
    const body = parseRequestBody(req);
    const { plan, currency = 'USD', userEmail = '', userId = '' } = body;

    // Validate plan
    if (!plan || (plan !== 'intermediate_premium' && plan !== 'advanced_premium')) {
      console.warn(`[PADDLE] Invalid plan requested: ${plan}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription plan. Expected intermediate_premium or advanced_premium',
      });
    }

    const isAdvanced = plan === 'advanced_premium';
    const isPKR = currency === 'PKR';
    const amountStr = isPKR ? (isAdvanced ? '4200' : '2800') : (isAdvanced ? '1500' : '1000');
    const currencyCode = isPKR ? 'PKR' : 'USD';
    const planName = isAdvanced ? 'Speak with MZ - Advanced Premium Plan' : 'Speak with MZ - Intermediate Premium Plan';

    const isSandbox = isPaddleSandbox();
    const envMode = isSandbox ? 'sandbox' : 'production';

    const apiKey = getSanitizedPaddleApiKey();
    const hasApiKey = Boolean(apiKey);

    // STEP 4 - Safe diagnostic logging immediately before the Paddle request (NEVER log the key)
    const diagnostics = {
      hasApiKey: Boolean(apiKey),
      startsWithPdl: apiKey.startsWith('pdl_'),
      startsWithLiveApiKey: apiKey.startsWith('pdl_live_apikey_'),
      keyLength: apiKey.length,
      environment: process.env.PADDLE_ENVIRONMENT || 'production',
      authenticationMethod: 'Paddle SDK (native)',
    };
    console.log('[PADDLE] DIAGNOSTICS:', JSON.stringify(diagnostics));

    const intermediatePrice = (
      process.env.PADDLE_PRICE_INTERMEDIATE ||
      process.env.NEXT_PUBLIC_PADDLE_PRICE_INTERMEDIATE ||
      process.env.VITE_PADDLE_PRICE_INTERMEDIATE ||
      ''
    ).trim();

    const advancedPrice = (
      process.env.PADDLE_PRICE_ADVANCED ||
      process.env.NEXT_PUBLIC_PADDLE_PRICE_ADVANCED ||
      process.env.VITE_PADDLE_PRICE_ADVANCED ||
      ''
    ).trim();

    // Isolated price selection based strictly on requested plan
    const selectedPriceId = isAdvanced ? advancedPrice : intermediatePrice;

    console.log(`[PADDLE] plan = ${plan}`);
    console.log(`[PADDLE] currency = ${currency}`);
    console.log(`[PADDLE] selected price configured = ${Boolean(selectedPriceId)}`);

    const clientToken = (
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ||
      process.env.VITE_PADDLE_CLIENT_TOKEN ||
      process.env.PADDLE_CLIENT_TOKEN ||
      ''
    ).trim();

    if (!hasApiKey) {
      console.error('[PADDLE] API key missing or invalid on server');
      return res.status(500).json({
        success: false,
        error: 'Paddle API key is not configured on the server. Please set PADDLE_API_KEY in environment variables.',
        details: 'PADDLE_API_KEY missing in environment variables',
      });
    }

    // Initialize official Paddle Node SDK with clean raw API key.
    // NOTE: SDK itself creates Authorization: `bearer ${apiKey}`. We do NOT pass duplicate customHeaders.
    console.log('[PADDLE] creating Paddle transaction via SDK');
    try {
      const env = isSandbox ? Environment.sandbox : Environment.production;
      const paddle = new Paddle(apiKey, {
        environment: env,
      });

      let transaction: any;
      if (selectedPriceId) {
        transaction = await paddle.transactions.create({
          items: [{ priceId: selectedPriceId, quantity: 1 }],
          customData: {
            userId: String(userId || ''),
            plan: String(plan || ''),
            userEmail: String(userEmail || ''),
          },
        });
      } else {
        console.warn(`[PADDLE] Price ID not found in environment for plan: ${plan}. Using custom dynamic price creation.`);
        transaction = await paddle.transactions.create({
          items: [
            {
              quantity: 1,
              price: {
                description: '24/7 Unlimited AI English Partner, Grammar Doctor & Pronunciation Analysis',
                name: planName,
                unitPrice: {
                  amount: amountStr,
                  currencyCode: currencyCode as any,
                },
                product: {
                  name: planName,
                  taxCategory: 'standard' as any,
                },
              },
            },
          ],
          customData: {
            userId: String(userId || ''),
            plan: String(plan || ''),
            userEmail: String(userEmail || ''),
          },
        });
      }

      console.log(`[PADDLE] Paddle transaction created = ${transaction.id}`);
      const checkoutUrl = transaction.checkout?.url || `https://${isSandbox ? 'sandbox-' : ''}checkout.paddle.com/checkout/custom/${transaction.id}`;
      console.log(`[PADDLE] checkout URL available = ${Boolean(checkoutUrl)}`);
      console.log('[PADDLE] create-checkout-session SUCCESS');

      return res.status(200).json({
        success: true,
        transactionId: transaction.id,
        status: transaction.status,
        checkoutUrl,
        clientToken,
        environment: envMode,
      });
    } catch (sdkErr: any) {
      console.error('[PADDLE] Paddle API ERROR:', {
        name: sdkErr.name,
        message: sdkErr.message,
        code: sdkErr.code,
        detail: sdkErr.detail,
      });

      return res.status(400).json({
        success: false,
        error: sdkErr.message || 'Paddle transaction creation failed',
        details: sdkErr.detail || sdkErr.code || undefined,
      });
    }
  } catch (outerErr: any) {
    console.error('[PADDLE] Unhandled exception in create-checkout-session:', outerErr);
    return res.status(500).json({
      success: false,
      error: outerErr.message || 'Internal server error creating Paddle checkout session',
    });
  }
}
