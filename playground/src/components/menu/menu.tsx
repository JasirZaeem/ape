import { Button, ButtonProps } from "@/components/ui/button.tsx";
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
import { useApeStore } from "@/hooks/useApeStore.ts";
import { useApe } from "@/apeContext.tsx";
import { ReactNode } from "react";

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

function MenuButton({
  children,
  toolTipContent,
  ...props
}: ButtonProps & {
  toolTipContent: ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" {...props}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{toolTipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function RunCodeButton() {
  const code = useApeStore((state) => state.code);
  const { runCode } = useApe();

  return (
    <MenuButton
      toolTipContent="Run Code"
      onClick={() => runCode(code, ApeCodeSource.EDITOR)}
      variant="default"
      className="bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
    >
      <PlayIcon />
    </MenuButton>
  );
}

function RunSelectedCodeButton() {
  const selectedCode = useApeStore((state) => state.selectedCode);
  const isCodeSelected = useApeStore((state) => state.isCodeSelected);
  const { runCode } = useApe();

  return (
    <MenuButton
      toolTipContent="Run selected code"
      onClick={() => runCode(selectedCode, ApeCodeSource.EDITOR)}
      disabled={!isCodeSelected}
    >
      <CursorTextIcon />
    </MenuButton>
  );
}

const FormatCodeButton = () => {
  const code = useApeStore((state) => state.code);
  const { formatCode } = useApe();

  return (
    <MenuButton toolTipContent="Format code" onClick={() => formatCode(code)}>
      <TextAlignLeftIcon />
    </MenuButton>
  );
};

const ToggleAstViewerButton = () => {
  const code = useApeStore((state) => state.code);
  const astViewerVisible = useApeStore((state) => state.astViewerVisible);
  const setAstViewerVisible = useApeStore((state) => state.setAstViewerVisible);
  const setAst = useApeStore((state) => state.setAst);
  const { getAst } = useApe();

  function getAstHandler() {
    if (astViewerVisible) {
      setAstViewerVisible(false);
      return;
    }

    setAstViewerVisible(true);
    const result = getAst(code);
    if (result.type === ApeResultType.JSON_AST) {
      setAst(result.value);
    }
  }

  return (
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
  );
};

export function Menu() {
  const { theme, setTheme } = useTheme();
  const CurrentThemeIcon = themeIcons[theme];

  const { resetApe } = useApe();
  const setCode = useApeStore((state) => state.setCode);

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

          <RunCodeButton />
          <RunSelectedCodeButton />
          <FormatCodeButton />

          <MenuButton
            toolTipContent={
              <>
                Reset interpreter environment
                <br />
                (removes all set variables)
              </>
            }
            onClick={resetApe}
          >
            <ResetIcon />
          </MenuButton>

          <ToggleAstViewerButton />

          <MenuButton toolTipContent="Clear code" onClick={() => setCode("")}>
            <TrashIcon />
          </MenuButton>

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

          <MenuButton toolTipContent="View Documentation" asChild>
            <a href="https://github.com/JasirZaeem/ape" target="_blank">
              <InfoCircledIcon />
            </a>
          </MenuButton>
        </div>
      </nav>
    </div>
  );
}
