import { useEffect, useState } from "react";

/**
 * useDebounce
 * Returns a debounced value that updates only after `delay` ms of inactivity.
 *
 * Example:
 *   const debounced = useDebounce(searchTerm, 300);
 */
export default function useDebounce<T>(value: T, delay = 300): T {
  const [state, setState] = useState<T>(value);

  useEffect(() => {
    const id = window.setTimeout(() => setState(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return state;
}
