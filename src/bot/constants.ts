import { Redis } from '@upstash/redis';

export const token = process.env.SLACK_BOT_TOKEN as string;
export const signingSecret: string = process.env.SLACK_SIGNING_SECRET as string;

const redisURL = process.env.UPSTASH_REDIS_REST_URL as string;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN as string;
const allowedToken = process.env.WEBHOOK_TOKEN as string;
export const defaultChannel = process.env.SLACK_WEBHOOK_CHANNEL || '#random';
export const allowedTokens = [allowedToken];

if (!allowedToken) {
  throw new Error('Missing WEBHOOK_TOKEN');
}
if (!token) {
  throw new Error('Missing SLACK_BOT_TOKEN');
}
if (!signingSecret) {
  throw new Error('Missing SLACK_SIGNING_SECRET');
}
if (!redisURL) {
  throw new Error('Missing redis URL');
}
if (!redisToken) {
  throw new Error('Missing redis Token');
}

export const redis = new Redis({
  url: redisURL,
  token: redisToken,
});
