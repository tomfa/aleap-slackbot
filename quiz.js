const { NoRemainingUsers } = require("./errors");
const { fetchUsers } = require("./data");
const { findAsync, shuffle } = require( "./utils");

const getFaceQuiz = async ({ exclude = [] }) => {
  const users = shuffle(await fetchUsers());
  const randomUser = await findAsync(users.filter(u => !exclude.includes(u.id)), async (u) => await u.hasImage() === true);
  if (!randomUser) {
    throw new NoRemainingUsers('There are no users left to quiz that has image :cry:');
  }
  const correctAnswer = randomUser.id;
  return {
    blocks: [
      {
        type: "image",
        image_url: randomUser.profile.image_original || randomUser.profile.image_192,
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
            options: users.map(c => (
              {
                text: {
                  type: "plain_text",
                  text: c.real_name,
                  emoji: true,
                },
                value: `${correctAnswer};${c.id}`,
              }))
          },
        ],
      },
    ],
  };
};

module.exports = { getFaceQuiz }
