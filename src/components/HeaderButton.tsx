import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, type PressableStateCallbackType } from 'react-native';

import type { IconName } from '@/components/icons';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface HeaderButtonProps {
  onPress: () => void;
  icon?: IconName;
  label?: string;
  accessibilityLabel: string;
}

export function HeaderButton({ onPress, icon, label, accessibilityLabel }: HeaderButtonProps) {
  const theme = useTheme();
  const style = ({ pressed }: PressableStateCallbackType) => [
    styles.button,
    pressed && styles.pressed,
  ];
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={style}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      {icon ? <Ionicons name={icon} size={20} color={theme.primary} /> : null}
      {label ? <Text style={[styles.label, { color: theme.primary }]}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
  },
  pressed: { opacity: 0.6 },
  label: { fontSize: 16, fontWeight: '600' },
});
