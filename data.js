const app = require('./app');
const fetch = require('node-fetch');

let userData = undefined;

async function isRedirected(url) {
  const data = await fetch(url, { method: 'HEAD' });
  return data.redirected;
}

async function hasImage(user) {
  if (user.profile.image_original) {
    return true;
  }
  const gravatarUrl = user.profile.image_192;
  return !(await isRedirected(gravatarUrl));
}

const hasImageLazy = (user, key = 'hasImage') => async () => {
  const value = await hasImage(user);
  user[key] = async () => value;
  return value;
};

async function fetchUsers({ refresh = false } = {}) {
  if (userData && !refresh) {
    return userData;
  }
  try {
    const result = await app.client.users.list({
      token: process.env.SLACK_BOT_TOKEN,
    });
    userData = result.members
      .filter((m) => !m.deleted)
      .filter((m) => !m.is_bot)
      .filter((m) => m.name !== 'slackbot')
      .map((u) => {
        u.hasImage = hasImageLazy(u, 'hasImage');
        return u;
      });

    return userData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getUser({ id }) {
  const users = await fetchUsers();
  return users.find((u) => u.id === id);
}

module.exports = { getUser, fetchUsers };
