import { NoRemainingUsers } from './errors';
import { findAsync, shuffle } from './utils';
import { Block, KnownBlock, PlainTextOption } from '@slack/bolt';
import { User } from './types';
import { ChatPostMessageArguments } from '@slack/web-api';

const questionVariants = [
  'Who is this?',
  `What's their name?`,
  `What's their name again?`,
  `Remember this one?`,
  `Sure you know this one?`,
  `Who's this?`,
  `This one is easy, right?`,
  `And this one?`,
];

export const getFaceQuiz = async ({
  slackUsers,
  exclude = [],
}: {
  slackUsers: Array<User>;
  exclude: string[];
}): Promise<
  Omit<ChatPostMessageArguments, 'blocks' | 'channel'> & {
    blocks: Array<Block | KnownBlock>;
  }
> => {
  const users = shuffle(slackUsers);
  const randomUser = await findAsync(
    users.filter((u) => !exclude.includes(u.id)),
    async (u) => u.hasImage,
  );
  if (!randomUser) {
    throw new NoRemainingUsers(
      'There are no users left to quiz that has image :cry:',
    );
  }
  const correctAnswer = randomUser.id;
  const question = shuffle(questionVariants)[0];
  return {
    blocks: [
      {
        type: 'image',
        image_url:
          randomUser.profile.image_original || randomUser.profile.image_192,
        alt_text: question,
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: question,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'static_select',
            action_id: 'guess_name_from_picture',
            placeholder: {
              type: 'plain_text',
              text: 'Select an item',
              emoji: true,
            },
            options: slackUsers.map(
              (c): PlainTextOption => ({
                text: {
                  type: 'plain_text',
                  text:
                    c.real_name ||
                    c.profile.real_name ||
                    c.name ||
                    c.profile.first_name!,
                  emoji: true,
                },
                value: `${correctAnswer};${c.id}`,
              }),
            ),
          },
        ],
      },
    ],
  };
};
