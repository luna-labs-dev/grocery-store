import 'reflect-metadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GroupService } from '@/application/usecases/group-service';
import type { UserRepositories, GroupRepositories } from '@/application/contracts';
import { User, CollaborationGroup, GroupMember } from '@/domain/entities';
import { GroupRole } from '@/domain/core/enums';
import {
    UserNotFoundException,
    InvalidGroupInvitationCodeException,
    UnauthorizedGroupOperationException, LastOwnerCannotLeaveException
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
      addMember: vi.fn(),
      removeMember: vi.fn(),
      updateMemberRole: vi.fn(),
      getMembers: vi.fn(),
      getGroups: vi.fn(),
    } as any;

    sut = new GroupService(userRepository, groupRepository);
  });

  describe('createGroup', () => {
    it('should create a group and make the user the OWNER', async () => {
      const mockUser = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, 'user-1');

      vi.mocked(userRepository.getById).mockResolvedValue(mockUser);

      const group = await sut.createGroup({
        userId: 'user-1',
        name: 'My Awesome Group',
        description: 'Testing groups',
      });

      expect(group.name).toBe('My Awesome Group');
      expect(group.createdBy).toBe('user-1');
      expect(groupRepository.add).toHaveBeenCalled();
      expect(groupRepository.addMember).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user-1',
        role: GroupRole.OWNER,
      }));
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      vi.mocked(userRepository.getById).mockResolvedValue(undefined as any);

      await expect(sut.createGroup({
        userId: 'invalid-user',
        name: 'No Group',
      })).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('joinGroup', () => {
    it('should add a user to a group if invite code is valid', async () => {
       const mockUser = User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, 'user-2');

      const mockGroup = CollaborationGroup.create({
        name: 'Existing Group',
        createdAt: new Date(),
        createdBy: 'user-1',
        inviteCode: 'valid-code'
      }, 'group-1');

      vi.mocked(userRepository.getById).mockResolvedValue(mockUser);
      vi.mocked(groupRepository.getByInviteCode).mockResolvedValue(mockGroup);

      await sut.joinGroup({
        userId: 'user-2',
        inviteCode: 'valid-code',
      });

      expect(groupRepository.addMember).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user-2',
        groupId: 'group-1',
        role: GroupRole.MEMBER
      }));
    });

    it('should throw InvalidGroupInvitationCodeException if invite code is invalid', async () => {
      const mockUser = User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, 'user-2');

      vi.mocked(userRepository.getById).mockResolvedValue(mockUser);
      vi.mocked(groupRepository.getByInviteCode).mockResolvedValue(undefined);

      await expect(sut.joinGroup({
        userId: 'user-2',
        inviteCode: 'bad-code',
      })).rejects.toThrow(InvalidGroupInvitationCodeException);
    });
  });

  describe('removeMember', () => {
    it('should allow an OWNER to remove a MEMBER', async () => {
      const requester = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-owner',
        role: GroupRole.OWNER,
        joinedAt: new Date(),
      });
      const target = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-member',
        role: GroupRole.MEMBER,
        joinedAt: new Date(),
      });

      vi.mocked(groupRepository.getMembers).mockResolvedValue([requester, target]);
      
      await sut.removeMember({
        userId: 'user-owner',
        groupId: 'group-1',
        targetUserId: 'user-member',
      });

      expect(groupRepository.removeMember).toHaveBeenCalledWith({
        groupId: 'group-1',
        userId: 'user-member',
      });
    });

    it('should throw UnauthorizedGroupOperationException if a MEMBER tries to remove someone', async () => {
      const requester = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-member',
        role: GroupRole.MEMBER,
        joinedAt: new Date(),
      });
      const target = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-other',
        role: GroupRole.MEMBER,
        joinedAt: new Date(),
      });

      vi.mocked(groupRepository.getMembers).mockResolvedValue([requester, target]);

      await expect(sut.removeMember({
        userId: 'user-member',
        groupId: 'group-1',
        targetUserId: 'user-other',
      })).rejects.toThrow(UnauthorizedGroupOperationException);
    });

    it('should throw UnauthorizedGroupOperationException if an ADMIN tries to remove the OWNER', async () => {
      const admin = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-admin',
        role: GroupRole.ADMIN,
        joinedAt: new Date(),
      });
      const owner = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-owner',
        role: GroupRole.OWNER,
        joinedAt: new Date(),
      });

      vi.mocked(groupRepository.getMembers).mockResolvedValue([admin, owner]);

      await expect(sut.removeMember({
        userId: 'user-admin',
        groupId: 'group-1',
        targetUserId: 'user-owner',
      })).rejects.toThrow(UnauthorizedGroupOperationException);
    });

    it('should throw UnauthorizedGroupOperationException if a user tries to remove themselves (should use leaveGroup)', async () => {
      const member = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-id',
        role: GroupRole.MEMBER,
        joinedAt: new Date(),
      });

      vi.mocked(groupRepository.getMembers).mockResolvedValue([member]);

      await expect(sut.removeMember({
        userId: 'user-id',
        groupId: 'group-1',
        targetUserId: 'user-id',
      })).rejects.toThrow(UnauthorizedGroupOperationException);
    });
  });

  describe('updateMemberRole', () => {
    it('should allow OWNER to promote a MEMBER to ADMIN', async () => {
      const owner = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-owner',
        role: GroupRole.OWNER,
        joinedAt: new Date(),
      });
      const target = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-member',
        role: GroupRole.MEMBER,
        joinedAt: new Date(),
      });

      vi.mocked(groupRepository.getMembers).mockResolvedValue([owner, target]);

      await sut.updateMemberRole({
        userId: 'user-owner',
        groupId: 'group-1',
        targetUserId: 'user-member',
        role: GroupRole.ADMIN,
      });

      expect(groupRepository.updateMemberRole).toHaveBeenCalledWith({
        groupId: 'group-1',
        userId: 'user-member',
        role: GroupRole.ADMIN,
      });
    });
  });

  describe('leaveGroup', () => {
    it('should allow a MEMBER to leave', async () => {
      const member = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-id',
        role: GroupRole.MEMBER,
        joinedAt: new Date(),
      });

      vi.mocked(groupRepository.getMembers).mockResolvedValue([member]);

      await sut.leaveGroup({
        userId: 'user-id',
        groupId: 'group-1',
      });

      expect(groupRepository.removeMember).toHaveBeenCalledWith({
        groupId: 'group-1',
        userId: 'user-id',
      });
    });

    it('should throw LastOwnerCannotLeaveException if the only owner tries to leave when there are other members', async () => {
      const owner = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-owner',
        role: GroupRole.OWNER,
        joinedAt: new Date(),
      });
      const member = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-member',
        role: GroupRole.MEMBER,
        joinedAt: new Date(),
      });

      vi.mocked(groupRepository.getMembers).mockResolvedValue([owner, member]);

      await expect(sut.leaveGroup({
        userId: 'user-owner',
        groupId: 'group-1',
      })).rejects.toThrow(LastOwnerCannotLeaveException);
    });

    it('should allow the last owner to leave if they are the only member left (group effectively abandoned)', async () => {
       const owner = GroupMember.create({
        groupId: 'group-1',
        userId: 'user-owner',
        role: GroupRole.OWNER,
        joinedAt: new Date(),
      });

      vi.mocked(groupRepository.getMembers).mockResolvedValue([owner]);

      await sut.leaveGroup({
        userId: 'user-owner',
        groupId: 'group-1',
      });

      expect(groupRepository.removeMember).toHaveBeenCalledWith({
        groupId: 'group-1',
        userId: 'user-owner',
      });
    });
  });
});
