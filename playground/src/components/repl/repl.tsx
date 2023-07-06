import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input.tsx";
import { FormEventHandler } from "react";
import { ApeCodeSource, ApeInterpreterHistory } from "@/hooks/useApe.ts";
import { cn } from "@/lib/utils.ts";

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
    <pre className="container flex flex-col max-w-full h-full overflow-auto w-full text-sm font-mono">
      {history.map(({ id, ...item }) => (
        <ReplHistoryItem key={id} {...item} />
      ))}
      <code className="relative">
        <DoubleArrowRightIcon className="text-green-300 absolute inline-block mt-0.5 w-8 h-5 animate-pulse" />
        <form onSubmit={replHandler}>
          <Input className="inline w-full m-0 h-6 pl-10" name="repl-code" />
        </form>
      </code>
    </pre>
  );
}
