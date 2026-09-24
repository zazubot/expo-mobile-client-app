import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableStateCallbackType } from 'react-native';

import { Badge, type BadgeTone } from '@/components/Badge';
import { ThemedText } from '@/components/ThemedText';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { formatDateTime, formatRelative, formatValue, truncate } from '@/lib/format';

type ResultAnswer = Result['answers'][number];
type ResultVariable = Result['variables'][number];

interface ResultCardProps {
  result: Result;
  expanded: boolean;
  onToggle: (id: string) => void;
}

function statusOf(result: Result): { label: string; tone: BadgeTone } {
  if (result.isArchived) return { label: 'Archived', tone: 'neutral' };
  if (result.isCompleted) return { label: 'Completed', tone: 'success' };
  if (result.hasStarted) return { label: 'In progress', tone: 'warning' };
  return { label: 'Viewed', tone: 'neutral' };
}

function previewOf(result: Result): string {
  const allAnswers: readonly ResultAnswer[] = result.answers ?? [];
  const allVariables: readonly ResultVariable[] = result.variables ?? [];
  const answers = allAnswers.map((answer) => answer.content).filter(Boolean);
  if (answers.length > 0) return truncate(answers.slice(0, 3).join(' · '));
  const variables = allVariables
    .filter((variable) => !variable.isSessionVariable && variable.value)
    .map((variable) => `${variable.name}: ${formatValue(variable.value)}`);
  if (variables.length > 0) return truncate(variables.slice(0, 3).join(' · '));
  return 'No answers recorded';
}

/** One result row; tap to expand and reveal every answer and variable. */
export function ResultCard({ result, expanded, onToggle }: ResultCardProps) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);
  const status = statusOf(result);
  // `src/types` declares these as one-element tuples; widen to arrays for iteration.
  const answers: readonly ResultAnswer[] = result.answers ?? [];
  const variables: readonly ResultVariable[] = result.variables ?? [];

  const cardStyle = ({ pressed }: PressableStateCallbackType) => [
    styles.card,
    pressed && styles.cardPressed,
  ];

  return (
    <Pressable
      onPress={() => onToggle(result.id)}
      style={cardStyle}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`Result from ${formatRelative(result.createdAt)}, ${status.label}`}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText variant="bodyStrong">{formatRelative(result.createdAt)}</ThemedText>
          <ThemedText variant="caption" color="textMuted">
            {formatDateTime(result.createdAt)}
          </ThemedText>
        </View>
        <Badge label={status.label} tone={status.tone} />
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.textMuted}
        />
      </View>

      {expanded ? (
        <View style={styles.details}>
          <Section title={`Answers (${answers.length})`}>
            {answers.length === 0 ? (
              <ThemedText variant="caption" color="textMuted">
                No answers recorded.
              </ThemedText>
            ) : (
              answers.map((answer, index) => (
                <View key={`${answer.blockId}-${index}`} style={styles.entry}>
                  <ThemedText selectable>{formatValue(answer.content)}</ThemedText>
                  {answer.attachedFileUrls?.length ? (
                    <ThemedText variant="caption" color="textMuted">
                      {answer.attachedFileUrls.length} attached file
                      {answer.attachedFileUrls.length === 1 ? '' : 's'}
                    </ThemedText>
                  ) : null}
                </View>
              ))
            )}
          </Section>

          <Section title={`Variables (${variables.length})`}>
            {variables.length === 0 ? (
              <ThemedText variant="caption" color="textMuted">
                No variables set.
              </ThemedText>
            ) : (
              variables.map((variable) => (
                <View key={variable.id} style={styles.variableRow}>
                  <ThemedText variant="caption" color="textSecondary" style={styles.variableName}>
                    {variable.name}
                  </ThemedText>
                  <ThemedText variant="caption" selectable style={styles.variableValue}>
                    {formatValue(variable.value)}
                  </ThemedText>
                </View>
              ))
            )}
          </Section>
        </View>
      ) : (
        <ThemedText variant="caption" color="textSecondary" numberOfLines={2}>
          {previewOf(result)}
        </ThemedText>
      )}
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.section}>
      <ThemedText variant="label" color="textMuted">
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      gap: Spacing.two,
      padding: Spacing.four,
      borderRadius: Radius.lg,
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    cardPressed: { backgroundColor: theme.surfacePressed },
    header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
    headerText: { flex: 1, gap: Spacing.half },
    details: {
      gap: Spacing.four,
      marginTop: Spacing.two,
      paddingTop: Spacing.three,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
    },
    section: { gap: Spacing.two },
    entry: {
      gap: Spacing.half,
      padding: Spacing.three,
      borderRadius: Radius.sm,
      backgroundColor: theme.background,
    },
    variableRow: {
      flexDirection: 'row',
      gap: Spacing.three,
      paddingVertical: Spacing.one,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    variableName: { flex: 2 },
    variableValue: { flex: 3 },
  });
