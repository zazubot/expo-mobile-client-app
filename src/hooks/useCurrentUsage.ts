import { useQuery } from '@tanstack/react-query';

import { getCurrentUsage } from '@/api/account';

export function useCurrentUsage(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['usage', workspaceId],
    queryFn: ({ signal }) => getCurrentUsage(workspaceId ?? '', { signal }),
    enabled: !!workspaceId,
  });
}
