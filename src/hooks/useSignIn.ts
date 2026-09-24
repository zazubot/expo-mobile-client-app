import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getErrorMessage, isApiError } from '@/api/client';
import { getWorkspaceList } from '@/api/workspaces';
import { useAuth } from '@/context/AuthContext';
import { workspacesQueryKey } from '@/hooks/useWorkspaces';

/**
 * Validates a pasted token by listing workspaces with it, then persists it.
 * The fetched workspaces seed the cache so the first screen renders instantly.
 */
export function useSignIn() {
  const { signIn } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rawToken: string) => {
      const token = rawToken.trim();
      const workspaces = await getWorkspaceList({ token });
      await signIn(token);
      queryClient.setQueryData<Workspace[]>(workspacesQueryKey, workspaces);
    },
  });
}

export function signInErrorMessage(error: unknown): string {
  if (isApiError(error) && (error.status === 401 || error.status === 403)) {
    return 'Invalid token. Check it and try again.';
  }
  return getErrorMessage(error);
}
