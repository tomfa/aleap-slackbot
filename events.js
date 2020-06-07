const { getUser } = require("./data");
const app = require("./app");

app.action(
  "guess_name_from_picture",
  async (things) => {
    const { body, ack, say, action, payload } = things
    // Acknowledge the action
    await ack();
    const [correctAnswer, answer] = action.selected_option.value.split(';');
    const user = await getUser({ id: correctAnswer });
    const text = `That was ${user.real_name} (<@${user.name}>). *${user.profile.title}*`;
    if (correctAnswer === answer) {
      await say(`Correct! :cake: ${text}`);
    } else {
      await say(`Nope! :cry: ${text}`);
    }
  }
);
