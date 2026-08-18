/**
 * Shared Paddle API Key Sanitizer
 * Ensures the API key passed to @paddle/paddle-node-sdk is in clean raw token format.
 * Strips accidental wrapping quotes, redundant "Bearer " prefixes, and non-printable characters.
 */
export function getSanitizedPaddleApiKey(): string {
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

export function isPaddleSandbox(): boolean {
  const envStr = (process.env.PADDLE_ENVIRONMENT || '').trim().toLowerCase();
  return envStr === 'sandbox';
}
