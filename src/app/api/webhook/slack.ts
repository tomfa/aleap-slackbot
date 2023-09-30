import { NextApiRequest, NextApiResponse } from 'next';
import { allowedTokens, defaultChannel } from '../../../bot/constants';
import { postToChannel } from '../../../bot/utils/postToChannel';
import { parseSentryEvent } from '../../../bot/slack/parser';
import { slackBlocks } from '../../../bot/slack/blocks';
import { assertTokenAuth } from '../../../bot/utils/assertTokenAuth';

export default async function slackWebhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(`POST /webhook/slack received:`);
  console.log(JSON.stringify(req.body, undefined, 2));
  assertTokenAuth(req);
  const sentryEvent = parseSentryEvent(req.body);
  await postToChannel({
    channel: defaultChannel,
    res,
    payload: slackBlocks(sentryEvent),
  });
  res.send(`Super`);
}
