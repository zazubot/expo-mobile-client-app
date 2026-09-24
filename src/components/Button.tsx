import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { IconName } from '@/components/icons';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);
  const isDisabled = disabled || loading;
  const textColor = TEXT_COLORS[variant](theme);

  const containerStyle = ({ pressed }: PressableStateCallbackType) => [
    styles.base,
    styles[variant],
    pressed && !isDisabled && styles[`${variant}Pressed`],
    isDisabled && styles.disabled,
    style,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={containerStyle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={textColor} /> : null}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const TEXT_COLORS: Record<ButtonVariant, (theme: Theme) => string> = {
  primary: (t) => t.onPrimary,
  secondary: (t) => t.text,
  ghost: (t) => t.primary,
  danger: (t) => t.onPrimary,
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      minHeight: 50,
      paddingHorizontal: Spacing.five,
      paddingVertical: Spacing.three,
      borderRadius: Radius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.two,
    },
    text: { fontSize: 16, fontWeight: '600' },
    disabled: { opacity: 0.5 },
    primary: { backgroundColor: theme.primary },
    primaryPressed: { backgroundColor: theme.primaryPressed },
    secondary: {
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    secondaryPressed: { backgroundColor: theme.surfacePressed },
    ghost: { backgroundColor: 'transparent' },
    ghostPressed: { backgroundColor: theme.primarySoft },
    danger: { backgroundColor: theme.danger },
    dangerPressed: { opacity: 0.85 },
  });
