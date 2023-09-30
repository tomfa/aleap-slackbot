import { NextApiRequest, NextApiResponse } from 'next';
import { BlockAction, SayArguments, StaticSelectAction } from '@slack/bolt';
import { ack } from '../utils/ack';
import { getUser, getUsers } from '../utils/users';
import { postToChannel } from '../utils/postToChannel';
import { getFaceQuiz } from '../quiz';
import { MessageError } from '../errors';

export interface GuessNameFromPictureEvent
  extends Omit<BlockAction<StaticSelectAction>, 'type'> {
  type: 'guess_name_from_picture';
}

export async function guessNameFromPicture(
  req: NextApiRequest,
  res: NextApiResponse,
  event: GuessNameFromPictureEvent,
) {
  console.log('req body challenge is:', req.body.challenge);
  const action = event.actions[0]!;
  const say = async (payload: SayArguments | string) =>
    postToChannel({ channel: event.user.username, res, payload });

  ack(res);
  const [correctAnswer, answer] = action.selected_option.value.split(';');
  const user = await getUser({ id: correctAnswer });
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
    const slackUsers = await getUsers();
    const quiz = await getFaceQuiz({ slackUsers, exclude: [user.id] });
    await say(quiz);
  } catch (error) {
    if (error instanceof MessageError) {
      await say((error as MessageError).message);
    } else {
      throw error;
    }
  }
}
