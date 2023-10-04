import { NextApiRequest, NextApiResponse } from 'next';
import { allowedTokens, defaultChannel } from '../../../bot/constants';
import { chat } from '../../../bot/api/chat';
import { assertTokenAuth } from '../../../bot/utils/assertTokenAuth';

export default async function webhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  assertTokenAuth(req);
  const dataLength = JSON.stringify(req.body).length;
  console.log(`POST /webhook received:`);
  console.log(JSON.stringify(req.body, undefined, 2));
  await chat({
    channel: defaultChannel,
    payload: `/webhook got a POST request with data of length ${dataLength}`,
  });
  res.send(`Super`);
}
