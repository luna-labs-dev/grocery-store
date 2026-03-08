import { createFileRoute } from '@tanstack/react-router';
import { ManageGroupsPage } from '@/features/group/pages/manage-groups-page';

export const Route = createFileRoute('/_protected/manage-groups/')({
  component: ManageGroupsPage,
});
