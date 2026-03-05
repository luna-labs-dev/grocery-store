import 'reflect-metadata';
import { describe, expect, it, vi, beforeEach, type Mocked } from 'vitest';
import { GroupService } from '@/application/usecases/group-service';
import type { UserRepositories, GroupRepositories } from '@/application/contracts';
import { CollaborationGroup, User, GroupMember } from '@/domain/entities';
import {
  UserNotInGroupException,
  UnexpectedException,
  UserNotFoundException,
  InvalidGroupInvitationCodeException
} from '@/domain/exceptions';
import { GroupRole } from '@/domain/core/enums';

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

  describe('getInviteInfo', () => {
    it('should return invite code and join URL for a valid group member', async () => {
      const mockGroup = CollaborationGroup.create({
        name: 'Test Group',
        inviteCode: 'ABC-123',
        createdBy: 'user-1',
        createdAt: new Date(),
      }, 'group-1');

      vi.mocked(groupRepository.getById).mockResolvedValue(mockGroup);
      vi.mocked(groupRepository.getMembers).mockResolvedValue([{ userId: 'user-1' } as any]);

      const result = await sut.getInviteInfo({
        userId: 'user-1',
        groupId: 'group-1',
      });

      expect(result.inviteCode).toBe('ABC-123');
      expect(result.joinUrl).toContain('ABC-123');
      expect(groupRepository.updateInviteCode).not.toHaveBeenCalled();
    });

    it('should generate a new invite code if missing and return it', async () => {
      // Create a mock group object that mimics the entity but has undefined inviteCode initially
      const mockGroup = {
        id: 'group-1',
        name: 'Test Group',
        inviteCode: undefined as string | undefined,
        generateInviteCode: vi.fn().mockImplementation(function(this: any) {
          this.inviteCode = 'NEW-CODE';
        })
      } as any;

      vi.mocked(groupRepository.getById).mockResolvedValue(mockGroup);
      vi.mocked(groupRepository.getMembers).mockResolvedValue([{ userId: 'user-1' } as any]);
      vi.mocked(groupRepository.updateInviteCode).mockResolvedValue(undefined);

      const result = await sut.getInviteInfo({
        userId: 'user-1',
        groupId: 'group-1',
      });

      expect(result.inviteCode).toBe('NEW-CODE');
      expect(result.joinUrl).toContain('NEW-CODE');
      expect(groupRepository.updateInviteCode).toHaveBeenCalledWith('group-1', 'NEW-CODE');
    });

    it('should throw UserNotInGroupException if requester is not a member', async () => {
       const mockGroup = CollaborationGroup.create({
        name: 'Test Group',
        inviteCode: 'ABC-123',
        createdBy: 'user-owner',
        createdAt: new Date(),
      }, 'group-1');

      vi.mocked(groupRepository.getById).mockResolvedValue(mockGroup);
      vi.mocked(groupRepository.getMembers).mockResolvedValue([{ userId: 'user-owner' } as any]);

      await expect(sut.getInviteInfo({
        userId: 'user-stranger',
        groupId: 'group-1',
      })).rejects.toThrow(UserNotInGroupException);
    });

    it('should throw UnexpectedException if group does not exist', async () => {
      vi.mocked(groupRepository.getById).mockResolvedValue(undefined);

      await expect(sut.getInviteInfo({
        userId: 'user-1',
        groupId: 'non-existent',
      })).rejects.toThrow(UnexpectedException);
    });
  });

  describe('joinGroup', () => {
    it('should allow a user to join a group with a valid invite code', async () => {
      const mockUser = User.create({
        email: 'test@test.com',
        emailVerified: true,
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 'user-1');

      const mockGroup = CollaborationGroup.create({
        name: 'Group',
        inviteCode: 'JOIN-ME',
        createdBy: 'owner',
        createdAt: new Date()
      }, 'group-1');

      vi.mocked(userRepository.getById).mockResolvedValue(mockUser);
      vi.mocked(groupRepository.getByInviteCode).mockResolvedValue(mockGroup);
      vi.mocked(groupRepository.addMember).mockResolvedValue(undefined);

      await sut.joinGroup({
        userId: 'user-1',
        inviteCode: 'JOIN-ME'
      });

      expect(groupRepository.addMember).toHaveBeenCalledWith(expect.any(GroupMember));
      const calledMember = vi.mocked(groupRepository.addMember).mock.calls[0][0];
      expect(calledMember.userId).toBe('user-1');
      expect(calledMember.groupId).toBe('group-1');
      expect(calledMember.role).toBe(GroupRole.MEMBER);
    });

    it('should throw UserNotFoundException if joining user does not exist', async () => {
      vi.mocked(userRepository.getById).mockResolvedValue(undefined);

      await expect(sut.joinGroup({
        userId: 'non-existent',
        inviteCode: 'ANY'
      })).rejects.toThrow(UserNotFoundException);
    });

    it('should throw InvalidGroupInvitationCodeException if invite code is invalid', async () => {
      const mockUser = User.create({
        email: 'test@test.com',
        emailVerified: true,
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 'user-1');

      vi.mocked(userRepository.getById).mockResolvedValue(mockUser);
      vi.mocked(groupRepository.getByInviteCode).mockResolvedValue(undefined);

      await expect(sut.joinGroup({
        userId: 'user-1',
        inviteCode: 'WRONG'
      })).rejects.toThrow(InvalidGroupInvitationCodeException);
    });

    it('should throw UnexpectedException if repository fails to add member', async () => {
       const mockUser = User.create({
        email: 'test@test.com',
        emailVerified: true,
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 'user-1');

      const mockGroup = CollaborationGroup.create({
        name: 'Group',
        inviteCode: 'JOIN-ME',
        createdBy: 'owner',
        createdAt: new Date()
      }, 'group-1');

      vi.mocked(userRepository.getById).mockResolvedValue(mockUser);
      vi.mocked(groupRepository.getByInviteCode).mockResolvedValue(mockGroup);
      vi.mocked(groupRepository.addMember).mockRejectedValue(new Error('Persistent error'));

      await expect(sut.joinGroup({
        userId: 'user-1',
        inviteCode: 'JOIN-ME'
      })).rejects.toThrow(UnexpectedException);
    });
  });
});
