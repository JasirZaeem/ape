import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState('print("Hello, World!");');
  const [evaluated, setEvaluated] = useState(""); // output
  const goref = useRef(null); // global reference
  const [ready, setReady] = useState(false); // ready to run

  // load ape.wasm

  useEffect(() => {
    const loadWasm = async () => {
      goref.current = new globalThis.Go();
      const result = await WebAssembly.instantiateStreaming(
        fetch("/ape.wasm"),
        goref.current.importObject
      );
      goref.current.run(result.instance);
    };
    loadWasm().then(() => setReady(true));
  }, []);

  function clickHandler() {
    if (!ready) return;
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
