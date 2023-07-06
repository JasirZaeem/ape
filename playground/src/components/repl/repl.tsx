import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input.tsx";
import { FormEventHandler } from "react";

type ReplProps = {
  results: string[];
  replHandler: FormEventHandler<HTMLFormElement>;
};

export function Repl({ results, replHandler }: ReplProps) {
  return (
    <pre className="container flex flex-col max-w-full h-full overflow-auto w-full text-sm font-mono">
      {results.map((result, i) => (
        <code key={i}>
          <span className="text-green-300 w-10 pr-2 inline-block text-right">
            [{i + 1}]
          </span>
          {result}
        </code>
      ))}
      <code className="relative">
        <DoubleArrowRightIcon className="text-green-300 absolute inline-block mt-1 w-8 h-4 animate-pulse" />
        <form onSubmit={replHandler}>
          <Input className="inline w-full m-0 h-6 pl-10" name="repl-code" />
        </form>
      </code>
    </pre>
  );
}
