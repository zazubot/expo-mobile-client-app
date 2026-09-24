import { api, authHeader, type RequestOptions } from "@/api/client";

const WORKSPACES_PATH = "/workspaces";

/** GET /workspaces — all workspaces the token can access. */
export async function getWorkspaceList(
  opts: RequestOptions = {},
): Promise<Workspace[]> {
  const { data } = await api.get<WorkspaceListResponse>(WORKSPACES_PATH, {
    signal: opts.signal,
    headers: authHeader(opts.token),
  });
  return data.workspaces;
}
