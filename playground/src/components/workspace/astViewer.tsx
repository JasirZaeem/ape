import { JSONTree } from "react-json-tree";
import { useApe } from "@/apeContext.tsx";
import { useEffect } from "react";
import { ApeResultType } from "@/hooks/useApe.ts";

export function AstViewer() {
  const { code, ast, getAst, setDebouncedAst } = useApe();

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
    <div className="overflow-auto w-full h-full bg-[#011627] pl-2">
      <JSONTree
        data={ast}
        shouldExpandNodeInitially={(_, __, level) => level < 3}
        theme={{
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
        }}
      />
    </div>
  );
}
