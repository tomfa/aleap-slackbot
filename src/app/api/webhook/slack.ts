import { NextApiRequest, NextApiResponse } from 'next';
import { allowedTokens, defaultChannel } from '../../../bot/constants';
import { postToChannel } from '../../../bot/utils/postToChannel';
import { parseSentryEvent } from '../../../bot/slack/parser';
import { slackBlocks } from '../../../bot/slack/blocks';

export default async function slackWebhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.query.token as string;
  const hasAccess = token && allowedTokens.includes(token);
  if (!hasAccess) {
    console.log(`Attempted accessing POST webhook without valid token`);
    return res.send('OK');
  }
  console.log(`POST /webhook/slack received:`);
  console.log(JSON.stringify(req.body, undefined, 2));
  const sentryEvent = parseSentryEvent(req.body);
  await postToChannel({
    channel: defaultChannel,
    res,
    payload: slackBlocks(sentryEvent),
  });
  res.send(`Super`);
}
