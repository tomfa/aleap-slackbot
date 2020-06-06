require('dotenv').config()
const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

app.message('help', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `What you need help with <@${message.user}>?`
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Ask an expert"
        },
        "action_id": "expert_please_button_clicked"
      }
    }
    ]
  });
});


app.action('expert_please_button_clicked', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`Don't worry, it'l be fine!`);
});

(async () => {
  await app.start(process.env.PORT);

  console.log(`⚡️ Bolt app is listening at localhost!${process.env.PORT}`);
})();

