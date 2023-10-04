import { NextApiRequest, NextApiResponse } from 'next';
import { defaultChannel } from '../../bot/constants';
import { chat } from '../../bot/api/chat';
import { assertTokenAuth } from '../../bot/utils/assertTokenAuth';

export default async function secretPage(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  assertTokenAuth(req);
  await chat({
    channel: defaultChannel,
    payload: '/secret-page got a get request',
  });
  res.send(`Super`);
}
