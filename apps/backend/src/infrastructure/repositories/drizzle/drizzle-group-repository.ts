import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import * as schema from './setup/schema';
import type {
  AddGroupRepository,
  GetGroupByIdRepository,
  GetGroupByInviteCodeParams,
  GetGroupByInviteCodeRepository,
  GetGroupMembersRepository,
  GetGroupsByUserIdRepository,
  UpdateGroupInviteCodeRepository,
  UpdateGroupRepository,
} from '@/application/contracts/repositories/group';
import type { GroupRole } from '@/domain/core/logic/permissions/group/types';
import { CollaborationGroup, GroupMember, User } from '@/domain/entities';

@injectable()
export class DrizzleGroupRepository
  implements
    AddGroupRepository,
    GetGroupByIdRepository,
    GetGroupByInviteCodeRepository,
    GetGroupMembersRepository,
    GetGroupsByUserIdRepository,
    UpdateGroupInviteCodeRepository,
    UpdateGroupRepository
{
  async add(group: CollaborationGroup): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.insert(schema.groupTable).values({
        id: group.id,
        name: group.name,
        description: group.description ?? null,
        inviteCode: group.inviteCode ?? null,
        createdAt: group.createdAt,
        createdBy: group.createdBy,
      });

      if (group.members && group.members.length > 0) {
        for (const member of group.members) {
          await tx.insert(schema.groupMemberTable).values({
            groupId: group.id,
            userId: member.userId,
            role: member.role,
            joinedAt: member.joinedAt,
          });
        }
      }
    });
  }

  async getById(id: string): Promise<CollaborationGroup | undefined> {
    const groupModel = await db.query.groupTable.findFirst({
      where: eq(schema.groupTable.id, id),
      with: {
        members: {
          with: { user: true },
        },
      },
    });

    if (!groupModel) return undefined;

    const group = CollaborationGroup.create(
      {
        name: groupModel.name,
        description: groupModel.description ?? undefined,
        inviteCode: groupModel.inviteCode ?? undefined,
        createdAt: groupModel.createdAt,
        createdBy: groupModel.createdBy,
      },
      groupModel.id,
    );

    if (groupModel.members) {
      group.props.members = groupModel.members.map((m) =>
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
              roles: [],
              reputationScore: 0,
              createdAt: m.user.createdAt,
              updatedAt: m.user.updatedAt,
              externalId: m.user.externalId ?? undefined,
            },
            m.user.id,
          ),
        }),
      );
    }

    return group;
  }

  async getByInviteCode({
    inviteCode,
  }: GetGroupByInviteCodeParams): Promise<CollaborationGroup | undefined> {
    const groupModel = await db.query.groupTable.findFirst({
      where: eq(schema.groupTable.inviteCode, inviteCode),
      with: {
        members: {
          with: { user: true },
        },
      },
    });

    if (!groupModel) return undefined;

    const group = CollaborationGroup.create(
      {
        name: groupModel.name,
        description: groupModel.description ?? undefined,
        inviteCode: groupModel.inviteCode ?? undefined,
        createdAt: groupModel.createdAt,
        createdBy: groupModel.createdBy,
      },
      groupModel.id,
    );

    if (groupModel.members) {
      group.props.members = groupModel.members.map((m) =>
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
              roles: [],
              reputationScore: 0,
              createdAt: m.user.createdAt,
              updatedAt: m.user.updatedAt,
              externalId: m.user.externalId ?? undefined,
            },
            m.user.id,
          ),
        }),
      );
    }

    return group;
  }

  async update(group: CollaborationGroup): Promise<void> {
    await db.transaction(async (tx) => {
      await tx
        .update(schema.groupTable)
        .set({
          name: group.name,
          description: group.description ?? null,
          inviteCode: group.inviteCode ?? null,
        })
        .where(eq(schema.groupTable.id, group.id));

      if (group.members) {
        const currentMembers = await tx.query.groupMemberTable.findMany({
          where: eq(schema.groupMemberTable.groupId, group.id),
        });

        const newMemberIds = group.members.map((m) => m.userId);
        const currentMemberIds = currentMembers.map((m) => m.userId);

        const toAdd = group.members.filter(
          (m) => !currentMemberIds.includes(m.userId),
        );
        const toRemove = currentMembers.filter(
          (m) => !newMemberIds.includes(m.userId),
        );
        const toUpdate = group.members.filter((m) =>
          currentMemberIds.includes(m.userId),
        );

        if (toAdd.length > 0) {
          for (const member of toAdd) {
            await tx.insert(schema.groupMemberTable).values({
              groupId: group.id,
              userId: member.userId,
              role: member.role,
              joinedAt: member.joinedAt,
            });
          }
        }

        if (toRemove.length > 0) {
          for (const member of toRemove) {
            await tx
              .delete(schema.groupMemberTable)
              .where(
                and(
                  eq(schema.groupMemberTable.groupId, member.groupId),
                  eq(schema.groupMemberTable.userId, member.userId),
                ),
              );
          }
        }

        if (toUpdate.length > 0) {
          for (const member of toUpdate) {
            const current = currentMembers.find(
              (m) => m.userId === member.userId,
            );
            if (current && current.role !== member.role) {
              await tx
                .update(schema.groupMemberTable)
                .set({ role: member.role })
                .where(
                  and(
                    eq(schema.groupMemberTable.groupId, member.groupId),
                    eq(schema.groupMemberTable.userId, member.userId),
                  ),
                );
            }
          }
        }
      }
    });
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
            roles: [],
            reputationScore: 0,
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
