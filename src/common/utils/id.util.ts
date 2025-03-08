export function nextId<T extends { id: number }>(items: T[]): number {
  const lastId = Math.max(0, ...items.map(item => item.id));
  return lastId + 1;
}
