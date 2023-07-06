import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input.tsx";
import { FormEventHandler } from "react";
import { ApeCodeSource, ApeInterpreterHistory } from "@/hooks/useApe.ts";
import { cn } from "@/lib/utils.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

type ReplProps = {
  history: ApeInterpreterHistory[];
  replHandler: FormEventHandler<HTMLFormElement>;
};

const IN_TYPES: string[] = [ApeCodeSource.EDITOR, ApeCodeSource.REPL];

function ReplHistoryItem({
  order,
  type,
  value,
}: Omit<ApeInterpreterHistory, "id">) {
  const inType = IN_TYPES.includes(type);
  return (
    <code>
      {order !== undefined && (
        <span
          className={cn(
            "pr-2 inline-block text-right",
            inType ? "text-rose-600" : "text-green-300"
          )}
        >
          {inType ? "In " : "Out"}[{order}]
        </span>
      )}
      {type === ApeCodeSource.EDITOR ? "<From Editor>" : value}
    </code>
  );
}

export function Repl({ history, replHandler }: ReplProps) {
  return (
    <div className="container py-4 flex flex-col max-w-full h-full overflow-auto w-full">
      <h3 className="text-xl mb-2">Output:</h3>

      <ScrollArea>
        <pre className="flex flex-col max-w-full h-full w-full text-base font-mono">
          {history.map(({ id, ...item }) => (
            <ReplHistoryItem key={id} {...item} />
          ))}
          <code className="relative">
            <DoubleArrowRightIcon className="text-green-300 absolute inline-block mt-1 w-8 h-6 animate-pulse" />
            <form onSubmit={replHandler}>
              <Input className="inline w-full m-0 h-8 pl-10" name="repl-code" />
            </form>
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
}
