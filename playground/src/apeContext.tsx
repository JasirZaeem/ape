import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  ApeCodeSource,
  ApeInterpreterHistory,
  ApeResultType,
  FormatCodeResult,
  GetAstResult,
  useApeInterpreter,
} from "@/hooks/useApe.ts";
import { fibonacci } from "@/codeExamples.ts";
import { useDebouncedState } from "@/hooks/useDebouncedState.ts";

type ApeContextType = {
  history: ApeInterpreterHistory[];
  runCode: (code: string, source: ApeCodeSource) => void;
  formatCode: (code: string) => FormatCodeResult;
  getAst: (code: string) => GetAstResult;
  resetApe: () => void;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  ast: unknown;
  setDebouncedAst: Dispatch<SetStateAction<unknown>>;
  setAstNow: Dispatch<SetStateAction<unknown>>;
  selectedCode: string;
  setSelectedCode: Dispatch<SetStateAction<string>>;
};

const ApeContext = createContext<ApeContextType>({
  history: [],
  runCode: () => {},
  formatCode: () => ({ type: "FORMATTED", value: "" }),
  getAst: () => ({ type: ApeResultType.JSON_AST, value: {} }),
  resetApe: () => {},
  code: "",
  setCode: () => {},
  ast: {},
  setDebouncedAst: () => {},
  setAstNow: () => {},
  selectedCode: "",
  setSelectedCode: () => {},
});

export function ApeProvider({ children }: { children: ReactNode }) {
  const { history, runCode, formatCode, getAst, resetApe } =
    useApeInterpreter();
  const [code, setCode] = useState(fibonacci);
  const [ast, setDebouncedAst, setAstNow] = useDebouncedState<unknown>({}, 200);
  const [selectedCode, setSelectedCode] = useState("");

  return (
    <ApeContext.Provider
      value={{
        history,
        runCode,
        formatCode,
        getAst,
        resetApe,
        code,
        setCode,
        ast,
        setDebouncedAst,
        setAstNow,
        selectedCode,
        setSelectedCode,
      }}
    >
      {children}
    </ApeContext.Provider>
  );
}

export function useApe() {
  const value = useContext(ApeContext);
  if (value === undefined) {
    throw new Error("useApe must be used within a ApeProvider");
  }
  return value;
}
