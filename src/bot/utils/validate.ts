import crypto from 'crypto';
import { NextApiRequest } from 'next';

export function validateSlackRequest(
  req: NextApiRequest,
  signingSecret: string,
) {
  const requestBody = JSON.stringify(req['body']);

  const headers = req.headers;

  const timestamp = headers['x-slack-request-timestamp'];
  const slackSignature = headers['x-slack-signature'];
  const baseString = 'v0:' + timestamp + ':' + requestBody;

  const hmac = crypto
    .createHmac('sha256', signingSecret)
    .update(baseString)
    .digest('hex');
  const computedSlackSignature = 'v0=' + hmac;
  const isValid = computedSlackSignature === slackSignature;
  if (!isValid) {
    console.log(`Received invalid slack signature ${slackSignature}`);
  }

  return isValid;
}
