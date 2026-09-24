import { router } from 'expo-router';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { ListItem } from '@/components/ListItem';

const ACCESS_LABELS: Record<string, string> = {
  read: 'Read-only access',
  write: 'Full access',
  guest: 'Guest access',
};

export function BotRow({ bot }: { bot: Bot }) {
  const accessRight: string = bot.accessRight;
  const isPublished = Boolean(bot.publishedTypebotId);
  const openResults = () =>
    router.push({
      pathname: '/bots/[botId]/results',
      params: { botId: bot.id, name: bot.name },
    });

  return (
    <ListItem
      title={bot.name}
      subtitle={ACCESS_LABELS[accessRight] ?? accessRight}
      leading={<Avatar icon={bot.icon} name={bot.name} />}
      trailing={
        <Badge label={isPublished ? 'Published' : 'Draft'} tone={isPublished ? 'success' : 'neutral'} />
      }
      onPress={openResults}
    />
  );
}
