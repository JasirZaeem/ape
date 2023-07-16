import { create } from "zustand";
import { helloWorld } from "@/codeExamples.ts";
import { ApeInterpreterHistory } from "@/hooks/useApe.ts";

type State = {
  code: string;
  setCode: (code: string) => void;
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

export const useApeStore = create<State>((set, get) => {
  return {
    code: getFromLocalStorage("code", helloWorld),
    setCode: (code: string) => {
      set({ code });
      setToLocalStorage("code", code);
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
