import { FormEventHandler, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { clike } from "@codemirror/legacy-modes/mode/clike";
import { nightOwlInit } from "@/editor/themes/night-owl.ts";
import { fibApe } from "./codeExamples.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@radix-ui/react-separator";
import { Repl } from "@/components/repl";
import { ReplHistoryType, useApeInterpreter } from "@/hooks/useApe.ts";

function App() {
  const { ready, history, runCode, resetApe } = useApeInterpreter();

  const [code, setCode] = useState(fibApe);

  function clickHandler() {
    if (!ready) return;
    runCode(code, ReplHistoryType.EDITOR_CODE);
  }

  const replHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // Get data from form
    // @ts-ignore
    const replCode = e.target["repl-code"].value as string;
    if (ready && replCode) {
      runCode(replCode, ReplHistoryType.REPL_CODE);
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
                resetApe();
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
        <Repl history={history} replHandler={replHandler} />
      </main>

      <footer className="container flex flex-col items-start space-y-2 py-4 sm:space-y-0 md:h-16">
        <Separator className="my-4" />
        <div>APE Playground</div>
      </footer>
    </div>
  );
}

export default App;
