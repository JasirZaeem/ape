import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { clike } from "@codemirror/legacy-modes/mode/clike";
import { nightOwlInit } from "@/editor/themes/night-owl.ts";
import { fibApe } from "./codeExamples.ts";

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
    <div>
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

      <button onClick={clickHandler}>Run</button>

      {results.map((result, i) => (
        <pre key={i}>{result}</pre>
      ))}
    </div>
  );
}

export default App;
