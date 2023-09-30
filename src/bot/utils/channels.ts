import { defaultChannel, token } from '../constants';
import { ChannelCreatedEvent } from '@slack/bolt/dist/types/events/base-events';
import { getUsers } from './users';

type ConversationsListResponse = {
  ok: boolean;
  channels: Array<ChannelCreatedEvent['channel']>;
  response_metadata: {
    next_cursor?: 'dGVhbTpDMDYxRkE1UEI=';
  };
};

export async function getChannels() {
  try {
    const url = 'https://slack.com/api/conversations.list';
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    });
    const data: ConversationsListResponse = await response.json();
    console.log(
      'https://slack.com/api/conversations.list',
      JSON.stringify(data, null, 2),
    );
    return data.channels;
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
