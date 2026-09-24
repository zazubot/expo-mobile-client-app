import { Stack, useLocalSearchParams } from 'expo-router';
import type { ListRenderItem } from 'react-native';

import { BotRow } from '@/components/BotRow';
import { QueryList } from '@/components/QueryList';
import { useBots } from '@/hooks/useBots';
import { keyById } from '@/lib/list';

const renderBot: ListRenderItem<Bot> = ({ item }) => <BotRow bot={item} />;

export default function BotsScreen() {
  const { workspaceId, name } = useLocalSearchParams<{ workspaceId: string; name?: string }>();
  const query = useBots(workspaceId);

  return (
    <>
      <Stack.Screen options={{ title: name || 'Bots' }} />
      <QueryList
        data={query.data}
        isPending={query.isPending}
        isError={query.isError}
        error={query.error}
        onRetry={() => void query.refetch()}
        onRefresh={query.refetch}
        renderItem={renderBot}
        keyExtractor={keyById}
        emptyTitle="No bots in this workspace yet"
        emptyMessage="Bots you create in this workspace will show up here."
        emptyIcon="chatbubbles-outline"
      />
    </>
  );
}
