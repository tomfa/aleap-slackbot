
const app = require("./app");
const { MessageError } = require("./errors");
const { getUser } = require("./data");
const { getFaceQuiz } = require("./quiz");

app.action(
  "guess_name_from_picture",
  async ({ ack, say, action, body }) => {
    await ack();

    const [correctAnswer, answer] = action.selected_option.value.split(';');
    const user = await getUser({ id: correctAnswer });
    const text = `That was ${user.real_name} (<@${user.name}>). *${user.profile.title}*`;
    if (correctAnswer === answer) {
      await say(`Correct! :cake: ${text}`);
    } else {
      await say(`Nope! :cry: ${text}`);
    }
    try {
      const quiz = await getFaceQuiz({exclude: [user.id, body.user.id]});
      await say(quiz)
    } catch (error) {
      if (error instanceof MessageError) {
        await say(error.message)
      } else {
        throw error;
      }
    }
  }
);
