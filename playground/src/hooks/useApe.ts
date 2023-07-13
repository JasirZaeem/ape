import { useEffect, useRef, useState } from "react";

export enum ApeResultType {
  // E.g. "let x = 1"
  EMPTY = "EMPTY",

  // Errors
  ERROR = "ERROR",
  PARSER_ERROR = "PARSER_ERROR",
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
      const order = NEXT_ORDER++;
      setHistory((results) => [
        ...results,
        { type: source, value: code, order, id: results.length },
      ]);
      // runApeProgram global function is injected by Go
      const result = ready
        ? // @ts-ignore
          (runApeProgram(code) as ApeResult)
        : {
            type: ApeResultType.WASM_ERROR,
            value: "Interpreter not ready",
          };
      setHistory((results) => [
        ...results,
        { ...result, order, id: results.length },
      ]);
      return result;
    },
    formatCode: (
      code: string
    ): {
      type: ApeResultType.PARSER_ERROR | "FORMATTED";
      value: string;
    } => {
      // formatApeCode global function is injected by Go
      // @ts-ignore
      const res = formatApeProgram(code);
      if (res.type === ApeResultType.PARSER_ERROR) {
        setHistory((results) => [...results, { ...res, id: results.length }]);
        return res;
      }
      return res;
    },
    resetApe: () => {
      // resetApeEnvironment global function is injected by Go
      // @ts-ignore
      resetApeEnvironment();
    },
  };
}