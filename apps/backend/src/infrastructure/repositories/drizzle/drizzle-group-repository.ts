import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  AddGroupMemberRepository,
  AddGroupRepository,
  GetGroupByIdRepository,
  GetGroupByInviteCodeRepository,
  GetGroupMembersRepository,
  GetGroupsByUserIdRepository,
  RemoveGroupMemberRepository,
  UpdateGroupInviteCodeRepository,
  UpdateGroupMemberRoleRepository,
} from '@/application/contracts/repositories/group';
import type { GroupRole } from '@/domain/core/enums';
import { CollaborationGroup, GroupMember, User } from '@/domain/entities';

@injectable()
export class DrizzleGroupRepository
  implements
    AddGroupRepository,
    GetGroupByIdRepository,
    GetGroupByInviteCodeRepository,
    AddGroupMemberRepository,
    RemoveGroupMemberRepository,
    UpdateGroupMemberRoleRepository,
    GetGroupMembersRepository,
    GetGroupsByUserIdRepository,
    UpdateGroupInviteCodeRepository
{
  async add(group: CollaborationGroup): Promise<void> {
    await db.insert(schema.groupTable).values({
      id: group.id,
      name: group.name,
      description: group.description ?? null,
      inviteCode: group.inviteCode ?? null,
      createdAt: group.createdAt,
      createdBy: group.createdBy,
    });
  }

  async getById(id: string): Promise<CollaborationGroup | undefined> {
    const groupModel = await db.query.groupTable.findFirst({
      where: eq(schema.groupTable.id, id),
    });

    if (!groupModel) return undefined;

    return CollaborationGroup.create(
      {
        name: groupModel.name,
        description: groupModel.description ?? undefined,
        inviteCode: groupModel.inviteCode ?? undefined,
        createdAt: groupModel.createdAt,
        createdBy: groupModel.createdBy,
      },
      groupModel.id,
    );
  }

  async getByInviteCode({
    inviteCode,
  }: {
    inviteCode: string;
  }): Promise<CollaborationGroup | undefined> {
    const groupModel = await db.query.groupTable.findFirst({
      where: eq(schema.groupTable.inviteCode, inviteCode),
    });

    if (!groupModel) return undefined;

    return CollaborationGroup.create(
      {
        name: groupModel.name,
        description: groupModel.description ?? undefined,
        inviteCode: groupModel.inviteCode ?? undefined,
        createdAt: groupModel.createdAt,
        createdBy: groupModel.createdBy,
      },
      groupModel.id,
    );
  }

  async addMember(member: GroupMember): Promise<void> {
    await db.insert(schema.groupMemberTable).values({
      groupId: member.groupId,
      userId: member.userId,
      role: member.role,
      joinedAt: member.joinedAt,
    });
  }

  async removeMember({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }): Promise<void> {
    await db
      .delete(schema.groupMemberTable)
      .where(
        and(
          eq(schema.groupMemberTable.groupId, groupId),
          eq(schema.groupMemberTable.userId, userId),
        ),
      );
  }

  async updateMemberRole({
    groupId,
    userId,
    role,
  }: {
    groupId: string;
    userId: string;
    role: GroupRole;
  }): Promise<void> {
    await db
      .update(schema.groupMemberTable)
      .set({ role })
      .where(
        and(
          eq(schema.groupMemberTable.groupId, groupId),
          eq(schema.groupMemberTable.userId, userId),
        ),
      );
  }

  async getMembers(groupId: string): Promise<GroupMember[]> {
    const members = await db.query.groupMemberTable.findMany({
      where: eq(schema.groupMemberTable.groupId, groupId),
      with: {
        user: true,
      },
    });

    return members.map((m) =>
      GroupMember.create({
        groupId: m.groupId,
        userId: m.userId,
        role: m.role as GroupRole,
        joinedAt: m.joinedAt,
        user: User.create(
          {
            name: m.user.name,
            email: m.user.email,
            emailVerified: m.user.emailVerified,
            image: m.user.image ?? undefined,
            createdAt: m.user.createdAt,
            updatedAt: m.user.updatedAt,
            externalId: m.user.externalId ?? undefined,
          },
          m.user.id,
        ),
      }),
    );
  }

  async getGroups(userId: string): Promise<CollaborationGroup[]> {
    const result = await db.query.groupMemberTable.findMany({
      where: eq(schema.groupMemberTable.userId, userId),
      with: {
        group: true,
      },
    });

    return result.map((r) =>
      CollaborationGroup.create(
        {
          name: r.group.name,
          description: r.group.description ?? undefined,
          inviteCode: r.group.inviteCode ?? undefined,
          createdAt: r.group.createdAt,
          createdBy: r.group.createdBy,
        },
        r.group.id,
      ),
    );
  }

  async updateInviteCode(groupId: string, inviteCode: string): Promise<void> {
    await db
      .update(schema.groupTable)
      .set({ inviteCode })
      .where(eq(schema.groupTable.id, groupId));
  }
}
