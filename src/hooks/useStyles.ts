import { useMemo } from 'react';

import type { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

/**
 * Builds a memoized `StyleSheet` from the current theme.
 * Define the factory at module scope so the memo stays stable:
 *
 *   const makeStyles = (t: Theme) => StyleSheet.create({ ... });
 *   const styles = useStyles(makeStyles);
 */
export function useStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
