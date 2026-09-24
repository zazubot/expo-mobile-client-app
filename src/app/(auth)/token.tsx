import { Image } from 'expo-image';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { ThemedText } from '@/components/ThemedText';
import { API_URL, APP_NAME } from '@/constants/config';
import { MaxContentWidth, Radius, Spacing, type Theme } from '@/constants/theme';
import { signInErrorMessage, useSignIn } from '@/hooks/useSignIn';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';

const logo = require('@/assets/logo.png');

export default function TokenScreen() {
  const theme = useTheme();
  const styles = useStyles(makeStyles);
  const signIn = useSignIn();
  const [token, setToken] = useState('');

  const trimmed = token.trim();
  const canSubmit = trimmed.length > 0 && !signIn.isPending;
  const errorMessage = signIn.isError ? signInErrorMessage(signIn.error) : null;

  const submit = () => {
    if (canSubmit) signIn.mutate(trimmed);
  };

  const handleChange = (value: string) => {
    setToken(value);
    if (signIn.isError) signIn.reset();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          <View style={styles.hero}>
            <Image
              source={logo}
              style={styles.logo}
              contentFit="contain"
              tintColor={theme.text}
              accessibilityLabel={`${APP_NAME} logo`}
            />
            <ThemedText variant="title" center>
              {APP_NAME}
            </ThemedText>
            <ThemedText color="textSecondary" center style={styles.tagline}>
              Sign in with your API token to browse your workspaces, bots and results.
            </ThemedText>
          </View>

          <View style={styles.card}>
            <TextField
              label="API token"
              placeholder="Paste your token"
              value={token}
              onChangeText={handleChange}
              error={errorMessage}
              secureToggle
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={submit}
              editable={!signIn.isPending}
              autoFocus
            />
            <Button
              title="Continue"
              onPress={submit}
              disabled={!canSubmit}
              loading={signIn.isPending}
            />
            {!API_URL ? (
              <ThemedText variant="caption" color="danger" center>
                EXPO_PUBLIC_API_URL is not set. Add it to .env and restart the dev server with
                --clear.
              </ThemedText>
            ) : null}
          </View>

          <ThemedText variant="caption" color="textMuted" center style={styles.footer}>
            Create a token in {APP_NAME} under Settings & Members › My account › API tokens. It is
            stored encrypted on this device only.
          </ThemedText>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    flex: { flex: 1 },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      width: '100%',
      maxWidth: MaxContentWidth,
      alignSelf: 'center',
      padding: Spacing.five,
      gap: Spacing.six,
    },
    hero: { alignItems: 'center', gap: Spacing.three },
    logo: { width: 96, height: 104 },
    tagline: { maxWidth: 320 },
    card: {
      gap: Spacing.four,
      padding: Spacing.five,
      borderRadius: Radius.xl,
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    footer: { maxWidth: 360, alignSelf: 'center' },
  });
