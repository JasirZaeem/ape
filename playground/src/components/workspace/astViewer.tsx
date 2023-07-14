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
    <div className="overflow-auto w-full h-full">
      <JSONTree
        data={ast}
        shouldExpandNodeInitially={(_, __, level) => level < 3}
      />
    </div>
  );
}
