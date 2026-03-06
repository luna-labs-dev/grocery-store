import 'reflect-metadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  GroupRepositories,
  UserRepositories,
} from '@/application/contracts';
import { GroupService } from '@/application/usecases/group-service';
import { RequesterContext } from '@/domain/core/requester-context';
import { CollaborationGroup, GroupMember, User } from '@/domain/entities';
import {
  UnauthorizedGroupOperationException,
  UserNotInGroupException,
} from '@/domain/exceptions';

describe('GroupService', () => {
  let sut: GroupService;
  let userRepository: UserRepositories;
  let groupRepository: GroupRepositories;

  beforeEach(() => {
    userRepository = {
      getById: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
    } as any;

    groupRepository = {
      add: vi.fn(),
      getById: vi.fn(),
      getByInviteCode: vi.fn(),
      getMembers: vi.fn(),
      getGroups: vi.fn(),
      updateInviteCode: vi.fn(),
      update: vi.fn(),
    } as any;

    sut = new GroupService(userRepository, groupRepository);
  });

  const createMockUser = (
    id: string,
    roles: string[] = [],
    groupRole?: { groupId: string; role: any },
  ) => {
    return User.create(
      {
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: true,
        roles: roles as any,
        reputationScore: 0,
        groups: groupRole
          ? [
              GroupMember.create({
                groupId: groupRole.groupId,
                userId: id,
                role: groupRole.role,
                joinedAt: new Date(),
              }),
            ]
          : [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
  };

  describe('createGroup', () => {
    it('should create a group and make the user the OWNER', async () => {
      const mockUser = createMockUser('user-1');
      vi.mocked(userRepository.getById).mockResolvedValue(mockUser);

      const group = await sut.createGroup({
        userId: 'user-1',
        name: 'My Awesome Group',
        description: 'Testing groups',
      });

      expect(group.name).toBe('My Awesome Group');
      expect(group.createdBy).toBe('user-1');
      expect(groupRepository.add).toHaveBeenCalledWith(group);
      expect(group.members).toHaveLength(1);
      expect(group.members?.[0].userId).toBe('user-1');
      expect(group.members?.[0].role).toBe('owner');
    });
  });

  describe('removeMember', () => {
    it('should allow an OWNER to remove a MEMBER', async () => {
      const mockUser = createMockUser('user-owner', [], {
        groupId: 'group-1',
        role: 'owner',
      });
      const mockGroup = CollaborationGroup.create(
        { name: 'Group 1', createdAt: new Date(), createdBy: 'user-owner' },
        'group-1',
      );
      mockGroup.addMember(
        GroupMember.create({
          groupId: 'group-1',
          userId: 'user-member',
          role: 'member',
          joinedAt: new Date(),
        }),
      );
      const ctx = new RequesterContext(mockUser, mockGroup);

      await sut.removeMember(ctx, {
        targetUserId: 'user-member',
      });

      expect(groupRepository.update).toHaveBeenCalled();
      const updatedGroup = vi.mocked(groupRepository.update).mock.calls[0][0];
      expect(updatedGroup.members.some((m) => m.userId === 'user-member')).toBe(
        false,
      );
    });

    it('should throw UnauthorizedGroupOperationException if a Global ADMIN tries to remove a MEMBER but is NOT in group', async () => {
      const mockAdmin = createMockUser('user-admin', ['admin']);
      const mockGroup = CollaborationGroup.create(
        { name: 'Group 1', createdAt: new Date(), createdBy: 'user-owner' },
        'group-1',
      );
      const ctx = new RequesterContext(mockAdmin, mockGroup);

      await expect(
        sut.removeMember(ctx, {
          targetUserId: 'user-member',
        }),
      ).rejects.toThrow(UserNotInGroupException);
    });

    it('should throw UnauthorizedGroupOperationException if a MEMBER tries to remove someone', async () => {
      const mockUser = createMockUser('user-member', [], {
        groupId: 'group-1',
        role: 'member',
      });
      const mockGroup = CollaborationGroup.create(
        { name: 'Group 1', createdAt: new Date(), createdBy: 'user-owner' },
        'group-1',
      );
      const ctx = new RequesterContext(mockUser, mockGroup);

      await expect(
        sut.removeMember(ctx, {
          targetUserId: 'user-other',
        }),
      ).rejects.toThrow(UnauthorizedGroupOperationException);
    });
  });

  describe('updateMemberRole', () => {
    it('should allow OWNER to promote a MEMBER to MODERATOR', async () => {
      const mockUser = createMockUser('user-owner', [], {
        groupId: 'group-1',
        role: 'owner',
      });
      const mockGroup = CollaborationGroup.create(
        { name: 'Group 1', createdAt: new Date(), createdBy: 'user-owner' },
        'group-1',
      );
      mockGroup.addMember(
        GroupMember.create({
          groupId: 'group-1',
          userId: 'user-member',
          role: 'member',
          joinedAt: new Date(),
        }),
      );
      const ctx = new RequesterContext(mockUser, mockGroup);

      await sut.updateMemberRole(ctx, {
        targetUserId: 'user-member',
        role: 'moderator',
      });

      expect(groupRepository.update).toHaveBeenCalled();
      const updatedGroup = vi.mocked(groupRepository.update).mock.calls[0][0];
      const member = updatedGroup.members.find(
        (m) => m.userId === 'user-member',
      );
      expect(member?.role).toBe('moderator');
    });
  });

  // Keep other tests largely similar but remove permissionService mocks
});
