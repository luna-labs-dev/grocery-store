import 'reflect-metadata';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import type {
  GroupRepositories,
  UserRepositories,
} from '@/application/contracts';
import { GroupService } from '@/application/usecases/group-service';
import { RequesterContext } from '@/domain/core/requester-context';
import { CollaborationGroup, GroupMember, User } from '@/domain/entities';
import { UserNotInGroupException } from '@/domain/exceptions';

describe('GroupService - Magic Link', () => {
  let sut: GroupService;
  let userRepository: Mocked<UserRepositories>;
  let groupRepository: Mocked<GroupRepositories>;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    userRepository = {
      getById: vi.fn(),
    } as any;

    groupRepository = {
      getById: vi.fn(),
      getMembers: vi.fn(),
      getByInviteCode: vi.fn(),
      addMember: vi.fn(),
      updateInviteCode: vi.fn(),
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
      const ctx = new RequesterContext(mockUser, mockGroup);

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
        generateInviteCode: vi.fn().mockImplementation(function (this: any) {
          this.inviteCode = 'NEW-CODE';
        }),
      } as any;

      vi.mocked(groupRepository.getById).mockResolvedValue(mockGroup);
      vi.mocked(groupRepository.updateInviteCode).mockResolvedValue(undefined);
      const ctx = new RequesterContext(mockUser, mockGroup);

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
      const ctx = new RequesterContext(mockUser, mockGroup);

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
      const ctx = new RequesterContext(mockAdmin, mockGroup);

      await expect(sut.getInviteInfo(ctx)).rejects.toThrow(
        UserNotInGroupException,
      );
    });
  });

  // joinGroup tests are unaffected as they don't use permission checks
});
