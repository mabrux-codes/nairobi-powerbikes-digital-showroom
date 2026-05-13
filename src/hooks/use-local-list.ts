import { useEffect, useState, useCallback } from "react";

const listeners = new Map<string, Set<() => void>>();

function notify(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useLocalList(key: string, max = 50) {
  const [items, setItems] = useState<string[]>(() => read(key));

  useEffect(() => {
    const fn = () => setItems(read(key));
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(fn);
    fn();
    return () => { listeners.get(key)?.delete(fn); };
  }, [key]);

  const set = useCallback((next: string[]) => {
    localStorage.setItem(key, JSON.stringify(next.slice(0, max)));
    notify(key);
  }, [key, max]);

  const toggle = useCallback((id: string) => {
    const cur = read(key);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    set(next);
  }, [key, set]);

  const remove = useCallback((id: string) => set(read(key).filter((x) => x !== id)), [key, set]);
  const clear = useCallback(() => set([]), [set]);
  const has = useCallback((id: string) => items.includes(id), [items]);

  return { items, toggle, remove, clear, has, set };
}

export const useWishlist = () => useLocalList("npb:wishlist", 100);
export const useCompare = () => useLocalList("npb:compare", 4);
