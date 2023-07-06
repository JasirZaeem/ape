import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { clike } from "@codemirror/legacy-modes/mode/clike";
import { nightOwlInit } from "@/editor/themes/night-owl.ts";
import { fibApe } from "./codeExamples.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@radix-ui/react-separator";

function App() {
  const [code, setCode] = useState(fibApe);
  const [results, setResults] = useState<string[]>([]); // output
  const goRef = useRef(null); // global reference
  const [ready, setReady] = useState(false); // ready to run

  // load ape.wasm

  useEffect(() => {
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
  }, []);

  function clickHandler() {
    if (!ready) return;
    // @ts-ignore
    const result = run(code);
    setResults((results) => [...results, result]);
  }

  return (
    <div className="bg-background h-full flex-col">
      <nav className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">Playground</h2>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <Button onClick={clickHandler} variant="outline">
            Run
          </Button>
        </div>
      </nav>

      <Separator />

      <CodeMirror
        height="200px"
        value={code}
        onChange={(val) => setCode(val)}
        theme={nightOwlInit()}
        extensions={[
          StreamLanguage.define(
            clike({ name: "ape", keywords: ["fn", "if", "else", "let"] })
          ),
        ]}
      />

      <Separator />
      <div>
        {results.map((result, i) => (
          <pre key={i}>{result}</pre>
        ))}
      </div>
      <Separator />
      <footer>APE Playground by</footer>
    </div>
  );
}

export default App;
