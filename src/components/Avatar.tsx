import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Radius, type Theme } from '@/constants/theme';
import { useStyles } from '@/hooks/useStyles';
import { initials } from '@/lib/format';

interface AvatarProps {
  /** Emoji, image URL, or empty. */
  icon?: string | null;
  name: string;
  size?: 'md' | 'lg';
}

const isUrl = (value: string) => /^https?:\/\//i.test(value);

/** Square avatar for workspaces and bots: image URL, emoji, or initials. */
export function Avatar({ icon, name, size = 'md' }: AvatarProps) {
  const styles = useStyles(makeStyles);
  const sizeStyle = size === 'lg' ? styles.lg : styles.md;

  if (icon && isUrl(icon)) {
    return (
      <Image
        source={{ uri: icon }}
        style={[styles.base, sizeStyle]}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View style={[styles.base, sizeStyle, styles.fallback]}>
      {icon ? (
        <Text style={size === 'lg' ? styles.emojiLg : styles.emojiMd}>{icon}</Text>
      ) : (
        <Text style={size === 'lg' ? styles.initialsLg : styles.initialsMd}>{initials(name)}</Text>
      )}
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: { borderRadius: Radius.md, overflow: 'hidden' },
    md: { width: 44, height: 44 },
    lg: { width: 56, height: 56, borderRadius: Radius.lg },
    fallback: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primarySoft,
    },
    emojiMd: { fontSize: 22, lineHeight: 28 },
    emojiLg: { fontSize: 28, lineHeight: 34 },
    initialsMd: { fontSize: 16, fontWeight: '700', color: theme.primary },
    initialsLg: { fontSize: 20, fontWeight: '700', color: theme.primary },
  });
