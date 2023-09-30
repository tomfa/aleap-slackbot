import { NextApiRequest, NextApiResponse } from 'next';
import { allowedTokens, defaultChannel } from '../../bot/constants';
import { postToChannel } from '../../bot/utils/postToChannel';
import { assertTokenAuth } from '../../bot/utils/assertTokenAuth';

export default async function secretPage(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  assertTokenAuth(req);
  await postToChannel({
    channel: defaultChannel,
    res,
    payload: '/secret-page got a get request',
  });
  res.send(`Super`);
}
