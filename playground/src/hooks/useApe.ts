import { useEffect, useRef, useState } from "react";

export enum ApeResultType {
  // E.g. "let x = 1"
  EMPTY = "EMPTY",

  // Errors
  ERROR = "ERROR",
  PARSE_ERROR = "PARSE_ERROR",
  WASM_ERROR = "WASM_ERROR",

  // Value types
  BOOLEAN = "BOOLEAN",
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  STRING = "STRING",
  ARRAY = "ARRAY",
  HASH = "HASH",
  FUNCTION = "FUNCTION",

  // Stdout added by hijacked console.log
  STDOUT = "STDOUT",
}

export enum ApeCodeSource {
  REPL = "REPL",
  EDITOR = "EDITOR",
}

export type ApeResult = {
  type: ApeResultType;
  value: string;
};

export type ApeInterpreterHistory = {
  type: ApeResultType | ApeCodeSource;
  value: string;
  order?: number;
  id: number;
};

let NEXT_ORDER = 0;

export function useApeInterpreter() {
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState<ApeInterpreterHistory[]>([]);
  const goRef = useRef<any>();

  useEffect(() => {
    // override console.log to add output to results and then call original console.log
    // @ts-ignore
    const originalLog = console.log;
    // @ts-ignore
    console.log = (...args) => {
      setHistory((results) => [
        ...results,
        {
          type: ApeResultType.STDOUT,
          value: args.join(" "),
          id: results.length,
        },
      ]);
      originalLog(...args);
    };

    const loadWasm = async () => {
      // @ts-ignore
      goRef.current = new globalThis.Go();
      // @ts-ignore
      const result = await WebAssembly.instantiateStreaming(
        fetch("/ape.wasm"),
        // @ts-ignore
        goRef.current.importObject
      );
      // @ts-ignore
      goRef.current.run(result.instance);
    };
    loadWasm().then(() => setReady(true));

    return () => {
      // @ts-ignore
      console.log = originalLog;
    };
  }, []);

  return {
    ready,
    history,
    runCode: (code: string, source: ApeCodeSource) => {
      setHistory((results) => [
        ...results,
        { type: source, value: code, order: NEXT_ORDER, id: results.length },
      ]);
      // runApeProgram global function is injected by Go
      // @ts-ignore
      const result = runApeProgram(code) as ApeResult;
      setHistory((results) => [
        ...results,
        { ...result, order: NEXT_ORDER, id: results.length },
      ]);
      NEXT_ORDER++;
      return result;
    },
    resetApe: () => {
      // resetApeEnvironment global function is injected by Go
      // @ts-ignore
      resetApeEnvironment();
    },
  };
}
