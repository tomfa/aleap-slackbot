import { Redis } from '@upstash/redis';

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

export const hasRedis =
  !!process.env.KV_REST_API_TOKEN && !!process.env.KV_REST_API_URL;

if (!hasRedis) {
  console.warn(
    'Missing KV_REST_API_TOKEN or KV_REST_API_URL.' +
      'Will not cache responses from Slack. This may result in rate limiting.',
  );
}
