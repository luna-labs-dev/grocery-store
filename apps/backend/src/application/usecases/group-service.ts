import { inject, injectable } from 'tsyringe';
import type {
  GroupRepositories,
  UserRepositories,
} from '@/application/contracts';
import type { GroupRole } from '@/domain/core/logic/permissions';
import type { RequesterContext } from '@/domain/core/requester-context';
import { CollaborationGroup, GroupMember } from '@/domain/entities';
import {
  InvalidGroupInvitationCodeException,
  LastOwnerCannotLeaveException,
  UserNotFoundException,
  UserNotInGroupException,
} from '@/domain/exceptions';
import type { GetInviteInfoResult, JoinGroupParams } from '@/domain/usecases';
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

    group.addMember(member);
    await this.groupRepository.update(group);
  }

  async leaveGroup(ctx: RequesterContext): Promise<void> {
    const members = ctx.group.members;
    const requester = members.find((m) => m.userId === ctx.user.id);

    if (!requester) throw new UserNotInGroupException();

    const isRequesterOwner = requester.role === 'owner';
    const otherMembers = members.filter((m) => m.userId !== ctx.user.id);
    const hasOtherOwners = otherMembers.some((m) => m.role === 'owner');

    // If owner is trying to leave and there are other members, but no other owner
    if (isRequesterOwner && otherMembers.length > 0 && !hasOtherOwners) {
      throw new LastOwnerCannotLeaveException();
    }

    ctx.group.removeMember(ctx.user.id);
    await this.groupRepository.update(ctx.group);
  }

  async removeMember(
    ctx: RequesterContext,
    { targetUserId }: { targetUserId: string },
  ): Promise<void> {
    ctx.checkPermission('removeMember', 'group');

    ctx.group.removeMember(targetUserId);
    await this.groupRepository.update(ctx.group);
  }

  async updateMemberRole(
    ctx: RequesterContext,
    { targetUserId, role }: { targetUserId: string; role: GroupRole },
  ): Promise<void> {
    ctx.checkPermission('updateMemberRole', 'group');

    ctx.group.updateMemberRole(targetUserId, role);
    await this.groupRepository.update(ctx.group);
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

  async getInviteInfo(ctx: RequesterContext): Promise<GetInviteInfoResult> {
    ctx.checkPermission('inviteMember', 'group');

    if (!ctx.group.inviteCode) {
      ctx.group.generateInviteCode();
      if (ctx.group.inviteCode) {
        await this.groupRepository.updateInviteCode(
          ctx.group.id,
          ctx.group.inviteCode,
        );
      }
    }

    // Use configured web app URL
    const { webAppUrl } = env.baseConfig;
    const joinUrl = `${webAppUrl}/join?code=${ctx.group.inviteCode}`;

    return {
      // biome-ignore lint/style/noNonNullAssertion: The validation above ensures this is not undefined
      inviteCode: ctx.group.inviteCode!,
      joinUrl,
    };
  }
}
