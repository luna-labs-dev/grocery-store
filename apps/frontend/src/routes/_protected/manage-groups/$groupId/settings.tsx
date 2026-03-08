import { createFileRoute } from '@tanstack/react-router';
import { GroupSettingsPage } from '@/features/group/pages';

export const Route = createFileRoute(
  '/_protected/manage-groups/$groupId/settings',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { groupId } = Route.useParams();
  return <GroupSettingsPage groupId={groupId} />;
}
