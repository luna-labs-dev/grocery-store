import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import type * as schema from './setup/schema';
import { userTable } from './setup/schema';
import type { UserRepositories } from '@/application';
import { GroupMember, User } from '@/domain';

type UserGroupModel = typeof schema.groupMemberTable.$inferSelect & {
  group?: typeof schema.groupTable.$inferSelect;
};

type UserModel = typeof schema.userTable.$inferSelect & {
  groups?: UserGroupModel[];
};

@injectable()
export class DrizzleUserRepository implements UserRepositories {
  add = async (user: User): Promise<void> => {
    await db.insert(userTable).values({
      id: user.id,
      name: user.name ?? '',
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      externalId: user.externalId ?? null,
    });
  };

  update = async (user: User): Promise<void> => {
    await db
      .update(userTable)
      .set({
        name: user.name ?? '',
        email: user.email,
        image: user.image ?? null,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, user.id));
  };

  getById = async (userId: string): Promise<User | undefined> => {
    const userModel = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
      with: {
        groups: {
          with: {
            group: true,
          },
        },
      },
    });
    if (!userModel) return undefined;
    return this.toDomain(userModel);
  };

  getByExternalId = async (externalId: string): Promise<User | undefined> => {
    const userModel = await db.query.userTable.findFirst({
      where: eq(userTable.externalId, externalId),
      with: {
        groups: {
          with: {
            group: true,
          },
        },
      },
    });
    if (!userModel) return undefined;
    return this.toDomain(userModel);
  };

  private toDomain(userModel: UserModel): User {
    const groups = userModel.groups?.map((gm: UserGroupModel) =>
      GroupMember.create({
        groupId: gm.groupId,
        userId: gm.userId,
        role: gm.role,
        joinedAt: gm.joinedAt,
      }),
    );

    return User.create(
      {
        externalId: userModel.externalId ?? undefined,
        email: userModel.email,
        emailVerified: userModel.emailVerified ?? false,
        name: userModel.name,
        image: userModel.image ?? undefined,
        roles: ['user'],
        reputationScore: 0,
        groups,
        createdAt: userModel.createdAt,
        updatedAt: userModel.updatedAt,
      },
      userModel.id,
    );
  }
}
