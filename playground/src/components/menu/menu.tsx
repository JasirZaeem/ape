import { Button } from "@/components/ui/button.tsx";
import {
  CursorTextIcon,
  DesktopIcon,
  MoonIcon,
  PlayIcon,
  ResetIcon,
  SunIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator.tsx";
import { Theme, useTheme } from "@/themeContext.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { ExampleSelector } from "@/components/menu/exampleSelector.tsx";

type MenuProps = {
  onRun: () => void;
  onRunSelected: () => void;
  onReset: () => void;
  onClearCode: () => void;
  codeSelected: boolean;
  onSelectExample: (code: string) => void;
};

const themeIcons = {
  [Theme.System]: DesktopIcon,
  [Theme.Light]: SunIcon,
  [Theme.Dark]: MoonIcon,
};

const themeNames = {
  [Theme.System]: "System",
  [Theme.Light]: "Light",
  [Theme.Dark]: "Dark",
};

export function Menu({
  onRun,
  onRunSelected,
  onReset,
  onClearCode,
  codeSelected,
  onSelectExample,
}: MenuProps) {
  const { theme, setTheme } = useTheme();
  const CurrentThemeIcon = themeIcons[theme];

  return (
    <div>
      <nav className="px-8 flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">Playground</h2>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <ExampleSelector onSelectExample={onSelectExample} />

          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onRun}
                  variant="default"
                  size="icon"
                  className="bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                >
                  <PlayIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Run code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    onClick={onRunSelected}
                    variant="outline"
                    size="icon"
                    disabled={!codeSelected}
                  >
                    <CursorTextIcon />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Run selected code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onReset} variant="outline" size="icon">
                  <ResetIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-center">
                  Reset interpreter environment
                  <br />
                  (removes all set variables)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onClearCode} variant="outline" size="icon">
                  <TrashIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <TooltipProvider delayDuration={500}>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <span>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <CurrentThemeIcon />
                      </Button>
                    </TooltipTrigger>
                  </span>
                </DropdownMenuTrigger>

                <TooltipContent>
                  <p>Switch theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent>
              {Object.entries(themeIcons).map(([theme, Icon]) => (
                <DropdownMenuItem
                  key={theme}
                  onSelect={() => setTheme(theme as Theme)}
                >
                  <Icon className={"m-2"} /> {themeNames[theme as Theme]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <Separator />
    </div>
  );
}
