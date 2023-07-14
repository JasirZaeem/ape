import { nightOwlInit } from "@/editor/themes/night-owl.ts";
import { StreamLanguage } from "@codemirror/language";
import { apeMode } from "@/editor/apeMode.ts";
import CodeMirror from "@uiw/react-codemirror";
import { useApe } from "@/apeContext.tsx";

export function Editor() {
  const { code, setCode, setSelectedCode } = useApe();

  return (
    <CodeMirror
      className="flex flex-row w-full max-w-full h-full text-base"
      value={code}
      onChange={(val) => {
        setCode(val);
      }}
      theme={nightOwlInit()}
      extensions={[StreamLanguage.define(apeMode)]}
      onStatistics={(stats) => {
        setSelectedCode(stats.selectionCode.trim());
      }}
    />
  );
}
