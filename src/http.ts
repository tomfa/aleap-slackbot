import { ChatBot } from "./types";

import { ExpressReceiver } from "@slack/bolt";

export const createHandler = (props: { signingSecret: string }) =>
  new ExpressReceiver(props);

export const addHttpHandlers = (args: {
  app: ChatBot;
  receiver: ExpressReceiver;
  allowedTokens: string[];
  dmChannel: string;
}) => {
  args.receiver.router.get("/secret-page", (req, res) => {
    const token = req.query.token as string;
    const hasAccess = token && args.allowedTokens.includes(token);
    if (!hasAccess) {
      console.log(`Attempted accessing http handler without valid token`);
      return res.send("OK");
    }
    args.app.dm({
      user: args.dmChannel,
      text: "I suppose there will be a funny little PR tomorrow",
    });
    res.send(`I have informed our master of your arrival`);
  });
};
