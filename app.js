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

async function fetchUsers() {
  try {
    const result = await app.client.users.list({
      token: process.env.SLACK_BOT_TOKEN
    });
    const users = result.members
      .filter(m => !m.deleted)
      .filter(m => !m.is_bot)
      .filter(m => m.name !== 'slackbot');

    return users;
  }
  catch (error) {
    console.error(error);
    return []
  }
}

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

