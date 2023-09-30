export function shuffle<T = any>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function findAsync<T>(
  arr: T[],
  asyncCallback: (v: T) => Promise<any>,
  syncExecution = true,
) {
  if (syncExecution) {
    for (const element of arr) {
      const result = await asyncCallback(element);
      if (result) return element;
    }
  } else {
    const promises = arr.map(asyncCallback);
    const results = await Promise.all(promises);
    const index = results.findIndex((result) => result);
    return arr[index];
  }
}
