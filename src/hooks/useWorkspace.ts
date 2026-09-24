import { useWorkspaces } from '@/hooks/useWorkspaces';

/** A single workspace from the (cached) workspaces list. */
export function useWorkspace(workspaceId: string | undefined) {
  const query = useWorkspaces();
  const workspace = query.data?.find((item) => item.id === workspaceId);
  return { workspace, query };
}
