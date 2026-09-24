enum Plan {
  FREE = "FREE",
  STARTER = "STARTER",
  PRO = "PRO",
  LIFETIME = "LIFETIME",
  OFFERED = "OFFERED",
  CUSTOM = "CUSTOM",
  UNLIMITED = "UNLIMITED",
}

interface Workspace {
  id: string;
  name: string;
  icon: string;
  plan: Plan;
}

interface WorkspaceListResponse {
  workspaces: Workspace[];
}

interface WorkspaceDetailsResponse {
  workspace: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    icon: string;
    plan: Plan;
    stripeId: string;
    settings: {
      groupTitlesAutoGeneration: {
        isEnabled: boolean;
        provider: string;
        credentialsId: string;
        model: string;
        prompt: string;
      };
    };
    customChatsLimit: number;
    customSeatsLimit: number;
    isSuspended: boolean;
    isPastDue: boolean;
    isVerified: boolean;
    chatsHardLimit: number;
    lastActivityAt: string;
    inactiveFirstEmailSentAt: string;
    inactiveSecondEmailSentAt: string;
  };
  currentUserMode: "read";
}

interface WorkspaceDetailsRequest {
  workspaceId: string;
}

interface WorkspaceMembersRequest {
  members: [
    {
      workspaceId: string;
      user: {
        name: string | null;
        email: string | null;
        image: string | null;
      };
      role: "ADMIN" | "MEMBER" | "GUEST";
    },
  ];
}
