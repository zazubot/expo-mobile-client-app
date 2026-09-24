interface Result {
  id: string;
  createdAt: string;
  typebotId: string;
  variables: [
    {
      id: string;
      name: string;
      value: string;
      isSessionVariable: true;
    },
  ];
  isCompleted: true;
  hasStarted: true;
  isArchived: true;
  lastChatSessionId: string;
  answers: [
    {
      blockId: string;
      content: string;
      attachedFileUrls: string[];
    },
  ];
}

interface ResultListResponse {
  results: Result[];
  nextCursor: string | null;
}

interface ResultQuery {
  typebotId: string;
  limit?: number;
  cursor?: string;
}
