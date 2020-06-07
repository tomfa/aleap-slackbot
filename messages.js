const app = require("./app");
const { MessageError } = require("./errors");
const { getFaceQuiz } = require("./quiz");

app.message("facequiz", async ({ message, say }) => {
  try {
    const quiz = await getFaceQuiz({ exclude: [message.user] });
    await app.dm({ user: message.user, blocks: quiz.blocks });
  } catch (error) {
    if (error instanceof MessageError) {
      await app.dm({ user: message.user, text: error.message });
    } else {
      throw error;
    }
  }
});
