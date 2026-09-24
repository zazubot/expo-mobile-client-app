import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface FilterChipsProps<T extends string> {
  options: readonly ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

/** Horizontal single-select chip row. */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: FilterChipsProps<T>) {
  const styles = useStyles(makeStyles);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.chip, selected && styles.chipSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}>
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    row: { gap: Spacing.two, paddingVertical: Spacing.one },
    chip: {
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderRadius: Radius.full,
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    chipSelected: { backgroundColor: theme.primary, borderColor: theme.primary },
    label: { fontSize: 14, fontWeight: '600', color: theme.textSecondary },
    labelSelected: { color: theme.onPrimary },
  });
