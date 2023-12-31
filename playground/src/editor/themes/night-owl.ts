import { tags as t } from "@lezer/highlight";
import { createTheme, CreateThemeOptions } from "@uiw/codemirror-themes";

export const defaultSettingsNightOwl: CreateThemeOptions["settings"] = {
  background: "#011627",
  foreground: "#ffd700",
  caret: "#80a4c2",
  selection: "#1d3b53",
  selectionMatch: "#5f7e9779",
  gutterBackground: "#011627",
  gutterForeground: "#80a4c2",
  gutterBorder: "transparent",
  lineHighlight: "#F0F0F033",
};

export const nightOwlInit = (options?: Partial<CreateThemeOptions>) => {
  const { theme = "dark", settings = {}, styles = [] } = options || {};
  return createTheme({
    theme: theme,
    settings: {
      ...defaultSettingsNightOwl,
      ...settings,
    },
    styles: [
      { tag: t.keyword, color: "#c792ea" },
      {
        tag: [t.name, t.deleted, t.character, t.macroName, t.variableName],
        color: "#d7dbe0",
      },
      { tag: [t.propertyName], color: "#3760bf" },
      {
        tag: [
          t.processingInstruction,
          t.string,
          t.inserted,
          t.special(t.string),
        ],
        color: "#ecc48d",
      },
      { tag: [t.function(t.variableName), t.labelName], color: "#82AAFF" },
      {
        tag: [t.color, t.constant(t.name), t.standard(t.name)],
        color: "#3760bf",
      },
      { tag: [t.definition(t.name), t.separator], color: "#3760bf" },
      { tag: [t.className], color: "#111111" },
      {
        tag: [
          t.number,
          t.changed,
          t.annotation,
          t.modifier,
          t.self,
          t.namespace,
        ],
        color: "#F78C6C",
      },
      { tag: [t.typeName], color: "#007197" },
      { tag: [t.operator, t.operatorKeyword], color: "#7fdbca" },
      { tag: [t.url, t.escape, t.regexp, t.link], color: "#587539" },
      { tag: [t.meta, t.comment], color: "#848cb5" },
      { tag: t.strong, fontWeight: "bold" },
      { tag: t.emphasis, fontStyle: "italic" },
      { tag: t.link, textDecoration: "underline" },
      { tag: t.heading, fontWeight: "bold", color: "#b15c00" },
      { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#ff5874" },
      { tag: t.invalid, color: "#f52a65" },
      { tag: t.strikethrough, textDecoration: "line-through" },
      ...styles,
    ],
  });
};

export const nightOwl = nightOwlInit();
