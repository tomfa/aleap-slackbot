const randomSort = () => Math.random() - 0.5;

export function shuffle<T = any>(items: T[]): T[] {
  return items.slice().sort(randomSort);
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
