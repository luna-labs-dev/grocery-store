import type { PermissionCheck } from '../base/types';

export const applicationRoles = [
  'master',
  'admin',
  'moderator',
  'user',
] as const;

export type ApplicationRole = (typeof applicationRoles)[number];

export type GlobalRolesWithPermissions = {
  [R in ApplicationRole]: Partial<{
    [Key in keyof GlobalPermissions]: Partial<{
      [Action in GlobalPermissions[Key]['action']]: PermissionCheck<
        GlobalPermissions[Key]['dataType']
      >;
    }>;
  }>;
};

export type GlobalPermissions = {
  systemSettings: {
    dataType: never;
    action: 'manageConfig';
  };
  systemLogs: {
    dataType: never;
    action: 'viewLogs';
  };
  productPrice: {
    dataType: { reputationScore: number };
    action: 'verifyPrice';
  };
};
