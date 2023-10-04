import { User } from '../types';
import { SlackClient } from './client';
import { kv } from '@vercel/kv';

const CACHE_KEY = 'users';

async function getCachedData() {
  return kv.get<User[]>(CACHE_KEY);
}

async function setCacheData(users: User[]) {
  await kv.set<User[]>(CACHE_KEY, users, { ex: 3600 });
}

export async function getUsers({
  useCache = true,
}: { useCache?: boolean } = {}): Promise<User[]> {
  const cached = useCache && (await getCachedData());
  if (cached) {
    return cached.map(
      (m): User => ({
        ...m,
        id: m.id!,
        profile: m.profile!,
        hasImage: hasImageLazy(m as User),
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
            hasImage: hasImageLazy(m as User),
          }),
        ) || [];
    await setCacheData(userData);
    return userData;
  } catch (err) {
    console.log('fetch Error:', err);
    return [];
  }
}

async function isRedirected(url: string) {
  const data = await fetch(url, { method: 'HEAD' });
  return data.redirected;
}

async function hasImage(user: User) {
  if (user.profile?.image_original) {
    return true;
  }
  const gravatarUrl = user.profile?.image_192;
  return !!gravatarUrl && !(await isRedirected(gravatarUrl));
}

const hasImageLazy = (user: User) => async () => {
  if (user.hasImage !== undefined) {
    return user.hasImage();
  }
  const value = await hasImage(user);
  user.hasImage = async () => value;
  return value;
};

export async function getUser({ id }: { id: string }) {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}
