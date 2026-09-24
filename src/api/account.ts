import { api, type RequestOptions } from '@/api/client';

const USAGE_PATH = '/billing/usage';
const INVOICES_PATH = '/billing/invoices';

/** GET /billing/usage?workspaceId=… — chats used in the current billing period. */
export async function getCurrentUsage(
  workspaceId: CurrentUsageQuery['workspaceId'],
  opts: RequestOptions = {},
): Promise<CurrentUsageResponse> {
  const { data } = await api.get<CurrentUsageResponse>(USAGE_PATH, {
    params: { workspaceId },
    signal: opts.signal,
  });
  return data;
}

/** GET /billing/invoices?workspaceId=… — paid invoices, newest first. */
export async function getInvoiceList(
  workspaceId: InvoiceQuery['workspaceId'],
  opts: RequestOptions = {},
): Promise<Invoice[]> {
  const { data } = await api.get<InvoiceListResponse>(INVOICES_PATH, {
    params: { workspaceId },
    signal: opts.signal,
  });
  return [...data.invoices].sort((a, b) => (b.date ?? 0) - (a.date ?? 0));
}
