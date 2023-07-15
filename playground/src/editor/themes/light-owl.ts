import { tags as t } from "@lezer/highlight";
import { createTheme, CreateThemeOptions } from "@uiw/codemirror-themes";

export const defaultSettingsLightOwl: CreateThemeOptions["settings"] = {
  background: "#F0F0F0",
  foreground: "#0431fa",
  caret: "#90A7B2",
  selection: "#E0E0E0",
  selectionMatch: "#339cec33",
  gutterBackground: "#F0F0F0",
  gutterForeground: "#90A7B2",
  gutterBorder: "transparent",
  lineHighlight: "#00000030",
};

export const lightOwlInit = (options?: Partial<CreateThemeOptions>) => {
  const { theme = "dark", settings = {}, styles = [] } = options || {};
  return createTheme({
    theme: theme,
    settings: {
      ...defaultSettingsLightOwl,
      ...settings,
    },
    styles: [
      { tag: t.keyword, color: "#994cc3" },
      {
        tag: [t.name, t.deleted, t.character, t.macroName, t.variableName],
        color: "#403f53",
      },
      { tag: [t.propertyName], color: "#3760bf" },
      {
        tag: [
          t.processingInstruction,
          t.string,
          t.inserted,
          t.special(t.string),
        ],
        color: "#c96765",
      },
      { tag: [t.function(t.variableName), t.labelName], color: "#994cc3" },
      {
        tag: [t.color, t.constant(t.name), t.standard(t.name)],
        color: "#3760bf",
      },
      { tag: [t.definition(t.name), t.separator], color: "#3760bf" },
      { tag: [t.className], color: "#ffcb8b" },
      {
        tag: [
          t.number,
          t.changed,
          t.annotation,
          t.modifier,
          t.self,
          t.namespace,
        ],
        color: "#aa0982",
      },
      { tag: [t.typeName], color: "#007197" },
      { tag: [t.operator, t.operatorKeyword], color: "#0c969b" },
      { tag: [t.url, t.escape, t.regexp, t.link], color: "#587539" },
      { tag: [t.meta, t.comment], color: "#848cb5" },
      { tag: t.strong, fontWeight: "bold" },
      { tag: t.emphasis, fontStyle: "italic" },
      { tag: t.link, textDecoration: "underline" },
      { tag: t.heading, fontWeight: "bold", color: "#b15c00" },
      { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#bc5454" },
      { tag: t.invalid, color: "#f52a65" },
      { tag: t.strikethrough, textDecoration: "line-through" },
      ...styles,
    ],
  });
};

export const nightOwl = lightOwlInit();
