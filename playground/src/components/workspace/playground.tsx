import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DotsHorizontalIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { Repl } from "@/components/repl";
import { Editor } from "@/components/workspace/editor.tsx";
import { AstViewer } from "@/components/workspace/astViewer.tsx";

export function Playground() {
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
          <Panel>
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
