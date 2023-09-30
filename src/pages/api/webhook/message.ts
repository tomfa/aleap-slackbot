import { NextApiRequest, NextApiResponse } from 'next';
import { defaultChannel } from '../../../bot/constants';
import { postToChannel } from '../../../bot/utils/postToChannel';
import { assertTokenAuth } from '../../../bot/utils/assertTokenAuth';
import { parseMessageEvent } from '../../../bot/message/parser';
import { messageBlocks } from '../../../bot/message/blocks';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log(`POST /webhook/message received:`);
  console.log(JSON.stringify(req.body, undefined, 2));
  assertTokenAuth(req);
  const msg = parseMessageEvent(req.body);
  if (!msg.title) {
    res.status(400).send(`Missing title`);
    return;
  }
  const color =
    msg.sentiment === 'HAPPY'
      ? '#167716'
      : msg.sentiment === 'SAD'
      ? '#861818'
      : '#2a2aa8';
  await postToChannel({
    channel: msg.channel || defaultChannel,
    payload: {
      metadata: undefined,
      text: msg.title,
      attachments: [
        {
          color,
          blocks: messageBlocks(msg),
        },
      ],
    },
  });
  res.send('Super');
}
