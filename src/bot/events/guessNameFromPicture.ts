import { NextApiRequest } from 'next';
import { BlockAction, StaticSelectAction } from '@slack/bolt';
import { getUser, getUsers } from '../api/users';
import { chat } from '../api/chat';
import { getFaceQuiz } from '../quiz';
import { MessageError } from '../errors';
import { ChatPostMessageArguments } from '@slack/web-api';
import { hasRedis } from '../constants';
import { wait } from '../api/utils';

export type GuessNameFromPictureAction = Omit<
  StaticSelectAction,
  'action_id'
> & { action_id: 'guess_name_from_picture ' };
export type GuessNameFromPictureEvent = BlockAction<GuessNameFromPictureAction>;
export type GuessNameFromPictureArgs = {
  selectedOption: string;
  channel: string;
};

export async function guessNameFromPicture({
  channel,
  selectedOption,
}: GuessNameFromPictureArgs) {
  const say = async (
    payload: Omit<ChatPostMessageArguments, 'channel'> | string,
  ) => chat({ channel, payload });

  const [correctAnswer, answer] = selectedOption.split(';');
  const user = await getUser({ id: correctAnswer });
  if (!hasRedis) {
    await wait(1000); // rate limiting
  }
  if (!user) {
    console.log(`Error: Unable to find user with id ${correctAnswer}`);
    await say(`Error: Unable to find user with id ${correctAnswer}`);
    return;
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
    const slackUsers = await getUsers();
    const quiz = await getFaceQuiz({ slackUsers, exclude: [user.id] });
    if (!hasRedis) {
      await wait(1000); // rate limiting
    }
    await say(quiz);
  } catch (error) {
    console.log('Error in guessNameFromPicture:', error);
    if (error instanceof MessageError) {
      await say((error as MessageError).message);
    } else {
      throw error;
    }
  }
}
