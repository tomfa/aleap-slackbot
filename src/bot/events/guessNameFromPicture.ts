import { NextApiRequest } from 'next';
import { BlockAction, SayArguments, StaticSelectAction } from '@slack/bolt';
import { getUser, getUsers } from '../utils/users';
import { postToChannel, respond } from '../utils/postToChannel';
import { getFaceQuiz } from '../quiz';
import { MessageError } from '../errors';

export type GuessNameFromPictureAction = Omit<
  StaticSelectAction,
  'action_id'
> & { action_id: 'guess_name_from_picture ' };
export type GuessNameFromPictureEvent = BlockAction<GuessNameFromPictureAction>;

export async function guessNameFromPicture(
  req: NextApiRequest,
  event: GuessNameFromPictureEvent,
) {
  const action = event.actions[0]!;
  const say = async (payload: SayArguments | string) =>
    postToChannel({ channel: event.channel!.id, payload });

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
