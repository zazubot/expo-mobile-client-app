import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/client';
import { Button } from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
  title?: string;
}

/** Full-screen error with a Retry button, used when a list has no data to show. */
export function ErrorState({ error, onRetry, title = "Couldn't load data" }: ErrorStateProps) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="cloud-offline-outline" size={28} color={theme.danger} />
      </View>
      <ThemedText variant="subtitle" center>
        {title}
      </ThemedText>
      <ThemedText color="textSecondary" center style={styles.message}>
        {getErrorMessage(error)}
      </ThemedText>
      <Button title="Retry" icon="refresh-outline" variant="secondary" onPress={onRetry} />
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.three,
      padding: Spacing.six,
    },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: Radius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.dangerSoft,
      marginBottom: Spacing.two,
    },
    message: { maxWidth: 320, marginBottom: Spacing.two },
  });
