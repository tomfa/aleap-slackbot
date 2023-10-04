import { NextApiRequest, NextApiResponse } from 'next';
import { tokenizeString } from '../../bot/utils/tokenizeString';
import { getFaceQuiz } from '../../bot/quiz';
import { MessageError } from '../../bot/errors';
import { ack } from '../../bot/utils/ack';
import { getUsers } from '../../bot/utils/users';
import { postToChannel, respond } from '../../bot/utils/postToChannel';
import { SayArguments } from '@slack/bolt';

type FaceQuizPayload = {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  api_app_id: string;
  is_enterprise_install: string;
  response_url: string;
  trigger_id: string;
};

export default async function facequiz(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = (await req.body) as FaceQuizPayload;
  const user = { id: data.user_id, username: data.user_name };

  const say = async (payload: SayArguments | string) =>
    postToChannel({ channel: data.channel_id, payload });

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
