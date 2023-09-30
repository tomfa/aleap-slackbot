import { NextApiRequest, NextApiResponse } from 'next';
import { allowedTokens, defaultChannel } from '../../bot/constants';
import { postToChannel } from '../../bot/utils/postToChannel';

export default async function webhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.query.token as string;
  const hasAccess = token && allowedTokens.includes(token);
  if (!hasAccess) {
    console.log(`Attempted accessing POST webhook without valid token`);
    return res.send('OK');
  }
  const dataLength = JSON.stringify(req.body).length;
  console.log(`POST /webhook received:`);
  console.log(JSON.stringify(req.body, undefined, 2));
  await postToChannel(
    defaultChannel,
    res,
    `/webhook got a POST request with data of length ${dataLength}`,
  );
  res.send(`Super`);
}
