import { FormEventHandler, useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { clike } from "@codemirror/legacy-modes/mode/clike";
import { nightOwlInit } from "@/editor/themes/night-owl.ts";
import { fibApe } from "./codeExamples.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@radix-ui/react-separator";
import { Repl } from "@/components/repl";

function App() {
  const [code, setCode] = useState(fibApe);
  const [results, setResults] = useState<string[]>([]); // output
  const goRef = useRef(null); // global reference
  const [ready, setReady] = useState(false); // ready to run

  // load ape.wasm

  useEffect(() => {
    // override console.log to add output to results and then call original console.log
    // @ts-ignore
    const originalLog = console.log;
    // @ts-ignore
    console.log = (...args) => {
      setResults((results) => [...results, args.join(" ")]);
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

  function clickHandler() {
    if (!ready) return;
    // Global function from ape.wasm
    // @ts-ignore
    const result = runApeProgram(code);
    setResults((results) => [...results, result]);
  }

  const replHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // Get data from form
    // @ts-ignore
    const replCode = e.target["repl-code"].value as string;
    if (ready && replCode) {
      // Global function from ape.wasm
      // @ts-ignore
      const result = runApeProgram(replCode);
      setResults((results) => [...results, result]);
      // @ts-ignore
      e.target["repl-code"].value = "";
    }
  };

  return (
    <div className="bg-background h-full max-h-full grid grid-rows-layout w-full max-w-full overflow-hidden">
      <div>
        <nav className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <Button onClick={clickHandler} variant="outline">
              Run
            </Button>
            <Button
              onClick={() => {
                // Global function from ape.wasm
                // @ts-ignore
                resetApeEnvironment();
              }}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        </nav>
        <Separator />
      </div>

      <main className="h-full flex flex-col w-full overflow-hidden">
        <CodeMirror
          className="flex flex-row w-full max-w-full text-base"
          height="400px"
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
        <Repl results={results} replHandler={replHandler} />
      </main>

      <footer className="container flex flex-col items-start space-y-2 py-4 sm:space-y-0 md:h-16">
        <Separator className="my-4" />
        <div>APE Playground</div>
      </footer>
    </div>
  );
}

export default App;
