import { useRef, useState } from "react";

export function useDebouncedState<T>(
  value: T | (() => T),
  delay: number
): [
  T,
  (value: T | ((prevValue: T) => T)) => void,
  (value: T | ((prevValue: T) => T)) => void
] {
  const [state, setState] = useState(value);
  const timeout = useRef<number>(-1);

  function updateState(value: T | ((prevValue: T) => T)) {
    window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      setState(value);
    }, delay);
  }

  function updateStateImmediately(value: T | ((prevValue: T) => T)) {
    window.clearTimeout(timeout.current);
    setState(value);
  }

  return [state, updateState, updateStateImmediately];
}
