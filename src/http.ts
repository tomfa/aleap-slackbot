import { ChatBot } from "./types";

import express from "express";
import { ExpressReceiver } from "@slack/bolt";

export const createHandler = (props: { signingSecret: string }) =>
  new ExpressReceiver(props);

export const addHttpHandlers = (args: {
  app: ChatBot;
  receiver: ExpressReceiver;
  allowedTokens: string[];
  dmChannel: string;
}) => {
  args.receiver.router.use(express.json());
  args.receiver.router.use(express.urlencoded({ extended: true }));
  args.receiver.router.get("/secret-page", (req, res) => {
    const token = req.query.token as string;
    const hasAccess = token && args.allowedTokens.includes(token);
    if (!hasAccess) {
      console.log(`Attempted accessing http handler without valid token`);
      return res.send("OK");
    }
    args.app.dm({
      user: args.dmChannel,
      text: "/secret-page got a get request",
    });
    res.send(`Super`);
  });
  args.receiver.router.post("/webhook", (req, res) => {
    const token = req.query.token as string;
    const hasAccess = token && args.allowedTokens.includes(token);
    if (!hasAccess) {
      console.log(`Attempted accessing POST webhook without valid token`);
      return res.send("OK");
    }
    const dataLength = JSON.stringify(req.body).length;
    console.log(`POST /webhook received:`);
    console.log(JSON.stringify(req.body, undefined, 2));
    args.app.dm({
      user: args.dmChannel,
      text: `/webhook got a POST request with data of length ${dataLength}`,
    });
    res.send(`Super`);
  });
};
