import { NextApiRequest } from 'next';
import { BlockAction, StaticSelectAction } from '@slack/bolt';
import { getUser, getUsers } from '../api/users';
import { chat } from '../api/chat';
import { getFaceQuiz } from '../quiz';
import { MessageError } from '../errors';
import { ChatPostMessageArguments } from '@slack/web-api';
import { hasRedis } from '../constants';
import { wait } from '../api/utils';
import { shuffle } from '../utils';
import { kv } from '@vercel/kv';
import { User } from '../types';

export type GuessNameFromPictureAction = Omit<
  StaticSelectAction,
  'action_id'
> & { action_id: 'guess_name_from_picture ' };
export type GuessNameFromPictureEvent = BlockAction<GuessNameFromPictureAction>;
export type GuessNameFromPictureArgs = {
  userId: string;
  selectedOption: string;
  username: string;
};

const correctVariants = [
  ':partying_face: Correct!',
  ':partying_face: That is correct!',
  ':partying_face: You are right!',
  ':partying_face: That is right!',
  ':tada: You got it!',
  ':tada: You are correct!',
  ':tada: That is the correct answer!',
  ':tada: That is the right answer!',
  ':clap: That is the answer!',
  ':clap: That is correct!',
  ':clap: That is right!',
  ':balloon: You are correct!',
  ':balloon: Have you been studying?',
  ':white_check_mark: Doing great!',
  ':white_check_mark: You are doing great!',
];

const wrongVariants = [
  ':x: Nope!',
  ':x: That is incorrect.',
  ':x: Wrong!',
  `:x: Incorrect, I'm afraid.`,
  `:x: You got the next one, I'm sure!`,
  `:x: You will get the next one!`,
  `:x: Bad luck.`,
  `:x: Maybe you misclicked?`,
  `:x: No, but they kinda look similar, right?`,
  `:x: I was sure you would get that one!`,
];

type Score = {
  correct: number;
  total: number;
};
const getScoreKey = (username: string) => `score:${username}`;

const getScore = async (username: string): Promise<Score> => {
  const scores = hasRedis ? await kv.get<Score>(getScoreKey(username)) : null;
  if (scores) {
    return scores;
  }
  return {
    correct: 0,
    total: 0,
  };
};

const setScore = async (username: string, score: Score) => {
  if (hasRedis) {
    await kv.set(getScoreKey(username), score, { ex: 3600 });
  }
};

export async function guessNameFromPicture({
  username,
  userId,
  selectedOption,
}: GuessNameFromPictureArgs) {
  const say = async (
    payload: Omit<ChatPostMessageArguments, 'channel'> | string,
  ) => chat({ channel: '@' + username, payload });

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
  const correct = correctAnswer === answer;
  const oldScore = await getScore(username);
  const score = {
    correct: oldScore.correct + +correct,
    total: oldScore.total + 1,
  };
  const preText = correct
    ? shuffle(correctVariants)[0]
    : shuffle(wrongVariants)[0];
  const text = `That was ${real_name} (<@${name}>).${title}`;
  await say({
    attachments: [
      {
        color: correct ? '#0d8a28' : '#8b1313',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: preText + ' ' + text,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `${score.correct}/${score.total} correct. Resets after 1 hour of inactivity.`,
              },
            ],
          },
        ],
      },
    ],
  });
  try {
    await setScore(username, score);
    const slackUsers = await getUsers();
    const quiz = await getFaceQuiz({ slackUsers, exclude: [user.id, userId] });
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
