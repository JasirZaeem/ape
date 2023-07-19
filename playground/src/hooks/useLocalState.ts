import { Dispatch, SetStateAction, useState } from "react";

export function useLocalState<T>(
  init: T | (() => T),
  key: string
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const localState = localStorage.getItem(key);
    let parsedState: T | undefined;
    if (localState) {
      try {
        parsedState = JSON.parse(localState);
      } catch (e) {
        console.error(e);
        parsedState = undefined;
      }
    }

    return parsedState ?? (init instanceof Function ? init() : init);
  });

  function setLocalState(val: SetStateAction<T>) {
    setState((prevState) => {
      const newState = val instanceof Function ? val(prevState) : val;
      window.localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    });
  }

  return [state, setLocalState];
}
