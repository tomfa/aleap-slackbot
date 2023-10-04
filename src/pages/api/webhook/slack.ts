import { NextApiRequest, NextApiResponse } from 'next';
import { allowedTokens, defaultChannel } from '../../../bot/constants';
import { chat } from '../../../bot/api/chat';
import { parseSentryEvent } from '../../../bot/sentry/parser';
import { slackBlocks } from '../../../bot/sentry/blocks';
import { assertTokenAuth } from '../../../bot/utils/assertTokenAuth';

export default async function slackWebhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(`POST /webhook/slack received:`);
  console.log(JSON.stringify(req.body, undefined, 2));
  assertTokenAuth(req);
  const sentryEvent = parseSentryEvent(req.body);
  await chat({
    channel: defaultChannel,
    payload: slackBlocks(sentryEvent),
  });
  res.send(`Super`);
}
