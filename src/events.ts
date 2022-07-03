import { ChatBot } from "./types";

const { MessageError } = require("./errors");
const { getUser } = require("./data");
const { getFaceQuiz } = require("./quiz");

const addNameGuessEventHandler = (app: ChatBot) => {
  app.action("guess_name_from_picture", async ({ ack, say, action, body }) => {
    await ack();

    // @ts-ignore
    const [correctAnswer, answer] = action.selected_option.value.split(";");
    const user = await getUser({ id: correctAnswer });
    const { real_name, name, profile } = user;
    const title = profile.title ? ` *${profile.title}*` : "";
    const text = `That was ${real_name} (<@${name}>).${title}`;
    if (correctAnswer === answer) {
      await say(`Correct! :cake: ${text}`);
    } else {
      await say(`Nope! :cry: ${text}`);
    }
    try {
      const quiz = await getFaceQuiz({ exclude: [user.id, body.user.id] });
      await say(quiz);
    } catch (error) {
      if (error instanceof MessageError) {
        await say((error as typeof MessageError).message);
      } else {
        throw error;
      }
    }
  });
};

export const addEvents = (app: ChatBot) => {
  addNameGuessEventHandler(app);
};
