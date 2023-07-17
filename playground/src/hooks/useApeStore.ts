import { create } from "zustand";
import { ApeInterpreterHistory } from "@/hooks/useApe.ts";
import { useEffect, useRef } from "react";
import { compressText, decompressText } from "@/lib/utils.ts";

type State = {
  code: string;
  setCode: (code: string) => void;
  setCodeToUrlHash: () => Promise<string>;
  selectedCode: string;
  isCodeSelected: boolean;
  setSelectedCode: (selectedCode: string) => void;
  astViewerVisible: boolean;
  setAstViewerVisible: (astViewerVisible: boolean) => void;
  ast: unknown;
  setAst: (ast: unknown) => void;
  history: ApeInterpreterHistory[];
  updateHistory: (
    updater: (history: ApeInterpreterHistory[]) => ApeInterpreterHistory[]
  ) => void;
};

function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  const value = window.localStorage.getItem(key);
  if (value === null) {
    return defaultValue;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return defaultValue;
  }
}

function setToLocalStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

async function getFromCompressedUrlHash<T>(defaultValue: T): Promise<T> {
  const value = window.location.hash.slice(1);
  if (value === "") {
    return defaultValue;
  }
  try {
    const text = await decompressText(value);
    return JSON.parse(text);
  } catch (e) {
    return defaultValue;
  }
}

async function setToCompressedUrlHash<T>(value: T) {
  const compressed = await compressText(JSON.stringify(value));
  const url = new URL(window.location.toString());
  url.hash = compressed;
  return url.toString();
}

export const useApeStore = create<State>((set, get) => {
  return {
    code: getFromLocalStorage("code", ""),
    setCode: (code: string) => {
      set({ code });
      setToLocalStorage("code", code);
    },
    setCodeToUrlHash: () => {
      return setToCompressedUrlHash(get().code);
    },
    selectedCode: "",
    isCodeSelected: false,
    setSelectedCode: (selectedCode: string) =>
      set({ selectedCode, isCodeSelected: selectedCode.trim() !== "" }),
    astViewerVisible: getFromLocalStorage("astViewerVisible", false),
    setAstViewerVisible: (astViewerVisible: boolean) => {
      set({ astViewerVisible });
      setToLocalStorage("astViewerVisible", astViewerVisible);
    },
    ast: {},
    setAst: (ast: unknown) => set({ ast }),
    history: [],
    updateHistory: (
      updater: (history: ApeInterpreterHistory[]) => ApeInterpreterHistory[]
    ) => {
      const newHistory = updater(get().history);
      set({ history: newHistory });
    },
  };
});

// Load shared code from hash if present
getFromCompressedUrlHash("").then((code) => {
  if (code !== "") {
    useApeStore.setState({ code });
  }
});

export function useTransientApeStore<T extends keyof State>(
  slice: T
): () => State[T] {
  const stateRef = useRef(useApeStore.getState()[slice]);

  useEffect(
    () => useApeStore.subscribe((state) => (stateRef.current = state[slice])),
    []
  );

  return () => stateRef.current;
}
