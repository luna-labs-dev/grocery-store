import { inject, injectable } from 'tsyringe';
import type {
  GroupRepositories,
  UserRepositories,
} from '@/application/contracts';
import { GroupRole } from '@/domain/core/enums';
import { CollaborationGroup, GroupMember } from '@/domain/entities';
import {
  InvalidGroupInvitationCodeException,
  LastOwnerCannotLeaveException,
  UnauthorizedGroupOperationException,
  UnexpectedException,
  UserNotFoundException,
  UserNotInGroupException,
} from '@/domain/exceptions';
import type {
  GetInviteInfoParams,
  GetInviteInfoResult,
  JoinGroupParams,
  LeaveGroupParams,
  RemoveMemberParams,
} from '@/domain/usecases';
import { env } from '@/main/config/env';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class GroupService {
  constructor(
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
    @inject(infra.groupRepositories)
    private readonly groupRepository: GroupRepositories,
  ) {}

  async createGroup({
    userId,
    name,
    description,
  }: {
    userId: string;
    name: string;
    description?: string;
  }): Promise<CollaborationGroup> {
    try {
      const user = await this.userRepository.getById(userId);
      if (!user) throw new UserNotFoundException();

      const group = CollaborationGroup.create({
        name,
        description,
        createdAt: new Date(),
        createdBy: user.id,
      });

      const member = GroupMember.create({
        groupId: group.id,
        userId: user.id,
        role: GroupRole.OWNER,
        joinedAt: new Date(),
      });

      await this.groupRepository.add(group);
      await this.groupRepository.addMember(member);

      return group;
    } catch (error) {
      if (error instanceof UserNotFoundException) throw error;
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async joinGroup({ userId, inviteCode }: JoinGroupParams): Promise<void> {
    try {
      const user = await this.userRepository.getById(userId);
      if (!user) throw new UserNotFoundException();

      const group = await this.groupRepository.getByInviteCode({ inviteCode });
      if (!group) throw new InvalidGroupInvitationCodeException();

      const member = GroupMember.create({
        groupId: group.id,
        userId: user.id,
        role: GroupRole.MEMBER,
        joinedAt: new Date(),
      });

      await this.groupRepository.addMember(member);
    } catch (error) {
      if (
        error instanceof UserNotFoundException ||
        error instanceof InvalidGroupInvitationCodeException
      ) {
        throw error;
      }
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async leaveGroup({ userId, groupId }: LeaveGroupParams): Promise<void> {
    try {
      const members = await this.groupRepository.getMembers(groupId);
      const requester = members.find((m) => m.userId === userId);

      if (!requester) throw new UserNotInGroupException();

      const isRequesterOwner = requester.role === GroupRole.OWNER;
      const otherMembers = members.filter((m) => m.userId !== userId);
      const hasOtherOwners = otherMembers.some(
        (m) => m.role === GroupRole.OWNER,
      );

      // If owner is trying to leave and there are other members, but no other owner
      if (isRequesterOwner && otherMembers.length > 0 && !hasOtherOwners) {
        throw new LastOwnerCannotLeaveException();
      }

      await this.groupRepository.removeMember({ groupId, userId });
    } catch (error) {
      if (
        error instanceof UserNotInGroupException ||
        error instanceof LastOwnerCannotLeaveException
      ) {
        throw error;
      }
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async removeMember({
    userId,
    groupId,
    targetUserId,
  }: RemoveMemberParams): Promise<void> {
    try {
      const members = await this.groupRepository.getMembers(groupId);
      const requester = members.find((m) => m.userId === userId);
      const target = members.find((m) => m.userId === targetUserId);

      if (!requester) throw new UserNotInGroupException();
      if (!target) throw new UserNotFoundException(); // Or UserNotInGroup

      // Self-removal protection (should use leaveGroup)
      if (userId === targetUserId) {
        throw new UnauthorizedGroupOperationException();
      }

      const isRequesterOwner = requester.role === GroupRole.OWNER;
      const isRequesterAdmin = requester.role === GroupRole.ADMIN;
      const isTargetOwner = target.role === GroupRole.OWNER;
      const isTargetAdmin = target.role === GroupRole.ADMIN;

      // Owners can remove anyone
      if (isRequesterOwner) {
        await this.groupRepository.removeMember({
          groupId,
          userId: targetUserId,
        });
        return;
      }

      // Admins can remove members, but not owners or other admins
      if (isRequesterAdmin && !isTargetOwner && !isTargetAdmin) {
        await this.groupRepository.removeMember({
          groupId,
          userId: targetUserId,
        });
        return;
      }

      throw new UnauthorizedGroupOperationException();
    } catch (error) {
      if (
        error instanceof UserNotInGroupException ||
        error instanceof UnauthorizedGroupOperationException ||
        error instanceof UserNotFoundException
      ) {
        throw error;
      }
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async updateMemberRole({
    userId,
    groupId,
    targetUserId,
    role,
  }: {
    userId: string;
    groupId: string;
    targetUserId: string;
    role: GroupRole;
  }): Promise<void> {
    try {
      const members = await this.groupRepository.getMembers(groupId);
      const requester = members.find((m) => m.userId === userId);
      const target = members.find((m) => m.userId === targetUserId);

      if (!requester) throw new UserNotInGroupException();
      if (!target) throw new UserNotFoundException();

      const isRequesterOwner = requester.role === GroupRole.OWNER;
      const isRequesterAdmin = requester.role === GroupRole.ADMIN;

      // Owners can change any role (except maybe their own if last owner, but let's keep it simple for now)
      if (isRequesterOwner) {
        await this.groupRepository.updateMemberRole({
          groupId,
          userId: targetUserId,
          role,
        });
        return;
      }

      // Admins can promote MEMBERS to ADMIN, but not demote OWNER or other ADMINS
      if (
        isRequesterAdmin &&
        target.role === GroupRole.MEMBER &&
        role === GroupRole.ADMIN
      ) {
        await this.groupRepository.updateMemberRole({
          groupId,
          userId: targetUserId,
          role,
        });
        return;
      }

      throw new UnauthorizedGroupOperationException();
    } catch (error) {
      if (
        error instanceof UserNotInGroupException ||
        error instanceof UnauthorizedGroupOperationException ||
        error instanceof UserNotFoundException
      ) {
        throw error;
      }
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async getGroups(userId: string): Promise<CollaborationGroup[]> {
    try {
      const groups = await this.groupRepository.getGroups(userId);
      return groups;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const members = await this.groupRepository.getMembers(groupId);
      return members;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async getGroupById(groupId: string): Promise<CollaborationGroup | undefined> {
    try {
      const group = await this.groupRepository.getById(groupId);
      return group;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async getInviteInfo({
    userId,
    groupId,
  }: GetInviteInfoParams): Promise<GetInviteInfoResult> {
    try {
      const group = await this.groupRepository.getById(groupId);
      if (!group) throw new UnexpectedException(); // Ideally GroupNotFound

      const members = await this.groupRepository.getMembers(groupId);
      const isMember = members.some((m) => m.userId === userId);

      if (!isMember) throw new UserNotInGroupException();

      const inviteCode = group.inviteCode;
      if (!inviteCode) {
        // Fallback: generate if missing (shouldn't happen with current logic)
        group.generateInviteCode();
        await this.groupRepository.updateInviteCode(
          group.id,
          group.inviteCode!,
        );
      }

      // Use configured web app URL
      const { webAppUrl } = env.baseConfig;
      const joinUrl = `${webAppUrl}/join?code=${group.inviteCode}`;

      return {
        inviteCode: group.inviteCode!,
        joinUrl,
      };
    } catch (error) {
      if (error instanceof UserNotInGroupException) throw error;
      console.error(error);
      throw new UnexpectedException();
    }
  }
}
