import { ChatBot } from './types';

import { MessageError } from './errors';
import { fetchUsers, getUser } from './data';
import { getFaceQuiz } from './quiz';
import { SayArguments } from '@slack/bolt';

const addNameGuessEventHandler = (app: ChatBot) => {
  app.action('guess_name_from_picture', async ({ ack, say, action, body }) => {
    await ack();

    // @ts-ignore
    const [correctAnswer, answer] = action.selected_option.value.split(';');
    const user = await getUser({ app, id: correctAnswer });
    if (!user) {
      await say(`Error: Unable to find user with id ${correctAnswer}`);
      throw new Error(`Error: Unable to find user with id ${correctAnswer}`);
    }
    const { real_name, name, profile } = user;
    const title = profile.title ? ` *${profile.title}*` : '';
    const text = `That was ${real_name} (<@${name}>).${title}`;
    if (correctAnswer === answer) {
      await say(`Correct! :cake: ${text}`);
    } else {
      await say(`Nope! :cry: ${text}`);
    }
    try {
      const slackUsers = await fetchUsers({ app });
      const quiz = await getFaceQuiz({ slackUsers, exclude: [user.id] });
      await say(quiz);
    } catch (error) {
      if (error instanceof MessageError) {
        await say((error as MessageError).message);
      } else {
        throw error;
      }
    }
  });
};

export const addEvents = (app: ChatBot) => {
  addNameGuessEventHandler(app);
};
