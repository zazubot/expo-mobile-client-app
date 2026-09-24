import type { ListRenderItem } from 'react-native';

import { QueryList } from '@/components/QueryList';
import { WorkspaceRow } from '@/components/WorkspaceRow';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { keyById } from '@/lib/list';

const renderWorkspace: ListRenderItem<Workspace> = ({ item }) => <WorkspaceRow workspace={item} />;

export default function WorkspacesScreen() {
  const query = useWorkspaces();

  return (
    <QueryList
      data={query.data}
      isPending={query.isPending}
      isError={query.isError}
      error={query.error}
      onRetry={() => void query.refetch()}
      onRefresh={query.refetch}
      renderItem={renderWorkspace}
      keyExtractor={keyById}
      emptyTitle="No workspaces yet"
      emptyMessage="This token does not have access to any workspaces."
      emptyIcon="briefcase-outline"
    />
  );
}
