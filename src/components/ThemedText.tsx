import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export type TextVariant =
  | 'body'
  | 'bodyStrong'
  | 'title'
  | 'heading'
  | 'subtitle'
  | 'caption'
  | 'label'
  | 'mono';

export interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: ThemeColor;
  center?: boolean;
}

export function ThemedText({
  style,
  variant = 'body',
  color = 'text',
  center = false,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  return (
    <Text
      style={[styles[variant], { color: theme[color] }, center && styles.center, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  body: { fontSize: 16, lineHeight: 22 },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.5 },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  subtitle: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18 },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  mono: { fontFamily: Fonts.mono, fontSize: 13, lineHeight: 18 },
  center: { textAlign: 'center' },
});
