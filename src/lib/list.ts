/** `keyExtractor` for any entity keyed by its `id` field. */
export function keyById(item: { id: string }): string {
  return item.id;
}
