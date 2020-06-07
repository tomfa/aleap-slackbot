const app = require("./app");
const { getFaceQuiz } = require("./quiz");

app.message("facequiz", async ({ message, say }) => {
  const quiz = await getFaceQuiz({ exclude: [] });
  await say(quiz)
});
