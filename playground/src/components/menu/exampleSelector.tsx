import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { examples } from "@/codeExamples.ts";

const exampleNames = Object.keys(examples);
type ExampleSelectorProps = {
  onSelectExample: (code: string) => void;
};

export function ExampleSelector({ onSelectExample }: ExampleSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      onSelectExample(examples[value as keyof typeof examples]);
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ?? "Select example..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search example..." className="h-9" />
          <CommandEmpty>No example found.</CommandEmpty>
          <CommandGroup>
            {exampleNames.map((example) => (
              <CommandItem
                key={example}
                onSelect={() => {
                  setValue(example === value ? null : example);
                  setOpen(false);
                }}
              >
                {example}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === example ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
