import { api, type RequestOptions } from '@/api/client';
import { RESULTS_PAGE_SIZE } from '@/constants/config';

const resultsPath = (botId: string) => `/typebots/${encodeURIComponent(botId)}/results`;

/**
 * Time window accepted by the results and stats endpoints.
 * NOTE: `timeFilter` is documented by the API but is not part of `ResultQuery`
 * in `src/types`; it is kept here so the app can show more than the API's
 * default window of the last 7 days.
 */
export const RESULT_TIME_FILTERS = [
  'today',
  'last7Days',
  'last30Days',
  'monthToDate',
  'lastMonth',
  'yearToDate',
  'allTime',
] as const;

export type ResultTimeFilter = (typeof RESULT_TIME_FILTERS)[number];

export interface ResultListParams extends Omit<ResultQuery, 'typebotId'> {
  timeFilter?: ResultTimeFilter;
}

/** GET /typebots/:botId/results — one page of results, newest first. */
export async function getResultsList(
  botId: string,
  params: ResultListParams = {},
  opts: RequestOptions = {},
): Promise<ResultListResponse> {
  const { data } = await api.get<ResultListResponse>(resultsPath(botId), {
    params: {
      limit: params.limit ?? RESULTS_PAGE_SIZE,
      cursor: params.cursor,
      timeFilter: params.timeFilter,
    },
    signal: opts.signal,
  });
  return data;
}
