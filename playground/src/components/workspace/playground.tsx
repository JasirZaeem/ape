import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { DotsHorizontalIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { Repl } from "@/components/repl";
import { Editor } from "@/components/workspace/editor.tsx";
import { AstViewer } from "@/components/workspace/astViewer.tsx";
import { useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useApeStore } from "@/hooks/useApeStore.ts";

export function Playground() {
  const astPanelRef = useRef<ImperativePanelHandle>(null);
  const astViewerVisible = useApeStore((state) => state.astViewerVisible);
  const setAstViewerVisible = useApeStore((state) => state.setAstViewerVisible);

  return (
    <PanelGroup direction="vertical">
      <Panel>
        <PanelGroup direction="horizontal" className="relative">
          <Panel className="rounded-r">
            <Editor />
          </Panel>
          {astViewerVisible ? (
            <>
              <PanelResizeHandle className="relative flex flex-col justify-center align-middle group hover:bg-border w-2">
                <DotsVerticalIcon className="absolute mx-auto -translate-x-1/4 invisible group-hover:visible" />
              </PanelResizeHandle>
              <Panel ref={astPanelRef} minSize={20} className="rounded-l">
                <AstViewer />
              </Panel>
            </>
          ) : (
            <Button
              className="absolute right-0 top-5 rounded-b-none -rotate-90 translate-x-1/4"
              variant="outline"
              onClick={() => {
                setAstViewerVisible(true);
              }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-400">
                AST
              </span>
            </Button>
          )}
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="relative flex justify-center align-middle group hover:bg-border h-2">
        <DotsHorizontalIcon className="absolute my-auto -translate-y-1/4 invisible group-hover:visible" />
      </PanelResizeHandle>
      <Panel>
        <Repl />
      </Panel>
    </PanelGroup>
  );
}
