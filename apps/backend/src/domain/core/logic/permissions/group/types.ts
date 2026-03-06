import type { PermissionCheck } from '../base/types';
import type { CollaborationGroup, ShoppingEvent } from '@/domain/entities';

export const groupRoles = ['owner', 'moderator', 'member'] as const;

export type GroupRole = (typeof groupRoles)[number];

export type GroupRolesWithPermissions = {
  [R in GroupRole]: Partial<{
    [Key in keyof GroupPermissions]: Partial<{
      [Action in GroupPermissions[Key]['action']]: PermissionCheck<
        GroupPermissions[Key]['dataType']
      >;
    }>;
  }>;
};

export type GroupPermissions = {
  group: {
    dataType: CollaborationGroup;
    action:
      | 'delete'
      | 'update'
      | 'inviteMember'
      | 'removeMember'
      | 'updateMemberRole';
  };
  shoppingList: {
    dataType: CollaborationGroup | { groupId: string };
    action: 'update' | 'read';
  };
  shoppingEvent: {
    dataType: ShoppingEvent | { groupId: string };
    action: 'read' | 'create';
  };
  settings: {
    dataType: { groupId: string };
    action: 'read' | 'update';
  };
};
