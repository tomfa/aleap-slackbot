import { defaultChannel, hasRedis } from '../constants';
import { getUsers } from './users';
import { SlackClient } from './client';
import { kv } from '@vercel/kv';
import { User } from '../types';
import { ChannelsListResponse } from '@slack/web-api';
import { Channel } from '@slack/web-api/dist/response/ChannelsListResponse';

const CACHE_KEY = 'channels';

async function getCachedData() {
  return kv.get<Channel[]>(CACHE_KEY);
}

async function setCacheData(channels: Channel[]) {
  await kv.set<Channel[]>(CACHE_KEY, channels, { ex: 3600 * 12 });
}

export async function getChannels({
  useCache = hasRedis,
}: { useCache?: boolean } = {}): Promise<Channel[]> {
  try {
    if (useCache) {
      const cached = await getCachedData();
      if (cached) {
        return cached;
      }
    }
    const client = new SlackClient();
    const data = await client.conversations.list();
    if (data.channels && useCache) {
      await setCacheData(data.channels);
    }
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
