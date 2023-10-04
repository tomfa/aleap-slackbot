import { NextApiRequest, NextApiResponse } from 'next';
import { getFaceQuiz } from '../../bot/quiz';
import { MessageError } from '../../bot/errors';
import { ack } from '../../bot/utils/ack';
import { getUsers } from '../../bot/api/users';
import { respond } from '../../bot/api/chat';
import { ChatPostMessageArguments } from '@slack/web-api';
import { validateSlackRequest } from '../../bot/utils/validate';
import { signingSecret, verificationToken } from '../../bot/constants';
import { SlashCommand } from '@slack/bolt/dist/types/command';

export default async function facequiz(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { payload: data, valid } = validateSlackRequest(
    req,
    verificationToken,
    signingSecret,
  ) as { payload: SlashCommand; valid: boolean };
  if (!valid) {
    console.error('Invalid request signature found');
    return;
  }
  const user = { id: data.user_id, username: data.user_name };

  const say = async (
    payload: Omit<ChatPostMessageArguments, 'channel'> | string,
  ) => respond({ responseUrl: data.response_url, payload });

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
