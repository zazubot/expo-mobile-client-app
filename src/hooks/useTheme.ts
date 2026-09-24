import { Colors, type Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

/** Returns the color palette for the active color scheme. */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}
