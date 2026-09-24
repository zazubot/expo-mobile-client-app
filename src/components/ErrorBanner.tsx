import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/client';
import { ThemedText } from '@/components/ThemedText';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';

interface ErrorBannerProps {
  error: unknown;
  onRetry: () => void;
}

/** Compact banner shown above stale data when a refresh fails. */
export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Ionicons name="warning-outline" size={18} color={theme.danger} />
      <ThemedText variant="caption" color="danger" style={styles.text}>
        {getErrorMessage(error)}
      </ThemedText>
      <Pressable onPress={onRetry} hitSlop={8} accessibilityRole="button">
        <ThemedText variant="caption" color="danger" style={styles.retry}>
          Retry
        </ThemedText>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      padding: Spacing.three,
      borderRadius: Radius.md,
      backgroundColor: theme.dangerSoft,
      marginBottom: Spacing.three,
    },
    text: { flex: 1 },
    retry: { fontWeight: '700' },
  });
