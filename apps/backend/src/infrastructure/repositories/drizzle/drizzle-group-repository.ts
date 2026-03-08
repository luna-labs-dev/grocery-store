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
  RemoveGroupRepository,
  UpdateGroupInviteCodeRepository,
  UpdateGroupRepository,
} from '@/application/contracts/repositories/group';
import type { GroupRole } from '@/domain/core/logic/permissions/group/types';
import { CollaborationGroup, GroupMember, User } from '@/domain/entities';

type GroupMemberModel = typeof schema.groupMemberTable.$inferSelect & {
  user?: typeof schema.userTable.$inferSelect;
};

type GroupModel = typeof schema.groupTable.$inferSelect & {
  members?: GroupMemberModel[];
};

@injectable()
export class DrizzleGroupRepository
  implements
    AddGroupRepository,
    GetGroupByIdRepository,
    GetGroupByInviteCodeRepository,
    GetGroupMembersRepository,
    GetGroupsByUserIdRepository,
    UpdateGroupInviteCodeRepository,
    UpdateGroupRepository,
    RemoveGroupRepository
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
        await this.addMembers(tx, group.id, group.members);
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

    return groupModel ? this.toDomain(groupModel as GroupModel) : undefined;
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

    return groupModel ? this.toDomain(groupModel as GroupModel) : undefined;
  }

  private toDomain(groupModel: GroupModel): CollaborationGroup {
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
      group.props.members = groupModel.members.map((m: GroupMemberModel) =>
        GroupMember.create({
          groupId: m.groupId,
          userId: m.userId,
          role: m.role as GroupRole,
          joinedAt: m.joinedAt,
          user: m.user
            ? User.create(
                {
                  name: m.user.name,
                  email: m.user.email,
                  emailVerified: m.user.emailVerified,
                  image: m.user.image ?? undefined,
                  roles: ['user'],
                  reputationScore: 0,
                  createdAt: m.user.createdAt,
                  updatedAt: m.user.updatedAt,
                  externalId: m.user.externalId ?? undefined,
                },
                m.user.id,
              )
            : undefined,
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
        await this.syncMembers(tx, group);
      }
    });
  }

  async remove(groupId: string): Promise<void> {
    await db.transaction(async (tx) => {
      // First remove members (though cascading is usually handled by DB, we follow aggregate rules here)
      await tx
        .delete(schema.groupMemberTable)
        .where(eq(schema.groupMemberTable.groupId, groupId));

      await tx
        .delete(schema.groupTable)
        .where(eq(schema.groupTable.id, groupId));
    });
  }

  private async syncMembers(tx: any, group: CollaborationGroup): Promise<void> {
    const currentMembers = (await tx.query.groupMemberTable.findMany({
      where: eq(schema.groupMemberTable.groupId, group.id),
    })) as (typeof schema.groupMemberTable.$inferSelect)[];

    const newMemberIds = group.members.map((m: GroupMember) => m.userId);
    const currentMemberIds = currentMembers.map((m) => m.userId);

    const toAdd = group.members.filter(
      (m: GroupMember) => !currentMemberIds.includes(m.userId),
    );
    const toRemove = currentMembers.filter(
      (m) => !newMemberIds.includes(m.userId),
    );
    const toUpdate = group.members.filter((m: GroupMember) =>
      currentMemberIds.includes(m.userId),
    );

    await this.addMembers(tx, group.id, toAdd);
    await this.removeMembers(tx, group.id, toRemove);
    await this.updateMembers(tx, currentMembers, toUpdate);
  }

  private async addMembers(
    tx: any,
    groupId: string,
    members: GroupMember[],
  ): Promise<void> {
    if (members.length === 0) return;

    for (const member of members) {
      await tx.insert(schema.groupMemberTable).values({
        groupId,
        userId: member.userId,
        role: member.role,
        joinedAt: member.joinedAt,
      });
    }
  }

  private async removeMembers(
    tx: any,
    groupId: string,
    members: (typeof schema.groupMemberTable.$inferSelect)[],
  ): Promise<void> {
    if (members.length === 0) return;

    for (const member of members) {
      await tx
        .delete(schema.groupMemberTable)
        .where(
          and(
            eq(schema.groupMemberTable.groupId, groupId),
            eq(schema.groupMemberTable.userId, member.userId),
          ),
        );
    }
  }

  private async updateMembers(
    tx: any,
    currentMembers: (typeof schema.groupMemberTable.$inferSelect)[],
    members: GroupMember[],
  ): Promise<void> {
    if (members.length === 0) return;

    for (const member of members) {
      const current = currentMembers.find((m) => m.userId === member.userId);
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
        group: {
          with: {
            members: {
              with: { user: true },
            },
          },
        },
      },
    });

    return result.map((r) => {
      const groupModel = r.group as GroupModel;
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
        group.props.members = groupModel.members.map((m: GroupMemberModel) =>
          GroupMember.create({
            groupId: m.groupId,
            userId: m.userId,
            role: m.role as GroupRole,
            joinedAt: m.joinedAt,
            user: m.user
              ? User.create(
                  {
                    name: m.user.name,
                    email: m.user.email,
                    emailVerified: m.user.emailVerified,
                    image: m.user.image ?? undefined,
                    roles: ['user'],
                    reputationScore: 0,
                    createdAt: m.user.createdAt,
                    updatedAt: m.user.updatedAt,
                    externalId: m.user.externalId ?? undefined,
                  },
                  m.user.id,
                )
              : undefined,
          }),
        );
      }

      return group;
    });
  }

  async updateInviteCode(groupId: string, inviteCode: string): Promise<void> {
    await db
      .update(schema.groupTable)
      .set({ inviteCode })
      .where(eq(schema.groupTable.id, groupId));
  }
}
