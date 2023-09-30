import { NextApiRequest, NextApiResponse } from 'next';
import { allowedTokens, defaultChannel } from '../../bot/constants';
import { postToChannel } from '../../bot/utils/postToChannel';

export default async function secretPage(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.query.token as string;
  const hasAccess = token && allowedTokens.includes(token);
  if (!hasAccess) {
    console.log(`Attempted accessing http handler without valid token`);
    return res.send('OK');
  }
  await postToChannel({
    channel: defaultChannel,
    res,
    payload: '/secret-page got a get request',
  });
  res.send(`Super`);
}
