import { addEvents } from "./events";

require("dotenv").config();

import { addSlashCommands } from "./commands";
import { createApp } from "./app";

const app = createApp({
  slackBotToken: process.env.SLACK_BOT_TOKEN as string,
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET as string,
});

addSlashCommands(app);
addEvents(app);

(async () => {
  await app.start(process.env.PORT);
  console.log(`⚡️ Bolt app is listening at localhost:${process.env.PORT}`);
})();
