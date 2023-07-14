import {
  CheckIcon,
  CopyIcon,
  DoubleArrowRightIcon,
  Pencil1Icon,
  PlayIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input.tsx";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { ApeCodeSource, ApeInterpreterHistory } from "@/hooks/useApe.ts";
import { cn } from "@/lib/utils.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useApe } from "@/apeContext.tsx";

const IN_TYPES: string[] = [ApeCodeSource.EDITOR, ApeCodeSource.REPL];

type ReplHistoryItemProps = Omit<ApeInterpreterHistory, "id"> & {
  onRunCode: (code: string) => void;
  onEdit: (value: string) => void;
};

function ReplHistoryItem({
  order,
  type,
  value,
  onRunCode,
  onEdit,
}: ReplHistoryItemProps) {
  const inType = IN_TYPES.includes(type);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  return (
    <code className="relative whitespace-pre-wrap group hover:bg-accent min-h-7 py-0.5">
      {order !== undefined && (
        <span
          className={cn(
            "pr-2 inline-block text-right self-start",
            inType ? "text-red-500" : "text-green-500"
          )}
        >
          {inType ? "In " : "Out"}[{order}]
        </span>
      )}
      {type === ApeCodeSource.EDITOR ? "<From Editor>" : value}

      <span className="absolute top-0 right-0 invisible group-hover:visible">
        {type === ApeCodeSource.REPL ? (
          <>
            <Button variant="outline" className="h-6 w-6 p-0 m-0.5">
              <PlayIcon onClick={() => onRunCode(value)} />
            </Button>
            <Button variant="outline" className="h-6 w-6 p-0 m-0.5">
              <Pencil1Icon onClick={() => onEdit(value)} />
            </Button>
          </>
        ) : null}
        <Button
          variant="outline"
          className="h-6 w-6 p-0 m-0.5 mr-4"
          onClick={() => {
            navigator.clipboard.writeText(value).then(() => setHasCopied(true));
          }}
        >
          {hasCopied ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
        </Button>
      </span>
    </code>
  );
}

export function Repl() {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScroll = useRef(true);
  const [replInput, setReplInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { history, runCode } = useApe();

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

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // Get data from form
    // @ts-ignore
    const replCode = e.target["repl-code"].value as string;
    runCode(replCode, ApeCodeSource.REPL);
    setReplInput("");
  };

  return (
    <div className="container py-1 flex flex-col max-w-full h-full overflow-auto w-full">
      <h3 className="text-xl mb-2">Output:</h3>

      <ScrollArea ref={containerRef}>
        <div className="flex flex-col max-w-full h-full w-full text-base font-mono py-1 break-all">
          {history.map(({ id, ...item }) => (
            <ReplHistoryItem
              key={id}
              {...item}
              onRunCode={(code) => runCode(code, ApeCodeSource.REPL)}
              onEdit={() => {
                setReplInput(item.value);
                inputRef.current?.focus();
              }}
            />
          ))}
          <code className="relative">
            <DoubleArrowRightIcon className="text-green-300 absolute inline-block mt-1 w-8 h-6 animate-pulse" />
            <form onSubmit={submitHandler}>
              <Input
                className="inline w-full m-0 h-8 pl-10"
                name="repl-code"
                value={replInput}
                onChange={(e) => setReplInput(e.target.value)}
                ref={inputRef}
              />
            </form>
          </code>
        </div>
      </ScrollArea>
    </div>
  );
}
