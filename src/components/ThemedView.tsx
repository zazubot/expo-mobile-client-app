import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export interface ThemedViewProps extends ViewProps {
  surface?: 'background' | 'surface' | 'transparent';
}

export function ThemedView({ style, surface = 'background', ...rest }: ThemedViewProps) {
  const theme = useTheme();
  const backgroundColor = surface === 'transparent' ? 'transparent' : theme[surface];
  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
