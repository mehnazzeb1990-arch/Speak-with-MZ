import { Environment, Paddle } from '@paddle/paddle-node-sdk';

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

    const rawEnv = (process.env.PADDLE_ENVIRONMENT || '').trim().toLowerCase();
    const isSandbox = rawEnv === 'sandbox';
    const envMode = isSandbox ? 'sandbox' : 'production';

    const apiKey = (process.env.PADDLE_API_KEY || '').trim();
    const hasApiKey = Boolean(apiKey && apiKey !== '' && apiKey !== 'MY_PADDLE_API_KEY');

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

    // Safe diagnostic logging (NO secrets or tokens logged)
    console.log(`[PADDLE] plan = ${plan}`);
    console.log(`[PADDLE] currency = ${currency}`);
    console.log(`[PADDLE] API key configured = ${hasApiKey}`);
    console.log(`[PADDLE] intermediate price configured = ${Boolean(intermediatePrice)}`);
    console.log(`[PADDLE] advanced price configured = ${Boolean(advancedPrice)}`);
    console.log(`[PADDLE] selected price configured = ${Boolean(selectedPriceId)}`);
    console.log(`[PADDLE] environment = ${envMode}`);

    const clientToken = (
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ||
      process.env.VITE_PADDLE_CLIENT_TOKEN ||
      process.env.PADDLE_CLIENT_TOKEN ||
      ''
    ).trim();

    if (!hasApiKey) {
      console.error('[PADDLE] API key missing on server');
      return res.status(500).json({
        success: false,
        error: 'Paddle API key is not configured on the server. Please set PADDLE_API_KEY in environment variables.',
        details: 'PADDLE_API_KEY missing in environment variables',
      });
    }

    // 1. Initialize Paddle Node SDK
    console.log('[PADDLE] creating Paddle transaction');
    try {
      const env = isSandbox ? Environment.sandbox : Environment.production;
      const paddle = new Paddle(apiKey, { environment: env });

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

      // Attempt Direct REST Fallback if SDK had an unexpected serialization issue
      try {
        const baseUrl = isSandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';
        console.log(`[PADDLE REST] Attempting fallback REST call at ${baseUrl}/transactions`);

        const requestPayload: any = selectedPriceId
          ? {
              items: [{ price_id: selectedPriceId, quantity: 1 }],
              custom_data: { userId: String(userId || ''), plan: String(plan || '') },
            }
          : {
              items: [
                {
                  quantity: 1,
                  price: {
                    name: planName,
                    unit_price: { amount: amountStr, currency_code: currencyCode },
                    product_id: isAdvanced ? 'pro_01' : 'pro_01',
                  },
                },
              ],
              custom_data: { userId: String(userId || ''), plan: String(plan || '') },
            };

        const paddleRes = await fetch(`${baseUrl}/transactions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload),
        });

        if (paddleRes.ok) {
          const restData = await paddleRes.json();
          const txnId = restData.data?.id;
          const checkoutUrl = restData.data?.checkout?.url || `https://${isSandbox ? 'sandbox-' : ''}checkout.paddle.com/checkout/custom/${txnId}`;
          console.log(`[PADDLE REST] Fallback transaction created = ${txnId}`);
          return res.status(200).json({
            success: true,
            transactionId: txnId,
            status: restData.data?.status,
            checkoutUrl,
            clientToken,
            environment: envMode,
          });
        }
      } catch (restErr) {
        console.warn('[PADDLE REST] Fallback also failed:', restErr);
      }

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
