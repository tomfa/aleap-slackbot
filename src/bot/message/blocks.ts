import { Block, KnownBlock } from '@slack/bolt';
import type { MessageEvent } from './parser';

export const messageBlocks = (msg: MessageEvent): Array<Block | KnownBlock> => {
  const description = msg.description ? `\n${msg.description}` : '';
  const blocks: Array<Block | KnownBlock | false> = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${msg.title}*${description}`,
      },
    },
    !!msg.url && {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<${msg.url.href}|${msg.url.title}>`,
      },
    },
    !!msg.tags &&
      Object.entries(msg.tags).length > 0 && {
        type: 'section',
        fields: Object.entries(msg.tags).map(([k, v]) => ({
          type: 'mrkdwn',
          text: `*${k}:*\n${v}`,
        })),
      },
    !!msg.subtext && {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: msg.subtext,
        },
      ],
    },
  ];
  return blocks.filter((b) => !!b) as Array<Block | KnownBlock>;
};
