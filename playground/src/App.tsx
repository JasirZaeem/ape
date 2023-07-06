import { FormEventHandler, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { clike } from "@codemirror/legacy-modes/mode/clike";
import { nightOwlInit } from "@/editor/themes/night-owl.ts";
import { fibApe } from "./codeExamples.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { Repl } from "@/components/repl";
import { ApeCodeSource, useApeInterpreter } from "@/hooks/useApe.ts";
import { Menu } from "@/components/menu";

function App() {
  const { ready, history, runCode, resetApe } = useApeInterpreter();
  const [code, setCode] = useState(fibApe);
  const selectedCodeRef = useRef<string>("");

  function clickHandler() {
    if (!ready) return;
    runCode(code, ApeCodeSource.EDITOR);
  }

  function selectedCodeHandler() {
    if (!ready || !selectedCodeRef.current) return;
    runCode(selectedCodeRef.current, ApeCodeSource.EDITOR);
  }

  const replHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // Get data from form
    // @ts-ignore
    const replCode = e.target["repl-code"].value as string;
    if (ready && replCode) {
      runCode(replCode, ApeCodeSource.REPL);
      // @ts-ignore
      e.target["repl-code"].value = "";
    }
  };

  return (
    <div className="bg-background h-full max-h-full grid grid-rows-layout w-full max-w-full overflow-hidden">
      <Menu
        onRun={clickHandler}
        onReset={resetApe}
        onRunSelected={selectedCodeHandler}
      />
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
          onStatistics={(stats) => {
            selectedCodeRef.current = stats.selectionCode;
          }}
        />

        <Separator />
        <Repl history={history} replHandler={replHandler} />
      </main>

      <footer>
        <Separator />
        <div className="px-8 flex flex-col items-start space-y-2 py-4 sm:space-y-0 md:h-16">
          APE Playground
        </div>
      </footer>
    </div>
  );
}

export default App;
