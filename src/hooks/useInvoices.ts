import { useQuery } from '@tanstack/react-query';

import { getInvoiceList } from '@/api/account';

export function useInvoices(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['invoices', workspaceId],
    queryFn: ({ signal }) => getInvoiceList(workspaceId ?? '', { signal }),
    enabled: !!workspaceId,
  });
}
