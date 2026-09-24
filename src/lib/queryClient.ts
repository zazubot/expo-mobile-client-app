import { QueryClient } from '@tanstack/react-query';

import { isApiError } from '@/api/client';

const NON_RETRYABLE = new Set([400, 401, 403, 404]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status !== undefined && NON_RETRYABLE.has(error.status)) {
          return false;
        }
        if (isApiError(error) && error.code === 'NO_API_URL') return false;
        return failureCount < 2;
      },
    },
  },
});
