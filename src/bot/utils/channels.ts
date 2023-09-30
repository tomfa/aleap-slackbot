import { token } from '../constants';
import { ChannelCreatedEvent } from '@slack/bolt/dist/types/events/base-events';

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
    return data.channels;
  } catch (err) {
    console.log('fetch Error:', err);
    return [];
  }
}

export async function channelNameToId(channelName: string) {
  const channels = await getChannels();
  const channel = channels.find((c) => c.name === channelName);
  if (channel) {
    return channel.id;
  }
  console.error(`Unable to find channel with name ${channelName}`);
  const generalChannel = channels.find((c) => c.name === 'general');
  if (generalChannel) {
    return generalChannel.id;
  }
  console.error(`Unable to find channel with name general`);
  return undefined;
}
