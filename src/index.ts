require("dotenv").config();

import { createApp } from "./app";
import { addEvents } from "./events";
import { addSlashCommands } from "./commands";
import { createHandler, addHttpHandlers } from "./http";

const receiver = createHandler({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

const app = createApp({
  slackBotToken: process.env.SLACK_BOT_TOKEN!,
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET!,
  receiver,
});

addSlashCommands(app);
addEvents(app);
addHttpHandlers({
  app,
  receiver,
  allowedTokens: [process.env.WEBHOOK_TOKEN!],
  dmChannel: "#random",
});

(async () => {
  await app.start(process.env.PORT as string);
  console.log(`⚡️ Bolt app is listening at localhost:${process.env.PORT}`);
})();
