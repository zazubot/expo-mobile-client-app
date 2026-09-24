interface StatsResponse {
  stats: {
    totalViews: number;
    totalStarts: number;
    totalCompleted: number;
  };
}

interface StatsQuery {
  typebotId: string;
}

interface CurrentUsageQuery {
  workspaceId: string;
}

interface CurrentUsageResponse {
  totalChatsUsed: number;
  resetsAt: string;
}

interface Invoice {
  id: string;
  url: string;
  amount: number;
  currency: string;
  date: number;
}

interface InvoiceListResponse {
  invoices: Invoice[];
}

interface InvoiceQuery {
  workspaceId: string;
}
