import { useCallback, useState, type ReactElement } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, type ListRenderItem } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ErrorState } from '@/components/ErrorState';
import type { IconName } from '@/components/icons';
import { Loader } from '@/components/Loader';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface QueryListProps<T> {
  data: readonly T[] | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  onRefresh: () => Promise<unknown>;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  emptyTitle: string;
  emptyMessage?: string;
  emptyIcon?: IconName;
  ListHeaderComponent?: ReactElement | null;
  onEndReached?: () => void;
  isFetchingMore?: boolean;
  extraData?: unknown;
}

/**
 * FlatList with the loading / error / empty / pull-to-refresh / load-more
 * states every list screen needs. Screens pass React Query flags straight in.
 */
export function QueryList<T>({
  data,
  isPending,
  isError,
  error,
  onRetry,
  onRefresh,
  renderItem,
  keyExtractor,
  emptyTitle,
  emptyMessage,
  emptyIcon,
  ListHeaderComponent = null,
  onEndReached,
  isFetchingMore = false,
  extraData,
}: QueryListProps<T>) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  if (isPending) return <Loader />;

  const items = data ?? [];
  if (isError && items.length === 0) return <ErrorState error={error} onRetry={onRetry} />;

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={extraData}
      style={styles.list}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={
        <>
          {isError ? <ErrorBanner error={error} onRetry={onRetry} /> : null}
          {ListHeaderComponent}
        </>
      }
      ListEmptyComponent={<EmptyState title={emptyTitle} message={emptyMessage} icon={emptyIcon} />}
      ListFooterComponent={isFetchingMore ? <Loader inline size="small" /> : null}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.primary}
          colors={[theme.primary]}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
    />
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  separator: { height: Spacing.two },
});
