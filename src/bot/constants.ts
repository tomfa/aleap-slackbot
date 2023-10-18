export const token = process.env.SLACK_BOT_TOKEN as string;
export const signingSecret = process.env.SLACK_SIGNING_SECRET;
export const verificationToken: string = process.env
  .SLACK_VERIFICATION_TOKEN as string;

const allowedToken = process.env.WEBHOOK_TOKEN as string;
export const defaultChannel = process.env.SLACK_WEBHOOK_CHANNEL || '#random';
export const allowedTokens = [allowedToken];

if (!allowedToken) {
  throw new Error('Missing WEBHOOK_TOKEN');
}
if (!token) {
  throw new Error('Missing SLACK_BOT_TOKEN');
}
if (!verificationToken) {
  throw new Error('Missing SLACK_VERIFICATION_TOKEN');
}
const ensureProtocol = (val: string) => {
  if (val.startsWith('http')) {
    return val;
  }
  return `https://${val}`;
};
export const domainUrl = ensureProtocol(
  process.env.DOMAIN_URL || process.env.VERCEL_URL || 'http://localhost:3000',
);

export const workerToken = process.env.WORKER_TOKEN || verificationToken;

export const colors = {
  HAPPY: '#167716',
  SAD: '#861818',
  NEUTRAL: '#2a2aa8',
  GREEN: '#167716',
  RED: '#861818',
  BLUE: '#2a2aa8',
} as const;

export const hasRedis =
  !!process.env.KV_REST_API_TOKEN && !!process.env.KV_REST_API_URL;

if (!hasRedis) {
  console.warn(
    'Missing KV_REST_API_TOKEN or KV_REST_API_URL.' +
      'Will not cache responses from Slack. This may result in rate limiting.',
  );
}
