import type { GroupRolesWithPermissions } from './types';

export const GROUP_ROLES: GroupRolesWithPermissions = {
  owner: {
    group: {
      delete: true,
      update: true,
      inviteMember: true,
      removeMember: true,
      updateMemberRole: true,
    },
    shoppingList: { update: true, read: true },
    shoppingEvent: { create: true, read: true },
    settings: { read: true, update: true },
  },
  moderator: {
    group: {
      update: true,
      inviteMember: true,
      removeMember: ({ user, data }) => {
        if (user.id === data?.id) return false;
        return true;
      },
    },
    shoppingList: { update: true, read: true },
    shoppingEvent: { create: true, read: true },
  },
  member: {
    group: { inviteMember: true },
    shoppingList: { update: true, read: true },
    shoppingEvent: { create: true, read: true },
  },
};
