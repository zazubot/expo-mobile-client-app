import { useQuery } from '@tanstack/react-query';

import { getWorkspaceList } from '@/api/workspaces';

export const workspacesQueryKey = ['workspaces'] as const;

export function useWorkspaces() {
  return useQuery({
    queryKey: workspacesQueryKey,
    queryFn: ({ signal }) => getWorkspaceList({ signal }),
  });
}
