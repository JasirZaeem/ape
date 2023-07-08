import { FormEventHandler, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { nightOwlInit } from "@/editor/themes/night-owl.ts";
import { fibApe } from "./codeExamples.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { Repl } from "@/components/repl";
import { ApeCodeSource, useApeInterpreter } from "@/hooks/useApe.ts";
import { Menu } from "@/components/menu";
import { apeMode } from "@/editor/apeMode.ts";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

function App() {
  const { ready, history, runCode, resetApe } = useApeInterpreter();
  const [code, setCode] = useState(fibApe);
  const [selectedCode, setSelectedCode] = useState("");

  function clickHandler() {
    if (!ready) return;
    runCode(code, ApeCodeSource.EDITOR);
  }

  function selectedCodeHandler() {
    if (!ready) return;
    runCode(selectedCode, ApeCodeSource.EDITOR);
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
        onClearCode={() => setCode("")}
        codeSelected={selectedCode !== ""}
      />
      <PanelGroup direction="vertical">
        <Panel>
          <CodeMirror
            className="flex flex-row w-full max-w-full h-full text-base"
            value={code}
            onChange={(val) => setCode(val)}
            theme={nightOwlInit()}
            extensions={[StreamLanguage.define(apeMode)]}
            onStatistics={(stats) => {
              setSelectedCode(stats.selectionCode.trim());
            }}
          />
        </Panel>
        <PanelResizeHandle className="relative flex justify-center align-middle group bg-border h-2">
          <DotsHorizontalIcon className="absolute my-auto -translate-y-1/4 invisible group-hover:visible" />
        </PanelResizeHandle>
        <Panel>
          <Repl history={history} replHandler={replHandler} />
        </Panel>
      </PanelGroup>

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
