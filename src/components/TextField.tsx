import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string | null;
  hint?: string;
  /** Adds a show/hide toggle and hides the value by default. */
  secureToggle?: boolean;
}

export function TextField({
  label,
  error,
  hint,
  secureToggle = false,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const theme = useTheme();
  const styles = useStyles(makeStyles);
  const [hidden, setHidden] = useState(secureToggle);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <ThemedText variant="label" color="textSecondary">
          {label}
        </ThemedText>
      ) : null}
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}>
        <TextInput
          {...inputProps}
          style={[styles.input, style]}
          placeholderTextColor={theme.textMuted}
          secureTextEntry={secureToggle ? hidden : inputProps.secureTextEntry}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
        />
        {secureToggle ? (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            hitSlop={8}
            style={styles.toggle}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show token' : 'Hide token'}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <ThemedText variant="caption" color="danger" accessibilityRole="alert">
          {error}
        </ThemedText>
      ) : hint ? (
        <ThemedText variant="caption" color="textMuted">
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: { gap: Spacing.two },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 50,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      paddingLeft: Spacing.four,
      paddingRight: Spacing.two,
    },
    fieldFocused: { borderColor: theme.primary },
    fieldError: { borderColor: theme.danger },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      paddingVertical: Spacing.three,
    },
    toggle: { padding: Spacing.two },
  });
