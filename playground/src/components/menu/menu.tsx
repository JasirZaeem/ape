import { Button } from "@/components/ui/button.tsx";
import {
  CursorTextIcon,
  DesktopIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  InfoCircledIcon,
  MoonIcon,
  PlayIcon,
  ResetIcon,
  SunIcon,
  TextAlignLeftIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
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
import { ApeCodeSource, ApeResultType } from "@/hooks/useApe.ts";
import { useApe } from "@/apeContext.tsx";

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

export function Menu() {
  const { theme, setTheme } = useTheme();
  const CurrentThemeIcon = themeIcons[theme];

  const {
    code,
    setCode,
    setAstNow,
    formatCode,
    selectedCode,
    getAst,
    runCode,
    resetApe,
    astViewerVisible,
    setAstViewerVisible,
  } = useApe();

  function codeFormatHandler() {
    const result = formatCode(code);
    if (result.type === "FORMATTED") {
      setCode(result.value);
    }
  }

  function getAstHandler() {
    if (astViewerVisible) {
      setAstViewerVisible(false);
      return;
    }

    setAstViewerVisible(true);
    const result = getAst(code);
    if (result.type === ApeResultType.JSON_AST) {
      setAstNow(result.value);
    }
  }

  return (
    <div>
      <nav className="px-8 flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-4xl w-full">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-400">
            Ape
          </span>{" "}
          Playground
        </h1>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <ExampleSelector
            onSelectExample={(code) => {
              setCode(code);
            }}
          />

          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => runCode(code, ApeCodeSource.EDITOR)}
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
                    onClick={() => runCode(selectedCode, ApeCodeSource.EDITOR)}
                    variant="outline"
                    size="icon"
                    disabled={selectedCode === ""}
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
                <span>
                  <Button
                    onClick={codeFormatHandler}
                    variant="outline"
                    size="icon"
                  >
                    <TextAlignLeftIcon />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Format code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={resetApe} variant="outline" size="icon">
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
                <Button onClick={getAstHandler} variant="outline" size="icon">
                  {astViewerVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-center">
                  {astViewerVisible ? "Hide" : "Show"} AST
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setCode("")}
                  variant="outline"
                  size="icon"
                >
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

          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setCode("")}
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href="https://github.com/JasirZaeem/ape">
                    <InfoCircledIcon />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Check Documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </div>
  );
}
