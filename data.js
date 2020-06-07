const app = require("./app");

let userData = undefined;

async function fetchUsers({ refresh = false } = {}) {
  if (userData && !refresh) {
    return userData;
  }
  try {
    const result = await app.client.users.list({
      token: process.env.SLACK_BOT_TOKEN,
    });
    const users = result.members
      .filter((m) => !m.deleted)
      .filter((m) => !m.is_bot)
      .filter((m) => m.name !== "slackbot");

    userData = users;
    return userData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getUser({ id }) {
  const users = await fetchUsers();
  return users.find(u => u.id === id);
}

module.exports = { getUser, fetchUsers };
