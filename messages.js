const app = require("./app");

app.message("hello", async ({ message, say }) => {
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
