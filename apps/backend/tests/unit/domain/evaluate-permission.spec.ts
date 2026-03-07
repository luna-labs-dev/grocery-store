import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import {
  type ApplicationRole,
  type GroupRole,
  hasGroupPermission,
  hasPermission,
} from '@/domain/core/logic/permissions';
import { CollaborationGroup, GroupMember, User } from '@/domain/entities';

describe('Domain Permissions - hasPermission & hasGroupPermission', () => {
  const createUser = (
    id: string,
    roles: ApplicationRole[],
    reputationScore: number,
    groupRoles: { groupId: string; role: GroupRole }[] = [],
  ) => {
    return User.create(
      {
        email: 'test@grocery.test',
        emailVerified: true,
        name: 'Test User',
        roles,
        reputationScore,
        groups: groupRoles.map((gr) =>
          GroupMember.create({
            groupId: gr.groupId,
            userId: id,
            role: gr.role,
            joinedAt: new Date(),
          }),
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
  };

  describe('Group Permissions (hasGroupPermission)', () => {
    describe('shoppingList update', () => {
      it('should ALLOW if user has MEMBER role in the target group', () => {
        const subject = createUser('user-1', ['user'], 10, [
          { groupId: 'group-a', role: 'member' },
        ]);
        const group = CollaborationGroup.create(
          { name: 'Group A', createdBy: 'admin', createdAt: new Date() },
          'group-a',
        );
        const result = hasGroupPermission(
          subject,
          'update',
          'shoppingList',
          group,
        );
        expect(result).toBe(true);
      });

      it('should DENY if user is NOT in the target group', () => {
        const subject = createUser('user-1', ['user'], 10, [
          { groupId: 'group-c', role: 'member' },
        ]);
        const group = CollaborationGroup.create(
          { name: 'Group A', createdBy: 'admin', createdAt: new Date() },
          'group-a',
        );
        const result = hasGroupPermission(
          subject,
          'update',
          'shoppingList',
          group,
        );
        expect(result).toBe(false);
      });
    });

    describe('group delete', () => {
      it('should ALLOW if user is OWNER of the group', () => {
        const subject = createUser('user-1', ['user'], 10, [
          { groupId: 'group-a', role: 'owner' },
        ]);
        const group = CollaborationGroup.create(
          { name: 'Group A', createdBy: 'admin', createdAt: new Date() },
          'group-a',
        );
        const result = hasGroupPermission(subject, 'delete', 'group', group);
        expect(result).toBe(true);
      });

      it('should DENY if user is MODERATOR of the group', () => {
        const subject = createUser('user-1', ['user'], 10, [
          { groupId: 'group-a', role: 'moderator' },
        ]);
        const group = CollaborationGroup.create(
          { name: 'Group A', createdBy: 'admin', createdAt: new Date() },
          'group-a',
        );
        const result = hasGroupPermission(subject, 'delete', 'group', group);
        expect(result).toBe(false);
      });
    });
  });

  describe('Global Permissions (hasPermission)', () => {
    describe('systemSettings manageConfig', () => {
      it('should ALLOW if user has MASTER role', () => {
        const subject = createUser('user-1', ['master'], 0);
        const result = hasPermission(subject, 'manageConfig', 'systemSettings');
        expect(result).toBe(true);
      });

      it('should DENY if user is USER role', () => {
        const subject = createUser('user-1', ['user'], 0);
        const result = hasPermission(subject, 'manageConfig', 'systemSettings');
        expect(result).toBe(false);
      });
    });

    describe('systemLogs viewLogs', () => {
      it('should ALLOW if user has MODERATOR role', () => {
        const subject = createUser('user-1', ['moderator'], 0);
        const result = hasPermission(subject, 'viewLogs', 'systemLogs');
        expect(result).toBe(true);
      });
    });

    describe('productPrice verifyPrice', () => {
      it('should ALLOW if user reputation is >= threshold', () => {
        const subject = createUser('user-1', ['user'], 50);
        const result = hasPermission(subject, 'verifyPrice', 'productPrice');
        expect(result).toBe(true);
      });

      it('should DENY if user reputation is < threshold', () => {
        const subject = createUser('user-1', ['user'], 49);
        const result = hasPermission(subject, 'verifyPrice', 'productPrice');
        expect(result).toBe(false);
      });
    });
  });

  describe('Decoupling Check', () => {
    it('hasGroupPermission should NOT grant permission based on global roles (Complete Decoupling)', () => {
      const subject = createUser('admin-1', ['admin'], 100);
      const group = CollaborationGroup.create(
        { name: 'Group A', createdBy: 'admin', createdAt: new Date() },
        'group-a',
      );

      // Admin has NO group role in group-a.
      // hasGroupPermission should return false because it is decoupled from global roles.
      const result = hasGroupPermission(subject, 'delete', 'group', group);
      expect(result).toBe(false);
    });
  });
});
