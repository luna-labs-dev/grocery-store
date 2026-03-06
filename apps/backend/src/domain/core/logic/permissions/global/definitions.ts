import type { GlobalRolesWithPermissions } from './types';

export const GLOBAL_ROLES: GlobalRolesWithPermissions = {
  master: {
    systemSettings: { manageConfig: true },
    systemLogs: { viewLogs: true },
  },
  admin: {
    systemSettings: { manageConfig: true },
    systemLogs: { viewLogs: true },
  },
  moderator: {
    systemLogs: { viewLogs: true },
  },
  user: {
    productPrice: {
      verifyPrice: ({ user }) => {
        // Simplified for domain logic, specific thresholds can be passed in data if needed
        return user.reputationScore >= 50;
      },
    },
  },
};
