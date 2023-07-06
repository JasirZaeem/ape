import { Button } from "@/components/ui/button.tsx";
import { PlayIcon, ResetIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator.tsx";

type MenuProps = {
  onRun: () => void;
  onReset: () => void;
};

export function Menu({ onRun, onReset }: MenuProps) {
  return (
    <div>
      <nav className="px-8 flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">Playground</h2>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <Button onClick={onRun} variant="outline" size="icon">
            <PlayIcon />
          </Button>
          <Button onClick={onReset} variant="outline" size="icon">
            <ResetIcon />
          </Button>
        </div>
      </nav>
      <Separator />
    </div>
  );
}
