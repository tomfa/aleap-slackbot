import { respond } from '../api/chat';
import { ChatPostMessageArguments } from '@slack/web-api';
import { getUsers } from '../api/users';
import { getFaceQuiz } from '../quiz';
import { MessageError } from '../errors';

export const handleFaceQuiz = async (data: {
  userId: string;
  responseUrl: string;
}) => {
  const say = async (
    payload: Omit<ChatPostMessageArguments, 'channel'> | string,
  ) => respond({ responseUrl: data.responseUrl, payload });

  try {
    const slackUsers = await getUsers();
    const quiz = await getFaceQuiz({
      exclude: [data.userId],
      slackUsers,
    });
    await say(quiz);
  } catch (error) {
    console.error('Error in facequiz:', error);
    if (error instanceof MessageError) {
      await say((error as MessageError).message);
    } else {
      throw error;
    }
  }
};
