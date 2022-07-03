require("dotenv").config();

import { ChatBot } from "./types";

export const createApp = (config: {
  slackBotToken: string;
  slackSigningSecret: string;
}): ChatBot =>
  new ChatBot({
    token: config.slackBotToken,
    signingSecret: config.slackSigningSecret,
  });
