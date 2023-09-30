import { SentryEvent } from './types';
import { Block, KnownBlock, SayArguments } from '@slack/bolt';

export const slackBlocks = (msg: SentryEvent): SayArguments => {
  return {
    metadata: undefined,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `:warning: ${msg.title}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${msg.url}|View Issue>`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Environment:*\n${msg.environment}`,
          },
          {
            type: 'mrkdwn',
            text: `*Release:*\n${msg.release}`,
          },
        ],
      },
      {
        type: 'section',
        fields: Object.entries(msg.tags).map(([k, v]) => ({
          type: 'mrkdwn',
          text: `*${k}:*\n${v}`,
        })),
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'Bjarne Bot, reporting for *Sentry*',
          },
        ],
      },
    ],
  };
};
