import { useQuery } from '@tanstack/react-query';

import { getBotList } from '@/api/bots';

export function useBots(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['bots', workspaceId],
    queryFn: ({ signal }) => getBotList(workspaceId ?? '', { signal }),
    enabled: !!workspaceId,
  });
}
