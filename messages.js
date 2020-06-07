const { fetchUsers } = require("./data");
const app = require("./app");

app.message("facequiz", async ({ message, say }) => {
  const users = await fetchUsers();
  const randomUser = users[Math.floor(Math.random() * users.length)];
  const correctAnswer = randomUser.id;
  await say({
    blocks: [
      {
        type: "image",
        image_url: randomUser.profile.image_512,
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
  });
});
