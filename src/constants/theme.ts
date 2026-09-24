/**
 * Design tokens for Zazubot: a monochrome (gray/black) palette in light and dark,
 * plus spacing, radii and fonts. Status tones are grayscale too; badges and
 * messages carry meaning through their labels and icons, not hue.
 * Components read colors through `useTheme()` and build styles with `useStyles()`.
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: '#111111',
    primaryPressed: '#333333',
    primarySoft: '#ECECEC',
    onPrimary: '#FFFFFF',
    background: '#F4F4F4',
    surface: '#FFFFFF',
    surfacePressed: '#EAEAEA',
    border: '#DEDEDE',
    text: '#111111',
    textSecondary: '#555555',
    textMuted: '#8A8A8A',
    danger: '#1A1A1A',
    dangerSoft: '#E4E4E4',
    success: '#2B2B2B',
    successSoft: '#E9E9E9',
    warning: '#6B6B6B',
    warningSoft: '#F0F0F0',
  },
  dark: {
    primary: '#F5F5F5',
    primaryPressed: '#D6D6D6',
    primarySoft: '#2A2A2A',
    onPrimary: '#111111',
    background: '#0D0D0D',
    surface: '#171717',
    surfacePressed: '#222222',
    border: '#2C2C2C',
    text: '#F5F5F5',
    textSecondary: '#B3B3B3',
    textMuted: '#7A7A7A',
    danger: '#EDEDED',
    dangerSoft: '#2E2E2E',
    success: '#DCDCDC',
    successSoft: '#262626',
    warning: '#A6A6A6',
    warningSoft: '#202020',
  },
} as const;

export type Theme = { readonly [K in keyof typeof Colors.light]: string };
export type ThemeColor = keyof Theme;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    mono: "ui-monospace",
  },
  web: {
    sans: "Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  },
  default: {
    sans: "normal",
    mono: "monospace",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

/** Content is centered and capped at this width on wide screens (web, tablets). */
export const MaxContentWidth = 720;
