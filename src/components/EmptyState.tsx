import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

import type { IconName } from '@/components/icons';
import { ThemedText } from '@/components/ThemedText';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: IconName;
  action?: ReactNode;
}

export function EmptyState({ title, message, icon = 'file-tray-outline', action }: EmptyStateProps) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={28} color={theme.primary} />
      </View>
      <ThemedText variant="subtitle" center>
        {title}
      </ThemedText>
      {message ? (
        <ThemedText color="textSecondary" center style={styles.message}>
          {message}
        </ThemedText>
      ) : null}
      {action}
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
      backgroundColor: theme.primarySoft,
      marginBottom: Spacing.two,
    },
    message: { maxWidth: 320 },
  });
