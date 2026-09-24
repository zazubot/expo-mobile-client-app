import { useQuery } from '@tanstack/react-query';

import type { ResultTimeFilter } from '@/api/results';
import { getBotStats } from '@/api/stats';

export function useBotStats(botId: string | undefined, timeFilter: ResultTimeFilter) {
  return useQuery({
    queryKey: ['bot-stats', botId, timeFilter],
    queryFn: ({ signal }) => getBotStats(botId ?? '', { timeFilter }, { signal }),
    enabled: !!botId,
  });
}
