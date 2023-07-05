import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("print('Hello, World!');");

  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>

      <button>Run</button>

      <pre>{code}</pre>
    </div>
  );
}

export default App;
