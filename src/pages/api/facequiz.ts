import { NextApiRequest, NextApiResponse } from 'next';
import { validateSlackRequest } from '../../bot/utils/validate';
import { signingSecret, verificationToken } from '../../bot/constants';
import { SlashCommand } from '@slack/bolt/dist/types/command';
import { ack } from '../../bot/utils/ack';
import { sendEvent } from './internal';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { payload: data, valid } = validateSlackRequest(
    req,
    verificationToken,
    signingSecret,
  ) as { payload: SlashCommand; valid: boolean };
  if (!valid) {
    console.error('Invalid request signature found');
    return;
  }
  // Intentionally not awaiting this, so that we can ack the request
  sendEvent({
    name: 'faceQuiz',
    data: {
      userId: data.user_id,
      responseUrl: data.response_url,
    },
  });
  ack(res);
}
