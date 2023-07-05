import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState('print("Hello, World!");');
  const [evaluated, setEvaluated] = useState(""); // output
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
    setEvaluated(result);
  }

  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>

      <button onClick={clickHandler}>Run</button>

      <pre>{evaluated}</pre>
    </div>
  );
}

export default App;
