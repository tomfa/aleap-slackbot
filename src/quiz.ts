import { NoRemainingUsers } from "./errors";
import { findAsync, shuffle } from "./utils";
import { Block, KnownBlock, PlainTextOption } from "@slack/bolt";
import { User } from "./types";

export const getFaceQuiz = async ({
  slackUsers,
  exclude = [],
}: {
  slackUsers: User[];
  exclude: string[];
}): Promise<{ blocks: Array<Block | KnownBlock> }> => {
  const users = shuffle(slackUsers);
  const randomUser = await findAsync(
    users.filter((u) => !exclude.includes(u.id)),
    async (u) => await u.hasImage()
  );
  if (!randomUser) {
    throw new NoRemainingUsers(
      "There are no users left to quiz that has image :cry:"
    );
  }
  const correctAnswer = randomUser.id;
  return {
    blocks: [
      {
        type: "image",
        image_url:
          randomUser.profile.image_original || randomUser.profile.image_192,
        alt_text: "Who is this?",
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "Who is this?",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "static_select",
            action_id: "guess_name_from_picture",
            placeholder: {
              type: "plain_text",
              text: "Select an item",
              emoji: true,
            },
            options: users.map(
              (c): PlainTextOption => ({
                text: {
                  type: "plain_text",
                  text:
                    c.real_name ||
                    c.profile.real_name ||
                    c.name ||
                    c.profile.first_name!,
                  emoji: true,
                },
                value: `${correctAnswer};${c.id}`,
              })
            ),
          },
        ],
      },
    ],
  };
};
