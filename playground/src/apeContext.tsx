import { createContext, ReactNode, useContext } from "react";
import {
  ApeCodeSource,
  ApeResultType,
  FormatCodeResult,
  GetAstResult,
  useApeInterpreter,
} from "@/hooks/useApe.ts";

type ApeContextType = {
  runCode: (code: string, source: ApeCodeSource) => void;
  formatCode: (code: string) => FormatCodeResult;
  getAst: (code: string) => GetAstResult;
  resetApe: () => void;
};

const ApeContext = createContext<ApeContextType>({
  runCode: () => {},
  formatCode: () => ({ type: ApeResultType.FORMATTED, value: "" }),
  getAst: () => ({ type: ApeResultType.JSON_AST, value: {} }),
  resetApe: () => {},
});

export function ApeProvider({ children }: { children: ReactNode }) {
  const { runCode, formatCode, getAst, resetApe } = useApeInterpreter();
  return (
    <ApeContext.Provider
      value={{
        runCode,
        formatCode,
        getAst,
        resetApe,
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
