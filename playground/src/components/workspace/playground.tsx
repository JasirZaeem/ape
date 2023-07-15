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
import { useApe } from "@/apeContext.tsx";
import { Button } from "@/components/ui/button.tsx";

export function Playground() {
  const astPanelRef = useRef<ImperativePanelHandle>(null);

  const { astViewerVisible, setAstViewerVisible } = useApe();

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
              AST
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
