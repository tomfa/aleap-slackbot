import { NextApiRequest, NextApiResponse } from 'next';
import { tokenizeString } from '../../bot/utils/tokenizeString';
import { getFaceQuiz } from '../../bot/quiz';
import { MessageError } from '../../bot/errors';
import { ack } from '../../bot/utils/ack';
import { getUsers } from '../../bot/utils/users';
import { postToChannel } from '../../bot/utils/postToChannel';
import { SayArguments } from '@slack/bolt';

export default async function facequiz(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const commandArray = tokenizeString(req.body.text);
  console.log('commandArray', JSON.stringify(commandArray));
  const data = await req.body.event;
  console.log('req.body', JSON.stringify(req.body));
  // TODO: Validate/typescheck
  const user: { id: string; username: string } = data.user.id;

  const say = async (payload: SayArguments | string) =>
    postToChannel({ res, channel: user.username, payload });

  try {
    ack(res);
    const slackUsers = await getUsers();
    const quiz = await getFaceQuiz({
      exclude: [user.id],
      slackUsers,
    });
    await say(quiz);
  } catch (error) {
    if (error instanceof MessageError) {
      await say((error as MessageError).message);
    } else {
      throw error;
    }
  }
}
