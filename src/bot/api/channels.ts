import { defaultChannel } from '../constants';
import { getUsers } from './users';
import { SlackClient } from './client';

export async function getChannels() {
  try {
    const client = new SlackClient();
    const data = await client.conversations.list();
    return data.channels || [];
  } catch (err) {
    console.log('fetch Error:', err);
    return [];
  }
}

export async function channelNameToId(channelName: string) {
  if (channelName.startsWith('#')) {
    const channels = await getChannels();
    const channel = channels.find((c) => '#' + c.name === channelName);
    if (channel) {
      return channel.id;
    }
    console.error(`Unable to find channel with name ${channelName}`);
    return defaultChannel;
  }
  if (channelName.startsWith('@')) {
    const users = await getUsers();
    const user = users.find((u) => '@' + u.name === channelName);
    if (user) {
      return user.id;
    }
    console.error(`Unable to find user with name ${channelName}`);
    return undefined;
  }
  return channelName;
}
