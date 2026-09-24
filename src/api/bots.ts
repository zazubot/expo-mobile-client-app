import { api, type RequestOptions } from '@/api/client';

const BOTS_PATH = '/typebots';

/** GET /typebots?workspaceId=… — bots inside a workspace. */
export async function getBotList(workspaceId: string, opts: RequestOptions = {}): Promise<Bot[]> {
  const { data } = await api.get<BotListResponse>(BOTS_PATH, {
    params: { workspaceId },
    signal: opts.signal,
  });
  return data.typebots;
}
