import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { nightOwlInit } from "@/editor/themes/night-owl.ts";
import { fibonacci } from "./codeExamples.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { Repl } from "@/components/repl";
import { ApeCodeSource, useApeInterpreter } from "@/hooks/useApe.ts";
import { Menu } from "@/components/menu";
import { apeMode } from "@/editor/apeMode.ts";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

function App() {
  const { history, runCode, formatCode, resetApe } = useApeInterpreter();
  const [code, setCode] = useState(fibonacci);
  const [selectedCode, setSelectedCode] = useState("");

  function codeFormatHandler() {
    const result = formatCode(code);
    if (result.type === "FORMATTED") {
      setCode(result.value);
    }
  }

  return (
    <div className="bg-background h-full max-h-full grid grid-rows-layout w-full max-w-full overflow-hidden">
      <Menu
        onRun={() => runCode(code, ApeCodeSource.EDITOR)}
        onReset={resetApe}
        onRunSelected={() => runCode(selectedCode, ApeCodeSource.EDITOR)}
        onFormat={codeFormatHandler}
        onClearCode={() => setCode("")}
        codeSelected={selectedCode !== ""}
        onSelectExample={(code) => {
          setCode(code);
          setSelectedCode("");
        }}
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
          <Repl
            history={history}
            onRunCode={(code) => runCode(code, ApeCodeSource.REPL)}
          />
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
