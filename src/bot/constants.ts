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
