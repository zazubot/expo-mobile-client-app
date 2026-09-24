import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface LoaderProps {
  label?: string;
  size?: 'small' | 'large';
  /** Render compactly inside a list instead of filling the screen. */
  inline?: boolean;
}

export function Loader({ label, size = 'large', inline = false }: LoaderProps) {
  const theme = useTheme();
  return (
    <View style={inline ? styles.inline : styles.fill}>
      <ActivityIndicator size={size} color={theme.primary} />
      {label ? (
        <ThemedText variant="caption" color="textSecondary">
          {label}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.five,
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
});
