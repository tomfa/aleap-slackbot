const app = require("./app");
const { MessageError } = require("./errors");
const { getFaceQuiz } = require("./quiz");

app.command("/facequiz", async ({ command, ack, say }) => {
  try {
    await ack();
    const quiz = await getFaceQuiz({ exclude: [command.user_id] });
    await app.dm({ user: command.user_id, blocks: quiz.blocks });
  } catch (error) {
    if (error instanceof MessageError) {
      await app.dm({ user: command.user_id, text: error.message });
    } else {
      throw error;
    }
  }
});
