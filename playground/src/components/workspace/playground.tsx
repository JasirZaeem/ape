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
import { useEffect, useRef } from "react";
import { useApe } from "@/apeContext.tsx";

export function Playground() {
  const astPanelRef = useRef<ImperativePanelHandle>(null);

  const { astViewerVisible } = useApe();

  useEffect(() => {
    if (!astViewerVisible) {
      astPanelRef.current?.collapse();
    } else {
      astPanelRef.current?.expand();
    }
  }, [astViewerVisible]);

  return (
    <PanelGroup direction="vertical">
      <Panel>
        <PanelGroup direction="horizontal">
          <Panel>
            <Editor />
          </Panel>
          <PanelResizeHandle className="relative flex flex-col justify-center align-middle group bg-border w-2">
            <DotsVerticalIcon className="absolute mx-auto -translate-x-1/4 invisible group-hover:visible" />
          </PanelResizeHandle>
          <Panel collapsible ref={astPanelRef}>
            <AstViewer />
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="relative flex justify-center align-middle group bg-border h-2">
        <DotsHorizontalIcon className="absolute my-auto -translate-y-1/4 invisible group-hover:visible" />
      </PanelResizeHandle>
      <Panel>
        <Repl />
      </Panel>
    </PanelGroup>
  );
}
