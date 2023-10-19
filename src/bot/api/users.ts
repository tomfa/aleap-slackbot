import { User } from '../types';
import { SlackClient } from './client';
import { kv } from '@vercel/kv';
import { hasRedis } from '../constants';

const CACHE_KEY = 'users';

async function getCachedData() {
  return kv.get<User[]>(CACHE_KEY);
}

async function setCacheData(users: User[]) {
  await kv.set<User[]>(CACHE_KEY, users, { ex: 3600 });
}

export async function getUsers({
  useCache = hasRedis,
}: { useCache?: boolean } = {}): Promise<User[]> {
  const cached = useCache && (await getCachedData());
  if (cached) {
    return cached.map(
      (m): User => ({
        ...m,
        id: m.id!,
        profile: m.profile!,
        hasImage: !!m.profile?.is_custom_image,
      }),
    );
  }
  try {
    const client = new SlackClient();
    const data = await client.users.list();
    const userData =
      data.members
        ?.filter((m) => !m.deleted && !m.is_bot && !!m.profile && !!m.id)
        .filter((m) => m.name !== 'slackbot')
        .map(
          (m): User => ({
            ...m,
            id: m.id!,
            profile: m.profile!,
            hasImage: !!m.profile?.is_custom_image,
          }),
        ) || [];
    if (useCache && !!userData.length) {
      await setCacheData(userData);
    }
    return userData;
  } catch (err) {
    console.log('fetch Error:', err);
    return [];
  }
}

export async function getUser({ id }: { id: string }) {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}
