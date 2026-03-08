import { createFileRoute } from '@tanstack/react-router';
import { GroupDetails } from '@/features/group/components/group-details';

export const Route = createFileRoute('/_protected/manage-groups/$groupId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { groupId } = Route.useParams();
  return <GroupDetails groupId={groupId} />;
}
