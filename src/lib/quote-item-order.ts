/** Reordena un arreglo moviendo el índice `from` a `to`. */
export function reorderList<T>(list: T[], from: number, to: number): T[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= list.length ||
    to >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

type SortableItem = {
  sort_order?: number | null;
  created_at?: string | null;
  id?: string;
};

/** Ordena partidas por sort_order (corridas vacías incluidas). */
export function sortQuoteItems<T extends SortableItem>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ao = a.sort_order;
    const bo = b.sort_order;
    if (typeof ao === 'number' && typeof bo === 'number' && ao !== bo) {
      return ao - bo;
    }
    if (typeof ao === 'number' && typeof bo !== 'number') return -1;
    if (typeof bo === 'number' && typeof ao !== 'number') return 1;
    const ac = a.created_at || '';
    const bc = b.created_at || '';
    if (ac !== bc) return ac.localeCompare(bc);
    return String(a.id || '').localeCompare(String(b.id || ''));
  });
}
