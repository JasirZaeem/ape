import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input.tsx";
import { FormEventHandler, useEffect, useRef } from "react";
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
    <code className="whitespace-pre-wrap">
      {order !== undefined && (
        <span
          className={cn(
            "pr-2 inline-block text-right",
            inType ? "text-red-500" : "text-green-500"
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
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScroll = useRef(true);

  useEffect(() => {
    if (containerRef.current && autoScroll.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const scrollHandler = () => {
    if (containerRef.current) {
      // Resume auto scroll if user is close to the bottom
      autoScroll.current =
        containerRef.current.scrollHeight -
          (containerRef.current.scrollTop + containerRef.current.clientHeight) <
        10;
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", scrollHandler);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", scrollHandler);
      }
    };
  }, []);

  return (
    <div className="container py-1 flex flex-col max-w-full h-full overflow-auto w-full">
      <h3 className="text-xl mb-2">Output:</h3>

      <ScrollArea ref={containerRef}>
        <div className="flex flex-col max-w-full h-full w-full text-base font-mono py-1 break-all">
          {history.map(({ id, ...item }) => (
            <ReplHistoryItem key={id} {...item} />
          ))}
          <code className="relative">
            <DoubleArrowRightIcon className="text-green-300 absolute inline-block mt-1 w-8 h-6 animate-pulse" />
            <form onSubmit={replHandler}>
              <Input className="inline w-full m-0 h-8 pl-10" name="repl-code" />
            </form>
          </code>
        </div>
      </ScrollArea>
    </div>
  );
}
