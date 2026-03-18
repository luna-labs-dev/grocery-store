import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type {
  GroupRepositories,
  UserRepositories,
} from '@/application/contracts';
import { DbGroupManager } from '@/application/usecases/db-group-manager';
import { RequesterContext } from '@/domain/core/requester-context';
import { CollaborationGroup, GroupMember, User } from '@/domain/entities';
import { UserNotInGroupException } from '@/domain/exceptions';

describe('DbGroupManager - Magic Link', () => {
  let sut: DbGroupManager;
  let userRepository: Mocked<UserRepositories>;
  let groupRepository: Mocked<GroupRepositories>;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    userRepository = {
      getById: vi.fn(),
    } as unknown as Mocked<UserRepositories>;

    groupRepository = {
      getById: vi.fn(),
      getMembers: vi.fn(),
      getByInviteCode: vi.fn(),
      addMember: vi.fn(),
      updateInviteCode: vi.fn(),
    } as unknown as Mocked<GroupRepositories>;

    sut = new DbGroupManager(userRepository, groupRepository);
  });

  const createMockUser = (
    id: string,
    roles: string[] = [],
    groupRole?: { groupId: string; role: string },
  ) => {
    return User.create(
      {
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: true,
        roles: roles as unknown as never,
        reputationScore: 0,
        groups: groupRole
          ? [
              GroupMember.create({
                groupId: groupRole.groupId,
                userId: id,
                role: groupRole.role as unknown as never,
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

  describe('getInviteInfo', () => {
    it('should return invite code and join URL for a valid group member', async () => {
      const mockUser = createMockUser('user-1', [], {
        groupId: 'group-1',
        role: 'member',
      });
      const mockGroup = CollaborationGroup.create(
        {
          name: 'Test Group',
          inviteCode: 'ABC-123',
          createdBy: 'user-1',
          createdAt: new Date(),
        },
        'group-1',
      );

      vi.mocked(groupRepository.getById).mockResolvedValue(mockGroup);
      const ctx = new RequesterContext(mockUser, mockGroup, {
        isAllowed: vi.fn().mockResolvedValue(true),
      } as unknown as never);

      const result = await sut.getInviteInfo(ctx);

      expect(result.inviteCode).toBe('ABC-123');
      expect(result.joinUrl).toContain('ABC-123');
      expect(groupRepository.updateInviteCode).not.toHaveBeenCalled();
    });

    it('should generate a new invite code if missing and return it', async () => {
      const mockUser = createMockUser('user-1', [], {
        groupId: 'group-1',
        role: 'owner',
      });
      const mockGroup = {
        id: 'group-1',
        name: 'Test Group',
        inviteCode: undefined as string | undefined,
        generateInviteCode: vi.fn().mockImplementation(function (this: {
          inviteCode: string | undefined;
        }) {
          this.inviteCode = 'NEW-CODE';
        }),
      } as unknown as CollaborationGroup;

      vi.mocked(groupRepository.getById).mockResolvedValue(mockGroup);
      vi.mocked(groupRepository.updateInviteCode).mockResolvedValue(undefined);
      const ctx = new RequesterContext(mockUser, mockGroup, {
        isAllowed: vi.fn().mockResolvedValue(true),
      } as unknown as never);

      const result = await sut.getInviteInfo(ctx);

      expect(result.inviteCode).toBe('NEW-CODE');
      expect(result.joinUrl).toContain('NEW-CODE');
      expect(groupRepository.updateInviteCode).toHaveBeenCalledWith(
        'group-1',
        'NEW-CODE',
      );
    });

    it('should throw UserNotInGroupException if requester is not a member', async () => {
      const mockUser = createMockUser('user-stranger');
      const mockGroup = CollaborationGroup.create(
        {
          name: 'Test Group',
          inviteCode: 'ABC-123',
          createdBy: 'user-owner',
          createdAt: new Date(),
        },
        'group-1',
      );

      vi.mocked(groupRepository.getById).mockResolvedValue(mockGroup);
      const ctx = new RequesterContext(mockUser, mockGroup, {
        isAllowed: vi.fn(),
      } as unknown as never);

      await expect(sut.getInviteInfo(ctx)).rejects.toThrow(
        UserNotInGroupException,
      );
    });

    it('should throw UserNotInGroupException if a Global ADMIN tries to get invite info but is NOT in group', async () => {
      const mockAdmin = createMockUser('admin-1', ['admin']);
      const mockGroup = CollaborationGroup.create(
        {
          name: 'Test Group',
          inviteCode: 'ABC-123',
          createdBy: 'user-owner',
          createdAt: new Date(),
        },
        'group-1',
      );

      vi.mocked(groupRepository.getById).mockResolvedValue(mockGroup);
      const ctx = new RequesterContext(mockAdmin, mockGroup, {
        isAllowed: vi.fn().mockResolvedValue(true),
      } as unknown as never);

      await expect(sut.getInviteInfo(ctx)).rejects.toThrow(
        UserNotInGroupException,
      );
    });
  });
});
