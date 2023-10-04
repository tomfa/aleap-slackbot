import { NextApiRequest } from 'next';
import { isValidSlackRequest } from '@slack/bolt';

export function validateSlackRequest(
  req: NextApiRequest,
  verificationToken: string,
  signingSecret?: string,
) {
  const payload = getPayload(req);
  if (payload.token === verificationToken) {
    return { payload, valid: true };
  }

  if (!signingSecret) {
    return { payload, valid: false };
  }

  // Note: the below validation will likely never work
  // The method isValidSlackRequest requires the raw body, but NextJS
  // parses the body before it reaches this point.
  const valid = isValidSlackRequest({
    signingSecret,
    body: req.body,
    headers: {
      'x-slack-signature': req.headers['x-slack-signature'] as string,
      'x-slack-request-timestamp': parseInt(
        req.headers['x-slack-request-timestamp'] as string,
        10,
      ),
    },
  });
  return { payload, valid };
}

const getPayload = (
  req: NextApiRequest,
): Record<string, any> & { token: string } => {
  if (req.body === null) {
    throw new Error('request body is null');
  }
  if (typeof req.body === 'object' && !req.body.payload) {
    const payload = req.body;
    if (typeof payload.token !== 'string') {
      throw new Error('request body is missing a "token" field');
    }
    return payload;
  }
  const payload = req.body.payload;
  if (typeof payload !== 'string') {
    throw new Error('request body "payload" is not a string');
  }
  try {
    const parsed = JSON.parse(payload);
    const isRecord = parsed !== null && typeof parsed === 'object';
    if (!isRecord) {
      throw new Error('request body "payload" is not a JSON object');
    }
    if (typeof parsed.token !== 'string') {
      throw new Error('request body "payload" is missing a "token" field');
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse payload:', payload);
    throw e;
  }
};
