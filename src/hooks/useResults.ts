import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getResultsList, type ResultTimeFilter } from '@/api/results';

export function useResults(botId: string | undefined, timeFilter: ResultTimeFilter) {
  const query = useInfiniteQuery({
    queryKey: ['results', botId, timeFilter],
    queryFn: ({ pageParam, signal }) =>
      getResultsList(botId ?? '', { cursor: pageParam ?? undefined, timeFilter }, { signal }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!botId,
  });

  const results = useMemo<Result[]>(
    () => query.data?.pages.flatMap((page) => page.results) ?? [],
    [query.data],
  );

  return { query, results };
}
