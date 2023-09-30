import { Receiver } from '@slack/bolt';

require('dotenv').config();

import { ChatBot } from './types';

export const createApp = (config: {
  slackBotToken: string;
  slackSigningSecret: string;
  receiver: Receiver | undefined;
}): ChatBot =>
  new ChatBot({
    token: config.slackBotToken,
    signingSecret: config.slackSigningSecret,
    receiver: config.receiver,
  });
