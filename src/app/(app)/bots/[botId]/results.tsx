import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View, type ListRenderItem } from 'react-native';

import type { ResultTimeFilter } from '@/api/results';
import { FilterChips, type ChipOption } from '@/components/FilterChips';
import { QueryList } from '@/components/QueryList';
import { ResultCard } from '@/components/ResultCard';
import { StatsHeader } from '@/components/StatsHeader';
import { Spacing } from '@/constants/theme';
import { useBotStats } from '@/hooks/useBotStats';
import { useResults } from '@/hooks/useResults';
import { keyById } from '@/lib/list';

const TIME_FILTERS: readonly ChipOption<ResultTimeFilter>[] = [
  { value: 'allTime', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'last7Days', label: '7 days' },
  { value: 'last30Days', label: '30 days' },
  { value: 'monthToDate', label: 'This month' },
  { value: 'yearToDate', label: 'This year' },
];

export default function ResultsScreen() {
  const { botId, name } = useLocalSearchParams<{ botId: string; name?: string }>();
  const [timeFilter, setTimeFilter] = useState<ResultTimeFilter>('allTime');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { query, results } = useResults(botId, timeFilter);
  const stats = useBotStats(botId, timeFilter);

  const toggle = useCallback((id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  const renderResult: ListRenderItem<Result> = ({ item }) => (
    <ResultCard result={item} expanded={item.id === expandedId} onToggle={toggle} />
  );

  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
  };

  const refresh = async () => {
    await Promise.all([query.refetch(), stats.refetch()]);
  };

  return (
    <>
      <Stack.Screen options={{ title: name || 'Results' }} />
      <QueryList
        data={results}
        isPending={query.isPending}
        isError={query.isError}
        error={query.error}
        onRetry={() => void query.refetch()}
        onRefresh={refresh}
        renderItem={renderResult}
        keyExtractor={keyById}
        extraData={expandedId}
        onEndReached={loadMore}
        isFetchingMore={query.isFetchingNextPage}
        emptyTitle="No results yet"
        emptyMessage="Conversations with this bot will appear here as people use it."
        emptyIcon="chatbox-ellipses-outline"
        ListHeaderComponent={
          <View style={styles.header}>
            <StatsHeader stats={stats.data} isPending={stats.isPending} isError={stats.isError} />
            <FilterChips
              options={TIME_FILTERS}
              value={timeFilter}
              onChange={setTimeFilter}
              accessibilityLabel="Time range"
            />
          </View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.three, marginBottom: Spacing.four },
});
