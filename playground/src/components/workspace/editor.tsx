import { nightOwl } from "@/editor/themes/night-owl.ts";
import { StreamLanguage } from "@codemirror/language";
import { apeMode } from "@/editor/apeMode.ts";
import CodeMirror from "@uiw/react-codemirror";
import { useApe } from "@/apeContext.tsx";
import { lightOwl } from "@/editor/themes/light-owl.ts";
import { useTheme } from "@/themeContext.tsx";

export function Editor() {
  const { code, setCode, setSelectedCode } = useApe();

  const { effectiveTheme } = useTheme();

  const theme = effectiveTheme === "light" ? lightOwl : nightOwl;

  return (
    <CodeMirror
      className="flex flex-row w-full max-w-full h-full text-base"
      value={code}
      onChange={(val) => {
        setCode(val);
      }}
      theme={theme}
      extensions={[StreamLanguage.define(apeMode)]}
      onStatistics={(stats) => {
        setSelectedCode(stats.selectionCode.trim());
      }}
    />
  );
}
