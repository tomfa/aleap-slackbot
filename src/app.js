require("dotenv").config();
const { App } = require("@slack/bolt");

class ChatBot extends App {
  async dm({ user, blocks, text }) {
    const token = process.env.SLACK_BOT_TOKEN;
    await this.client.chat.postMessage({ channel: user, token, blocks, text });
  }
}

// Initializes your app with your bot token and signing secret
const app = new ChatBot({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

module.exports = app;
