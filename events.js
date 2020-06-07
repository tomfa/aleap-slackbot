const app = require("./app");

app.action('expert_please_button_clicked', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    await say(`Don't worry, it'l be fine!`);
});
