import { respond } from '../api/chat';
import { ChatPostMessageArguments } from '@slack/web-api';
import { getUsers } from '../api/users';
import { getFaceQuiz } from '../quiz';
import { MessageError } from '../errors';
import { GuessNameFromPictureArgs } from '../events/guessNameFromPicture';

export type HandleFaceQuizArgs = {
  userId: string;
  responseUrl: string;
};
export const handleFaceQuiz = async (data: HandleFaceQuizArgs) => {
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
