import { router } from 'expo-router';

import { Avatar } from '@/components/Avatar';
import { Badge, type BadgeTone } from '@/components/Badge';
import { ListItem } from '@/components/ListItem';
import { formatPlan } from '@/lib/format';

const PLAN_TONES: Record<string, BadgeTone> = {
  FREE: 'neutral',
  STARTER: 'primary',
  PRO: 'success',
  LIFETIME: 'success',
  OFFERED: 'warning',
  CUSTOM: 'warning',
  UNLIMITED: 'success',
};

export function WorkspaceRow({ workspace }: { workspace: Workspace }) {
  const plan: string = workspace.plan;
  const openBots = () =>
    router.push({
      pathname: '/workspaces/[workspaceId]',
      params: { workspaceId: workspace.id, name: workspace.name },
    });

  return (
    <ListItem
      title={workspace.name}
      subtitle={`${formatPlan(plan)} plan`}
      leading={<Avatar icon={workspace.icon} name={workspace.name} />}
      trailing={<Badge label={formatPlan(plan)} tone={PLAN_TONES[plan] ?? 'neutral'} />}
      onPress={openBots}
      accessibilityLabel={`${workspace.name}, ${formatPlan(plan)} plan`}
    />
  );
}
