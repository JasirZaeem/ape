import { nightOwl } from "@/editor/themes/night-owl.ts";
import { StreamLanguage } from "@codemirror/language";
import { apeMode } from "@/editor/apeMode.ts";
import CodeMirror from "@uiw/react-codemirror";
import { lightOwl } from "@/editor/themes/light-owl.ts";
import { useTheme } from "@/themeContext.tsx";
import { useApeStore } from "@/hooks/useApeStore.ts";
import { useEffect, useRef } from "react";
import { ApeResultType } from "@/hooks/useApe.ts";
import { useApe } from "@/apeContext.tsx";

export function Editor() {
  const code = useApeStore((state) => state.code);
  const setCode = useApeStore((state) => state.setCode);
  const setSelectedCode = useApeStore((state) => state.setSelectedCode);
  const astViewerVisible = useApeStore((state) => state.astViewerVisible);
  const setAst = useApeStore((state) => state.setAst);
  const { getAst } = useApe();
  const astUpdateTimeoutRef = useRef(-1);

  const { effectiveTheme } = useTheme();
  const theme = effectiveTheme === "light" ? lightOwl : nightOwl;

  useEffect(() => {
    if (astViewerVisible) {
      clearTimeout(astUpdateTimeoutRef.current);
      astUpdateTimeoutRef.current = window.setTimeout(() => {
        const newAst = getAst(code);
        if (newAst.type === ApeResultType.JSON_AST) setAst(newAst.value);
      }, 1000);
    } else {
      clearTimeout(astUpdateTimeoutRef.current);
    }

    return () => {
      clearTimeout(astUpdateTimeoutRef.current);
    };
  }, [code, astViewerVisible]);

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
