import { Button } from "@/components/ui/button.tsx";
import {
  CursorTextIcon,
  DesktopIcon,
  MoonIcon,
  PlayIcon,
  ResetIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator.tsx";
import { Theme, useTheme } from "@/themeContext.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

type MenuProps = {
  onRun: () => void;
  onRunSelected: () => void;
  onReset: () => void;
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

export function Menu({ onRun, onRunSelected, onReset }: MenuProps) {
  const { theme, setTheme } = useTheme();
  const CurrentThemeIcon = themeIcons[theme];

  return (
    <div>
      <nav className="px-8 flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">Playground</h2>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <Button onClick={onRun} variant="default" size="icon">
            <PlayIcon />
          </Button>
          <Button onClick={onRunSelected} variant="outline" size="icon">
            <CursorTextIcon />
          </Button>
          <Button onClick={onReset} variant="outline" size="icon">
            <ResetIcon />
          </Button>
          {/*  theme switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <CurrentThemeIcon />
              </Button>
            </DropdownMenuTrigger>
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
