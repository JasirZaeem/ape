import { JSONTree } from "react-json-tree";
import { useApe } from "@/apeContext.tsx";
import { useEffect } from "react";
import { ApeResultType } from "@/hooks/useApe.ts";
import { useTheme } from "@/themeContext.tsx";

const darkTheme = {
  base00: "#011627",
  base01: "#ff5874",
  base02: "#addb67",
  base03: "#f78c6c",
  base04: "#82aaff",
  base05: "#c792ea",
  base06: "#7fdbca",
  base07: "#eeeeee",
  base08: "#637777",
  base09: "#ff5874",
  base0A: "#addb67",
  base0B: "#f78c6c",
  base0C: "#82aaff",
  base0D: "#c792ea",
  base0E: "#7fdbca",
  base0F: "#eeeeee",
};

const lightTheme = {
  base00: "#F0F0F0",
  base01: "#288ed7",
  base02: "#2AA298",
  base03: "#08916a",
  base04: "#d6438a",
  base05: "#de3d3b",
  base06: "#F0F0F0",
  base07: "#E0AF02",
  base08: "#403f53",
  base09: "#FF0000",
  base0A: "#00FF00",
  base0B: "#de3d3b",
  base0C: "#0000FF",
  base0D: "#FF0000",
  base0E: "#0000FF",
  base0F: "#403f53",
};

export function AstViewer() {
  const { code, ast, getAst, setDebouncedAst } = useApe();
  const { effectiveTheme } = useTheme();
  const theme = effectiveTheme === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    setDebouncedAst((prevAst: unknown) => {
      const result = getAst(code);
      if (result.type === ApeResultType.JSON_AST) {
        return result.value;
      }
      return prevAst;
    });
  }, [code]);
  return (
    <div className="overflow-auto w-full h-full bg-[#F0F0F0] dark:bg-[#011627] pl-2">
      <JSONTree
        data={ast}
        shouldExpandNodeInitially={(_, __, level) => level < 3}
        theme={theme}
      />
    </div>
  );
}
