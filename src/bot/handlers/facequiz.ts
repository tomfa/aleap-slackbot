import { chat, respond } from '../api/chat';
import { ChatPostMessageArguments } from '@slack/web-api';
import { getUsers } from '../api/users';
import { getFaceQuiz } from '../quiz';
import { MessageError } from '../errors';
import { GuessNameFromPictureArgs } from '../events/guessNameFromPicture';

export type HandleFaceQuizArgs = {
  username: string;
  userId: string;
  responseUrl: string;
};
export const handleFaceQuiz = async (data: HandleFaceQuizArgs) => {
  const say = async (
    payload: Omit<ChatPostMessageArguments, 'channel'> | string,
  ) => chat({ channel: '@' + data.username, payload });

  try {
    const slackUsers = await getUsers();
    const quiz = await getFaceQuiz({
      exclude: [data.userId],
      slackUsers,
    });
    const askedBy = slackUsers.find((u) => u.id === data.userId);
    const missingOwnPhoto = askedBy && !askedBy.hasImage;
    if (missingOwnPhoto) {
      quiz.blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `I'm not seeing your own profile picture, <@${data.username}>. You should add one!`,
          },
        ],
      });
    }
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
