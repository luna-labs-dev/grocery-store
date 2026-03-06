import { inject, injectable } from 'tsyringe';
import type {
  GroupRepositories,
  UserRepositories,
} from '@/application/contracts';
import {
  type GroupRole,
  hasGroupPermission,
} from '@/domain/core/logic/permissions';
import { CollaborationGroup, GroupMember } from '@/domain/entities';
import {
  GroupNotFoundException,
  InvalidGroupInvitationCodeException,
  LastOwnerCannotLeaveException,
  UnauthorizedGroupOperationException,
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
      role: 'owner',
      joinedAt: new Date(),
    });

    group.props.members = [member];

    await this.groupRepository.add(group);
    return group;
  }

  async joinGroup({ userId, inviteCode }: JoinGroupParams): Promise<void> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new UserNotFoundException();

    const group = await this.groupRepository.getByInviteCode({ inviteCode });
    if (!group) throw new InvalidGroupInvitationCodeException();

    const member = GroupMember.create({
      groupId: group.id,
      userId: user.id,
      role: 'member',
      joinedAt: new Date(),
    });

    await this.groupRepository.addMember(member);
  }

  async leaveGroup({ userId, groupId }: LeaveGroupParams): Promise<void> {
    const members = await this.groupRepository.getMembers(groupId);
    const requester = members.find((m) => m.userId === userId);

    if (!requester) throw new UserNotInGroupException();

    const isRequesterOwner = requester.role === 'owner';
    const otherMembers = members.filter((m) => m.userId !== userId);
    const hasOtherOwners = otherMembers.some((m) => m.role === 'owner');

    // If owner is trying to leave and there are other members, but no other owner
    if (isRequesterOwner && otherMembers.length > 0 && !hasOtherOwners) {
      throw new LastOwnerCannotLeaveException();
    }

    await this.groupRepository.removeMember({ groupId, userId });
  }

  async removeMember({
    userId,
    groupId,
    targetUserId,
  }: RemoveMemberParams): Promise<void> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new UserNotFoundException();

    const group = await this.groupRepository.getById(groupId);
    if (!group) throw new GroupNotFoundException();

    const canRemove = hasGroupPermission(user, 'removeMember', 'group', group);
    if (!canRemove) throw new UnauthorizedGroupOperationException();

    await this.groupRepository.removeMember({
      groupId,
      userId: targetUserId,
    });
    return;
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
    const user = await this.userRepository.getById(userId);
    if (!user) throw new UserNotFoundException();

    const group = await this.groupRepository.getById(groupId);
    if (!group) throw new GroupNotFoundException();

    const canUpdate = hasGroupPermission(
      user,
      'updateMemberRole',
      'group',
      group,
    );
    if (!canUpdate) throw new UnauthorizedGroupOperationException();

    await this.groupRepository.updateMemberRole({
      groupId,
      userId: targetUserId,
      role,
    });
  }

  async getGroups(userId: string): Promise<CollaborationGroup[]> {
    const groups = await this.groupRepository.getGroups(userId);
    return groups;
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const members = await this.groupRepository.getMembers(groupId);
    return members;
  }

  async getGroupById(groupId: string): Promise<CollaborationGroup | undefined> {
    const group = await this.groupRepository.getById(groupId);
    return group;
  }

  async getInviteInfo({
    userId,
    groupId,
  }: GetInviteInfoParams): Promise<GetInviteInfoResult> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new UserNotFoundException();

    const group = await this.groupRepository.getById(groupId);
    if (!group) throw new GroupNotFoundException();

    const canInvite = hasGroupPermission(user, 'inviteMember', 'group', group);
    if (!canInvite) throw new UserNotInGroupException(); // Using existing exception or Forbidden

    if (!group.inviteCode) {
      // Fallback: generate if missing (shouldn't happen with current logic)
      group.generateInviteCode();
      if (group.inviteCode) {
        await this.groupRepository.updateInviteCode(group.id, group.inviteCode);
      }
    }

    // Use configured web app URL
    const { webAppUrl } = env.baseConfig;
    const joinUrl = `${webAppUrl}/join?code=${group.inviteCode}`;

    return {
      // biome-ignore lint/style/noNonNullAssertion: The validation above ensures this is not undefined
      inviteCode: group.inviteCode!,
      joinUrl,
    };
  }
}
