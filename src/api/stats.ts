import { api, type RequestOptions } from '@/api/client';
import type { ResultTimeFilter } from '@/api/results';

const statsPath = (botId: string) => `/typebots/${encodeURIComponent(botId)}/analytics/stats`;

export type BotStats = StatsResponse['stats'];

/** GET /typebots/:botId/analytics/stats — views/starts/completions for a window. */
export async function getBotStats(
  botId: string,
  params: { timeFilter?: ResultTimeFilter } = {},
  opts: RequestOptions = {},
): Promise<BotStats> {
  const { data } = await api.get<StatsResponse>(statsPath(botId), {
    params: { timeFilter: params.timeFilter },
    signal: opts.signal,
  });
  return data.stats;
}
