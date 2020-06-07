const app = require('./app');
const { MessageError } = require('./errors');
const { getFaceQuiz } = require('./quiz');

app.message('facequiz', async ({ message, say }) => {
  try {
    const quiz = await getFaceQuiz({ exclude: [message.user] });
    await say(quiz);
  } catch (error) {
    if (error instanceof MessageError) {
      await say(error.message);
    } else {
      throw error;
    }
  }
});
